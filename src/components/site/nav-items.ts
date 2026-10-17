import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { sectionPath } from '@/content/routes';
import { aboutReady } from '@/content/author';

/** Menú principal: Coaching · Guías · Herramientas · Aprende · Sobre mí (cuando esté listo). */
export function mainNav(locale: Locale, t: Dictionary) {
  return [
    // Orden por lo que es Kozaef: primero el servicio 1:1, después las guías y lo gratuito.
    { href: sectionPath('coaching', locale), label: t.nav.coaching },
    { href: sectionPath('programs', locale), label: t.nav.programs },
    { href: sectionPath('tools', locale), label: t.nav.tools },
    { href: sectionPath('learn', locale), label: t.nav.learn },
    ...(aboutReady() ? [{ href: sectionPath('about', locale), label: t.nav.about }] : []),
  ];
}
