import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { TechniqueSendForm } from '@/components/funnel/technique-send-form';
import { PageShell } from './page-shell';

/** Página de envío (noindex, fuera del sitemap y no enlazada desde menús): se llega tras comprar. */
export const techniqueSendMetadata = (locale: Locale) => ({
  title: pagesCopy(locale).send.metaTitle,
  robots: { index: false, follow: false },
});

export async function TechniqueSendPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).send;
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="display text-4xl font-bold leading-[1.02] md:text-5xl">{c.h1}</h1>
        <p className="mt-4 text-lg text-muted">{c.intro}</p>
        <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 sm:p-8">
          <TechniqueSendForm c={c} locale={locale} productId="revision-tecnica" />
        </div>
      </section>
    </PageShell>
  );
}
