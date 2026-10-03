import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

// Next.js 16: el antiguo `middleware` se llama ahora `proxy`.
// SOLO corre en rutas de la plataforma privada. La web pública (/es, /en) no
// pasa por aquí: así se sirve estática desde la CDN y aguanta picos virales.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clientes/:path*',
    '/ejercicios/:path*',
    '/mi-rutina/:path*',
    '/mi-dieta/:path*',
    '/revisiones/:path*',
    '/app/:path*',
    '/panel/:path*',
    '/analitica/:path*',
    '/solicitudes/:path*',
    '/login',
    '/signup',
    '/entrar',
    '/setup',
    '/auth/:path*',
  ],
};
