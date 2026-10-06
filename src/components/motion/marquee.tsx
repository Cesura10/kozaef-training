/**
 * Banda en movimiento continuo (CSS puro). El contenido se duplica para que el bucle no tenga
 * corte; la copia va oculta a lectores de pantalla. Se para al pasar el cursor y con reduced motion.
 */
export function Marquee({ items, className, seconds = 38 }: { items: string[]; className?: string; seconds?: number }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center">
          <span className="display whitespace-nowrap px-6 text-2xl font-bold uppercase tracking-[-0.01em] text-fg/85 md:px-10 md:text-4xl">
            {it}
          </span>
          <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden border-y border-border/70 py-5 md:py-7 ${className ?? ''}`}>
      <div className="marquee-track" style={{ '--dur': `${seconds}s` } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
