import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Bots frente a personas. Desde 2026-10-18 la web se sirve desde Netlify (bloqueos de LaLiga) y
 * Cloudflare ya no ve el tráfico: la función netlify/edge-functions/contador-bots.ts suma cada
 * página servida en public.bot_hits, por día y tipo de visitante ("Navegador" o el nombre del bot).
 * Sin la tabla (migración sin aplicar) o sin datos, el panel lo dice y no inventa nada.
 */
export type BotSplit =
  | { connected: false }
  | {
      connected: true;
      days: number;
      /** Páginas servidas en total, personas + bots. */
      total: number;
      /** Páginas pedidas con user agent de navegador (personas y bots disfrazados). */
      browsers: number;
      /** Bots identificados por nombre, de más a menos. */
      bots: Array<{ label: string; value: number }>;
    };

const BROWSER = 'Navegador';

export async function getBotSplit(days: number): Promise<BotSplit> {
  const d = Math.max(1, Math.min(365, Math.trunc(days)));
  const since = new Date(Date.now() - (d - 1) * 24 * 3600 * 1000).toISOString().slice(0, 10);
  try {
    const db = createAdminClient();
    // Tabla nueva (20261018200000_bot_hits.sql): aún no está en los tipos generados.
    const { data, error } = await db
      .from('bot_hits' as never)
      .select('label, hits')
      .gte('day', since)
      .returns<Array<{ label: string; hits: number }>>();
    if (error || !data || data.length === 0) return { connected: false };

    let total = 0;
    let browsers = 0;
    const bots = new Map<string, number>();
    for (const r of data) {
      total += r.hits;
      if (r.label === BROWSER) browsers += r.hits;
      else bots.set(r.label, (bots.get(r.label) ?? 0) + r.hits);
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
