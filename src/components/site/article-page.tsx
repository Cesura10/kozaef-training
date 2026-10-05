import type { Metadata } from 'next';
import Link from 'next/link';
import { CaretRight, Lightning } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { AUTHOR, authorSameAs } from '@/content/author';
import { CATEGORIES, LEVELS, PROFILES } from '@/content/taxonomy';
import { sectionPath } from '@/content/routes';
import { categoryPath, profilePath, related, type Article } from '@/content/articles';
import { CtaHerramienta } from '@/components/funnel/cta-herramienta';
import { BloqueProducto } from '@/components/funnel/bloque-producto';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { CajaAutor } from '@/components/funnel/caja-autor';
import { JsonLd, PageShell } from './page-shell';

const fmtDate = (d: string, locale: Locale) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function articleMetadata(a: Article): Metadata {
  return {
    title: a.titulo,
    description: a.descripcion,
    alternates: { canonical: a.url },
    openGraph: {
      type: 'article',
      title: a.titulo,
      description: a.descripcion,
      url: a.url,
      publishedTime: a.fechaPublicacion,
      modifiedTime: a.fechaRevision,
    },
    ...(a.borrador ? { robots: { index: false, follow: false } } : {}),
  };
}

export async function ArticlePage({ article: a }: { article: Article }) {
  const locale = a.locale;
  const c = pagesCopy(locale).learn;
  const cat = CATEGORIES[a.categoria];
  const rel = related(a);
  const crumbs = [
    { name: c.home, url: `/${locale}` },
    { name: c.h1, url: sectionPath('learn', locale) },
    { name: cat.label[locale], url: categoryPath(locale, a.categoria) },
    { name: a.titulo, url: a.url },
  ];
  const author = AUTHOR.name
    ? { '@type': 'Person', name: AUTHOR.name, url: `${SITE_URL}${sectionPath('about', locale)}`, sameAs: authorSameAs() }
    : { '@type': 'Organization', name: 'Kozaef Training', url: SITE_URL };

  return (
    <PageShell locale={locale}>
      <article className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
        {a.borrador && (
          <p className="mb-6 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
            {a.candidato
              ? `Candidato del bot (${a.candidato}): así quedaría publicado. Solo se ve en tu ordenador.`
              : 'Borrador: solo visible en desarrollo. No se publica, ni sale en el sitemap ni en el buscador.'}
          </p>
        )}
        <nav aria-label="Breadcrumb" className="text-sm text-faint">
          <ol className="flex flex-wrap items-center gap-1">
            {crumbs.slice(0, -1).map((cr) => (
              <li key={cr.url} className="flex items-center gap-1">
                <Link href={cr.url} className="hover:text-fg">
                  {cr.name}
                </Link>
                <CaretRight size={12} aria-hidden />
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="display mt-6 text-4xl font-bold leading-[1.05] md:text-5xl">{a.titulo}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span>
            {a.readingMinutes} {c.minutes}
          </span>
          <span>
            {c.published}: <time dateTime={a.fechaPublicacion}>{fmtDate(a.fechaPublicacion, locale)}</time>
          </span>
          <span>
            {c.reviewed} <time dateTime={a.fechaRevision}>{fmtDate(a.fechaRevision, locale)}</time>
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{LEVELS[a.nivel][locale]}</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {a.perfiles.map((p) => (
            <li key={p}>
              <Link href={profilePath(locale, p)} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-fg hover:text-primary">
                {PROFILES[p].label[locale]}
              </Link>
            </li>
          ))}
        </ul>

        <section aria-labelledby="quick" className="mt-8 rounded-[var(--radius-xl)] border border-primary/30 bg-primary/5 p-6">
          <h2 id="quick" className="flex items-center gap-2 text-sm font-medium text-primary">
            <Lightning size={16} weight="fill" aria-hidden />
            {c.quickAnswer}
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-fg">{a.respuestaRapida}</p>
        </section>

        <div className="prose-kz mt-4" dangerouslySetInnerHTML={{ __html: a.html[0] }} />
        {a.herramientaRelacionada && <CtaHerramienta locale={locale} tool={a.herramientaRelacionada} location="article" />}
        {a.html[1] && <div className="prose-kz" dangerouslySetInnerHTML={{ __html: a.html[1] }} />}

        {a.faq.length > 0 && (
          <section aria-labelledby="faq" className="mt-12">
            <h2 id="faq" className="display text-2xl font-bold">
              {c.faq}
            </h2>
            <div className="mt-4 divide-y divide-border rounded-[var(--radius-xl)] border border-border">
              {a.faq.map((f) => (
                <details key={f.pregunta} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-fg">
                    {f.pregunta}
                    <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{f.respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="sources" className="mt-12">
          <h2 id="sources" className="display text-2xl font-bold">
            {c.sources}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted marker:text-primary">
            {a.fuentes.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4 hover:text-primary">
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12">
          <CajaAutor locale={locale} />
        </div>

        <div className="mt-12 space-y-6">
          <BloqueProducto locale={locale} productId={a.productoRelacionado} categoria={a.categoria} perfiles={a.perfiles} location="article-end" />
          <CtaCoaching locale={locale} location="article-end" />
        </div>

        {rel.length > 0 && (
          <section aria-labelledby="related" className="mt-14">
            <h2 id="related" className="display text-2xl font-bold">
              {c.related}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {rel.map((r) => (
                <li key={r.url}>
                  <Link href={r.url} className="block h-full rounded-2xl border border-border p-4 transition-colors hover:border-primary/50">
                    <span className="text-xs text-primary">{CATEGORIES[r.categoria].label[locale]}</span>
                    <span className="mt-1 block font-medium text-fg">{r.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.titulo,
            description: a.descripcion,
            datePublished: a.fechaPublicacion,
            dateModified: a.fechaRevision,
            inLanguage: locale,
            author,
            publisher: { '@type': 'Organization', name: 'Kozaef Training', url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${a.url}`,
            citation: a.fuentes.map((s) => s.url),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((cr, i) => ({ '@type': 'ListItem', position: i + 1, name: cr.name, item: `${SITE_URL}${cr.url}` })),
          },
          ...(a.faq.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.pregunta, acceptedAnswer: { '@type': 'Answer', text: f.respuesta } })),
                },
              ]
            : []),
        ]}
      />
    </PageShell>
  );
}
