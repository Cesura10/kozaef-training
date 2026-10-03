-- Solicitudes de servicios manuales de pago (de momento: revisión de técnica en vídeo).
-- Se crean tras la compra en Shopify, desde el formulario público (route handler + guardPublicWrite).
create type public.service_request_status as enum ('new', 'in_review', 'done', 'cancelled');

create table public.service_requests (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null check (char_length(product_id) <= 80),
  lead_id     uuid references public.leads (id) on delete set null,
  name        text not null check (char_length(name) <= 120),
  email       text not null check (char_length(email) <= 254),
  order_ref   text check (char_length(order_ref) <= 80),       -- nº de pedido de Shopify
  payload     jsonb not null,                                    -- enlaces a vídeos, notas
  status      public.service_request_status not null default 'new',
  notes       text,                                              -- notas del entrenador
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (pg_column_size(payload) < 8192)
);
create index service_requests_product_idx on public.service_requests (product_id, created_at desc);

create trigger service_requests_touch before update on public.service_requests
  for each row execute function public.touch_updated_at();

alter table public.service_requests enable row level security;
create policy "trainer gestiona servicios" on public.service_requests
  for all to authenticated using (public.is_trainer()) with check (public.is_trainer());

-- Plazas usadas en los últimos 7 días para un producto (para mostrar compra o lista de espera).
-- Pública a propósito: solo devuelve un número, ningún dato personal.
create or replace function public.service_capacity_used(p_product text)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.service_requests
  where product_id = p_product and status <> 'cancelled' and created_at >= now() - interval '7 days';
$$;
grant execute on function public.service_capacity_used(text) to anon, authenticated;

-- Límites para el nuevo formulario.
insert into public.feature_flags (key, enabled) values ('service_requests_open', true)
on conflict (key) do nothing;
