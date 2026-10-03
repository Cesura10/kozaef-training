-- =============================================================================
-- 02 · Biblioteca de ejercicios (reutilizable entre rutinas)
-- =============================================================================

create table public.exercise_library (
  id            uuid primary key default gen_random_uuid(),
  trainer_id    uuid not null references public.profiles (id) on delete cascade,
  name          text not null,
  muscle_group  text,
  video_url     text,          -- embed de YouTube/Vimeo "no listado"
  instructions  text,
  created_at    timestamptz not null default now()
);

create index exercise_library_trainer_id_idx on public.exercise_library (trainer_id);

alter table public.exercise_library enable row level security;

-- El trainer gestiona su propia biblioteca.
create policy "exlib_trainer_all"
  on public.exercise_library for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- El cliente puede leer la biblioteca de su entrenador (para ver rutinas).
create policy "exlib_client_read"
  on public.exercise_library for select
  using (trainer_id = public.my_trainer_id());
