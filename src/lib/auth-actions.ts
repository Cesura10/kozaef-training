'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { guardPublicWrite } from '@/lib/guard';

export type MagicLinkState =
  | { status: 'idle' }
  | { status: 'sent'; email: string }
  | { status: 'error'; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(value: FormDataEntryValue | null) {
  const v = typeof value === 'string' ? value : '';
  return v.startsWith('/') && !v.startsWith('//') ? v : '/dashboard';
}

/**
 * Envía el enlace mágico. Pasa por guardPublicWrite (límite por IP + tope diario
 * de emails) para que nadie pueda usarlo para spamear ni agotar el plan gratis.
 * Crea la cuenta si no existe: no hay registro separado.
 */
export async function requestMagicLink(_prev: MagicLinkState, form: FormData): Promise<MagicLinkState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: 'Revisa el email, parece incompleto.' };
  }

  const h = await headers();
  const guard = await guardPublicWrite(h, {
    endpoint: 'magicLink',
    daily: 'emails',
    flag: 'emails_sending',
    turnstileToken: form.get('cf-turnstile-response') as string | null,
  });
  if (!guard.ok) {
    const message =
      guard.reason === 'rate_limited'
        ? 'Has pedido demasiados enlaces. Espera un rato e inténtalo de nuevo.'
        : guard.reason === 'daily_cap' || guard.reason === 'disabled'
          ? 'Ahora mismo no podemos enviar más emails. Inténtalo mañana.'
          : 'No hemos podido verificar la petición. Recarga la página.';
    return { status: 'error', message };
  }

  const origin = h.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const next = safeNext(form.get('next'));
  const name = String(form.get('full_name') ?? '').trim().slice(0, 120);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      data: name ? { full_name: name } : undefined,
    },
  });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes('rate limit') || m.includes('security purposes')) {
      return { status: 'error', message: 'Espera un minuto antes de pedir otro enlace.' };
    }
    return { status: 'error', message: 'No se pudo enviar el enlace. Inténtalo de nuevo.' };
  }
  return { status: 'sent', email };
}
