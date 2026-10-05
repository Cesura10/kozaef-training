-- Uso del plan gratis de Supabase para el panel (avisos antes de llegar al tope).
-- Solo entrenador (panel) o service_role (comprobación automática diaria).
create or replace function public.usage_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth, storage
as $$
begin
  if not (public.is_trainer() or coalesce(auth.role(), '') = 'service_role') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'db_bytes', pg_database_size(current_database()),
    'mau', (select count(*) from auth.users where last_sign_in_at >= now() - interval '30 days'),
    'storage_bytes', coalesce((select sum((metadata->>'size')::bigint) from storage.objects), 0),
    'emails_today', coalesce((select count from public.daily_counters where day = current_date and name = 'emails'), 0),
    'emails_month', coalesce((select sum(count) from public.daily_counters where name = 'emails' and day >= date_trunc('month', current_date)), 0)
  );
end;
$$;

revoke all on function public.usage_stats() from public, anon;
grant execute on function public.usage_stats() to authenticated, service_role;
