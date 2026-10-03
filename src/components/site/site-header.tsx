import Link from 'next/link';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { Wordmark } from '@/components/brand';
import { ButtonLink } from '@/components/ui/button';
import { PLATFORM_OPEN } from '@/lib/platform';
import { sectionPath } from '@/content/routes';
import { mainNav } from './nav-items';
import { DIAGNOSIS_APPROVED } from '@/content/diagnosis';

export function SiteHeader({ locale, t }: { locale: string; t: Dictionary }) {
  const l = locale as Locale;
  const nav = mainNav(l, t);
  // Hasta aprobar el diagnóstico, el botón destacado lleva a la solicitud.
  const cta = DIAGNOSIS_APPROVED
    ? { href: sectionPath('diagnosis', l), label: t.nav.diagnosis, id: 'diagnosis' }
    : { href: sectionPath('apply', l), label: t.nav.apply, id: 'apply' };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} aria-label={t.nav.home} className="shrink-0">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label={t.nav.main}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {PLATFORM_OPEN && (
            <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex" data-track="cta_click" data-cta="login" data-location="nav">
              {t.nav.login}
            </ButtonLink>
          )}
          <ButtonLink href={cta.href} size="sm" className="whitespace-nowrap px-4" data-track="cta_click" data-cta={cta.id} data-location="nav">
            {cta.label}
          </ButtonLink>
          {/* Menú móvil sin JavaScript: <details> nativo, accesible con teclado. */}
          <details className="group relative lg:hidden">
            <summary
              aria-label={t.nav.menu}
              className="ml-1 flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border-strong text-fg [&::-webkit-details-marker]:hidden"
            >
              <List size={18} className="group-open:hidden" aria-hidden />
              <X size={18} className="hidden group-open:block" aria-hidden />
            </summary>
            <nav
              aria-label={t.nav.main}
              className="absolute right-0 top-12 w-60 rounded-[var(--radius-xl)] border border-border bg-elevated p-2 shadow-2xl"
            >
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 text-sm text-fg hover:bg-surface-2">
                  {n.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
