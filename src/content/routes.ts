import type { Locale } from '@/i18n/config';

/**
 * Mapa ÚNICO de secciones públicas y su segmento de URL por idioma.
 * Ningún enlace interno se escribe a mano: siempre sectionPath('learn', locale, ...).
 * Cambiar una URL = cambiarla aquí + renombrar la carpeta de la ruta + añadir redirección.
 */
export const SECTIONS = {
  learn: { es: 'aprende', en: 'learn' },
  tools: { es: 'herramientas', en: 'tools' },
  programs: { es: 'programas', en: 'programs' },
  coaching: { es: 'coaching', en: 'coaching' },
  about: { es: 'sobre-mi', en: 'about' },
  diagnosis: { es: 'diagnostico', en: 'diagnosis' },
  apply: { es: 'solicitar', en: 'apply' },
} as const satisfies Record<string, Record<Locale, string>>;

export type SectionId = keyof typeof SECTIONS;

export function sectionPath(section: SectionId, locale: Locale, ...rest: string[]) {
  const tail = rest.filter(Boolean).join('/');
  return `/${locale}/${SECTIONS[section][locale]}${tail ? `/${tail}` : ''}`;
}
