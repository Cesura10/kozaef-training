import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition ' +
  'duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 ' +
  'disabled:pointer-events-none active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset]',
  outline:
    'border border-border-strong text-fg hover:bg-surface-2 hover:border-faint',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
