'use client';

import { useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';

/** Botón para parar o reanudar la banda en movimiento (teclado, móvil y lector de pantalla). */
export function MarqueePause() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={paused ? 'Reanudar la animación' : 'Pausar la animación'}
      onClick={(e) => {
        const next = !paused;
        setPaused(next);
        e.currentTarget.parentElement?.classList.toggle('is-paused', next);
      }}
      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg/80 text-muted backdrop-blur-sm transition-colors hover:text-fg"
    >
      {paused ? <Play size={14} weight="fill" aria-hidden /> : <Pause size={14} weight="fill" aria-hidden />}
    </button>
  );
}
