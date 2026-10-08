'use client';

import { useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';

/** Código de descuento con botón de copiar (el código se ve aunque no haya JavaScript). */
export function CopyCode({ code, label, copyLabel, copiedLabel }: { code: string; label: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="group inline-flex h-12 items-center gap-3 rounded-full border border-dashed border-primary/60 px-5 text-sm transition hover:border-primary hover:bg-primary/10 active:scale-[0.98]"
      aria-label={`${label} ${code}: ${copyLabel}`}
    >
      <span className="text-muted">{label}</span>
      <span className="font-mono text-base font-semibold tracking-wider text-primary">{code}</span>
      {copied ? (
        <Check size={16} weight="bold" className="text-primary" aria-hidden />
      ) : (
        <Copy size={16} className="text-muted transition-colors group-hover:text-fg" aria-hidden />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </button>
  );
}
