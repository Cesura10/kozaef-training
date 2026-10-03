import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { LEGAL } from '@/content/legal';
import { LEGAL_OWNER, LEGAL_SLUGS, type LegalSlug } from '@/lib/legal';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => LEGAL_SLUGS.map((slug) => ({ locale, slug })));
}

const isSlug = (s: string): s is LegalSlug => (LEGAL_SLUGS as readonly string[]).includes(s);

export async function generateMetadata({ params }: PageProps<'/[locale]/legal/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isSlug(slug)) return {};
  return {
    title: LEGAL[locale][slug].title,
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/legal/${slug}`])),
    },
  };
}

export default async function LegalPage({ params }: PageProps<'/[locale]/legal/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isSlug(slug)) notFound();
  const t = await getDictionary(locale);
  const doc = LEGAL[locale][slug];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} t={t} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="display text-4xl font-bold leading-[1.05] md:text-5xl">{doc.title}</h1>
        <p className="mt-4 text-lg text-muted">{doc.intro}</p>
        <div className="mt-12 space-y-10">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-semibold text-fg">{s.h}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted">
                {s.p.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-14 text-sm text-faint">
          {locale === 'es' ? 'Última actualización' : 'Last updated'}: {LEGAL_OWNER.updated}
        </p>
      </main>
      <SiteFooter locale={locale} t={t} />
    </div>
  );
}
