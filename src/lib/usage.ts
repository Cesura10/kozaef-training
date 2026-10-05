import 'server-only';
import { createAdminClient } from './supabase/admin';
import { FREE_PLAN_QUOTAS } from './limits';

/**
 * Uso de los planes GRATIS frente a sus topes, para avisar ANTES de que la web se frene.
 * Lo usan el panel (/analitica) y la comprobación diaria automática (/api/usage-check).
 *
 * Niveles: aviso >= 50 %, atención >= 70 %, urgente >= 85 % (contratar ya el plan indicado).
 */
export type Level = 'ok' | 'notice' | 'warning' | 'critical' | 'unknown';

export type UsageItem = {
  id: string;
  service: string;
  label: string;
  used: number | null;
  limit: number;
  unit: 'peticiones' | 'MB' | 'usuarios' | 'emails';
  percent: number | null;
  level: Level;
  /** Qué pasa al llegar al tope. */
  atLimit: string;
  plan: { name: string; price: string; url: string };
  note?: string;
};

export const LEVEL_ORDER: Record<Level, number> = { unknown: 0, ok: 1, notice: 2, warning: 3, critical: 4 };

const levelFor = (pct: number | null): Level =>
  pct === null ? 'unknown' : pct >= 85 ? 'critical' : pct >= 70 ? 'warning' : pct >= 50 ? 'notice' : 'ok';

const item = (i: Omit<UsageItem, 'percent' | 'level'>): UsageItem => {
  const percent = i.used === null ? null : Math.round((i.used / i.limit) * 1000) / 10;
  return { ...i, percent, level: levelFor(percent) };
};

const PLANS = {
  cloudflare: { name: 'Cloudflare Workers Paid', price: '5 $/mes (10 millones de peticiones/mes)', url: 'https://dash.cloudflare.com/?to=/:account/workers/plans' },
  supabase: { name: 'Supabase Pro', price: '25 $/mes (8 GB de base de datos, 100.000 usuarios)', url: 'https://supabase.com/dashboard/org/_/billing' },
  resend: { name: 'Resend Pro (o Amazon SES)', price: '20 $/mes (50.000 emails/mes)', url: 'https://resend.com/pricing' },
};

/** Peticiones al Worker por día (últimos 7 días) vía la API GraphQL de Cloudflare. */
async function cloudflareDaily(): Promise<{ today: number; peak: number } | null> {
  const token = process.env.CF_ANALYTICS_TOKEN;
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !account) return null;
  const end = new Date();
  const start = new Date(end.getTime() - 6 * 86_400_000);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($account: String!, $start: Date!, $end: Date!) {
          viewer { accounts(filter: { accountTag: $account }) {
            workersInvocationsAdaptive(limit: 10000, filter: { date_geq: $start, date_leq: $end }) {
              sum { requests } dimensions { date }
            }
          } }
        }`,
        variables: { account, start: day(start), end: day(end) },
      }),
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { viewer: { accounts: Array<{ workersInvocationsAdaptive: Array<{ sum: { requests: number }; dimensions: { date: string } }> }> } };
    };
    const rows = json.data?.viewer.accounts[0]?.workersInvocationsAdaptive ?? [];
    const byDay = new Map<string, number>();
    for (const r of rows) byDay.set(r.dimensions.date, (byDay.get(r.dimensions.date) ?? 0) + r.sum.requests);
    return { today: byDay.get(day(end)) ?? 0, peak: Math.max(0, ...byDay.values()) };
  } catch {
    return null;
  }
}

async function supabaseStats() {
  try {
    const { data } = await createAdminClient().rpc('usage_stats');
    return data as { db_bytes: number; mau: number; storage_bytes: number; emails_today: number; emails_month: number } | null;
  } catch {
    return null;
  }
}

export async function getUsage(): Promise<{ items: UsageItem[]; worst: Level }> {
  const [cf, sb] = await Promise.all([cloudflareDaily(), supabaseStats()]);
  const mb = (b: number) => Math.round((b / 1_048_576) * 10) / 10;

  const items: UsageItem[] = [
    item({
      id: 'cf-requests',
      service: 'Cloudflare',
      label: 'Peticiones a la web (día con más tráfico, últimos 7 días)',
      used: cf ? cf.peak : null,
      limit: FREE_PLAN_QUOTAS.workerRequestsPerDay,
      unit: 'peticiones',
      atLimit: 'La web da error el resto del día (se reinicia a las 02:00, hora de España en verano).',
      plan: PLANS.cloudflare,
      note: cf ? `Hoy: ${cf.today.toLocaleString('es-ES')}` : 'Sin conectar: falta CF_ANALYTICS_TOKEN.',
    }),
    item({
      id: 'sb-db',
      service: 'Supabase',
      label: 'Tamaño de la base de datos',
      used: sb ? mb(sb.db_bytes) : null,
      limit: FREE_PLAN_QUOTAS.dbMegabytes,
      unit: 'MB',
      atLimit: 'La base de datos pasa a solo lectura: no se guardan emails ni solicitudes.',
      plan: PLANS.supabase,
    }),
    item({
      id: 'sb-mau',
      service: 'Supabase',
      label: 'Usuarios activos en 30 días',
      used: sb ? sb.mau : null,
      limit: FREE_PLAN_QUOTAS.monthlyActiveUsers,
      unit: 'usuarios',
      atLimit: 'Nuevos inicios de sesión pueden fallar.',
      plan: PLANS.supabase,
    }),
    item({
      id: 'sb-storage',
      service: 'Supabase',
      label: 'Almacenamiento (fotos de progreso)',
      used: sb ? mb(sb.storage_bytes) : null,
      limit: 1024,
      unit: 'MB',
      atLimit: 'No se pueden subir más fotos.',
      plan: PLANS.supabase,
    }),
    item({
      id: 'emails-month',
      service: 'Email',
      label: 'Emails enviados este mes',
      used: sb ? sb.emails_month : null,
      limit: FREE_PLAN_QUOTAS.emailsPerMonth,
      unit: 'emails',
      atLimit: 'Los emails se posponen (la web sigue funcionando).',
      plan: PLANS.resend,
    }),
  ];
  const worst = items.reduce<Level>((w, i) => (LEVEL_ORDER[i.level] > LEVEL_ORDER[w] ? i.level : w), 'ok');
  return { items, worst };
}
