import type { SVGProps } from 'react';

/** Monograma provisional "K": marco dorado y letra en display. Sustituir por el logo definitivo. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="var(--color-primary)" strokeWidth="1.5" />
      <path d="M11 8v16M11 16.5 20.5 8M14.5 13.5 21 24" stroke="var(--color-primary)" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-8 w-8" />
      <span className="display text-[15px] font-bold uppercase leading-none tracking-[-0.01em]">
        Kozaef<span className="ml-1.5 hidden font-normal text-muted min-[420px]:inline">Training</span>
      </span>
    </span>
  );
}
