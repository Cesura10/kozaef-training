/**
 * Métodos de acceso. Hoy: SOLO enlace mágico. Contraseña y Google están
 * implementados pero apagados; se activan con estas variables sin tocar código
 * (y en Supabase: Authentication -> Providers).
 */
export const AUTH_METHODS = {
  password: process.env.NEXT_PUBLIC_AUTH_PASSWORD === 'true',
  google: process.env.NEXT_PUBLIC_AUTH_GOOGLE === 'true',
} as const;
