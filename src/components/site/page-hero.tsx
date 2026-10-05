import type { ReactNode } from 'react';
import { KineticTitle } from '@/components/motion/kinetic-title';

/**
 * Cabecera de las páginas interiores: índice de sección, titular cinético, línea dorada que se
 * dibuja y halo de luz. Sustituye al "título + párrafo" plano para que cada página tenga entrada propia.
 */
export function PageHero({
  index,
  label,
  title,
  intro,
  children,
  aside,
}: {
  index: string;
  label: string;
  title: Array<string | { text: string; accent?: boolean }>;
  intro?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(214,169,69,0.16),transparent)] blur-2xl"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="animate-fade-in flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-primary">{index}</span>
            <span className="draw-line block h-px w-14 bg-primary/70" aria-hidden />
            {label}
          </p>
          <KineticTitle
            lines={title}
            className="display mt-7 text-[2.75rem] font-bold leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          />
          {intro && (
            <p className="animate-rise mt-8 max-w-[52ch] text-lg leading-relaxed text-muted [animation-delay:350ms] [text-wrap:pretty]">
              {intro}
            </p>
          )}
          {children && <div className="animate-rise mt-9 [animation-delay:450ms]">{children}</div>}
        </div>
        {aside && <div className="animate-rise [animation-delay:250ms]">{aside}</div>}
      </div>
    </section>
  );
}
