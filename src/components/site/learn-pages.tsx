import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { LOCALES } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { sectionPath } from '@/content/routes';
import { CATEGORIES, CATEGORY_IDS, LEVELS, LEVEL_IDS, PROFILES, PROFILE_IDS, type CategoryId, type ProfileId } from '@/content/taxonomy';
import { articlesFor, categoryPath, forProfile, inCategory, profilePath, searchIndex, type Article } from '@/content/articles';
import { LearnSearch } from '@/components/funnel/learn-search';
import { AdSlot } from '@/components/funnel/ad-slot';
import { BloqueProducto } from '@/components/funnel/bloque-producto';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { PageShell } from './page-shell';

/* ----------------------------- /aprende ----------------------------- */

export function learnIndexMetadata(locale: Locale): Metadata {
  const c = pagesCopy(locale).learn;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: sectionPath('learn', locale), languages: Object.fromEntries(LOCALES.map((l) => [l, sectionPath('learn', l)])) },
    // Sin artículos, la portada de la biblioteca no se indexa (contenido vacío).
    ...(articlesFor(locale).length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function LearnIndexPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).learn;
  const entries = searchIndex(locale);
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">{c.intro}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <TopicLinks title={c.byCategory} items={CATEGORY_IDS.map((id) => ({ href: categoryPath(locale, id), label: CATEGORIES[id].label[locale] }))} />
          <TopicLinks title={c.byProfile} items={PROFILE_IDS.map((id) => ({ href: profilePath(locale, id), label: PROFILES[id].label[locale] }))} />
        </div>

        <div className="mt-12">
          {entries.length === 0 ? (
            // El formulario de aviso ya lo pinta el AdSlot de abajo: aquí solo el mensaje.
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-faint">{c.empty}</p>
          ) : (
            <LearnSearch
              entries={entries}
              categories={CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].label[locale] }))}
              profiles={PROFILE_IDS.map((id) => ({ id, label: PROFILES[id].label[locale] }))}
              levels={LEVEL_IDS.map((id) => ({ id, label: LEVELS[id][locale] }))}
              labels={{
                search: c.search,
                placeholder: c.searchPlaceholder,
                category: c.category,
                profile: c.profile,
                level: c.level,
                all: c.all,
                noResults: c.noResults,
              }}
            />
          )}
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <AdSlot locale={locale} />
          <CtaCoaching locale={locale} location="learn" />
        </div>
      </section>
    </PageShell>
  );
}

function TopicLinks({ title, items }: { title: string; items: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-primary">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-flex rounded-full border border-border-strong px-4 py-2 text-sm text-fg transition-colors hover:border-primary/60">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------- /aprende/{categoria} y /aprende/perfil/{perfil} ------------------- */

type Topic = { kind: 'category'; id: CategoryId } | { kind: 'profile'; id: ProfileId };

const topicInfo = (locale: Locale, t: Topic) =>
  t.kind === 'category'
    ? { entry: CATEGORIES[t.id], list: inCategory(locale, t.id), path: (l: Locale) => categoryPath(l, t.id) }
    : { entry: PROFILES[t.id], list: forProfile(locale, t.id), path: (l: Locale) => profilePath(l, t.id) };

export function topicMetadata(locale: Locale, t: Topic): Metadata {
  const { entry, list, path } = topicInfo(locale, t);
  return {
    title: entry.label[locale],
    description: entry.intro[locale],
    alternates: { canonical: path(locale), languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])) },
    // Página real e indexable, pero solo cuando tenga artículos (evita páginas vacías en Google).
    ...(list.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function TopicPage({ locale, topic }: { locale: Locale; topic: Topic }) {
  const c = pagesCopy(locale).learn;
  const { entry, list } = topicInfo(locale, topic);
  const [first, ...rest]: Article[] = list;
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
        <Link href={sectionPath('learn', locale)} className="text-sm text-faint hover:text-fg">
          {c.h1}
        </Link>
        <h1 className="display mt-4 text-4xl font-bold leading-[1.02] md:text-6xl">{entry.label[locale]}</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">{entry.intro[locale]}</p>

        {first ? (
          <>
            <h2 className="mt-12 text-sm font-medium text-primary">{c.startHere}</h2>
            <Link
              href={first.url}
              className="gold-sheen mt-3 block rounded-[var(--radius-xl)] border border-primary/30 p-6 transition-colors hover:border-primary/60 sm:p-8"
            >
              <span className="display block text-2xl font-bold text-fg md:text-3xl">{first.titulo}</span>
              <span className="mt-2 block text-muted">{first.descripcion}</span>
            </Link>
            {rest.length > 0 && (
              <>
                <h2 className="mt-12 text-sm font-medium text-primary">{c.more}</h2>
                <ul className="mt-3 divide-y divide-border">
                  {rest.map((a) => (
                    <li key={a.url}>
                      <Link href={a.url} className="flex items-baseline justify-between gap-4 py-4 hover:text-primary">
                        <span className="font-medium text-fg">{a.titulo}</span>
                        <span className="shrink-0 text-xs text-faint">{LEVELS[a.nivel][locale]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-faint">{c.empty}</p>
        )}

        <div className="mt-14 space-y-6">
          {topic.kind === 'category' ? (
            <BloqueProducto locale={locale} categoria={topic.id} location="topic" />
          ) : (
            <BloqueProducto locale={locale} perfiles={[topic.id]} location="topic" />
          )}
          <CtaCoaching locale={locale} location="topic" />
        </div>
      </section>
    </PageShell>
  );
}
