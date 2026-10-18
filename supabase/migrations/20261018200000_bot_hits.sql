-- Personas frente a bots (panel /analitica). Desde 2026-10-18 la web se sirve desde Netlify y
-- Cloudflare ya no ve el tráfico: una función de Netlify (netlify/edge-functions/contador-bots.ts)
-- suma aquí cada página servida, agrupada por día y tipo de visitante ("Navegador" o el bot).
-- Solo totales: ni IP ni user agent ni nada personal.
create table if not exists public.bot_hits (
  day date not null default current_date,
  label text not null check (char_length(label) between 1 and 60),
  hits integer not null default 0,
  primary key (day, label)
);

alter table public.bot_hits enable row level security;
-- Lectura: solo el entrenador (panel). Escritura: solo a través de bump_bot_hit con service_role.
create policy "bot_hits: lectura del entrenador" on public.bot_hits for select using (public.is_trainer());

create or replace function public.bump_bot_hit(p_label text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.bot_hits (day, label, hits)
  values (current_date, left(p_label, 60), 1)
  on conflict (day, label) do update set hits = public.bot_hits.hits + 1;
$$;

revoke all on function public.bump_bot_hit(text) from public, anon, authenticated;
grant execute on function public.bump_bot_hit(text) to service_role;
