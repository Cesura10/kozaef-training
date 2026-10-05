import { CheckCircle, Info, Warning, WarningOctagon } from '@phosphor-icons/react/dist/ssr';
import { getUsage, LEVEL_ORDER, type Level, type UsageItem } from '@/lib/usage';

const LEVEL_UI: Record<Level, { label: string; cls: string; bar: string; Icon: typeof Info }> = {
  ok: { label: 'Bien', cls: 'text-success', bar: 'bg-success', Icon: CheckCircle },
  notice: { label: 'Aviso', cls: 'text-primary', bar: 'bg-primary', Icon: Info },
  warning: { label: 'Atención', cls: 'text-warning', bar: 'bg-warning', Icon: Warning },
  critical: { label: 'Urgente', cls: 'text-danger', bar: 'bg-danger', Icon: WarningOctagon },
  unknown: { label: 'Sin conectar', cls: 'text-faint', bar: 'bg-faint', Icon: Info },
};

const fmt = (n: number) => n.toLocaleString('es-ES');

/** Banner superior: solo aparece si algún servicio está en atención o urgente. */
export async function UsageBanner() {
  const { items, worst } = await getUsage();
  if (LEVEL_ORDER[worst] < LEVEL_ORDER.warning) return null;
  const top = items.filter((i) => i.level === worst);
  const ui = LEVEL_UI[worst];
  return (
    <div role="alert" className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${worst === 'critical' ? 'border-danger/50 bg-danger/10' : 'border-warning/50 bg-warning/10'}`}>
      <ui.Icon size={22} weight="fill" className={`mt-0.5 shrink-0 ${ui.cls}`} aria-hidden />
      <div className="text-fg">
        <p className="font-semibold">
          {worst === 'critical' ? 'Hay que pasar a un plan de pago ya para que la web no se pare' : 'La web se acerca al tope de un plan gratis'}
        </p>
        <ul className="mt-1 space-y-1 text-muted">
          {top.map((i) => (
            <li key={i.id}>
              {i.service}: {i.label.toLowerCase()} al {i.percent} %. Contrata <strong className="text-fg">{i.plan.name}</strong> ({i.plan.price}).
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Uso de cada plan gratis frente a su tope. */
export async function UsagePanel() {
  const { items } = await getUsage();
  return (
    <section aria-labelledby="usage-h" className="card p-6">
      <h2 id="usage-h" className="text-lg font-semibold">
        Planes gratis: uso y avisos
      </h2>
      <p className="mt-1 text-sm text-muted">
        Te aviso aquí antes de llegar al tope para que contrates el plan a tiempo y la web no se pare. Niveles: aviso 50 %,
        atención 70 %, urgente 85 %.
      </p>
      <ul className="mt-5 divide-y divide-border">
        {items.map((i) => (
          <UsageRow key={i.id} i={i} />
        ))}
      </ul>
    </section>
  );
}

function UsageRow({ i }: { i: UsageItem }) {
  const ui = LEVEL_UI[i.level];
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-fg">
          <span className="text-faint">{i.service} · </span>
          {i.label}
        </p>
        <p className="flex items-center gap-2 text-sm tabular-nums">
          <span className={`inline-flex items-center gap-1 text-xs ${ui.cls}`}>
            <ui.Icon size={14} weight="fill" aria-hidden /> {ui.label}
          </span>
          {i.used !== null ? (
            <span className="text-fg">
              {fmt(i.used)} <span className="text-faint">/ {fmt(i.limit)} {i.unit}</span>
            </span>
          ) : (
            <span className="text-faint">-</span>
          )}
        </p>
      </div>
      {i.percent !== null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className={`h-full rounded-full ${ui.bar}`} style={{ width: `${Math.min(100, Math.max(1, i.percent))}%` }} />
        </div>
      )}
      <p className="mt-2 text-xs text-faint">
        {i.note ? `${i.note} ` : ''}Al llegar al tope: {i.atLimit}{' '}
        {LEVEL_ORDER[i.level] >= LEVEL_ORDER.notice && (
          <a href={i.plan.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Siguiente plan: {i.plan.name}, {i.plan.price}
          </a>
        )}
      </p>
    </li>
  );
}
