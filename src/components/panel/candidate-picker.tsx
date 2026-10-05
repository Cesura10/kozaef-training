'use client';

import { useState } from 'react';
import { Copy, Check } from '@phosphor-icons/react';

type Candidate = { slug: string; title: string; path: string };

/**
 * Eliges qué candidatos del bot quieres publicar y te da la orden para pegar en Claude.
 * La web no publica nada: solo prepara la orden (publicar sigue siendo tu clic en GitHub).
 */
export function CandidatePicker({ candidates }: { candidates: Candidate[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const chosen = candidates.filter((c) => picked.includes(c.slug));
  const prompt = chosen.length
    ? `Propón como artículos estos candidatos siguiendo el paso 6.5 de docs/privado/bot/INSTRUCCIONES.md, con la fecha de hoy en fechaPublicacion y fechaRevision:\n${chosen.map((c) => `- ${c.path}`).join('\n')}`
    : '';

  return (
    <div className="rounded-[var(--radius-xl)] border border-primary/30 bg-primary/5 p-5">
      <p className="font-semibold text-fg">¿Cuáles quieres publicar?</p>
      <p className="mt-1 text-sm text-muted">Márcalos y copia la orden. Pégala en Claude: los propondrá en GitHub y luego decides con Merge.</p>
      <ul className="mt-4 space-y-2">
        {candidates.map((c) => (
          <li key={c.slug}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-surface-2">
              <input
                type="checkbox"
                checked={picked.includes(c.slug)}
                onChange={(e) => setPicked((p) => (e.target.checked ? [...p, c.slug] : p.filter((s) => s !== c.slug)))}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-fg">{c.title}</span>
            </label>
          </li>
        ))}
      </ul>
      {prompt && (
        <div className="mt-4">
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-bg p-3 text-xs text-muted">{prompt}</pre>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(prompt);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
          >
            {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />} {copied ? 'Copiada' : 'Copiar la orden'}
          </button>
        </div>
      )}
    </div>
  );
}
