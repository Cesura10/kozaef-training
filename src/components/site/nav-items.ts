import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { sectionPath } from '@/content/routes';
import { aboutReady } from '@/content/author';

/** Menú principal (brief): Aprende · Herramientas · Programas · Coaching · Sobre mí (cuando esté listo). */
export function mainNav(locale: Locale, t: Dictionary) {
  return [
    { href: sectionPath('learn', locale), label: t.nav.learn },
    { href: sectionPath('tools', locale), label: t.nav.tools },
    { href: sectionPath('programs', locale), label: t.nav.programs },
    { href: sectionPath('coaching', locale), label: t.nav.coaching },
    ...(aboutReady() ? [{ href: sectionPath('about', locale), label: t.nav.about }] : []),
  ];
}
