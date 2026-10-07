import { ArrowDown, ArrowRight, Check, LockSimple } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { isBuyable, WITHDRAWAL_CONSENT, type Product } from '@/content/products';
import { BuyButton } from '@/components/funnel/buy-button';
import { formatProductPrice } from '@/components/funnel/bloque-producto';
import { ListaEspera } from '@/components/funnel/lista-espera';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { ProductViewTracker } from '@/components/funnel/product-view-tracker';
import { KineticTitle } from '@/components/motion/kinetic-title';
import { Marquee } from '@/components/motion/marquee';
import { ScrollTrailer } from '@/components/motion/scroll-trailer';
import { BookCover } from '@/components/motion/book-cover';
import { Spotlight } from '@/components/motion/spotlight';
import { Reveal } from '@/components/marketing/reveal';
import { JsonLd, PageShell } from './page-shell';

/**
 * Página de venta de un infoproducto: portada 3D, tráiler en scroll, índice, demo gratis con
 * aspecto de página real, compra en Shopify y puente al coaching para quien se estanque.
 * El contenido completo nunca está aquí: lo entrega Shopify.
 */
export async function InfoproductPage({ locale, product: p }: { locale: Locale; product: Product }) {
  const c = pagesCopy(locale).programs;
  const f = FUNNEL[locale];
  const buyable = isBuyable(p);
  const priceText = formatProductPrice(p, locale);
  const demo = p.demo?.[locale];
  const trailer = p.trailer?.[locale] ?? [];
  const chapters = p.capitulos?.[locale] ?? [];
  const [first, ...rest] = p.nombre[locale].split(' ');

  return (
    <PageShell locale={locale}>
      <ProductViewTracker product={p.id} price={p.precio} />

      {/* 1. Portada */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[55%] top-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(214,169,69,0.18),transparent)] blur-2xl"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            {p.borrador && !p.publicado && (
              <p className="mb-6 inline-flex border border-warning/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-warning">
                {c.draft}
              </p>
            )}
            <p className="animate-fade-in flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="text-primary">{c.kind}</span>
              <span className="draw-line block h-px w-14 bg-primary/70" aria-hidden />
              Kozaef Training
            </p>
            <KineticTitle
              lines={[first, { text: rest.join(' '), accent: true }].filter((l) => (typeof l === 'string' ? l : l.text))}
              className="display mt-7 text-[3.2rem] font-bold uppercase leading-[0.92] sm:text-7xl xl:text-[6.5rem]"
            />
            <p className="animate-rise mt-8 max-w-[48ch] text-lg leading-relaxed text-muted [animation-delay:350ms] [text-wrap:pretty]">
              {p.paraQuien[locale]}
            </p>
            <div className="animate-rise mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:450ms]">
              <a
                href="#comprar"
                data-track="cta_click"
                data-cta="infoproduct_buy"
                data-location="infoproduct-hero"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98]"
              >
                {c.getIt}
                {priceText && <span className="border-l border-primary-fg/25 pl-2 tabular-nums">{priceText}</span>}
                <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              {demo && (
                <a
                  href="#demo"
                  data-track="cta_click"
                  data-cta="infoproduct_demo"
                  data-location="infoproduct-hero"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-fg underline decoration-primary/50 underline-offset-[6px] hover:decoration-primary"
                >
                  {c.readDemo}
                  <ArrowDown size={14} weight="bold" className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
          <BookCover title={p.nombre[locale]} subtitle={chapters.map((ch) => ch.t).join(' · ')} />
        </div>
      </section>

      {chapters.length > 0 && <Marquee items={chapters.map((ch) => ch.t)} />}

      {/* 2. Tráiler */}
      {trailer.length > 0 && <ScrollTrailer scenes={trailer} label={c.trailer} />}

      {/* 3. Índice */}
      {chapters.length > 0 && (
        <section className="border-t border-border/60 py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <Reveal>
                <h2 className="display text-4xl font-bold leading-[1.02] md:text-6xl">{c.insideTitle}</h2>
              </Reveal>
              <ol className="mt-12 border-t border-border">
                {chapters.map((ch, i) => (
                  <li key={ch.t} className="group border-b border-border">
                    <Reveal delay={i * 0.06}>
                      <div className="grid gap-3 py-8 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.2fr)] md:items-baseline md:gap-8">
                        <span className="display outline-num text-5xl font-bold leading-none" aria-hidden>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="display text-2xl font-bold transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">{ch.t}</h3>
                        <p className="leading-relaxed text-muted">{ch.p}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
            <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
              <Spotlight className="rounded-[var(--radius-xl)] border border-border bg-surface p-7">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{pagesCopy(locale).programs.includes}</h3>
                <ul className="mt-5 space-y-4">
                  {p.incluye[locale].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fg/90">
                      <Check size={18} weight="bold" className="mt-1 shrink-0 text-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          </div>
        </section>
      )}

      {/* 4. Demo: una página de la guía, que se corta */}
      {demo && (
        <section id="demo" className="scroll-mt-20 border-t border-border/60 py-24 md:py-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{c.demo}</p>
              <h2 className="display mt-4 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-6xl">{c.demoTitle}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="relative mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-md bg-fg text-bg shadow-[0_50px_120px_-30px_rgba(214,169,69,0.25)] md:grid-cols-2">
                <div className="flex flex-col justify-between border-b border-black/10 p-8 md:border-b-0 md:border-r md:p-12">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/50">{p.nombre[locale]}</p>
                  <h3 className="display mt-16 text-4xl font-bold leading-[0.95] md:text-5xl [text-wrap:balance]">{demo.titulo}</h3>
                  <span className="mt-10 block h-1 w-12 bg-primary" aria-hidden />
                </div>
                <div className="relative space-y-7 p-8 md:p-12">
                  {demo.secciones.map((s) => (
                    <div key={s.h}>
                      <h4 className="text-lg font-semibold">{s.h}</h4>
                      <p className="mt-2 leading-relaxed text-black/70">{s.p}</p>
                    </div>
                  ))}
                  {/* Texto falso desenfocado: indica que la página sigue, sin enseñar contenido */}
                  <div aria-hidden className="space-y-2.5 pb-24 blur-[3px]">
                    {[92, 100, 85, 97, 60].map((w, i) => (
                      <span key={i} className="block h-3 rounded-sm bg-black/15" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex h-44 flex-col items-center justify-end bg-gradient-to-t from-fg via-fg/95 to-transparent px-8 pb-8 text-center">
                    <LockSimple size={20} weight="bold" className="text-black/60" aria-hidden />
                    <p className="mt-2 max-w-[40ch] text-sm text-black/70">{c.demoMore}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* 5. Compra (Shopify) */}
      <section id="comprar" className="scroll-mt-20 border-t border-border/60 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <Reveal>
            <h2 className="display max-w-[14ch] text-5xl font-bold leading-[0.98] md:text-7xl [text-wrap:balance]">{c.buyTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            {buyable && p.enlacePago ? (
              <Spotlight className="rounded-[var(--radius-xl)] border border-primary/30 bg-surface p-7">
                {priceText && (
                  <p>
                    <span className="display text-5xl font-bold tabular-nums text-fg">{priceText}</span>
                    {p.lanzamiento && <span className="ml-3 text-xs text-primary">{f.launch}</span>}
                  </p>
                )}
                <div className="mt-6">
                  <BuyButton
                    productId={p.id}
                    href={p.enlacePago}
                    price={p.precio}
                    label={f.buy}
                    consentText={WITHDRAWAL_CONSENT[locale]}
                    consentRequiredText={f.consentRequired}
                    fullText={f.full}
                  />
                </div>
              </Spotlight>
            ) : (
              <ListaEspera locale={locale} productId={p.id} productName={p.nombre[locale]} stacked />
            )}
          </Reveal>
        </div>
      </section>

      {/* 6. Puente al coaching: quien se atasca con la guía es el cliente ideal */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <CtaCoaching locale={locale} location="infoproduct-stuck" title={c.stuckTitle} body={c.stuckBody} />
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
            { name: pagesCopy(locale).programs.h1, url: sectionPath('programs', locale) },
            { name: p.nombre[locale], url: sectionPath('programs', locale, p.slug[locale]) },
          ].map((cr, i) => ({ '@type': 'ListItem', position: i + 1, name: cr.name, item: `${SITE_URL}${cr.url}` })),
        }}
      />
      {p.precio !== null && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.nombre[locale],
            description: p.paraQuien[locale],
            brand: { '@type': 'Brand', name: 'Kozaef Training' },
            offers: {
              '@type': 'Offer',
              price: p.precio,
              priceCurrency: p.moneda,
              availability: buyable ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
              url: `${SITE_URL}${sectionPath('programs', locale, p.slug[locale])}`,
            },
          }}
        />
      )}
    </PageShell>
  );
}
