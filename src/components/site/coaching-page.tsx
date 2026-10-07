import Link from 'next/link';
import { ArrowRight, Check } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { pagesCopy } from '@/content/pages';
import { sectionPath } from '@/content/routes';
import { PRODUCTS } from '@/content/products';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd, PageShell, sectionMetadata } from './page-shell';
import { PageHero } from './page-hero';
import { Reveal } from '@/components/marketing/reveal';
import { Spotlight } from '@/components/motion/spotlight';
import { DrawLine } from '@/components/motion/draw-line';

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
      <PageHero
        index="04"
        label={t.coaching.eyebrow}
        title={[c.h1]}
        intro={c.intro}
        aside={
          technique && (
            <Spotlight className="gold-sheen w-full max-w-sm rounded-[var(--radius-xl)] border border-primary/30 p-7">
              <h2 className="display text-xl font-bold">{c.techniqueTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.techniqueBody}</p>
              <Link
                href={sectionPath('programs', locale, technique.slug[locale])}
                data-track="cta_click"
                data-cta="technique"
                data-location="coaching-page"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                {c.techniqueCta}
                <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Spotlight>
          )
        }
      >
        <ul className="space-y-4">
          {t.coaching.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-lg text-fg/90">
              <Check size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink
          href={sectionPath('apply', locale)}
          className="group mt-10 h-12 px-7"
          data-track="cta_click"
          data-cta="apply"
          data-location="coaching-page"
        >
          {t.nav.apply}
          <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </PageHero>

      <section className="border-t border-border/60 py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display max-w-[16ch] text-4xl font-bold leading-[1.02] md:text-6xl">{c.howTitle}</h2>
          </Reveal>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {c.how.map((s, i) => (
              <li key={s.h}>
                <Reveal delay={i * 0.12}>
                  <span className="display text-6xl font-bold leading-none text-primary/90">{String(i + 1).padStart(2, '0')}</span>
                  <DrawLine className="mt-6 h-px w-full bg-gradient-to-r from-primary to-primary/0" delay={0.3 + i * 0.2} />
                  <h3 className="mt-6 text-xl font-semibold text-fg">{s.h}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border/60 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Reveal>
            <h2 className="display text-4xl font-bold leading-[1.02] md:text-5xl lg:sticky lg:top-28">{c.faqTitle}</h2>
          </Reveal>
          <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {c.faq.map((f, i) => (
              <Reveal key={f.q} delay={(i % 2) * 0.08}>
                <dt className="border-t border-primary/40 pt-5 text-lg font-semibold text-fg">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
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
