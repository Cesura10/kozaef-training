import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowSquareOut, CheckCircle, Prohibit, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { FREE_PLAN_QUOTAS, LIMITS, MONTHLY_COSTS_EUR } from '@/lib/limits';

export const metadata: Metadata = { title: 'Analítica' };
export const dynamic = 'force-dynamic';

type Overview = {
  days: number;
  funnel: Record<'tool_uses' | 'leads' | 'confirmed' | 'applications' | 'qualified' | 'calls' | 'won', number>;
  by_source: Array<{ source: string; leads: number; applications: number; won: number }>;
  by_tool: Array<{ tool: string; uses: number; with_email: number }>;
  today: Record<string, number>;
};

const RANGES = [7, 30, 90] as const;

const FUNNEL_STEPS: Array<{ key: keyof Overview['funnel']; label: string }> = [
  { key: 'tool_uses', label: 'Usaron una herramienta' },
  { key: 'leads', label: 'Dejaron su email' },
  { key: 'confirmed', label: 'Confirmaron el email' },
  { key: 'applications', label: 'Enviaron solicitud' },
  { key: 'qualified', label: 'Cualificadas' },
  { key: 'calls', label: 'Llamadas reservadas' },
  { key: 'won', label: 'Clientes' },
];

const TOOL_LABELS: Record<string, string> = {
  protein: 'Proteína',
  calories: 'Calorías y macros',
  bodyfat: 'Grasa corporal',
};

const FLAG_LABELS: Record<string, string> = {
  leads_capture: 'Captura de emails',
  applications_open: 'Solicitudes de llamada',
  emails_sending: 'Envío de emails',
  ads: 'Anuncios',
  auth_password: 'Login con contraseña',
  auth_google: 'Login con Google',
};

const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 1000) / 10} %` : '-');
const fmt = (n: number) => n.toLocaleString('es-ES');

export default async function AnalyticsPage({ searchParams }: PageProps<'/analitica'>) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== 'trainer') redirect('/dashboard');

  const sp = await searchParams;
  const days = RANGES.find((r) => String(r) === sp.d) ?? 30;

  const supabase = await createClient();
  const [{ data, error }, { data: flags }] = await Promise.all([
    supabase.rpc('analytics_overview', { p_days: days }),
    supabase.from('feature_flags').select('key, enabled').in('key', Object.keys(FLAG_LABELS)),
  ]);
  const o = data as unknown as Overview | null;

  const monthlyCost = Object.values(MONTHLY_COSTS_EUR).reduce<number>((a, b) => a + b, 0);
  const revenue = 0; // se conecta con la fase de pagos (orders)
  const hasData = o ? Object.values(o.funnel).some((v) => v > 0) : false;

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">Analítica</h1>
          <p className="mt-1 text-sm text-muted">Qué funciona, de dónde viene y cuánto cuesta.</p>
        </div>
        <nav aria-label="Periodo" className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/analitica?d=${r}`}
              aria-current={r === days ? 'page' : undefined}
              className="rounded-full px-4 py-1.5 text-sm text-muted transition hover:text-fg aria-[current=page]:bg-primary aria-[current=page]:text-primary-fg"
            >
              {r} días
            </Link>
          ))}
        </nav>
      </header>

      {error || !o ? (
        <p className="card p-6 text-sm text-danger">No se pudieron cargar los datos ({error?.message ?? 'sin respuesta'}).</p>
      ) : (
        <>
          {/* KPIs */}
          <section aria-label="Resumen" className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Kpi label="Emails captados" value={fmt(o.funnel.leads)} />
            <Kpi label="Solicitudes" value={fmt(o.funnel.applications)} />
            <Kpi label="Llamadas" value={fmt(o.funnel.calls)} />
            <Kpi label="Clientes nuevos" value={fmt(o.funnel.won)} />
            <Kpi label="Coste este mes" value={`${monthlyCost.toLocaleString('es-ES')} €`} hint="Infraestructura" />
          </section>

          {!hasData && (
            <p className="card p-5 text-sm text-muted">
              Aún no hay datos en estos {days} días. El panel se llena solo en cuanto la web empiece a captar
              emails y solicitudes. Las visitas y los clics se ven en PostHog y Cloudflare (enlaces abajo).
            </p>
          )}

          {/* Embudo */}
          <section aria-labelledby="funnel-h" className="card p-6">
            <h2 id="funnel-h" className="text-lg font-semibold">Embudo de conversión</h2>
            <p className="mt-1 text-sm text-muted">Cada paso, y qué porcentaje del paso anterior llega a él.</p>
            <Funnel funnel={o.funnel} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Canales */}
            <section aria-labelledby="src-h" className="card p-6">
              <h2 id="src-h" className="text-lg font-semibold">Leads por canal</h2>
              <p className="mt-1 text-sm text-muted">Dónde invertir el tiempo: el canal que trae clientes, no solo visitas.</p>
              {o.by_source.length === 0 ? (
                <Empty>Sin leads todavía.</Empty>
              ) : (
                <table className="mt-5 w-full text-sm">
                  <thead className="text-left text-xs text-faint">
                    <tr>
                      <th className="pb-2 font-medium">Canal</th>
                      <th className="pb-2 text-right font-medium">Emails</th>
                      <th className="pb-2 text-right font-medium">Solicitudes</th>
                      <th className="pb-2 text-right font-medium">Clientes</th>
                      <th className="pb-2 text-right font-medium">Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border tabular-nums">
                    {o.by_source.map((s) => (
                      <tr key={s.source}>
                        <td className="py-2.5 capitalize text-fg">{s.source}</td>
                        <td className="py-2.5 text-right">{fmt(s.leads)}</td>
                        <td className="py-2.5 text-right">{fmt(s.applications)}</td>
                        <td className="py-2.5 text-right">{fmt(s.won)}</td>
                        <td className="py-2.5 text-right text-muted">{pct(s.won, s.leads)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Herramientas */}
            <section aria-labelledby="tools-h" className="card p-6">
              <h2 id="tools-h" className="text-lg font-semibold">Herramientas</h2>
              <p className="mt-1 text-sm text-muted">Cuál engancha y cuál convierte en email.</p>
              {o.by_tool.length === 0 ? (
                <Empty>Sin usos registrados todavía.</Empty>
              ) : (
                <table className="mt-5 w-full text-sm">
                  <thead className="text-left text-xs text-faint">
                    <tr>
                      <th className="pb-2 font-medium">Herramienta</th>
                      <th className="pb-2 text-right font-medium">Usos</th>
                      <th className="pb-2 text-right font-medium">Con email</th>
                      <th className="pb-2 text-right font-medium">Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border tabular-nums">
                    {o.by_tool.map((t) => (
                      <tr key={t.tool}>
                        <td className="py-2.5 text-fg">{TOOL_LABELS[t.tool] ?? t.tool}</td>
                        <td className="py-2.5 text-right">{fmt(t.uses)}</td>
                        <td className="py-2.5 text-right">{fmt(t.with_email)}</td>
                        <td className="py-2.5 text-right text-muted">{pct(t.with_email, t.uses)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Uso de hoy frente a topes */}
            <section aria-labelledby="caps-h" className="card p-6">
              <h2 id="caps-h" className="text-lg font-semibold">Uso de hoy frente a los topes</h2>
              <p className="mt-1 text-sm text-muted">
                Los topes evitan pagar de más. Si uno se acerca al 100 % con frecuencia, toca valorar subir de plan.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <Usage label="Emails enviados" used={o.today.emails ?? 0} cap={LIMITS.daily.emails} note={`Plan gratis: ${FREE_PLAN_QUOTAS.emailsPerDay}/día`} />
                <Usage label="Emails captados" used={o.today.leads ?? 0} cap={LIMITS.daily.leads} />
                <Usage label="Solicitudes" used={o.today.applications ?? 0} cap={LIMITS.daily.applications} />
              </ul>
            </section>

            {/* Rentabilidad */}
            <section aria-labelledby="profit-h" className="card p-6">
              <h2 id="profit-h" className="text-lg font-semibold">Rentabilidad del mes</h2>
              <p className="mt-1 text-sm text-muted">Regla: subir de plan solo si los ingresos superan 3 veces el coste.</p>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-faint">Ingresos</dt>
                  <dd className="mt-1 text-2xl font-semibold">{revenue.toLocaleString('es-ES')} €</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Coste</dt>
                  <dd className="mt-1 text-2xl font-semibold">{monthlyCost.toLocaleString('es-ES')} €</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Margen</dt>
                  <dd className="mt-1 text-2xl font-semibold">{(revenue - monthlyCost).toLocaleString('es-ES')} €</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-faint">
                Los ingresos se conectarán al activar los pagos. El coste se edita en src/lib/limits.ts.
              </p>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Interruptores */}
            <section aria-labelledby="flags-h" className="card p-6">
              <h2 id="flags-h" className="text-lg font-semibold">Interruptores</h2>
              <p className="mt-1 text-sm text-muted">Apagan una función al momento si algo se descontrola.</p>
              <ul className="mt-5 divide-y divide-border text-sm">
                {(flags ?? []).map((f) => (
                  <li key={f.key} className="flex items-center justify-between py-2.5">
                    <span className="text-fg">{FLAG_LABELS[f.key] ?? f.key}</span>
                    {f.enabled ? (
                      <span className="inline-flex items-center gap-1.5 text-success">
                        <CheckCircle size={16} weight="fill" aria-hidden /> Activado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-faint">
                        <Prohibit size={16} aria-hidden /> Apagado
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Fuentes externas */}
            <section aria-labelledby="ext-h" className="card p-6">
              <h2 id="ext-h" className="text-lg font-semibold">Visitas y comportamiento</h2>
              <p className="mt-1 text-sm text-muted">
                Las visitas no se guardan aquí para no llenar la base de datos gratis. Se miran en:
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <ExternalLink href="https://eu.posthog.com" title="PostHog" body="Embudos, clics, grabaciones de sesión y tests A/B." />
                <ExternalLink href="https://dash.cloudflare.com" title="Cloudflare Web Analytics" body="Visitas, origen, países y velocidad real." />
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-fg">{value}</p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}

/** Barras horizontales de un solo color (una serie): la longitud es el valor. */
function Funnel({ funnel }: { funnel: Overview['funnel'] }) {
  const max = Math.max(1, ...FUNNEL_STEPS.map((s) => funnel[s.key]));
  return (
    <ol className="mt-6 space-y-2">
      {FUNNEL_STEPS.map((step, i) => {
        const value = funnel[step.key];
        const prev = i > 0 ? funnel[FUNNEL_STEPS[i - 1].key] : null;
        const width = value > 0 ? Math.max(0.6, (value / max) * 100) : 0;
        const conv = prev === null ? '' : pct(value, prev);
        return (
          <li
            key={step.key}
            title={`${step.label}: ${fmt(value)}${conv ? ` (${conv} del paso anterior)` : ''}`}
            className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-4 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2 sm:grid-cols-[13rem_1fr_7rem]"
          >
            <span className="truncate text-sm text-muted">{step.label}</span>
            <span className="relative h-5" aria-hidden>
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-[#b8893a]"
                style={{ width: `${width}%` }}
              />
            </span>
            <span className="text-right text-sm tabular-nums">
              <span className="text-fg">{fmt(value)}</span>
              {conv && <span className="ml-2 text-xs text-faint">{conv}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Usage({ label, used, cap, note }: { label: string; used: number; cap: number; note?: string }) {
  const ratio = cap > 0 ? used / cap : 0;
  const warn = ratio >= 0.8;
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span>
        <span className="text-fg">{label}</span>
        {note && <span className="ml-2 text-xs text-faint">{note}</span>}
      </span>
      <span className="flex items-center gap-2 tabular-nums">
        {warn && (
          <span className="inline-flex items-center gap-1 text-xs text-warning">
            <WarningCircle size={14} weight="fill" aria-hidden /> Cerca del tope
          </span>
        )}
        <span className="text-fg">{fmt(used)}</span>
        <span className="text-faint">/ {fmt(cap)}</span>
      </span>
    </li>
  );
}

function ExternalLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-start justify-between gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-primary/50"
      >
        <span>
          <span className="block font-medium text-fg">{title}</span>
          <span className="mt-0.5 block text-muted">{body}</span>
        </span>
        <ArrowSquareOut size={18} className="mt-0.5 shrink-0 text-faint group-hover:text-primary" aria-hidden />
      </a>
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 rounded-2xl border border-dashed border-border p-5 text-center text-sm text-faint">{children}</p>;
}
