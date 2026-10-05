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
  const tokenHash = searchParams.get('token_hash');
  const rawType = searchParams.get('type');
  // Solo tipos de verificación válidos de Supabase (no se confía en lo que llegue en la URL).
  const type = ALLOWED_TYPES.find((t) => t === rawType) ?? null;
  const next = sanitizeNext(searchParams.get('next'));

  if (tokenHash && /^[A-Za-z0-9_-]{10,512}$/.test(tokenHash) && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`);
}

function sanitizeNext(value: string | null) {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value;
  return '/dashboard';
}
