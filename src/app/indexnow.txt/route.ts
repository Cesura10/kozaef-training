// Clave de IndexNow (brief IA §A3). Se configura con INDEXNOW_KEY; scripts/indexnow.mjs la usa como keyLocation.
export const dynamic = 'force-static';

export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response('Not found', { status: 404 });
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
