import { NextResponse } from 'next/server';
import { isBot } from '@/components/honeypot';
import { z } from 'zod';
import { ANSWERS, QUESTION_KEYS, type QuestionKey } from '@/content/apply';
import { bookingUrl, scoreApplication } from '@/lib/applications';
import { guardPublicWrite } from '@/lib/guard';
import { escapeLike } from '@/lib/like';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';

// Solicitud de coaching: puntuación en servidor (scoring_rules), umbral y cupo semanal en feature_flags.

// Cada pregunta, obligatoria y con una de sus respuestas válidas.
const Answers = z
  .record(z.string(), z.string())
  .refine((a) => QUESTION_KEYS.every((k) => ANSWERS[k].includes(a[k])), 'invalid_answers')
  .transform((a) => Object.fromEntries(QUESTION_KEYS.map((k) => [k, a[k]])) as Record<QuestionKey, string>);

const Body = z.object({
  answers: Answers,
  tried: z.string().trim().max(1000).optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  privacy: z.literal(true),
  ageOk: z.literal(true),
  locale: z.enum(['es', 'en']).default('es'),
  source: z.string().max(40).optional(),
  utm: z.record(z.string().max(40), z.string().max(100)).optional(),
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

  const guard = await guardPublicWrite(req.headers, {
    endpoint: 'applications',
    daily: 'applications',
    flag: 'applications_open',
    turnstileToken: b.turnstileToken,
  });
  if (!guard.ok) return fail(guard.status, guard.reason);

  const db = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [rulesRes, flagsRes, takenRes] = await Promise.all([
    db.from('scoring_rules').select('question, answer, points').eq('active', true),
    db.from('feature_flags').select('key, value').in('key', ['application_threshold', 'weekly_call_capacity']),
    db
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .in('status', ['qualified', 'booked'])
      .gte('created_at', weekAgo),
  ]);
  // Sin reglas no se puede puntuar: mejor pedir que lo reintente que guardar un 0 y descartarle.
  if (rulesRes.error || flagsRes.error || takenRes.error) return fail(503, 'scoring_unavailable');

  const answers = b.answers;
  const { score, status, scoreBand } = scoreApplication(answers, rulesRes.data ?? [], flagsRes.data ?? [], takenRes.count ?? 0);

  // Vincula con el lead (lo crea sin consentimiento de marketing si no existía).
  let leadId: string | null = null;
  const { data: existing } = await db.from('leads').select('id').ilike('email', escapeLike(b.email)).maybeSingle();
  if (existing) {
    leadId = existing.id;
  } else {
    const { data: created } = await db
      .from('leads')
      .insert({ email: b.email, locale: b.locale, source: b.source ?? 'directo', utm: (b.utm ?? {}) as Json, marketing_consent: false })
      .select('id')
      .single();
    leadId = created?.id ?? null;
  }

  const { data: app, error } = await db
    .from('applications')
    .insert({
      lead_id: leadId,
      email: b.email,
      name: b.name,
      answers: { ...answers, tried: b.tried ?? null } as Json,
      score,
      status,
    })
    .select('booking_token')
    .single();
  if (error || !app) return fail(500, 'store_failed');

  if (leadId) await db.from('lead_events').insert({ lead_id: leadId, type: 'applied', data: { score, status } });

  const booking = status === 'qualified' ? bookingUrl(process.env.CALCOM_URL, b.name, b.email, app.booking_token) : null;

  return NextResponse.json({
    ok: true,
    result: status === 'qualified' ? 'qualified' : status === 'waitlist' ? 'waitlist' : 'low',
    scoreBand,
    bookingUrl: booking,
  });
}
