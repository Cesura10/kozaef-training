'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '@/content/articles';

type Option = { id: string; label: string };

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Buscador estático: el índice va en la página (solo títulos, descripciones y apartados),
 * sin servidor ni servicios externos. Suficiente para cientos de artículos.
 */
export function LearnSearch({
  entries,
  categories,
  profiles,
  levels,
  labels,
}: {
  entries: SearchEntry[];
  categories: Option[];
  profiles: Option[];
  levels: Option[];
  labels: { search: string; placeholder: string; category: string; profile: string; level: string; all: string; noResults: string };
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [prof, setProf] = useState('');
  const [lvl, setLvl] = useState('');
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return entries.filter(
      (e) =>
        (!cat || e.categoria === cat) &&
        (!prof || (e.perfiles as string[]).includes(prof)) &&
        (!lvl || e.nivel === lvl) &&
        words.every((w) => norm(e.texto).includes(w)),
    );
  }, [entries, q, cat, prof, lvl]);
  const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  const select = 'h-11 rounded-full border border-border-strong bg-bg px-4 text-sm text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40';
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <label className="block">
          <span className="sr-only">{labels.search}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.placeholder}
            className="h-11 w-full rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        {[
          { label: labels.category, value: cat, set: setCat, opts: categories },
          { label: labels.profile, value: prof, set: setProf, opts: profiles },
          { label: labels.level, value: lvl, set: setLvl, opts: levels },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="sr-only">{f.label}</span>
            <select value={f.value} onChange={(e) => f.set(e.target.value)} className={`${select} w-full`}>
              <option value="">
                {f.label}: {labels.all}
              </option>
              {f.opts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {results.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-faint">{labels.noResults}</p>
      ) : (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {results.map((r) => (
            <li key={r.url}>
              <Link href={r.url} className="block h-full rounded-[var(--radius-xl)] border border-border bg-surface p-5 transition-colors hover:border-primary/50">
                <span className="text-xs text-primary">{catLabel[r.categoria]}</span>
                <span className="mt-1 block text-lg font-semibold text-fg">{r.titulo}</span>
                <span className="mt-1 block text-sm text-muted">{r.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
