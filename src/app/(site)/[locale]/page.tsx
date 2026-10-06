import { applyPath } from '@/content/apply';
import type { Locale } from '@/i18n/config';
import {
  ArrowRight,
  ArrowUpRight,
  Barbell,
  ChatsCircle,
  Check,
  Drop,
  Fire,
  Ruler,
} from '@phosphor-icons/react/dist/ssr';
import { ButtonLink } from '@/components/ui/button';
import { ProteinCalculator } from '@/components/marketing/protein-calculator';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { Reveal } from '@/components/marketing/reveal';
import { KineticTitle } from '@/components/motion/kinetic-title';
import { Marquee } from '@/components/motion/marquee';
import { Spotlight } from '@/components/motion/spotlight';
import { LogoMark } from '@/components/brand';
import { hasLocale } from '@/i18n/config';
import Link from 'next/link';
import { toolPath } from '@/content/tools';
import { CATEGORIES, CATEGORY_IDS } from '@/content/taxonomy';
import { articlesFor, categoryPath } from '@/content/articles';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getDictionary } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';

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
        {/* Hero: mensaje a la izquierda, herramienta real a la derecha */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pb-24">
          {/* Hero con animación CSS: visible antes de hidratar (LCP) */}
          <div>
            <KineticTitle
              lines={[t.hero.titleA, { text: t.hero.titleB, accent: true }]}
              className="display text-[2.4rem] font-bold leading-[1.02] sm:text-6xl lg:text-[3.25rem] xl:text-[3.6rem]"
            />
            <p className="animate-rise mt-6 max-w-[46ch] text-lg leading-relaxed text-muted [animation-delay:400ms]">
              {t.hero.subtitle}
            </p>
            <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:500ms]">
              <ButtonLink href="#herramientas" className="h-12 px-6" data-track="cta_click" data-cta="tools" data-location="hero">
                {t.hero.ctaTools}
                <ArrowRight size={16} weight="bold" />
              </ButtonLink>
              <ButtonLink href={applyPath(locale as Locale)} variant="outline" className="h-12 px-6" data-track="cta_click" data-cta="apply" data-location="hero">
                {t.nav.apply}
              </ButtonLink>
            </div>
          </div>
          <div className="animate-rise [animation-delay:250ms]">
            <ProteinCalculator t={t.calculator} />
          </div>
        </section>

        <Marquee items={[...t.method.items.map((m) => m.word.replace(/\.$/, '')), 'Kozaef Training']} />

        {/* Herramientas: bento de 3 celdas */}
        <section id="herramientas" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{t.tools.eyebrow}</p>
              <h2 className="display mt-4 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                {t.tools.title}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
              <Reveal className="md:col-span-2 md:row-span-2">
                <Spotlight className="h-full rounded-[var(--radius-xl)]">
                <Link
                  href={toolPath('calories', locale)}
                  className="group gold-sheen relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-primary/25 p-8 transition-colors hover:border-primary/60 md:p-10"
                >
                  <div className="flex items-center justify-between">
                    <Fire size={28} weight="duotone" className="text-primary" />
                    <ArrowUpRight
                      size={22}
                      className="text-primary/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <p className="display text-[5.5rem] font-bold leading-none text-fg/10 sm:text-[8rem]" aria-hidden>
                      kcal
                    </p>
                    <h3 className="display mt-2 text-3xl font-bold md:text-4xl">{t.tools.calories.title}</h3>
                    <p className="mt-3 max-w-[44ch] text-muted">
                      {t.tools.calories.body}
                    </p>
                  </div>
                </Link>
                </Spotlight>
              </Reveal>

              <Reveal delay={0.08}>
                <Spotlight className="h-full rounded-[var(--radius-xl)]">
                <Link
                  href={toolPath('protein', locale)}
                  className="group flex h-full flex-col justify-between gap-10 rounded-[var(--radius-xl)] border border-border bg-surface p-7 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <Drop size={26} weight="duotone" className="text-primary" />
                    <ArrowUpRight
                      size={20}
                      className="text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{t.tools.protein.title}</h3>
                    <p className="mt-2 text-sm text-muted">{t.tools.protein.body}</p>
                  </div>
                </Link>
                </Spotlight>
              </Reveal>

              <Reveal delay={0.16}>
                <Spotlight className="h-full rounded-[var(--radius-xl)]">
                <Link
                  href={toolPath('bodyfat', locale)}
                  className="group flex h-full flex-col justify-between gap-10 rounded-[var(--radius-xl)] border border-border bg-surface-2 p-7 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <Ruler size={26} weight="duotone" className="text-primary" />
                    <ArrowUpRight
                      size={20}
                      className="text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{t.tools.bodyfat.title}</h3>
                    <p className="mt-2 text-sm text-muted">{t.tools.bodyfat.body}</p>
                  </div>
                </Link>
                </Spotlight>
              </Reveal>
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
              ? latest.map((a) => ({ key: a.url, href: a.url, tag: CATEGORIES[a.categoria].label[locale], title: a.titulo }))
              : CATEGORY_IDS.map((id) => ({ key: id, href: categoryPath(locale, id), tag: t.nav.learn, title: CATEGORIES[id].label[locale] }))
            ).map((g, i) => (
              <Link
                key={g.key}
                href={g.href}
                className={`flex aspect-[4/5] w-[78vw] max-w-[20rem] shrink-0 snap-start flex-col justify-between rounded-[var(--radius-xl)] border p-7 transition-colors hover:border-primary/60 sm:w-[20rem] ${
                  i % 2 === 0 ? 'gold-sheen border-primary/20' : 'border-border bg-surface'
                }`}
              >
                <span className="text-xs font-medium text-primary">{g.tag}</span>
                <h3 className="display text-2xl font-bold leading-[1.1]">{g.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Coaching: zona de venta, sin anuncios */}
        <section id="coaching" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              {/* Panel tipográfico hasta tener foto real de Manu entrenando (1200x1500, con permiso). */}
              <Spotlight className="gold-sheen relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 p-8">
                <LogoMark className="h-10 w-10" />
                <p className="display foil-text text-[9rem] font-bold leading-[0.8] tracking-[-0.05em] sm:text-[11rem]" aria-hidden>
                  1:1
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.coaching.eyebrow}</p>
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
    </div>
  );
}
