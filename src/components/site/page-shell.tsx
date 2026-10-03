import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { LOCALES } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { sectionPath, type SectionId } from '@/content/routes';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

/** Metadatos con canonical y hreflang para una sección (y subruta opcional por idioma). */
export function sectionMetadata(
  section: SectionId,
  locale: Locale,
  m: { title: string; description: string },
  rest: Partial<Record<Locale, string>> = {},
  opts: { noindex?: boolean } = {},
): Metadata {
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: sectionPath(section, locale, rest[locale] ?? ''),
      languages: Object.fromEntries(LOCALES.map((l) => [l, sectionPath(section, l, rest[l] ?? '')])),
    },
    openGraph: { title: m.title, description: m.description },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Cabecera + contenido + pie, común a las páginas públicas. */
export async function PageShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = await getDictionary(locale);
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} t={t} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} t={t} />
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
