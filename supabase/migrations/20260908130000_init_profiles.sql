-- =============================================================================
-- 01 · Perfiles, roles y helpers de seguridad
-- =============================================================================
-- Extiende auth.users con rol (trainer/client) y vínculo cliente -> entrenador.
-- Los helpers SECURITY DEFINER se usan desde las policies del resto de tablas
-- para consultar profiles sin provocar recursión de RLS.
-- =============================================================================

create type public.user_role as enum ('trainer', 'client');

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null default 'client',
  trainer_id  uuid references public.profiles (id) on delete set null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

comment on column public.profiles.trainer_id is
  'NULL para trainers. Para clients apunta al profile de su entrenador.';

create index profiles_trainer_id_idx on public.profiles (trainer_id);

-- -----------------------------------------------------------------------------
-- Helpers SECURITY DEFINER (bypass RLS -> sin recursión)
-- -----------------------------------------------------------------------------
create or replace function public.my_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_trainer()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'trainer'
  )
$$;

create or replace function public.my_trainer_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select trainer_id from public.profiles where id = auth.uid() $$;

-- ¿El usuario actual es el entrenador de `target`?
create or replace function public.owns_client(target uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = target and trainer_id = auth.uid()
  )
$$;

-- -----------------------------------------------------------------------------
-- Alta automática del profile al registrarse en auth.users.
-- El PRIMER usuario del sistema se crea como 'trainer' (bootstrap de Manu);
-- el resto como 'client'. Cambiar roles después con un trainer autenticado.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  is_first_user boolean;
begin
  select not exists (select 1 from public.profiles where role = 'trainer')
    into is_first_user;

  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    case when is_first_user then 'trainer'::public.user_role
         else 'client'::public.user_role end,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Evita que un usuario se auto-promocione: solo un trainer puede tocar
-- `role` o `trainer_id`.
-- -----------------------------------------------------------------------------
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.trainer_id is distinct from old.trainer_id)
     and not public.is_trainer() then
    raise exception 'Solo un trainer puede modificar role o trainer_id';
  end if;
  return new;
end;
$$;

create trigger protect_profile_privileged_fields
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_fields();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Cada quien ve su propio perfil; el trainer ve los de sus clientes.
create policy "profiles_select_self_or_own_clients"
  on public.profiles for select
  using (id = auth.uid() or trainer_id = auth.uid());

-- Un trainer puede ver clientes aún sin asignar (para poder reclamarlos).
create policy "profiles_trainer_sees_unassigned_clients"
  on public.profiles for select
  using (public.is_trainer() and role = 'client' and trainer_id is null);

-- Cada quien edita su propio perfil (nombre/avatar; role/trainer_id los
-- bloquea el trigger salvo que seas trainer).
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Un trainer edita los perfiles de sus clientes ya asignados.
create policy "profiles_trainer_update_clients"
  on public.profiles for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- Un trainer reclama un cliente sin asignar (le pone su trainer_id).
create policy "profiles_trainer_claims_unassigned"
  on public.profiles for update
  using (public.is_trainer() and role = 'client' and trainer_id is null)
  with check (trainer_id = auth.uid());

-- Sin policy de INSERT: los profiles los crea el trigger handle_new_user.
-- Sin policy de DELETE: se borran en cascada desde auth.users.
