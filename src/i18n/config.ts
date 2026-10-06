export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const hasLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Origen público. Cambiar al dominio definitivo vía NEXT_PUBLIC_SITE_URL. */
// `||` y no `??`: en GitHub Actions una variable sin definir llega como cadena vacía y rompía el build.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005').replace(/\/+$/, '');
