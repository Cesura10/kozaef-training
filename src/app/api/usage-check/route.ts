import { NextResponse } from 'next/server';
import { getUsage } from '@/lib/usage';

// Comprobación automática diaria del uso (la llama el monitor de GitHub con una clave).
// Sin USAGE_CHECK_KEY configurada no existe.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const key = process.env.USAGE_CHECK_KEY;
  if (!key || req.headers.get('x-usage-key') !== key) return new NextResponse('Not found', { status: 404 });
  const { items, worst } = await getUsage();
  return NextResponse.json(
    { worst, items: items.map(({ id, service, label, used, limit, percent, level, plan }) => ({ id, service, label, used, limit, percent, level, plan: plan.name, price: plan.price })) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
