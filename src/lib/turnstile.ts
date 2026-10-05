import 'server-only';

/**
 * Verifica el token de Cloudflare Turnstile (anti-bots, gratis e ilimitado).
 * Sin TURNSTILE_SECRET_KEY (desarrollo local) se deja pasar.
 */
export async function verifyTurnstile(token: string | null | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== 'production';
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  // Un fallo de red o una respuesta rara no debe tumbar el endpoint con un 500 sin controlar:
  // se trata como verificación fallida.
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
