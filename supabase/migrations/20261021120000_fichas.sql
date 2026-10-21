-- Fichas de clientes (sustituye a Google Forms): Manu crea un enlace privado, el cliente rellena el
-- formulario en la web (/ficha/<token>) y la ficha se crea o se completa sola. Panel en /fichas.
-- Contienen datos de salud (categoría especial, RGPD art. 9): solo el entrenador puede leerlas; el
-- formulario público escribe a través del servidor (service_role), nunca directamente.

create table if not exists public.fichas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '' check (char_length(nombre) <= 200),
  email text check (email is null or char_length(email) <= 254),
  telefono text check (telefono is null or char_length(telefono) <= 40),
  edad integer check (edad is null or edad between 10 and 110),
  estado text not null default 'activa' check (estado in ('activa', 'pausada', 'baja')),
  notas text not null default '' check (char_length(notas) <= 20000),
  -- Enlace de revisión propio de cada cliente (reutilizable cada mes).
  token_revision text unique check (token_revision is null or char_length(token_revision) between 20 and 80),
  ultima_actividad timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ficha_respuestas (
  id uuid primary key default gen_random_uuid(),
  ficha_id uuid not null references public.fichas (id) on delete cascade,
  tipo text not null check (tipo in ('inicial', 'revision')),
  respuestas jsonb not null,
  peso numeric(5, 1) check (peso is null or peso between 20 and 400),
  created_at timestamptz not null default now()
);
create index if not exists ficha_respuestas_ficha_idx on public.ficha_respuestas (ficha_id, created_at desc);

-- Enlaces de formulario inicial: de un solo uso, caducan a los 30 días.
create table if not exists public.ficha_enlaces (
  token text primary key check (char_length(token) between 20 and 80),
  etiqueta text not null default '' check (char_length(etiqueta) <= 120),
  ficha_id uuid references public.fichas (id) on delete set null,
  usado_at timestamptz,
  caduca_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz not null default now()
);

alter table public.fichas enable row level security;
alter table public.ficha_respuestas enable row level security;
alter table public.ficha_enlaces enable row level security;

create policy "fichas: solo el entrenador" on public.fichas
  for all using (public.is_trainer()) with check (public.is_trainer());
create policy "ficha_respuestas: solo el entrenador" on public.ficha_respuestas
  for all using (public.is_trainer()) with check (public.is_trainer());
create policy "ficha_enlaces: solo el entrenador" on public.ficha_enlaces
  for all using (public.is_trainer()) with check (public.is_trainer());

-- Permisos explícitos (Supabase, desde el 30-oct-2026). Sin anon: el público nunca las toca.
grant select, insert, update, delete on public.fichas to authenticated, service_role;
grant select, insert, update, delete on public.ficha_respuestas to authenticated, service_role;
grant select, insert, update, delete on public.ficha_enlaces to authenticated, service_role;
revoke all on public.fichas, public.ficha_respuestas, public.ficha_enlaces from anon;

create or replace function public.fichas_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger fichas_updated_at before update on public.fichas
  for each row execute function public.fichas_touch();
