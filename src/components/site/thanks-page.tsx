import Link from 'next/link';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { sectionPath } from '@/content/routes';
import { COACHING_CREDIT } from '@/content/offers';
import { PRODUCTS } from '@/content/products';
import { PageShell } from './page-shell';

/** Página de gracias tras comprar en Shopify. noindex, fuera del sitemap y bloqueada en robots.txt. */
export const thanksMetadata = (locale: Locale) => ({ title: pagesCopy(locale).thanks.metaTitle, robots: { index: false, follow: false } });

export async function ThanksPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).thanks;
  const technique = PRODUCTS.find((p) => p.id === 'revision-tecnica' && p.publicado);
  const credit = COACHING_CREDIT[locale];
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <CheckCircle size={40} weight="duotone" className="text-primary" aria-hidden />
        <h1 className="display mt-4 text-4xl font-bold md:text-5xl">{c.h1}</h1>
        <p className="mt-4 text-lg text-muted">{c.body}</p>
        {technique && (
          <div className="mt-8 rounded-[var(--radius-xl)] border border-border p-6">
            <p className="font-semibold text-fg">{c.techniqueTitle}</p>
            <Link
              href={sectionPath('programs', locale, technique.slug[locale], locale === 'es' ? 'enviar' : 'send')}
              className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {c.techniqueCta}
            </Link>
          </div>
        )}
        <div className="gold-sheen mt-6 rounded-[var(--radius-xl)] border border-primary/30 p-6">
          <p className="display text-xl font-bold">{c.coachingTitle}</p>
          <p className="mt-2 text-muted">{c.coachingBody}</p>
          {credit && <p className="mt-2 font-medium text-fg">{credit}</p>}
          <Link
            href={sectionPath('apply', locale)}
            data-track="cta_click"
            data-cta="apply"
            data-location="thanks"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
          >
            {locale === 'es' ? 'Solicitar plaza' : 'Apply now'}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
