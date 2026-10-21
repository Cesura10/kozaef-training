'use client';

import { useState } from 'react';
import { Check, Copy, WhatsappLogo } from '@phosphor-icons/react';

/** Enlace privado de formulario con botones de copiar y de enviar por WhatsApp. */
export function CopiarEnlace({ url, mensaje }: { url: string; mensaje: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="max-w-full truncate rounded-xl bg-bg px-3 py-2 text-xs text-muted">{url}</code>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard?.writeText(url).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 1800);
          })
        }
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border-strong px-4 text-xs text-fg hover:border-primary"
      >
        {copiado ? <Check size={14} weight="bold" className="text-primary" aria-hidden /> : <Copy size={14} aria-hidden />}
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${mensaje} ${url}`)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border-strong px-4 text-xs text-fg hover:border-primary"
      >
        <WhatsappLogo size={14} aria-hidden /> Enviar por WhatsApp
      </a>
    </div>
  );
}
