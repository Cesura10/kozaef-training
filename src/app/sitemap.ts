import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/i18n/config';
import { indexablePages } from '@/lib/indexable';

// Generado a partir de src/lib/indexable.ts: lastmod real (fecha de revisión) en artículos.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages().map((p) => ({
    url: `${SITE_URL}${p.path}`,
    ...(p.lastmod ? { lastModified: p.lastmod } : {}),
    priority: p.priority,
    ...(p.alternates
      ? { alternates: { languages: Object.fromEntries(Object.entries(p.alternates).map(([l, path]) => [l, `${SITE_URL}${path}`])) } }
      : {}),
  }));
}
