import Link from 'next/link';
import { Wordmark } from '@/components/brand';
import { LOCALES, type Locale } from '@/i18n/config';
import { LEGAL } from '@/content/legal';
import { LEGAL_SLUGS } from '@/lib/legal';
import { mainNav } from './nav-items';
import { ConsentSettingsLink } from '@/components/consent-banner';
import type { Dictionary } from '@/i18n/dictionaries';

export function SiteFooter({ locale, t }: { locale: string; t: Dictionary }) {
  const NAV = mainNav(locale as Locale, t);

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Wordmark />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label={t.nav.footer}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-fg">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-faint md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_SLUGS.map((slug) => (
              <Link key={slug} href={`/${locale}/legal/${slug}`} className="hover:text-fg">
                {LEGAL[locale as Locale][slug].title}
              </Link>
            ))}
            <ConsentSettingsLink label={locale === 'es' ? 'Configurar cookies' : 'Cookie settings'} />
          </nav>
          <div className="flex items-center gap-6">
            <nav aria-label={t.nav.language} className="flex gap-3">
              {LOCALES.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  hrefLang={l}
                  data-track="language_switch"
                  data-to={l}
                  aria-current={l === locale ? 'page' : undefined}
                  className="uppercase hover:text-fg aria-[current=page]:text-primary"
                >
                  {l}
                </Link>
              ))}
            </nav>
            <p>© {new Date().getFullYear()} Kozaef Training</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
