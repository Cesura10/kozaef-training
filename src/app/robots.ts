import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/i18n/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/signup', '/entrar', '/auth/', '/dashboard', '/analitica', '/app/', '/panel/', '/setup'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
