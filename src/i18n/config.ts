export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';
/**
 * Idiomas que Google debe indexar. El inglés existe pero es más pobre (decisión de Manu, 2026-10-21:
 * Google mostraba la portada en inglés al buscar la marca): va con noindex y sin hreflang hasta que
 * tenga el mismo contenido. Para indexarlo, añadirlo aquí y quitar su cabecera en next.config.ts.
 */
export const INDEXED_LOCALES: readonly Locale[] = ['es'];
export const isIndexedLocale = (l: Locale) => INDEXED_LOCALES.includes(l);

export const hasLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Origen público. Cambiar al dominio definitivo vía NEXT_PUBLIC_SITE_URL. */
// `||` y no `??`: en GitHub Actions una variable sin definir llega como cadena vacía y rompía el build.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005').replace(/\/+$/, '');
