import 'server-only';

/**
 * Búsquedas de Google (Search Console): por qué palabras apareces, cuántos clics traen y a qué
 * página llevan. Google NO dice qué buscó cada persona (lo oculta desde 2011): esto es el total
 * por búsqueda y página, con 2-3 días de retraso.
 *
 * Requiere (solo servidor), con una cuenta de servicio de Google Cloud (gratis) añadida como
 * usuario en Search Console:
 *   GSC_CLIENT_EMAIL  -> correo de la cuenta de servicio
 *   GSC_PRIVATE_KEY   -> su clave privada (PEM; los \n escritos se convierten en saltos de línea)
 *   GSC_SITE          -> la propiedad, p. ej. "sc-domain:kozaeftraining.com" o "https://kozaeftraining.com/"
 */

export type SearchQuery = { query: string; page: string; clicks: number; impressions: number; position: number };
export type SearchData =
  | { connected: false }
  | { connected: true; days: number; queries: SearchQuery[]; byPage: Record<string, SearchQuery[]> };

const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

async function accessToken(email: string, pem: string): Promise<string | null> {
  const der = Uint8Array.from(
    atob(pem.replace(/\\n/g, '\n').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64url(sig)}` }),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token?: string }).access_token ?? null;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function getSearchQueries(days: number): Promise<SearchData> {
  const email = process.env.GSC_CLIENT_EMAIL;
  const pem = process.env.GSC_PRIVATE_KEY;
  const site = process.env.GSC_SITE;
  if (!email || !pem || !site) return { connected: false };
  const d = Math.max(1, Math.min(480, Math.trunc(days)));
  try {
    const token = await accessToken(email, pem);
    if (!token) return { connected: false };
    const end = new Date();
    const start = new Date(end.getTime() - d * 24 * 3600 * 1000);
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: ymd(start), endDate: ymd(end), dimensions: ['query', 'page'], rowLimit: 500 }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { connected: false };
    const json = (await res.json()) as { rows?: Array<{ keys: [string, string]; clicks: number; impressions: number; position: number }> };
    const queries: SearchQuery[] = (json.rows ?? []).map((r) => ({
      query: r.keys[0],
      page: new URL(r.keys[1]).pathname,
      clicks: r.clicks,
      impressions: r.impressions,
      position: Math.round(r.position * 10) / 10,
    }));
    queries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
    const byPage: Record<string, SearchQuery[]> = {};
    for (const q of queries) (byPage[q.page] ??= []).push(q);
    return { connected: true, days: d, queries, byPage };
  } catch {
    return { connected: false };
  }
}
