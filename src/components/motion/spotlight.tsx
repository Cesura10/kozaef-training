'use client';

import { useRef, type ComponentProps } from 'react';

/**
 * Superficie con borde que se ilumina bajo el cursor. Mueve variables CSS (--mx, --my) sin
 * re-renderizar React; el dibujo vive en .spotlight (globals.css). En táctil no hace nada.
 */
export function Spotlight({ className, children, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
        ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className={`spotlight ${className ?? ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
