-- =============================================================================
-- 03 · Rutinas: rutina -> días -> ejercicios + registro real del cliente
-- =============================================================================

create table public.routines (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.profiles (id) on delete cascade,
  trainer_id  uuid not null references public.profiles (id) on delete cascade,
  name        text not null,
  active      boolean not null default true,
  start_date  date,
  end_date    date,
  created_at  timestamptz not null default now()
);
create index routines_client_id_idx  on public.routines (client_id);
create index routines_trainer_id_idx on public.routines (trainer_id);

create table public.routine_days (
  id          uuid primary key default gen_random_uuid(),
  routine_id  uuid not null references public.routines (id) on delete cascade,
  day_label   text,            -- "Día 1 - Empuje"
  day_order   int
);
create index routine_days_routine_id_idx on public.routine_days (routine_id);

create table public.routine_exercises (
  id              uuid primary key default gen_random_uuid(),
  routine_day_id  uuid not null references public.routine_days (id) on delete cascade,
  exercise_id     uuid references public.exercise_library (id) on delete set null,
  sets            int,
  reps            text,        -- "8-12" o "AMRAP"
  rest_seconds    int,
  notes           text,
  exercise_order  int
);
create index routine_exercises_day_id_idx on public.routine_exercises (routine_day_id);

-- Registro real del cliente al entrenar.
create table public.exercise_logs (
  id                   uuid primary key default gen_random_uuid(),
  routine_exercise_id  uuid not null references public.routine_exercises (id) on delete cascade,
  client_id            uuid not null references public.profiles (id) on delete cascade,
  set_number           int,
  weight               numeric,
  reps_done            int,
  rpe                  numeric,
  logged_at            timestamptz not null default now()
);
create index exercise_logs_client_id_idx           on public.exercise_logs (client_id);
create index exercise_logs_routine_exercise_id_idx on public.exercise_logs (routine_exercise_id);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.routines          enable row level security;
alter table public.routine_days      enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.exercise_logs     enable row level security;

-- routines ------------------------------------------------------------------
create policy "routines_select"
  on public.routines for select
  using (client_id = auth.uid() or trainer_id = auth.uid());

create policy "routines_trainer_write"
  on public.routines for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid() and public.owns_client(client_id));

-- routine_days ------------------------------------------------------------------
create policy "routine_days_select"
  on public.routine_days for select
  using (exists (
    select 1 from public.routines r
    where r.id = routine_id
      and (r.client_id = auth.uid() or r.trainer_id = auth.uid())
  ));

create policy "routine_days_trainer_write"
  on public.routine_days for all
  using (exists (
    select 1 from public.routines r
    where r.id = routine_id and r.trainer_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.routines r
    where r.id = routine_id and r.trainer_id = auth.uid()
  ));

-- routine_exercises ----------------------------------------------------------
create policy "routine_exercises_select"
  on public.routine_exercises for select
  using (exists (
    select 1
    from public.routine_days d
    join public.routines r on r.id = d.routine_id
    where d.id = routine_day_id
      and (r.client_id = auth.uid() or r.trainer_id = auth.uid())
  ));

create policy "routine_exercises_trainer_write"
  on public.routine_exercises for all
  using (exists (
    select 1
    from public.routine_days d
    join public.routines r on r.id = d.routine_id
    where d.id = routine_day_id and r.trainer_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.routine_days d
    join public.routines r on r.id = d.routine_id
    where d.id = routine_day_id and r.trainer_id = auth.uid()
  ));

-- exercise_logs ------------------------------------------------------------------
-- El cliente registra y edita sus propias series.
create policy "exercise_logs_client_all"
  on public.exercise_logs for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- El trainer lee (solo lectura) los registros de sus clientes.
create policy "exercise_logs_trainer_read"
  on public.exercise_logs for select
  using (public.owns_client(client_id));
