'use client';

import { useState } from 'react';
import { Play } from '@phosphor-icons/react';

/**
 * Vídeo de YouTube que NO carga nada de YouTube hasta que se pulsa (sin cookies ni
 * scripts de terceros antes de tiempo). Usa youtube-nocookie al reproducir.
 */
export function VideoFacade({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <iframe
        className="aspect-video w-full rounded-2xl"
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setOn(true)}
      aria-label={`${playLabel}: ${title}`}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2"
    >
      {/* Miniatura servida por YouTube (imagen estática, sin cookies). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-fg transition group-hover:scale-105">
        <Play size={24} weight="fill" aria-hidden />
      </span>
    </button>
  );
}
