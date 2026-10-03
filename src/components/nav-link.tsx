'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={
        'rounded-lg px-3 py-1.5 text-sm transition ' +
        (active
          ? 'bg-surface-2 text-fg'
          : 'text-muted hover:bg-surface-2 hover:text-fg')
      }
    >
      {children}
    </Link>
  );
}
