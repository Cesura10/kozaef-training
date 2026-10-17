import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { sectionPath } from '@/content/routes';
import { aboutReady } from '@/content/author';

/**
 * Menú principal: Aprende · Herramientas · Coaching (+ botón "Solicitar plaza" en la cabecera).
 * Las guías (/programas) NO van aquí: la oferta principal es el coaching y la guía es el plan B.
 * Siguen enlazadas desde el pie y desde /aprende (mismas URL).
 */
export function mainNav(locale: Locale, t: Dictionary) {
  return [
    { href: sectionPath('learn', locale), label: t.nav.learn },
    { href: sectionPath('tools', locale), label: t.nav.tools },
    { href: sectionPath('coaching', locale), label: t.nav.coaching },
    ...(aboutReady() ? [{ href: sectionPath('about', locale), label: t.nav.about }] : []),
  ];
}
