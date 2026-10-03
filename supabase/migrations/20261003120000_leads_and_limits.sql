-- =============================================================================
-- Leads, resultados de herramientas, solicitudes de llamada, interruptores y
-- LÍMITES DE USO (protección de coste). Ver docs/ecosistema.md §6, §7 y §13.
--
-- Escritura pública: SOLO desde route handlers con la service key (que salta RLS)
-- y después de pasar Turnstile + check_rate_limit + bump_daily_counter.
-- El navegador nunca inserta directamente en estas tablas.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Leads (emails captados)
-- ---------------------------------------------------------------------------
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  email            text not null check (char_length(email) <= 254),
  locale           text not null default 'es' check (locale in ('es', 'en')),
  source           text check (char_length(source) <= 40),        -- tiktok, instagram, google, directo...
  utm              jsonb not null default '{}'::jsonb,
  first_tool       text check (char_length(first_tool) <= 40),
  marketing_consent boolean not null default false,
  consent_text     text check (char_length(consent_text) <= 1000),  -- texto exacto aceptado (RGPD)
  consent_at       timestamptz,
  confirmed_at     timestamptz,                                     -- doble opt-in
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index leads_email_lower_idx on public.leads (lower(email));
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_source_idx on public.leads (source);

create table public.lead_events (
  id         bigint generated always as identity primary key,
  lead_id    uuid not null references public.leads (id) on delete cascade,
  type       text not null check (char_length(type) <= 40),  -- tool_used, email_opened, applied...
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

-- Resultado de cada calculadora (base de los datos agregados anónimos para prensa)
create table public.tool_results (
  id         bigint generated always as identity primary key,
  lead_id    uuid references public.leads (id) on delete set null,
  tool       text not null check (char_length(tool) <= 40),
  inputs     jsonb not null,
  outputs    jsonb not null,
  created_at timestamptz not null default now(),
  check (pg_column_size(inputs) + pg_column_size(outputs) < 4096)
);
create index tool_results_tool_idx on public.tool_results (tool, created_at desc);

-- ---------------------------------------------------------------------------
-- Solicitudes de llamada con puntuación
-- ---------------------------------------------------------------------------
create type public.application_status as enum
  ('new', 'qualified', 'rejected', 'booked', 'won', 'lost', 'waitlist');

create table public.applications (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid references public.leads (id) on delete set null,
  email        text not null check (char_length(email) <= 254),
  name         text check (char_length(name) <= 120),
  answers      jsonb not null,
  score        integer not null default 0,
  status       public.application_status not null default 'new',
  booking_token uuid unique default gen_random_uuid(),  -- token de un solo uso para ver Cal.com
  token_used_at timestamptz,
  notes        text,                                      -- notas del entrenador
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (pg_column_size(answers) < 8192)
);
create index applications_status_idx on public.applications (status, created_at desc);

create table public.scoring_rules (
  id          bigint generated always as identity primary key,
  question    text not null,             -- clave de la pregunta en el formulario
  answer      text not null,             -- valor de la respuesta
  points      integer not null,
  active      boolean not null default true,
  unique (question, answer)
);

-- ---------------------------------------------------------------------------
-- Interruptores sin redeploy (kill switches incluidos)
-- ---------------------------------------------------------------------------
create table public.feature_flags (
  key        text primary key,
  enabled    boolean not null default false,
  value      jsonb,
  updated_at timestamptz not null default now()
);

insert into public.feature_flags (key, enabled, value) values
  ('auth_password',        false, null),          -- login con contraseña (apagado)
  ('auth_google',          false, null),          -- login con Google (apagado)
  ('leads_capture',        true,  null),          -- kill switch: captura de emails
  ('applications_open',    true,  null),          -- kill switch: solicitudes de llamada
  ('emails_sending',       true,  null),          -- kill switch: envío de emails
  ('ads',                  false, null),          -- anuncios en zona de tráfico
  ('application_threshold', true, '{"score": 60}'::jsonb),
  ('weekly_call_capacity', true,  '{"max": 8}'::jsonb);

-- ---------------------------------------------------------------------------
-- LÍMITES: ventana deslizante por clave (IP+endpoint) y topes diarios globales
-- ---------------------------------------------------------------------------
create table public.rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  hits         integer not null default 0
);

create table public.daily_counters (
  day   date not null default current_date,
  name  text not null,
  count integer not null default 0,
  primary key (day, name)
);

-- true = permitido. Atómico (una fila por clave, upsert con bloqueo de fila).
create or replace function public.check_rate_limit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hits integer;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update
    set hits = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end,
        window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning hits into v_hits;
  return v_hits <= p_max;
end;
$$;

-- Suma 1 al contador del día si no supera el tope. true = permitido.
create or replace function public.bump_daily_counter(p_name text, p_cap integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.daily_counters as d (day, name, count)
  values (current_date, p_name, 1)
  on conflict (day, name) do update set count = d.count + 1
    where d.count < p_cap
  returning count into v_count;
  return v_count is not null;
end;
$$;

-- Solo el servidor (service_role) puede llamar a los limitadores.
revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.bump_daily_counter(text, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
grant execute on function public.bump_daily_counter(text, integer) to service_role;

-- Limpieza diaria para que estas tablas no crezcan (gratis con pg_cron).
create extension if not exists pg_cron;
select cron.schedule('purge-rate-limits', '17 4 * * *',
  $$delete from public.rate_limits where window_start < now() - interval '1 day';
    delete from public.daily_counters where day < current_date - 30;$$);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();
create trigger feature_flags_touch before update on public.feature_flags
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: el público no lee ni escribe nada; el entrenador gestiona desde el panel.
-- ---------------------------------------------------------------------------
alter table public.leads          enable row level security;
alter table public.lead_events    enable row level security;
alter table public.tool_results   enable row level security;
alter table public.applications   enable row level security;
alter table public.scoring_rules  enable row level security;
alter table public.feature_flags  enable row level security;
alter table public.rate_limits    enable row level security;
alter table public.daily_counters enable row level security;

create policy "trainer gestiona leads" on public.leads
  for all to authenticated using (public.is_trainer()) with check (public.is_trainer());
create policy "trainer lee eventos" on public.lead_events
  for select to authenticated using (public.is_trainer());
create policy "trainer lee resultados" on public.tool_results
  for select to authenticated using (public.is_trainer());
create policy "trainer gestiona solicitudes" on public.applications
  for all to authenticated using (public.is_trainer()) with check (public.is_trainer());
create policy "trainer gestiona reglas" on public.scoring_rules
  for all to authenticated using (public.is_trainer()) with check (public.is_trainer());
create policy "trainer gestiona flags" on public.feature_flags
  for all to authenticated using (public.is_trainer()) with check (public.is_trainer());
create policy "trainer lee contadores" on public.daily_counters
  for select to authenticated using (public.is_trainer());
-- rate_limits: sin policies (solo service_role).
