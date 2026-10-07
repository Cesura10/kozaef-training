import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { TOOL_CONTENT, TOOL_IDS, toolPath, type ToolId } from '@/content/tools';
import { AdSlot } from '@/components/funnel/ad-slot';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { PageShell, sectionMetadata } from './page-shell';
import { PageHero } from './page-hero';
import { Reveal } from '@/components/marketing/reveal';

/** Unidad que devuelve cada herramienta: se ve gigante y hueca, como anticipo del resultado. */
const UNIT: Record<ToolId, string> = { calories: 'kcal', protein: 'g/kg', bodyfat: '%' };

export const toolsIndexMetadata = (locale: Locale) => {
  const c = pagesCopy(locale).tools;
  return sectionMetadata('tools', locale, { title: c.metaTitle, description: c.metaDescription });
};

export async function ToolsIndexPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).tools;
  return (
    <PageShell locale={locale}>
      <PageHero index="02" label={c.h1} title={[c.h1]} intro={c.intro} />
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <ol className="border-t border-border">
          {TOOL_IDS.map((id, i) => {
            const t = TOOL_CONTENT[locale][id];
            return (
              <li key={id} className="border-b border-border">
                <Reveal delay={i * 0.08}>
                  <Link
                    href={toolPath(id, locale)}
                    className="group relative isolate grid items-center gap-4 overflow-hidden py-9 outline-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-[linear-gradient(90deg,rgba(214,169,69,0.10),transparent_70%)] before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-x-100 focus-visible:before:scale-x-100 md:grid-cols-[7rem_minmax(0,1fr)_12rem_3rem] md:gap-8 md:py-12"
                  >
                    <span className="display outline-num text-6xl font-bold leading-none md:text-7xl" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="display text-2xl font-bold leading-tight text-fg transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                        {t.h1}
                      </h2>
                      <p className="mt-3 max-w-[56ch] text-muted">{t.intro}</p>
                    </div>
                    <span className="display hidden text-right text-5xl font-bold text-fg/10 transition-colors duration-500 group-hover:text-primary/30 md:block" aria-hidden>
                      {UNIT[id]}
                    </span>
                    <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-border-strong text-fg transition-all duration-500 group-hover:-rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-fg md:flex" aria-hidden>
                      <ArrowRight size={18} weight="bold" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <div className="mt-16 space-y-6">
          <AdSlot locale={locale} />
          <CtaCoaching locale={locale} location="tools-index" />
        </div>
      </section>
    </PageShell>
  );
}
