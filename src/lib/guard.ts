import 'server-only';
import { LIMITS, type DailyCounter, type RateLimitKey } from './limits';
import { createAdminClient } from './supabase/admin';
import { verifyTurnstile } from './turnstile';

export type GuardResult =
  | { ok: true }
  | { ok: false; status: 400 | 403 | 413 | 429 | 503; reason: string };

/** IP del cliente detrás de Cloudflare (o de cualquier proxy). */
export function clientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

/**
 * Filtro común para TODO formulario público, en este orden (de más barato a más caro):
 * kill switch -> tamaño -> Turnstile -> límite por IP -> tope diario global.
 */
export async function guardPublicWrite(
  req: Request,
  opts: { endpoint: RateLimitKey; daily: DailyCounter; flag: string; turnstileToken?: string | null },
): Promise<GuardResult> {
  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > LIMITS.maxBodyBytes) return { ok: false, status: 413, reason: 'payload_too_large' };

  const db = createAdminClient();

  const { data: flag } = await db.from('feature_flags').select('enabled').eq('key', opts.flag).maybeSingle();
  if (flag && !flag.enabled) return { ok: false, status: 503, reason: 'disabled' };

  const ip = clientIp(req);
  if (!(await verifyTurnstile(opts.turnstileToken, ip))) return { ok: false, status: 403, reason: 'bot' };

  const { max, windowSeconds } = LIMITS.perIp[opts.endpoint];
  const { data: underIp } = await db.rpc('check_rate_limit', {
    p_key: `${opts.endpoint}:${ip}`,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (!underIp) return { ok: false, status: 429, reason: 'rate_limited' };

  const { data: underCap } = await db.rpc('bump_daily_counter', {
    p_name: opts.daily,
    p_cap: LIMITS.daily[opts.daily],
  });
  if (!underCap) return { ok: false, status: 503, reason: 'daily_cap' };

  return { ok: true };
}

/** ¿Queda cupo de emails hoy? Si no, el envío se pospone (nunca se paga de más). */
export async function canSendEmailToday(): Promise<boolean> {
  const db = createAdminClient();
  const { data } = await db.rpc('bump_daily_counter', { p_name: 'emails', p_cap: LIMITS.daily.emails });
  return Boolean(data);
}
