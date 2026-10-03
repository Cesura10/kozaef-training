-- Permite que el SERVIDOR (service_role) cambie role/trainer_id: necesario para tareas
-- de administración (p. ej. corregir quién es el entrenador). Los usuarios normales
-- siguen sin poder cambiarse el rol a sí mismos.
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.trainer_id is distinct from old.trainer_id)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_trainer() then
    raise exception 'Solo un trainer puede modificar role o trainer_id';
  end if;
  return new;
end;
$$;
