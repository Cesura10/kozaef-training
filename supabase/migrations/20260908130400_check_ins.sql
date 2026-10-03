-- =============================================================================
-- 05 · Check-ins (revisiones) + fotos de progreso
-- =============================================================================
-- Las fotos van a Supabase Storage (bucket privado 'check-in-photos', creado
-- en la migración 08). Aquí solo se guarda la ruta del objeto.
-- =============================================================================

create table public.check_ins (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.profiles (id) on delete cascade,
  trainer_id    uuid not null references public.profiles (id) on delete cascade,
  weight        numeric,
  waist_cm      numeric,
  notes_client  text,
  notes_trainer text,                     -- feedback de Manu sobre la revisión
  reviewed      boolean not null default false,
  created_at    timestamptz not null default now()
);
create index check_ins_client_id_idx  on public.check_ins (client_id);
create index check_ins_trainer_id_idx on public.check_ins (trainer_id);

create table public.check_in_photos (
  id           uuid primary key default gen_random_uuid(),
  check_in_id  uuid not null references public.check_ins (id) on delete cascade,
  storage_path text not null,             -- <client_id>/<check_in_id>/<archivo>
  angle        text                       -- frontal / lateral / espalda
);
create index check_in_photos_check_in_id_idx on public.check_in_photos (check_in_id);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.check_ins      enable row level security;
alter table public.check_in_photos enable row level security;

-- El cliente crea y edita sus medidas/notas (solo contra su entrenador).
create policy "check_ins_client_all"
  on public.check_ins for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid() and trainer_id = public.my_trainer_id());

-- El trainer lee todos los check-ins de sus clientes...
create policy "check_ins_trainer_select"
  on public.check_ins for select
  using (trainer_id = auth.uid());

-- ...y actualiza su feedback (notes_trainer, reviewed).
create policy "check_ins_trainer_update"
  on public.check_ins for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- Fotos: ambos participantes leen; solo el cliente sube/borra.
create policy "check_in_photos_select"
  on public.check_in_photos for select
  using (exists (
    select 1 from public.check_ins c
    where c.id = check_in_id
      and (c.client_id = auth.uid() or c.trainer_id = auth.uid())
  ));

create policy "check_in_photos_client_write"
  on public.check_in_photos for all
  using (exists (
    select 1 from public.check_ins c
    where c.id = check_in_id and c.client_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.check_ins c
    where c.id = check_in_id and c.client_id = auth.uid()
  ));
