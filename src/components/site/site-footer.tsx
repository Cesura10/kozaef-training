import Link from 'next/link';
import { InstagramLogo } from '@phosphor-icons/react/dist/ssr';
import { AUTHOR } from '@/content/author';
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
          <div className="flex flex-col gap-3">
            <Wordmark />
            {AUTHOR.social.instagram && (
              <a
                href={AUTHOR.social.instagram}
                target="_blank"
                rel="me noopener"
                data-track="cta_click"
                data-cta="instagram"
                data-location="footer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
              >
                <InstagramLogo size={18} aria-hidden />
                {(locale === 'es' ? 'Quién hay detrás: ' : 'Who is behind it: ') + instagramHandle(AUTHOR.social.instagram)}
              </a>
            )}
          </div>
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

/** "https://www.instagram.com/usuario/" -> "@usuario". */
function instagramHandle(url: string) {
  const user = url.replace(/\/+$/, '').split('/').pop();
  return user ? `@${user}` : 'Instagram';
}
