import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';

/** Siguiente paso hacia la videollamada. Va siempre DEBAJO del producto relacionado. */
export function CtaCoaching({ locale, location = 'page' }: { locale: Locale; location?: string }) {
  const f = FUNNEL[locale];
  return (
    <section className="rounded-[var(--radius-xl)] border border-border p-6 sm:p-8">
      <p className="text-xs font-medium text-primary">{f.coachingEyebrow}</p>
      <h2 className="display mt-2 text-2xl font-bold">{f.coachingTitle}</h2>
      <p className="mt-2 max-w-[60ch] text-muted">{f.coachingBody}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={sectionPath('apply', locale)}
          data-track="cta_click"
          data-cta="apply"
          data-location={location}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          {f.applyCta}
        </Link>
        <Link
          href={sectionPath('coaching', locale)}
          data-track="cta_click"
          data-cta="coaching"
          data-location={location}
          className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 text-sm text-fg hover:bg-surface-2"
        >
          {f.coachingCta}
        </Link>
      </div>
    </section>
  );
}
