/**
 * Consentimiento de cookies (brief seguridad §B5). Guardado en localStorage (dato funcional).
 * marketing = píxel de Meta + grabaciones/persistencia de PostHog.
 */
const KEY = 'kz_consent';
export type Consent = { v: 1; marketing: boolean; at: string };
export const CONSENT_EVENT = 'kz:open-consent';

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(marketing: boolean): Consent {
  const c: Consent = { v: 1, marketing, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // sin almacenamiento: se volverá a preguntar
  }
  return c;
}

/** ¿Hay algo que requiera consentimiento? Sin píxel ni PostHog, no se muestra banner. */
export const consentNeeded = () => Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_POSTHOG_KEY);
