import type { QuestionKey } from '@/content/apply';

/**
 * Puntuación de una solicitud de coaching (lógica pura, la usa /api/applications).
 * Reglas en public.scoring_rules; umbral y cupo semanal en feature_flags.
 */
export type ScoringRule = { question: string; answer: string; points: number };
export type FlagRow = { key: string; value: unknown };
export type ApplicationStatus = 'qualified' | 'waitlist' | 'new';

// Máximo posible 60 (experiencia 10 + estancamiento 15 + días 15 + compromiso 20): 40 = dos tercios.
export const DEFAULT_THRESHOLD = 40;
export const DEFAULT_WEEKLY_CAPACITY = 8;

function flagNumber(flags: FlagRow[], key: string, field: string, fallback: number) {
  const v = flags.find((f) => f.key === key)?.value;
  const n = v && typeof v === 'object' ? (v as Record<string, unknown>)[field] : undefined;
  return typeof n === 'number' && Number.isFinite(n) ? n : fallback;
}

export function scoreApplication(
  answers: Record<QuestionKey, string>,
  rules: ScoringRule[],
  flags: FlagRow[],
  takenThisWeek: number,
) {
  const score = rules.reduce((sum, r) => (answers[r.question as QuestionKey] === r.answer ? sum + r.points : sum), 0);
  const threshold = flagNumber(flags, 'application_threshold', 'score', DEFAULT_THRESHOLD);
  const capacity = flagNumber(flags, 'weekly_call_capacity', 'max', DEFAULT_WEEKLY_CAPACITY);
  const status: ApplicationStatus = score >= threshold ? (takenThisWeek < capacity ? 'qualified' : 'waitlist') : 'new';
  const scoreBand = score >= threshold ? 'high' : score >= threshold / 2 ? 'mid' : 'low';
  return { score, threshold, status, scoreBand } as const;
}

/**
 * Enlace de reserva de Cal.com con los datos precargados. Si CALCOM_URL está mal escrita
 * devuelve null (se muestra "te escribo en 48 h") en vez de romper la respuesta cuando la
 * solicitud ya se ha guardado.
 */
export function bookingUrl(cal: string | undefined, name: string, email: string, token: string | null): string | null {
  if (!cal) return null;
  let u: URL;
  try {
    u = new URL(cal);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:') return null;
  u.searchParams.set('name', name);
  u.searchParams.set('email', email);
  u.searchParams.set('metadata[token]', token ?? '');
  return u.toString();
}
