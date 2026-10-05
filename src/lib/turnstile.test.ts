import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('verifyTurnstile', () => {
  it('un fallo de red se trata como verificación fallida (no lanza)', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secreto');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const { verifyTurnstile } = await import('./turnstile');
    await expect(verifyTurnstile('token', '1.2.3.4')).resolves.toBe(false);
  });
  it('una respuesta que no es JSON también da false', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secreto');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>', { status: 200 })));
    const { verifyTurnstile } = await import('./turnstile');
    await expect(verifyTurnstile('token')).resolves.toBe(false);
  });
  it('acepta solo success === true', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secreto');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true })));
    const { verifyTurnstile } = await import('./turnstile');
    await expect(verifyTurnstile('token')).resolves.toBe(true);
    await expect(verifyTurnstile(null)).resolves.toBe(false);
  });
});
