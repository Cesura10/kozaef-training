import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL } from '@/i18n/config';
import { LEGAL_SLUGS } from '@/lib/legal';

// Solo páginas públicas. Al publicar guías/herramientas desde el panel se añadirán aquí.
export default function sitemap(): MetadataRoute.Sitemap {
  const alt = (path: string) => ({
    languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
  });
  return LOCALES.flatMap((locale) => [
    { url: `${SITE_URL}/${locale}`, changeFrequency: 'weekly' as const, priority: 1, alternates: alt('') },
    ...LEGAL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${locale}/legal/${slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
      alternates: alt(`/legal/${slug}`),
    })),
  ]);
}
