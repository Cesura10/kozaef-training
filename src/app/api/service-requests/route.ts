import { NextResponse } from 'next/server';
import { isBot } from '@/components/honeypot';
import { z } from 'zod';
import { guardPublicWrite } from '@/lib/guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRODUCTS } from '@/content/products';

// Envío de vídeos tras comprar la revisión de técnica (o futuros servicios manuales).
const httpsUrl = z.string().trim().url().max(500).refine((u) => u.startsWith('https://'), 'https_only');

const Body = z.object({
  productId: z.string().max(80),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  orderRef: z.string().trim().min(1).max(80),
  videos: z.array(httpsUrl).min(1).max(3),
  notes: z.string().trim().max(1000).optional(),
  privacy: z.literal(true),
  /** Campo trampa: las personas no lo ven; si llega relleno, es un bot. */
  /** Campo trampa antibots. */
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return fail(400, 'invalid_json');
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return fail(400, 'invalid_body');
  const b = parsed.data;
  // Bot detectado por el campo trampa: respuesta normal, sin guardar nada.
  if (isBot(b.website)) return NextResponse.json({ ok: true, result: 'low', scoreBand: 'low', bookingUrl: null });
  if (!PRODUCTS.some((p) => p.id === b.productId && p.tipo === 'servicio')) return fail(400, 'unknown_product');

  const guard = await guardPublicWrite(req.headers, {
    endpoint: 'serviceRequests',
    daily: 'serviceRequests',
    flag: 'service_requests_open',
    turnstileToken: b.turnstileToken,
  });
  if (!guard.ok) return fail(guard.status, guard.reason);

  const db = createAdminClient();
  const { data: lead } = await db.from('leads').select('id').ilike('email', b.email).maybeSingle();
  const { error } = await db.from('service_requests').insert({
    product_id: b.productId,
    lead_id: lead?.id ?? null,
    name: b.name,
    email: b.email,
    order_ref: b.orderRef,
    payload: { videos: b.videos, notes: b.notes ?? null },
  });
  if (error) return fail(500, 'store_failed');
  return NextResponse.json({ ok: true });
}
