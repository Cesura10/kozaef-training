import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guardPublicWrite } from '@/lib/guard';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';

// Captura de emails de la web pública (newsletter y herramientas).
// Orden: guardPublicWrite (kill switch, tamaño, Turnstile, IP, tope diario) -> validar -> guardar.

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
  consentText: z.string().min(10).max(1000),
  locale: z.enum(['es', 'en']).default('es'),
  source: z.string().max(40).optional(),
  utm: z.record(z.string().max(40), z.string().max(100)).optional(),
  tool: z.enum(['protein', 'calories', 'bodyfat']).optional(),
  toolInputs: z.record(z.string().max(40), z.union([z.string().max(40), z.number()])).optional(),
  toolOutputs: z.record(z.string().max(40), z.union([z.string().max(40), z.number()])).optional(),
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

  const guard = await guardPublicWrite(req.headers, {
    endpoint: 'leads',
    daily: 'leads',
    flag: 'leads_capture',
    turnstileToken: b.turnstileToken,
  });
  if (!guard.ok) return fail(guard.status, guard.reason);

  const db = createAdminClient();
  const now = new Date().toISOString();

  // Alta o reactivación (el email es único sin distinguir mayúsculas).
  let leadId: string | null = null;
  const { data: inserted, error: insertError } = await db
    .from('leads')
    .insert({
      email: b.email,
      locale: b.locale,
      source: b.source ?? 'directo',
      utm: (b.utm ?? {}) as Json,
      first_tool: b.tool ?? null,
      marketing_consent: true,
      consent_text: b.consentText,
      consent_at: now,
    })
    .select('id')
    .single();

  if (inserted) {
    leadId = inserted.id;
  } else if (insertError?.code === '23505') {
    const { data: existing } = await db
      .from('leads')
      .update({ marketing_consent: true, consent_text: b.consentText, consent_at: now, unsubscribed_at: null })
      .ilike('email', b.email)
      .select('id')
      .single();
    leadId = existing?.id ?? null;
  }
  if (!leadId) return fail(500, 'store_failed');

  await Promise.all([
    db.from('lead_events').insert({ lead_id: leadId, type: b.tool ? 'tool_email' : 'subscribed', data: { tool: b.tool ?? null } }),
    b.tool && b.toolInputs && b.toolOutputs
      ? db.from('tool_results').insert({
          lead_id: leadId,
          tool: b.tool,
          inputs: b.toolInputs as Json,
          outputs: b.toolOutputs as Json,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
