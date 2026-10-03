import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { APPLY_COPY, QUESTION_KEYS } from '@/content/apply';
import { setApplicationStatus } from './actions';

export const metadata: Metadata = { title: 'Solicitudes' };
export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  new: 'Nueva',
  qualified: 'Cualificada',
  waitlist: 'En espera',
  booked: 'Llamada reservada',
  won: 'Cliente',
  lost: 'No contrató',
  rejected: 'Descartada',
};
const FILTERS = ['all', 'qualified', 'waitlist', 'new', 'booked', 'won', 'lost'] as const;
const q = APPLY_COPY.es.questions;

export default async function ApplicationsPage({ searchParams }: PageProps<'/solicitudes'>) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== 'trainer') redirect('/dashboard');

  const sp = await searchParams;
  const filter = FILTERS.find((f) => f === sp.estado) ?? 'all';

  const supabase = await createClient();
  let query = supabase
    .from('applications')
    .select('id, name, email, score, status, answers, created_at, leads(source)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (filter !== 'all') query = query.eq('status', filter);
  const { data: rows, error } = await query;

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">Solicitudes</h1>
          <p className="mt-1 text-sm text-muted">Quién quiere trabajar contigo, ordenado por fecha. Las cualificadas primero en tu lista de llamadas.</p>
        </div>
        <nav aria-label="Filtrar" className="flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={f === 'all' ? '/solicitudes' : `/solicitudes?estado=${f}`}
              aria-current={f === filter ? 'page' : undefined}
              className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:text-fg aria-[current=page]:bg-primary aria-[current=page]:text-primary-fg"
            >
              {f === 'all' ? 'Todas' : STATUS_LABEL[f]}
            </Link>
          ))}
        </nav>
      </header>

      {error && <p className="card p-5 text-sm text-danger">No se pudieron cargar ({error.message}).</p>}
      {!error && (rows ?? []).length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-faint">
          Aún no hay solicitudes{filter !== 'all' ? ' con este estado' : ''}. Aparecerán aquí en cuanto alguien rellene el formulario.
        </p>
      )}

      <ul className="space-y-3">
        {(rows ?? []).map((r) => {
          const a = (r.answers ?? {}) as Record<string, string | null>;
          const source = (r.leads as { source: string | null } | null)?.source ?? 'directo';
          return (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-fg">{r.name ?? 'Sin nombre'}</p>
                  <a href={`mailto:${r.email}`} className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <EnvelopeSimple size={14} aria-hidden /> {r.email}
                  </a>
                  <p className="mt-1 text-xs text-faint">
                    {new Date(r.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })} · vino de{' '}
                    <span className="capitalize text-muted">{source}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-right">
                    <span className="block text-2xl font-semibold text-fg">{r.score}</span>
                    <span className="block text-xs text-faint">puntos</span>
                  </span>
                  <form action={setApplicationStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <label className="sr-only" htmlFor={`st-${r.id}`}>
                      Estado
                    </label>
                    <select
                      id={`st-${r.id}`}
                      name="status"
                      defaultValue={r.status}
                      className="h-10 rounded-full border border-border-strong bg-bg px-4 text-sm text-fg"
                    >
                      {Object.entries(STATUS_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="h-10 rounded-full border border-border-strong px-4 text-sm text-muted hover:text-fg">
                      Guardar
                    </button>
                  </form>
                </div>
              </div>
              <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-border pt-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {QUESTION_KEYS.map((k) => (
                  <div key={k}>
                    <dt className="text-xs text-faint">{q[k].label}</dt>
                    <dd className="text-fg">{a[k] ? q[k].options[a[k] as string] ?? a[k] : '-'}</dd>
                  </div>
                ))}
              </dl>
              {a.tried && (
                <p className="mt-4 rounded-2xl bg-surface-2 p-4 text-sm leading-relaxed text-muted">
                  <span className="mb-1 block text-xs text-faint">Lo que ha probado</span>
                  {a.tried}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
