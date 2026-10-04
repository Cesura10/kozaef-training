import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { LOCALES, SITE_URL } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { CALC_UI, TOOL_CONTENT, TOOL_IDS, toolPath, type ToolId } from '@/content/tools';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { ProteinCalculator } from '@/components/marketing/protein-calculator';
import { CaloriesCalculator } from '@/components/calculators/calories-calculator';
import { BodyfatCalculator } from '@/components/calculators/bodyfat-calculator';
import { BloqueProducto } from '@/components/funnel/bloque-producto';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import type { CategoryId } from '@/content/taxonomy';

/** Tema de cada herramienta, para elegir el producto relacionado. */
const TOOL_CATEGORY: Record<ToolId, CategoryId> = { calories: 'perder-grasa', protein: 'nutricion', bodyfat: 'perder-grasa' };

export function toolMetadata(locale: Locale, id: ToolId): Metadata {
  const c = TOOL_CONTENT[locale][id];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: toolPath(id, locale),
      languages: Object.fromEntries(LOCALES.map((l) => [l, toolPath(id, l)])),
    },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url: toolPath(id, locale) },
  };
}

export async function ToolPage({ locale, id }: { locale: Locale; id: ToolId }) {
  const t = await getDictionary(locale);
  const c = TOOL_CONTENT[locale][id];
  const ui = CALC_UI[locale];
  const others = TOOL_IDS.filter((x) => x !== id);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: c.h1,
      description: c.metaDescription,
      url: `${SITE_URL}${toolPath(id, locale)}`,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      inLanguage: locale,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} t={t} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
          <div className="animate-rise max-w-3xl">
            <h1 className="display text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
            <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{c.intro}</p>
          </div>

          <div className="animate-rise mt-10 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 [animation-delay:100ms] sm:p-8">
            {id === 'calories' && <CaloriesCalculator ui={ui} />}
            {id === 'bodyfat' && <BodyfatCalculator ui={ui} />}
            {id === 'protein' && (
              <div className="mx-auto max-w-xl">
                <ProteinCalculator t={t.calculator} />
              </div>
            )}
            <p className="mt-6 text-xs text-faint">{ui.disclaimer}</p>
          </div>

          <div id="lista" className="mt-6 grid gap-6 rounded-[var(--radius-xl)] border border-primary/25 p-6 gold-sheen sm:p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="display text-2xl font-bold md:text-3xl">{ui.emailTitle}</h2>
              <p className="mt-2 text-muted">{ui.emailBody}</p>
            </div>
            <NewsletterForm t={t.newsletter} locale={locale} />
          </div>

          {/* Embudo (brief): resultado sin email -> extra por email -> producto -> coaching */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <BloqueProducto locale={locale} categoria={TOOL_CATEGORY[id]} location={`tool-${id}`} />
            <CtaCoaching locale={locale} location={`tool-${id}`} />
          </div>
        </section>

        <section className="border-t border-border/60 py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="max-w-3xl space-y-10">
              {c.how.map((h) => (
                <article key={h.h}>
                  <h2 className="text-2xl font-semibold text-fg">{h.h}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-muted">{h.p}</p>
                </article>
              ))}

              <div>
                <h2 className="text-2xl font-semibold text-fg">{locale === 'es' ? 'Preguntas frecuentes' : 'FAQ'}</h2>
                <div className="mt-4 divide-y divide-border rounded-[var(--radius-xl)] border border-border">
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
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <nav aria-label={locale === 'es' ? 'Otras herramientas' : 'Other tools'} className="space-y-2">
                {others.map((o) => (
                  <Link
                    key={o}
                    href={toolPath(o, locale)}
                    className="group flex items-center justify-between rounded-2xl border border-border px-5 py-4 text-sm text-fg transition-colors hover:border-primary/50"
                  >
                    {TOOL_CONTENT[locale][o].h1}
                    <ArrowUpRight size={16} className="text-faint group-hover:text-primary" aria-hidden />
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  );
}
