-- =============================================================================
-- Resumen de analítica de negocio para /analitica (solo entrenador).
-- Agrega en Postgres: el panel recibe un único JSON pequeño aunque haya
-- decenas de miles de filas. Ver docs/ecosistema.md §15.
-- =============================================================================

create or replace function public.analytics_overview(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)));
begin
  if not public.is_trainer() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'days', greatest(1, least(coalesce(p_days, 30), 365)),
    'funnel', jsonb_build_object(
      'tool_uses',    (select count(*) from tool_results where created_at >= since),
      'leads',        (select count(*) from leads where created_at >= since),
      'confirmed',    (select count(*) from leads where created_at >= since and confirmed_at is not null),
      'applications', (select count(*) from applications where created_at >= since),
      'qualified',    (select count(*) from applications where created_at >= since
                         and status in ('qualified', 'booked', 'won', 'lost')),
      'calls',        (select count(*) from applications where created_at >= since
                         and status in ('booked', 'won', 'lost')),
      'won',          (select count(*) from applications where created_at >= since and status = 'won')
    ),
    'by_source', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.leads desc)
      from (
        select coalesce(l.source, 'directo') as source,
               count(distinct l.id)                           as leads,
               count(distinct a.id)                           as applications,
               count(distinct a.id) filter (where a.status = 'won') as won
        from leads l
        left join applications a on a.lead_id = l.id
        where l.created_at >= since
        group by 1
      ) s
    ), '[]'::jsonb),
    'by_tool', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.uses desc)
      from (
        select tool, count(*) as uses, count(lead_id) as with_email
        from tool_results
        where created_at >= since
        group by tool
      ) t
    ), '[]'::jsonb),
    'today', coalesce((
      select jsonb_object_agg(name, count) from daily_counters where day = current_date
    ), '{}'::jsonb)
  );
end;
$$;

revoke all on function public.analytics_overview(integer) from public, anon;
grant execute on function public.analytics_overview(integer) to authenticated;
