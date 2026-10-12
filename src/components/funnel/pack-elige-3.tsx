'use client';

import { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import { track } from '@/lib/analytics/client';
import { PACK_DISCOUNT, PACK_SIZE } from '@/content/pack';

export type PackItem = { id: string; name: string; price: number; variant: string; shop: string };


const eur = (n: number, locale: string) =>
  new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(n);

/**
 * Selector "elige 3" de /programas. Monta el enlace de carrito de Shopify con las tres guías
 * (/cart/v1:1,v2:1,v3:1); el descuento lo aplica Shopify solo, sin código.
 */
export function PackElige3({
  items,
  shop,
  locale,
  labels,
}: {
  items: PackItem[];
  shop: string;
  locale: string;
  labels: { kicker: string; title: string; intro: string; pick: string; separate: string; total: string; save: string; cta: string; note: string };
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < PACK_SIZE ? [...cur, id] : cur));
  const chosen = items.filter((i) => picked.includes(i.id));
  const sum = chosen.reduce((a, i) => a + i.price, 0);
  const total = Math.round(sum * (1 - PACK_DISCOUNT) * 100) / 100;
  const ready = chosen.length === PACK_SIZE;
  const href = ready ? `${shop}/cart/${chosen.map((i) => `${i.variant}:1`).join(',')}` : undefined;

  return (
    <section aria-labelledby="pack-title" className="gold-sheen mt-16 rounded-[var(--radius-xl)] border border-primary/30 p-7 sm:p-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{labels.kicker}</p>
      <h2 id="pack-title" className="display mt-3 max-w-[20ch] text-balance text-3xl font-bold leading-[1.05] text-fg md:text-4xl">
        {labels.title}
      </h2>
      <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted">{labels.intro}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => {
          const on = picked.includes(i.id);
          const full = !on && picked.length >= PACK_SIZE;
          return (
            <li key={i.id}>
              <button
                type="button"
                aria-pressed={on}
                disabled={full}
                onClick={() => toggle(i.id)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border-strong bg-bg/40 px-5 py-4 text-left transition hover:border-primary/60 active:scale-[0.98] disabled:opacity-40 aria-pressed:border-primary aria-pressed:bg-primary/10"
              >
                <span className="text-sm font-medium text-fg">{i.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-sm tabular-nums text-muted">{eur(i.price, locale)}</span>
                  <span
                    aria-hidden
                    className={`grid size-6 place-items-center rounded-full border transition ${on ? 'border-primary bg-primary text-primary-fg' : 'border-border-strong'}`}
                  >
                    {on && <Check size={14} weight="bold" />}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-5 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          {ready ? (
            <>
              <span className="mr-2 tabular-nums line-through">
                {labels.separate} {eur(sum, locale)}
              </span>
              <span className="display text-2xl font-bold tabular-nums text-fg">
                {labels.total} {eur(total, locale)}
              </span>
              <span className="ml-2 text-primary">
                {labels.save} {eur(sum - total, locale)}
              </span>
            </>
          ) : (
            labels.pick.replace('{n}', String(PACK_SIZE - chosen.length))
          )}
        </p>
        {href ? (
          <a
            href={href}
            rel="noopener"
            onClick={() => track('buy_click', { product: `pack-elige-3:${picked.join('+')}`, price: total, currency: 'EUR' })}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg transition hover:brightness-110 active:scale-[0.98]"
          >
            {labels.cta}
          </a>
        ) : (
          <span aria-disabled className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-border-strong px-6 py-3 text-sm text-faint">
            {labels.cta}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-faint">{labels.note}</p>
    </section>
  );
}
