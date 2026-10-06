import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { AUTHOR, aboutReady, authorSameAs } from '@/content/author';
import { pagesCopy } from '@/content/pages';
import { sectionPath } from '@/content/routes';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { JsonLd, PageShell, sectionMetadata } from './page-shell';


export const aboutMetadata = (locale: Locale) => {
  const c = pagesCopy(locale).about;
  return sectionMetadata('about', locale, { title: c.metaTitle, description: c.metaDescription }, {}, { noindex: !aboutReady() });
};

export async function AboutPage({ locale }: { locale: Locale }) {
  const t = await getDictionary(locale);
  const c = pagesCopy(locale).about;
  const social = Object.entries(AUTHOR.social).filter(([, v]) => v) as Array<[string, string]>;
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{AUTHOR.name ?? c.h1}</h1>
        {(AUTHOR.qualification || AUTHOR.city || social.length > 0) && (
          <dl className="mt-8 grid gap-4 rounded-[var(--radius-xl)] border border-border p-6 sm:grid-cols-2">
            {AUTHOR.qualification && (
              <div>
                <dt className="text-xs text-faint">{c.qualification}</dt>
                <dd className="mt-1 text-fg">{AUTHOR.qualification}</dd>
              </div>
            )}
            {AUTHOR.city && (
              <div>
                <dt className="text-xs text-faint">{c.city}</dt>
                <dd className="mt-1 text-fg">{AUTHOR.city}</dd>
              </div>
            )}
            {social.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-faint">{c.social}</dt>
                <dd className="mt-1 flex flex-wrap gap-4">
                  {social.map(([name, url]) => (
                    <a key={name} href={url} rel="me noreferrer" target="_blank" className="capitalize text-primary hover:underline">
                      {name}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}

        <h2 className="display mt-14 text-3xl font-bold">{c.methodTitle}</h2>
        <div className="mt-6 space-y-6">
          {t.method.items.map((m) => (
            <div key={m.word}>
              <p className="display text-3xl font-bold text-primary">{m.word}</p>
              <p className="mt-1 text-lg leading-relaxed text-muted">{m.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <CtaCoaching locale={locale} location="about" />
        </div>
      </section>
      {aboutReady() && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: AUTHOR.name,
            jobTitle: AUTHOR.qualification,
            url: `${SITE_URL}${sectionPath('about', locale)}`,
            ...(AUTHOR.city ? { address: { '@type': 'PostalAddress', addressLocality: AUTHOR.city } } : {}),
            ...(AUTHOR.photo ? { image: AUTHOR.photo } : {}),
            sameAs: authorSameAs(),
          }}
        />
      )}
    </PageShell>
  );
}
