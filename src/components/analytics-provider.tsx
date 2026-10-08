'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/analytics/attribution';
import { initAnalytics, track } from '@/lib/analytics/client';
import type { AnalyticsEvents } from '@/lib/analytics/events';

/**
 * Arranca la analítica en la web pública:
 * - guarda la atribución de primer contacto (canal de origen),
 * - registra idioma y canal en todos los eventos,
 * - mide los clics de cualquier elemento con data-track="cta_click" o "affiliate_click" (sin convertir
 *   los botones en Client Components: siguen siendo HTML estático).
 */
export function AnalyticsProvider({ locale }: { locale: string }) {
  useEffect(() => {
    const attribution = captureAttribution();
    initAnalytics({ locale, source: attribution?.source ?? 'directo' });

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const { track: name, cta, location, to } = el.dataset;
      if (name === 'cta_click' && cta) {
        track('cta_click', { cta, location: location ?? 'page' } as AnalyticsEvents['cta_click']);
      } else if (name === 'affiliate_click' && el.dataset.product) {
        track('affiliate_click', { product: el.dataset.product, location: location ?? 'page' });
      } else if (name === 'language_switch' && to) {
        track('language_switch', { to });
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [locale]);

  return null;
}
