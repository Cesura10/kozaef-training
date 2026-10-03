import Link from 'next/link';
import { ArrowRight, Check } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { pagesCopy } from '@/content/pages';
import { sectionPath } from '@/content/routes';
import { PRODUCTS } from '@/content/products';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd, PageShell, sectionMetadata } from './page-shell';

export const coachingMetadata = (locale: Locale) => {
  const c = pagesCopy(locale).coaching;
  return sectionMetadata('coaching', locale, { title: c.metaTitle, description: c.metaDescription });
};

export async function CoachingPage({ locale }: { locale: Locale }) {
  const t = await getDictionary(locale);
  const c = pagesCopy(locale).coaching;
  const technique = PRODUCTS.find((p) => p.id === 'revision-tecnica' && p.publicado);
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <div>
            <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
            <p className="mt-5 max-w-[55ch] text-lg leading-relaxed text-muted">{c.intro}</p>
            <ul className="mt-8 space-y-4">
              {t.coaching.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-fg/90">
                  <Check size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={sectionPath('apply', locale)}
              className="mt-10 h-12 px-7"
              data-track="cta_click"
              data-cta="apply"
              data-location="coaching-page"
            >
              {t.nav.apply}
              <ArrowRight size={16} weight="bold" />
            </ButtonLink>
          </div>
          {technique && (
            <aside className="gold-sheen rounded-[var(--radius-xl)] border border-primary/30 p-6">
              <h2 className="display text-xl font-bold">{c.techniqueTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.techniqueBody}</p>
              <Link
                href={sectionPath('programs', locale, technique.slug[locale])}
                data-track="cta_click"
                data-cta="technique"
                data-location="coaching-page"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                {c.techniqueCta}
              </Link>
            </aside>
          )}
        </div>
      </section>

      <section className="border-t border-border/60 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <h2 className="display text-3xl font-bold md:text-4xl">{c.howTitle}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {c.how.map((s) => (
              <li key={s.h} className="border-t border-primary/40 pt-5">
                <h3 className="text-xl font-semibold text-fg">{s.h}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border/60 py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <h2 className="display text-3xl font-bold">{c.faqTitle}</h2>
          <div className="mt-6 divide-y divide-border rounded-[var(--radius-xl)] border border-border">
            {c.faq.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-fg">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </PageShell>
  );
}
