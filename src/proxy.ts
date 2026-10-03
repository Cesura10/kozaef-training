import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

// Next.js 16: el antiguo `middleware` se llama ahora `proxy` (runtime nodejs).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto assets estáticos:
     * _next/static, _next/image, favicon.ico, imágenes e íconos.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
