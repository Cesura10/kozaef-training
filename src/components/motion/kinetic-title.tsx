import type { ElementType, ReactNode } from 'react';

/**
 * Titular cinético: cada palabra sube desde detrás de una máscara, en cascada.
 * Componente de servidor con animación CSS: se ve aunque no cargue JavaScript (bueno para LCP)
 * y respeta prefers-reduced-motion. `accent` pinta en dorado las palabras de esa línea.
 */
export function KineticTitle({
  lines,
  as: Tag = 'h1',
  className,
  delayMs = 0,
}: {
  lines: Array<string | { text: string; accent?: boolean }>;
  as?: ElementType;
  className?: string;
  delayMs?: number;
}) {
  let i = 0;
  const rows: ReactNode[] = lines.map((line, li) => {
    const { text, accent } = typeof line === 'string' ? { text: line, accent: false } : line;
    const words = text.split(/\s+/).filter(Boolean);
    return (
      <span key={li} className={`block ${accent ? 'text-primary' : ''}`}>
        {words.map((w, wi) => {
          const n = i++;
          return (
            <span key={wi} className="kinetic-word">
              <span style={{ '--i': n, '--d': `${delayMs}ms` } as React.CSSProperties}>
                {w}
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            </span>
          );
        })}
      </span>
    );
  });
  return <Tag className={className}>{rows}</Tag>;
}
