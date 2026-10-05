import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Confirmación de email / magic link (flujo con token_hash).
 * El correo de Supabase debe apuntar a:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}
 */
const ALLOWED_TYPES: EmailOtpType[] = ['signup', 'magiclink', 'recovery', 'invite', 'email_change', 'email'];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const rawHash = searchParams.get('token_hash') ?? '';
  const rawType = searchParams.get('type');
  const next = sanitizeNext(searchParams.get('next'));

  // La decisión la toma SIEMPRE Supabase en su servidor: se verifica en todos los casos y un
  // token o tipo no válido simplemente devuelve error (no hay atajo controlado por la URL).
  const tokenHash = /^[A-Za-z0-9_-]{10,512}$/.test(rawHash) ? rawHash : 'invalid';
  const type: EmailOtpType = ALLOWED_TYPES.find((t) => t === rawType) ?? 'email';

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  return NextResponse.redirect(error ? `${origin}/login?error=confirm` : `${origin}${next}`);
}

function sanitizeNext(value: string | null) {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value;
  return '/dashboard';
}
