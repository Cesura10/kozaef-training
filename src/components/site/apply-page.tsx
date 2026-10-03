import type { Metadata } from 'next';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { LOCALES, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { APPLY_COPY, applyPath } from '@/content/apply';
import { ApplyForm } from '@/components/marketing/apply-form';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function applyMetadata(locale: Locale): Metadata {
  const c = APPLY_COPY[locale];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: applyPath(locale), languages: Object.fromEntries(LOCALES.map((l) => [l, applyPath(l)])) },
  };
}

export async function ApplyPage({ locale }: { locale: Locale }) {
  const t = await getDictionary(locale);
  const c = APPLY_COPY[locale];
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} t={t} />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-3xl">
          <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{c.intro}</p>
          <div className="mt-10 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 sm:p-8">
            <ApplyForm copy={c} locale={locale} />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-xl)] border border-border p-6">
            <h2 className="text-lg font-semibold">{t.coaching.eyebrow}</h2>
            <ul className="mt-4 space-y-3">
              {t.coaching.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
      <SiteFooter locale={locale} t={t} />
    </div>
  );
}
