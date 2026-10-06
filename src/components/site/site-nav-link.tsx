'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Enlace del menú público: subrayado dorado que crece al pasar el cursor y se queda en la sección actual. */
export function SiteNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`group relative py-1 text-sm transition-colors ${active ? 'text-fg' : 'text-muted hover:text-fg'}`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}
