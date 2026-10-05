'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

export type ProductCard = {
  id: string;
  href: string;
  name: string;
  forWho: string;
  priceText: string | null;
  launch: boolean;
  categoria: string | null;
  perfiles: string[];
  waitlist: boolean;
  /** Etiqueta del tipo: "Guía", "Servicio"... */
  kind: string;
  infoproduct: boolean;
};

type Option = { id: string; label: string };

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full border border-border-strong px-3 py-1.5 text-xs text-muted transition hover:text-fg aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-fg"
    >
      {children}
    </button>
  );
}


/** Filtro por categoría y perfil en /programas (en cliente: el HTML con todas las fichas ya va servido). */
export function ProductFilter({
  products,
  categories,
  profiles,
  labels,
}: {
  products: ProductCard[];
  categories: Option[];
  profiles: Option[];
  labels: { all: string; empty: string; launch: string; waitlist: string };
}) {
  const [cat, setCat] = useState<string>('all');
  const [prof, setProf] = useState<string>('all');
  const shown = products.filter(
    (p) => (cat === 'all' || p.categoria === cat) && (prof === 'all' || p.perfiles.includes(prof)),
  );
  return (
    <div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>
            {labels.all}
          </Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={prof === 'all'} onClick={() => setProf('all')}>
            {labels.all}
          </Chip>
          {profiles.map((c) => (
            <Chip key={c.id} active={prof === c.id} onClick={() => setProf(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-faint">{labels.empty}</p>
      ) : (
        <MotionConfig reducedMotion="user">
          <motion.ul layout className="mt-10 grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                  <Link
                    href={p.href}
                    data-track="cta_click"
                    data-cta="product"
                    data-location="programs"
                    className={`group relative flex aspect-[5/4] h-full flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border p-7 transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-9 ${
                      p.infoproduct ? 'gold-sheen border-primary/25 hover:border-primary/60' : 'border-border bg-surface hover:border-primary/50'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="display pointer-events-none absolute -right-4 -top-8 select-none text-[11rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,169,69,0.18)] transition-transform duration-700 group-hover:-translate-x-3"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-primary">{p.kind}</p>
                    <div className="relative">
                      <h2 className="display max-w-[14ch] text-3xl font-bold leading-[1.02] text-fg md:text-4xl">{p.name}</h2>
                      <p className="mt-3 line-clamp-2 max-w-[46ch] text-sm leading-relaxed text-muted">{p.forWho}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-5">
                        <p className="text-sm">
                          {p.waitlist ? (
                            <span className="text-faint">{labels.waitlist}</span>
                          ) : (
                            <>
                              {p.priceText && <span className="display text-2xl font-bold tabular-nums text-fg">{p.priceText}</span>}
                              {p.launch && <span className="ml-2 text-xs text-primary">{labels.launch}</span>}
                            </>
                          )}
                        </p>
                        <span
                          aria-hidden
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-fg transition-all duration-500 group-hover:-rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-fg"
                        >
                          <ArrowRight size={16} weight="bold" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </MotionConfig>
      )}
    </div>
  );
}
