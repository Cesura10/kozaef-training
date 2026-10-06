import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { Spotlight } from '@/components/motion/spotlight';

/** Siguiente paso hacia la videollamada. Va siempre DEBAJO del producto relacionado. */
export function CtaCoaching({
  locale,
  location = 'page',
  title,
  body,
}: {
  locale: Locale;
  location?: string;
  /** Texto propio para un contexto concreto (p. ej. "¿Te has estancado?" en un infoproducto). */
  title?: string;
  body?: string;
}) {
  const f = FUNNEL[locale];
  return (
    <Spotlight className="gold-sheen overflow-hidden rounded-[var(--radius-xl)] border border-primary/25">
      <section className="relative grid gap-8 p-7 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <span
          aria-hidden
          className="display pointer-events-none absolute -bottom-6 right-4 select-none text-[7rem] font-bold leading-none text-primary/[0.07] md:text-[10rem]"
        >
          1:1
        </span>
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{f.coachingEyebrow}</p>
          <h2 className="display mt-4 max-w-[20ch] text-3xl font-bold leading-[1.05] md:text-4xl [text-wrap:balance]">
            {title ?? f.coachingTitle}
          </h2>
          <p className="mt-4 max-w-[58ch] text-muted">{body ?? f.coachingBody}</p>
        </div>
        <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={sectionPath('apply', locale)}
            data-track="cta_click"
            data-cta="apply"
            data-location={location}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98]"
          >
            {f.applyCta}
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href={sectionPath('coaching', locale)}
            data-track="cta_click"
            data-cta="coaching"
            data-location={location}
            className="text-sm font-medium text-fg underline decoration-primary/50 underline-offset-[6px] transition-colors hover:decoration-primary"
          >
            {f.coachingCta}
          </Link>
        </div>
      </section>
    </Spotlight>
  );
}
