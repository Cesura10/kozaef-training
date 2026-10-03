import Link from 'next/link';
import { Wordmark } from '@/components/brand';
import { ButtonLink } from '@/components/ui/button';
import { PLATFORM_OPEN } from '@/lib/platform';
import type { Dictionary } from '@/i18n/dictionaries';

export function SiteHeader({ locale, t }: { locale: string; t: Dictionary }) {
  const NAV = [
    { href: `/${locale}#herramientas`, label: t.nav.tools },
    { href: `/${locale}#guias`, label: t.nav.guides },
    { href: `/${locale}#coaching`, label: t.nav.coaching },
  ];

  return (
    <>
      {/* Navegación */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href={`/${locale}`} aria-label={t.nav.home}>
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label={t.nav.main}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-fg">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {PLATFORM_OPEN && (
              <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex" data-track="cta_click" data-cta="login" data-location="nav">
                {t.nav.login}
              </ButtonLink>
            )}
            <ButtonLink href={`/${locale}#coaching`} size="sm" className="whitespace-nowrap px-4" data-track="cta_click" data-cta="apply" data-location="nav">
              {t.nav.apply}
            </ButtonLink>
          </div>
        </div>
      </header>

    </>
  );
}
