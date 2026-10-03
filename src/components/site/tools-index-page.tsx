import Link from 'next/link';
import { ArrowUpRight, Drop, Fire, Ruler } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { TOOL_CONTENT, TOOL_IDS, toolPath, type ToolId } from '@/content/tools';
import { AdSlot } from '@/components/funnel/ad-slot';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { PageShell, sectionMetadata } from './page-shell';

const ICONS: Record<ToolId, typeof Fire> = { calories: Fire, protein: Drop, bodyfat: Ruler };

export const toolsIndexMetadata = (locale: Locale) => {
  const c = pagesCopy(locale).tools;
  return sectionMetadata('tools', locale, { title: c.metaTitle, description: c.metaDescription });
};

export async function ToolsIndexPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).tools;
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">{c.intro}</p>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {TOOL_IDS.map((id) => {
            const Icon = ICONS[id];
            const t = TOOL_CONTENT[locale][id];
            return (
              <li key={id}>
                <Link
                  href={toolPath(id, locale)}
                  className="group flex h-full flex-col justify-between gap-10 rounded-[var(--radius-xl)] border border-border bg-surface p-7 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={28} weight="duotone" className="text-primary" aria-hidden />
                    <ArrowUpRight size={20} className="text-faint group-hover:text-primary" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-fg">{t.h1}</h2>
                    <p className="mt-2 text-sm text-muted">{t.intro}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <AdSlot locale={locale} />
          <CtaCoaching locale={locale} location="tools-index" />
        </div>
      </section>
    </PageShell>
  );
}
