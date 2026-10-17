import 'server-only';
import { classifyAgent } from './classify';

/**
 * Bots frente a personas, con la analítica de Cloudflare (ve TODAS las peticiones, también las
 * de los bots que no ejecutan JavaScript; PostHog solo ve a personas).
 *
 * Requiere (solo servidor): CF_ANALYTICS_TOKEN (token de SOLO LECTURA "Zone · Analytics · Read")
 * y CF_ZONE_ID. Sin ellas, el panel lo dice y no muestra nada inventado.
 * Cloudflare guarda 30 días en el plan gratis: rangos mayores se recortan a 30.
 */
export const CF_MAX_DAYS = 30;

export type BotSplit =
  | { connected: false }
  | {
      connected: true;
      days: number;
      /** Páginas servidas en total (HTML), personas + bots. */
      total: number;
      /** Páginas pedidas con user agent de navegador (personas y bots disfrazados). */
      browsers: number;
      /** Bots identificados por nombre o por Cloudflare, de más a menos. */
      bots: Array<{ label: string; value: number }>;
    };

const QUERY = `query($zone: String!, $since: Time!, $until: Time!) {
  viewer { zones(filter: { zoneTag: $zone }) {
    httpRequestsAdaptiveGroups(
      limit: 5000
      filter: { datetime_geq: $since, datetime_lt: $until, edgeResponseContentTypeName: "html", requestSource: "eyeball" }
      orderBy: [count_DESC]
    ) { count dimensions { userAgent verifiedBotCategory } }
  } }
}`;

type Row = { count: number; dimensions: { userAgent: string; verifiedBotCategory: string } };

export async function getBotSplit(days: number): Promise<BotSplit> {
  const token = process.env.CF_ANALYTICS_TOKEN;
  const zone = process.env.CF_ZONE_ID;
  if (!token || !zone) return { connected: false };
  const d = Math.max(1, Math.min(CF_MAX_DAYS, Math.trunc(days)));
  const until = new Date();
  const since = new Date(until.getTime() - d * 24 * 3600 * 1000 + 60_000); // margen: el límite es 30 días exactos
  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { zone, since: since.toISOString(), until: until.toISOString() } }),
      next: { revalidate: 600 },
    });
    if (!res.ok) return { connected: false };
    const json = (await res.json()) as { data?: { viewer?: { zones?: Array<{ httpRequestsAdaptiveGroups: Row[] }> } }; errors?: unknown };
    const rows = json.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups;
    if (!rows) return { connected: false };

    let total = 0;
    let browsers = 0;
    const bots = new Map<string, number>();
    for (const r of rows) {
      total += r.count;
      const a = classifyAgent(r.dimensions.userAgent, r.dimensions.verifiedBotCategory || null);
      if (a.kind === 'browser') browsers += r.count;
      else bots.set(a.label, (bots.get(a.label) ?? 0) + r.count);
    }
    return {
      connected: true,
      days: d,
      total,
      browsers,
      bots: [...bots].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    };
  } catch {
    return { connected: false };
  }
}
