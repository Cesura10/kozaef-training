'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { List, X } from '@phosphor-icons/react/dist/ssr';

/**
 * Menú móvil sobre <details> nativo (funciona sin JavaScript). Con JS, además:
 * se cierra al navegar (la cabecera persiste entre páginas y se quedaba abierto),
 * con Escape (devolviendo el foco al botón) y al tocar fuera.
 */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = () => {
      if (ref.current) ref.current.open = false;
    };
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && ref.current?.open) {
        close();
        ref.current.querySelector('summary')?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  return (
    <details
      ref={ref}
      className="group relative lg:hidden"
      // Pulsar un enlace del menú (también el de la página actual) lo cierra.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a') && ref.current) ref.current.open = false;
      }}
    >
      <summary
        aria-label={label}
        className="ml-1 flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border-strong text-fg [&::-webkit-details-marker]:hidden"
      >
        <List size={18} className="group-open:hidden" aria-hidden />
        <X size={18} className="hidden group-open:block" aria-hidden />
      </summary>
      {children}
    </details>
  );
}
