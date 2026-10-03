import type { Locale } from '@/i18n/config';
import { ADS_ENABLED } from '@/lib/ads';
import type { CategoryId, ProfileId } from '@/content/taxonomy';
import { BloqueProducto } from './bloque-producto';

/**
 * Hueco publicitario. SOLO en /aprende y /herramientas (brief §6). Apagado por defecto:
 * mientras ADS_ENABLED sea false, muestra un producto propio relacionado.
 */
export function AdSlot({ locale, categoria, perfiles }: { locale: Locale; categoria?: CategoryId | null; perfiles?: ProfileId[] }) {
  if (!ADS_ENABLED) return <BloqueProducto locale={locale} categoria={categoria} perfiles={perfiles} location="ad-slot" />;
  // Cuando se activen anuncios (requiere banner de consentimiento TCF para AdSense):
  return <div data-ad-slot aria-hidden className="min-h-[250px]" />;
}
