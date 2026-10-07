import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { fontVariables } from '../../fonts';
import { LOCALES, SITE_URL, hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import Script from 'next/script';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { ConsentBanner } from '@/components/consent-banner';
import '../../globals.css';

// Web pública: estática por idioma y servida desde CDN. Nada de cookies ni BD al renderizar.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    // Verificación de Google Search Console (etiqueta HTML); sin la variable no se añade nada.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
    title: { default: t.meta.title, template: '%s | Kozaef Training' },
    description: t.meta.description,
    applicationName: 'Kozaef Training',
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])), 'x-default': '/es' },
    },
    openGraph: { siteName: 'Kozaef Training', locale, type: 'website' },
    appleWebApp: { capable: true, title: 'Kozaef', statusBarStyle: 'black-translucent' },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
};

export default async function SiteLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="app-backdrop grain min-h-full flex flex-col">
        {children}
        <AnalyticsProvider locale={locale} />
        <ConsentBanner locale={locale} />
        {/* Cloudflare Web Analytics: sin cookies, gratis e ilimitado. Solo si hay token. */}
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
