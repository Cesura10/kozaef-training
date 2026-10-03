import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { getSessionProfile } from '@/lib/auth';
import { Wordmark } from '@/components/brand';
import { NavLink } from '@/components/nav-link';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getSupabaseEnv().configured) redirect('/setup');

  const { user, profile } = await getSessionProfile();
  if (!user) redirect('/login');

  const role = profile?.role ?? 'client';
  const nav =
    role === 'trainer'
      ? [
          { href: '/dashboard', label: 'Panel' },
          { href: '/analitica', label: 'Analítica' },
          { href: '/clientes', label: 'Clientes' },
          { href: '/ejercicios', label: 'Ejercicios' },
        ]
      : [
          { href: '/dashboard', label: 'Inicio' },
          { href: '/mi-rutina', label: 'Rutina' },
          { href: '/mi-dieta', label: 'Dieta' },
          { href: '/revisiones', label: 'Revisiones' },
        ];

  const displayName = profile?.full_name || user.email || 'Usuario';

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3">
          <Link href="/dashboard" className="shrink-0">
            <Wordmark className="text-[15px]" />
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right text-xs leading-tight sm:block">
              <span className="block text-fg">{displayName}</span>
              <span className="block text-faint">
                {role === 'trainer' ? 'Entrenador' : 'Cliente'}
              </span>
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-faint hover:text-fg"
              >
                Salir
              </button>
            </form>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-5 py-2 sm:hidden">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
