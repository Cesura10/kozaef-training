'use client';

import { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import { track } from '@/lib/analytics/client';
import { PACK_ALL_DISCOUNT, PACK_ALL_MIN, PACK_DISCOUNT, PACK_SIZE } from '@/content/pack';

export type PackItem = { id: string; name: string; price: number; variant: string; shop: string };

const eur = (n: number, locale: string) =>
  new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(n);
const off = (n: number, d: number) => Math.round(n * (1 - d) * 100) / 100;
const cart = (shop: string, list: PackItem[]) => `${shop}/cart/${list.map((i) => `${i.variant}:1`).join(',')}`;

type Labels = {
  kicker: string;
  title: string;
  intro: string;
  pick: string;
  separate: string;
  total: string;
  save: string;
  cta: string;
  note: string;
  allKicker: string;
  allTitle: string;
  allIntro: string;
  allCta: string;
};

/**
 * Packs de /programas: "elige 3" y "todas las guías". Montan el enlace de carrito de Shopify
 * (/cart/v1:1,v2:1,...) y el descuento lo aplica Shopify solo, sin código. Como en BuyButton,
 * hay que aceptar la entrega inmediata (pérdida del desistimiento) antes de ir a pagar.
 */
export function PackElige3({
  items,
  locale,
  labels,
  consentText,
  consentRequiredText,
}: {
  items: PackItem[];
  locale: string;
  labels: Labels;
  consentText: string;
  consentRequiredText: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [warn, setWarn] = useState(false);
  const shop = items[0].shop;
  const toggle = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < PACK_SIZE ? [...cur, id] : cur));
  const chosen = items.filter((i) => picked.includes(i.id));
  const sum = chosen.reduce((a, i) => a + i.price, 0);
  const total = off(sum, PACK_DISCOUNT);
  const ready = chosen.length === PACK_SIZE;
  const allSum = items.reduce((a, i) => a + i.price, 0);
  const allTotal = off(allSum, PACK_ALL_DISCOUNT);
  const showAll = items.length >= PACK_ALL_MIN;

  const go = (e: React.MouseEvent, product: string, price: number) => {
    if (!accepted) {
      e.preventDefault();
      setWarn(true);
      return;
    }
    track('buy_click', { product, price, currency: 'EUR' });
  };
  const keys = (e: React.KeyboardEvent) => {
    if (!accepted && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setWarn(true);
    }
  };
  const primary =
    'inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg transition hover:brightness-110 active:scale-[0.98] aria-disabled:opacity-50';

  return (
    <section aria-labelledby="pack-title" className="mt-16 space-y-6">
      {showAll && (
        <div className="gold-sheen relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/50 p-7 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{labels.allKicker}</p>
          <div className="mt-3 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 className="display max-w-[20ch] text-balance text-3xl font-bold leading-[1.05] text-fg md:text-4xl">
                {labels.allTitle.replace('{n}', String(items.length))}
              </h2>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted">{labels.allIntro}</p>
              <p className="mt-4 text-xs text-faint">{items.map((i) => i.name).join(' · ')}</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-muted">
                <span className="mr-2 tabular-nums line-through">{eur(allSum, locale)}</span>
                <span className="display text-4xl font-bold tabular-nums text-fg">{eur(allTotal, locale)}</span>
              </p>
              <p className="mt-1 text-sm text-primary">
                {labels.save} {eur(allSum - allTotal, locale)}
              </p>
              <a
                href={accepted ? cart(shop, items) : undefined}
                role={accepted ? undefined : 'link'}
                aria-disabled={!accepted}
                tabIndex={0}
                rel="noopener"
                onKeyDown={keys}
                onClick={(e) => go(e, 'pack-completo', allTotal)}
                className={`${primary} mt-4 cursor-pointer`}
              >
                {labels.allCta}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="gold-sheen rounded-[var(--radius-xl)] border border-primary/30 p-7 sm:p-10">
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
          {ready ? (
            <a
              href={accepted ? cart(shop, chosen) : undefined}
              role={accepted ? undefined : 'link'}
              aria-disabled={!accepted}
              tabIndex={0}
              rel="noopener"
              onKeyDown={keys}
              onClick={(e) => go(e, `pack-elige-3:${picked.join('+')}`, total)}
              className={`${primary} cursor-pointer`}
            >
              {labels.cta}
            </a>
          ) : (
            <span aria-disabled className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-border-strong px-6 py-3 text-sm text-faint">
              {labels.cta}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 px-1">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              setWarn(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
          />
          <span>{consentText}</span>
        </label>
        {warn && (
          <p role="alert" className="text-sm text-danger">
            {consentRequiredText}
          </p>
        )}
        <p className="text-xs text-faint">{labels.note}</p>
      </div>
    </section>
  );
}
