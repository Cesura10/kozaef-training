-- =============================================================================
-- 04 · Dietas: dieta -> comidas, con objetivos de macros
-- =============================================================================

create table public.diets (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  trainer_id   uuid not null references public.profiles (id) on delete cascade,
  name         text,
  kcal_target  int,
  protein_g    int,
  carbs_g      int,
  fat_g        int,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index diets_client_id_idx  on public.diets (client_id);
create index diets_trainer_id_idx on public.diets (trainer_id);

create table public.diet_meals (
  id          uuid primary key default gen_random_uuid(),
  diet_id     uuid not null references public.diets (id) on delete cascade,
  meal_block  text,      -- desayuno / almuerzo / merienda / cena
  description text,
  kcal        int,
  protein_g   int,
  carbs_g     int,
  fat_g       int,
  meal_order  int
);
create index diet_meals_diet_id_idx on public.diet_meals (diet_id);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.diets      enable row level security;
alter table public.diet_meals enable row level security;

create policy "diets_select"
  on public.diets for select
  using (client_id = auth.uid() or trainer_id = auth.uid());

create policy "diets_trainer_write"
  on public.diets for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid() and public.owns_client(client_id));

create policy "diet_meals_select"
  on public.diet_meals for select
  using (exists (
    select 1 from public.diets d
    where d.id = diet_id
      and (d.client_id = auth.uid() or d.trainer_id = auth.uid())
  ));

create policy "diet_meals_trainer_write"
  on public.diet_meals for all
  using (exists (
    select 1 from public.diets d
    where d.id = diet_id and d.trainer_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.diets d
    where d.id = diet_id and d.trainer_id = auth.uid()
  ));
