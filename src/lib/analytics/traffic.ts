import 'server-only';

/**
 * Tráfico y comportamiento para el panel /analitica, leído de PostHog con HogQL.
 * Las visitas NO se guardan en Supabase (llenarían el plan gratis con un pico viral).
 *
 * Requiere (solo servidor): POSTHOG_PERSONAL_API_KEY (permiso "query:read") y POSTHOG_PROJECT_ID.
 * Sin ellas devuelve datos de EJEMPLO marcados como tal, para ver el panel desde el día 1.
 * Caché de 5 minutos: abrir el panel muchas veces no gasta cuota.
 */

export type Point = { day: string; views: number; visitors: number };
export type Bar = { label: string; value: number };

export type Traffic = {
  demo: boolean;
  totals: { views: number; visitors: number };
  daily: Point[];
  interactions: Array<{ day: string; tools: number; emails: number }>;
  channels: Bar[];
  pages: Bar[];
  devices: Bar[];
  countries: Bar[];
  ctas: Bar[];
  tools: Bar[];
};

const HOST = process.env.POSTHOG_API_HOST ?? 'https://eu.posthog.com';

async function hogql(query: string): Promise<unknown[][] | null> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const project = process.env.POSTHOG_PROJECT_ID;
  if (!key || !project) return null;
  try {
    const res = await fetch(`${HOST}/api/projects/${project}/query/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: unknown[][] };
    return json.results ?? [];
  } catch {
    return null;
  }
}

const CTA_LABELS: Record<string, string> = {
  'apply:nav': 'Solicitar plaza (menú)',
  'apply:hero': 'Solicitar plaza (portada)',
  'apply:coaching': 'Solicitar plaza (coaching)',
  'tools:hero': 'Ver herramientas (portada)',
  'login:nav': 'Entrar (menú)',
};
const TOOL_LABELS: Record<string, string> = { protein: 'Proteína', calories: 'Calorías', bodyfat: 'Grasa corporal' };
const DEVICE_LABELS: Record<string, string> = { Mobile: 'Móvil', Desktop: 'Ordenador', Tablet: 'Tablet' };

const toBars = (rows: unknown[][] | null, map?: (k: string) => string): Bar[] =>
  (rows ?? []).map(([k, v]) => {
    const key = k == null || k === '' ? 'Desconocido' : String(k);
    return { label: map ? map(key) : key, value: Number(v) };
  });

export async function getTraffic(days: number): Promise<Traffic> {
  const d = Math.max(1, Math.min(365, Math.trunc(days)));
  const since = `timestamp > now() - interval ${d} day`;
  const pv = `event = '$pageview' and ${since}`;

  const [daily, interactions, channels, pages, devices, countries, ctas, tools] = await Promise.all([
    hogql(`select toDate(timestamp) as day, count() as views, count(distinct $session_id) as visitors
           from events where ${pv} group by day order by day`),
    hogql(`select toDate(timestamp) as day,
                  countIf(event = 'calculator_used') as tools,
                  countIf(event = 'calculator_email_click' or event = 'newsletter_submit') as emails
           from events where ${since} and event in ('calculator_used', 'calculator_email_click', 'newsletter_submit')
           group by day order by day`),
    hogql(`select properties.source as s, count(distinct $session_id) as n from events where ${pv}
           group by s order by n desc limit 8`),
    hogql(`select properties.$pathname as p, count() as n from events where ${pv} group by p order by n desc limit 8`),
    hogql(`select properties.$device_type as t, count(distinct $session_id) as n from events where ${pv}
           group by t order by n desc limit 4`),
    hogql(`select properties.$geoip_country_name as c, count(distinct $session_id) as n from events where ${pv}
           group by c order by n desc limit 8`),
    hogql(`select concat(toString(properties.cta), ':', toString(properties.location)) as k, count() as n
           from events where event = 'cta_click' and ${since} group by k order by n desc limit 8`),
    hogql(`select properties.tool as t, count() as n from events where event = 'calculator_used' and ${since}
           group by t order by n desc`),
  ]);

  if (daily === null) return demoTraffic(d);

  const dailyPoints: Point[] = daily.map(([day, views, visitors]) => ({
    day: String(day),
    views: Number(views),
    visitors: Number(visitors),
  }));

  return {
    demo: false,
    totals: {
      views: dailyPoints.reduce((a, p) => a + p.views, 0),
      visitors: dailyPoints.reduce((a, p) => a + p.visitors, 0),
    },
    daily: dailyPoints,
    interactions: (interactions ?? []).map(([day, t, e]) => ({ day: String(day), tools: Number(t), emails: Number(e) })),
    channels: toBars(channels),
    pages: toBars(pages),
    devices: toBars(devices, (k) => DEVICE_LABELS[k] ?? k),
    countries: toBars(countries),
    ctas: toBars(ctas, (k) => CTA_LABELS[k] ?? k),
    tools: toBars(tools, (k) => TOOL_LABELS[k] ?? k),
  };
}

/* ---------------------------------------------------------------------------
 * Datos de EJEMPLO (deterministas). Solo se usan sin PostHog conectado y el panel
 * los marca de forma visible. Nunca se mezclan con datos reales.
 * ------------------------------------------------------------------------- */
function demoTraffic(days: number): Traffic {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const today = new Date();
  const daily: Point[] = [];
  const interactions: Traffic['interactions'] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.toISOString().slice(0, 10);
    const growth = 1 + (days - i) / days;
    const spike = i === Math.floor(days / 3) ? 3.4 : 1; // un vídeo que funcionó
    const visitors = Math.round((120 + rnd() * 90) * growth * spike);
    daily.push({ day, visitors, views: Math.round(visitors * (1.6 + rnd() * 0.5)) });
    interactions.push({ day, tools: Math.round(visitors * (0.28 + rnd() * 0.08)), emails: Math.round(visitors * (0.04 + rnd() * 0.02)) });
  }
  return {
    demo: true,
    totals: { views: daily.reduce((a, p) => a + p.views, 0), visitors: daily.reduce((a, p) => a + p.visitors, 0) },
    daily,
    interactions,
    channels: [
      { label: 'tiktok', value: 4210 },
      { label: 'google', value: 1985 },
      { label: 'instagram', value: 1240 },
      { label: 'directo', value: 860 },
      { label: 'youtube', value: 410 },
    ],
    pages: [
      { label: '/es', value: 6120 },
      { label: '/es/herramientas/calculadora-proteina', value: 3480 },
      { label: '/es/guias/llevo-meses-sin-ganar-musculo', value: 1730 },
      { label: '/en', value: 640 },
    ],
    devices: [
      { label: 'Móvil', value: 7380 },
      { label: 'Ordenador', value: 1210 },
      { label: 'Tablet', value: 115 },
    ],
    countries: [
      { label: 'Spain', value: 6940 },
      { label: 'Mexico', value: 720 },
      { label: 'Argentina', value: 410 },
      { label: 'Colombia', value: 290 },
    ],
    ctas: [
      { label: 'Ver herramientas (portada)', value: 1320 },
      { label: 'Solicitar plaza (portada)', value: 410 },
      { label: 'Solicitar plaza (coaching)', value: 265 },
      { label: 'Solicitar plaza (menú)', value: 140 },
    ],
    tools: [
      { label: 'Proteína', value: 2890 },
      { label: 'Calorías', value: 1940 },
      { label: 'Grasa corporal', value: 760 },
    ],
  };
}
