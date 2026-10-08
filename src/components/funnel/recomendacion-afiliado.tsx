import Link from 'next/link';
import { ArrowUpRight, Check } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { AFFILIATE, AFFILIATE_COPY, affiliateProduct, affiliateUrl, type AffiliateProductId } from '@/content/affiliates';
import { Spotlight } from '@/components/motion/spotlight';
import { CopyCode } from './copy-code';

/**
 * Recomendación de producto con enlace de afiliado. Separada del contenido y siempre con aviso.
 * Visual tipográfico (sin fotos de producto): la marca grande hace de "etiqueta".
 */
export function RecomendacionAfiliado({
  locale,
  id,
  location,
  headingLevel = 'h2',
}: {
  locale: Locale;
  id: AffiliateProductId;
  location: string;
  headingLevel?: 'h2' | 'h3';
}) {
  const p = affiliateProduct(id);
  const c = AFFILIATE_COPY[locale];
  const H = headingLevel;
  return (
    <Spotlight className="gold-sheen my-10 overflow-hidden rounded-[var(--radius-xl)] border border-primary/30 not-prose">
      <div className="grid gap-0 sm:grid-cols-[11rem_minmax(0,1fr)]">
        {/* Etiqueta del producto */}
        <div aria-hidden className="relative flex min-h-[9rem] items-end overflow-hidden border-b border-primary/20 bg-[linear-gradient(160deg,#211b0f,#0e0d0b)] p-5 sm:min-h-full sm:border-b-0 sm:border-r">
          <span className="display pointer-events-none absolute -right-3 top-2 select-none text-[5.5rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,169,69,0.35)] sm:right-auto sm:left-4 sm:top-5 sm:rotate-180 sm:text-[7rem] sm:[writing-mode:vertical-rl]">
            {p.mark}
          </span>
          <span className="relative font-mono text-[11px] uppercase tracking-[0.25em] text-primary">{AFFILIATE.brand}</span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{c.eyebrow}</p>
          <H className="display mt-3 text-2xl font-bold leading-tight text-fg md:text-3xl">{p.nombre[locale]}</H>
          <p className="mt-1 text-sm text-muted">{p.formato[locale]}</p>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-fg/90">{p.claim[locale]}</p>

          <ul className="mt-5 space-y-2">
            {p.porQue[locale].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-fg/90">
                <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 border-l-2 border-primary/60 pl-3 text-sm text-muted">
            <span className="font-semibold text-fg">{c.howTo}:</span> {p.comoTomar[locale]}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={affiliateUrl(p)}
              target="_blank"
              rel="sponsored noopener"
              data-track="affiliate_click"
              data-product={p.id}
              data-location={location}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98]"
            >
              {c.buy}
              <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {AFFILIATE.code && <CopyCode code={AFFILIATE.code} label={c.code} copyLabel={c.copy} copiedLabel={c.copied} />}
            {AFFILIATE.code && AFFILIATE.discount && <span className="text-sm font-medium text-primary">−{AFFILIATE.discount}</span>}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
            <p className="max-w-[60ch] text-xs leading-relaxed text-faint">{AFFILIATE.code ? c.disclosure : c.disclosureNoCode}</p>
            <Link href={p.masInfo[locale].href} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
              {p.masInfo[locale].label}
            </Link>
          </div>
        </div>
      </div>
    </Spotlight>
  );
}
