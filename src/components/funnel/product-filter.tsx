'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';

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
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {shown.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                data-track="cta_click"
                data-cta="product"
                data-location="programs"
                className="group flex h-full flex-col justify-between gap-6 rounded-[var(--radius-xl)] border border-border bg-surface p-6 transition-colors hover:border-primary/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-fg">{p.name}</h2>
                    <ArrowUpRight size={20} className="shrink-0 text-faint group-hover:text-primary" aria-hidden />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.forWho}</p>
                </div>
                <p className="text-sm">
                  {p.waitlist ? (
                    <span className="text-faint">{labels.waitlist}</span>
                  ) : (
                    <>
                      {p.priceText && <span className="text-lg font-semibold text-fg">{p.priceText}</span>}
                      {p.launch && <span className="ml-2 text-xs text-primary">{labels.launch}</span>}
                    </>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
