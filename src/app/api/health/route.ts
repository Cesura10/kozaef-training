import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Salud de la web para el monitor: el Worker responde y la base de datos contesta en < 4 s.
// Sin datos sensibles en la respuesta.
export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  let db: 'ok' | 'fail' = 'fail';
  try {
    const query = createAdminClient().from('feature_flags').select('key', { head: true, count: 'exact' });
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
    const { error } = await Promise.race([query, timeout]);
    db = error ? 'fail' : 'ok';
  } catch {
    db = 'fail';
  }
  const ok = db === 'ok';
  return NextResponse.json(
    { ok, db, ms: Date.now() - started, at: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
