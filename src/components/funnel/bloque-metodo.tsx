import Link from 'next/link';
import { Check, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { sectionPath } from '@/content/routes';
import { whatsappLink } from '@/content/contact';
import METODO from '@/content/bloque-metodo.json';

/**
 * "Saber el método no es lo mismo que aplicarlo". Va en TODOS los artículos, justo después del
 * cuerpo (cuando el lector ya entiende el tema y se pregunta cómo hacerlo él). Lleva a la
 * solicitud de coaching. Sin promesas de resultados ni cifras inventadas.
 * Textos en src/content/bloque-metodo.json (también los usa scripts/article-pdf.mjs).
 */
const COPY = METODO satisfies Record<Locale, unknown>;

export function BloqueMetodo({ locale, location = 'article' }: { locale: Locale; location?: string }) {
  const c = COPY[locale];
  return (
    <section aria-labelledby="metodo" className="gold-sheen mt-12 rounded-[var(--radius-xl)] border border-primary/30 p-6 sm:p-8">
      <p className="text-xs font-medium text-primary">{c.eyebrow}</p>
      <h2 id="metodo" className="display mt-2 text-2xl font-bold leading-tight sm:text-3xl">
        {c.title}
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{c.intro}</p>
      <h3 className="mt-6 text-sm font-medium text-fg">{c.listTitle}</h3>
      <ul className="mt-3 space-y-3">
        {c.list.map((item) => (
          <li key={item} className="flex items-start gap-3 text-fg/90">
            <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-medium text-fg">{c.closing}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={sectionPath('apply', locale)}
          data-track="cta_click"
          data-cta="apply"
          data-location={location}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          {c.apply}
        </Link>
        <a
          href={whatsappLink(c.whatsappText)}
          target="_blank"
          rel="noopener"
          data-track="cta_click"
          data-cta="whatsapp"
          data-location={location}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm text-fg hover:bg-surface-2"
        >
          <WhatsappLogo size={18} aria-hidden />
          {c.whatsapp}
        </a>
      </div>
    </section>
  );
}
