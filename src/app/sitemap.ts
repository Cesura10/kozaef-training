import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/i18n/config';
import { indexablePages } from '@/lib/indexable';

/**
 * Idiomas que se anuncian a Google. De momento solo español: el público es España y las guías
 * están en español. Las páginas en inglés siguen existiendo; para anunciarlas, añadir 'en' aquí.
 */
const SITEMAP_LOCALES = ['es'];
const inSitemap = (path: string) => SITEMAP_LOCALES.some((l) => path === `/${l}` || path.startsWith(`/${l}/`));

// Generado a partir de src/lib/indexable.ts: lastmod real (fecha de revisión) en artículos.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages()
    .filter((p) => inSitemap(p.path))
    .map((p) => ({
      url: `${SITE_URL}${p.path}`,
      ...(p.lastmod ? { lastModified: p.lastmod } : {}),
      priority: p.priority,
    }));
}
