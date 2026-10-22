import { applyPath } from '@/content/apply';
import type { Locale } from '@/i18n/config';
import {
  ArrowRight,
  ArrowUpRight,
  Barbell,
  ChatsCircle,
  Check,
  Drop,
  Ruler,
} from '@phosphor-icons/react/dist/ssr';
import { ButtonLink } from '@/components/ui/button';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { Reveal } from '@/components/marketing/reveal';
import { KineticTitle } from '@/components/motion/kinetic-title';
import { Marquee } from '@/components/motion/marquee';
import { Spotlight } from '@/components/motion/spotlight';
import { LogoMark } from '@/components/brand';
import { FondoFoto, Foto } from '@/components/site/foto';
import { hasLocale } from '@/i18n/config';
import Link from 'next/link';
import { toolPath } from '@/content/tools';
import { sectionPath } from '@/content/routes';
import { CATEGORIES, CATEGORY_IDS } from '@/content/taxonomy';
import { articlesFor, categoryPath } from '@/content/articles';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getDictionary } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/page-shell';
import { SITE_URL } from '@/i18n/config';
import { authorSameAs } from '@/content/author';

// Página estática por idioma: todos los textos salen de src/i18n/dictionaries.
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const latest = articlesFor(locale).slice(0, 6);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} t={t} />

      <main className="flex-1">
        {/* Hero a todo lo ancho con foto: la oferta principal es el coaching 1:1 ("Solicitar plaza") */}
        <section className="relative isolate overflow-hidden border-b border-border/60">
          {/* Foto: en móvil arriba; en escritorio a la derecha, fundida con el negro por la izquierda. LCP: sin carga diferida. */}
          <div className="absolute inset-x-0 top-0 -z-10 h-[62vh] sm:h-[70vh] lg:inset-y-0 lg:left-auto lg:h-auto lg:w-[64%]">
            {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizados (ver components/site/foto.tsx) */}
            <img
              src="/img/portada-1200.webp"
              srcSet="/img/portada-480.webp 480w, /img/portada-800.webp 800w, /img/portada-1200.webp 1200w, /img/portada-1600.webp 1600w"
              sizes="(min-width: 1024px) 64vw, 100vw"
              alt={locale === 'es' ? 'Entrenador corrigiendo la técnica de una sentadilla con mancuerna' : 'Coach correcting a dumbbell squat'}
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[60%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.15)_0%,rgba(10,10,11,0.35)_50%,rgba(10,10,11,1)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,10,11,1)_0%,rgba(10,10,11,0.75)_22%,rgba(10,10,11,0.2)_55%,rgba(10,10,11,0.1)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-bg to-transparent lg:block" />
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-col justify-end px-4 pb-14 pt-[44vh] sm:px-6 sm:pt-[52vh] lg:min-h-[calc(100dvh-4rem)] lg:justify-center lg:py-24">
            <div className="max-w-xl">
              <KineticTitle
                lines={[t.hero.titleA, { text: t.hero.titleB, accent: true }]}
                className="display text-[2.4rem] font-bold leading-[1.02] sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]"
              />
              <p className="animate-rise mt-6 max-w-[44ch] text-lg leading-relaxed text-fg/80 [animation-delay:400ms]">{t.hero.subtitle}</p>
              <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:500ms]">
                <ButtonLink href={applyPath(locale as Locale)} className="h-12 px-6" data-track="cta_click" data-cta="apply" data-location="hero">
                  {t.nav.apply}
                  <ArrowRight size={16} weight="bold" />
                </ButtonLink>
                <ButtonLink
                  href={sectionPath('coaching', locale)}
                  variant="outline"
                  className="h-12 bg-bg/40 px-6 backdrop-blur-sm"
                  data-track="cta_click"
                  data-cta="coaching"
                  data-location="hero"
                >
                  {t.hero.ctaHow}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo empezamos: los 3 pasos, justo debajo de la foto */}
        <section aria-labelledby="pasos-h" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <h2 id="pasos-h" className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t.hero.stepsTitle}</h2>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-primary/25 bg-border/60 md:grid-cols-3">
            {t.hero.steps.map((st, i) => (
              <li key={st.h} className="flex gap-5 bg-bg p-7 sm:p-8">
                <span className="display text-4xl font-bold leading-none text-primary">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-lg font-semibold text-fg">{st.h}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{st.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Marquee items={[...t.method.items.map((m) => m.word.replace(/\.$/, '')), 'Kozaef Training']} />

        {/* Segunda sección: herramientas gratis (puerta de Google: herramienta → email → guía → coaching) */}
        <section id="herramientas" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{t.tools.eyebrow}</p>
              <h2 className="display mt-4 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                {t.tools.title}
              </h2>
            </Reveal>

            {/* Solo proteína y grasa corporal por ahora (VISIBLE_TOOL_IDS en src/content/tools.ts). */}
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {([
                { id: 'protein', icon: Drop, big: 'g/kg', title: t.tools.protein.title, body: t.tools.protein.body, gold: true },
                { id: 'bodyfat', icon: Ruler, big: '%', title: t.tools.bodyfat.title, body: t.tools.bodyfat.body, gold: false },
              ] as const).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <Spotlight className="h-full rounded-[var(--radius-xl)]">
                    <Link
                      href={toolPath(c.id, locale)}
                      className={`group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border p-8 transition-colors md:p-10 ${
                        c.gold ? 'gold-sheen border-primary/25 hover:border-primary/60' : 'border-border bg-surface hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <c.icon size={28} weight="duotone" className="text-primary" />
                        <ArrowUpRight
                          size={22}
                          className="text-primary/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </div>
                      <div>
                        <p className="display text-[5rem] font-bold leading-none text-fg/10 sm:text-[7rem]" aria-hidden>
                          {c.big}
                        </p>
                        <h3 className="display mt-2 text-3xl font-bold md:text-4xl">{c.title}</h3>
                        <p className="mt-3 max-w-[44ch] text-muted">{c.body}</p>
                      </div>
                    </Link>
                  </Spotlight>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Método: filas tipográficas */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display max-w-[22ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                {t.method.title}
              </h2>
            </Reveal>
            <Reveal className="mt-12">
              <Foto
                name="coaching"
                alt={locale === 'es' ? 'Seguimiento del entrenamiento desde el móvil en el gimnasio' : 'Tracking a workout on a phone at the gym'}
                className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
              />
            </Reveal>
            <div className="mt-14 divide-y divide-border">
              {t.method.items.map((m, i) => (
                <Reveal key={m.word} delay={i * 0.06}>
                  <div className="group grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-12 md:py-10">
                    <p className="display text-6xl font-bold leading-none text-fg/90 transition-colors duration-300 group-hover:text-primary md:text-8xl">
                      {m.word}
                    </p>
                    <p className="max-w-[42ch] text-lg leading-relaxed text-muted">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Coaching: zona de venta, sin anuncios */}
        <section id="coaching" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              {/* Foto provisional (generada); sustituir por una foto real de Manu entrenando cuando la haya. */}
              <Spotlight className="group relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 bg-surface p-8">
                <FondoFoto name="coaching-llamada" alt={locale === 'es' ? 'Videollamada de coaching 1:1 online' : '1:1 online coaching video call'} sizes="(min-width: 1024px) 40vw, 90vw" />
                <LogoMark className="relative h-10 w-10" />
                <p className="display foil-text relative text-[9rem] font-bold leading-[0.8] tracking-[-0.05em] sm:text-[11rem]" aria-hidden>
                  1:1
                </p>
                <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-fg/80">{t.coaching.eyebrow}</p>
              </Spotlight>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{t.coaching.eyebrow}</p>
              <h2 className="display mt-4 max-w-[16ch] text-4xl font-bold leading-[1.02] md:text-6xl">
                {t.coaching.title}
              </h2>
              <ul className="mt-8 space-y-4">
                {t.coaching.items.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-lg text-fg/90">
                    <Check size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href={applyPath(locale as Locale)} className="h-12 px-7" data-track="cta_click" data-cta="apply" data-location="coaching">
                  {t.nav.apply}
                  <ArrowRight size={16} weight="bold" />
                </ButtonLink>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <ChatsCircle size={18} className="text-faint" />
                  {t.coaching.note}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Guías: carrusel horizontal con scroll-snap */}
        <section id="aprende" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display max-w-[20ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                {t.guides.title}
              </h2>
            </Reveal>
          </div>
          <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 xl:px-[calc((100vw_-_80rem)/2_+_1.5rem)] xl:scroll-px-[calc((100vw_-_80rem)/2_+_1.5rem)]">
            {/* Artículos reales más recientes; si aún no hay, las categorías como puerta de entrada. */}
            {(latest.length > 0
              ? latest.map((a) => ({ key: a.url, href: a.url, tag: CATEGORIES[a.categoria].label[locale], title: a.titulo, image: a.imagen?.nombre, alt: a.imagen?.alt }))
              : CATEGORY_IDS.map((id) => ({ key: id, href: categoryPath(locale, id), tag: t.nav.learn, title: CATEGORIES[id].label[locale], image: undefined as string | undefined, alt: undefined as string | undefined }))
            ).map((g, i) => (
              <Link
                key={g.key}
                href={g.href}
                className={`group relative flex aspect-[4/5] w-[78vw] max-w-[20rem] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border p-7 transition-colors hover:border-primary/60 sm:w-[20rem] ${
                  g.image ? 'border-primary/20 bg-surface' : i % 2 === 0 ? 'gold-sheen border-primary/20' : 'border-border bg-surface'
                }`}
              >
                {g.image && <FondoFoto name={g.image} alt={g.alt ?? g.title} sizes="320px" fuerte />}
                <span className="relative text-xs font-medium text-primary">{g.tag}</span>
                <h3 className="display relative text-2xl font-bold leading-[1.1]">{g.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Lista de correo */}
        <section id="lista" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <Barbell size={30} weight="duotone" className="text-primary" />
              <h2 className="display mt-6 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                {t.newsletter.title}
              </h2>
              <p className="mt-5 max-w-[48ch] text-lg text-muted">
                {t.newsletter.body}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:justify-self-end">
              <NewsletterForm t={t.newsletter} locale={locale} />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} t={t} />
      {/* Quién es la marca y qué es la web: ayuda a Google a mostrar el nombre y el logo. */}
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Kozaef Training',
            alternateName: ['Kozaef', 'KozaefTraining'],
            url: SITE_URL,
            logo: `${SITE_URL}/icon.svg`,
            description:
              'Entrenador personal online en español: coaching 1:1 de entrenamiento y nutrición, guías de entrenamiento en PDF y calculadoras gratis.',
            email: 'contacto@kozaeftraining.com',
            areaServed: { '@type': 'Country', name: 'España' },
            knowsAbout: ['Entrenamiento de fuerza', 'Pérdida de grasa', 'Ganar masa muscular', 'Nutrición deportiva', 'Entrenamiento en la menopausia'],
            ...(authorSameAs().length ? { sameAs: authorSameAs() } : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'Kozaef Training',
            url: SITE_URL,
            inLanguage: locale,
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
        ]}
      />
    </div>
  );
}
