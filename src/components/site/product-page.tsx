import Link from 'next/link';
import { Check } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { isBuyable, SERVICE_CONSENT, WITHDRAWAL_CONSENT, type Product } from '@/content/products';
import { TECHNIQUE_EXAMPLES } from '@/content/technique-examples';
import { BuyButton } from '@/components/funnel/buy-button';
import { formatProductPrice } from '@/components/funnel/bloque-producto';
import { ListaEspera } from '@/components/funnel/lista-espera';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { VideoFacade } from '@/components/funnel/video-facade';
import { ProductViewTracker } from '@/components/funnel/product-view-tracker';
import { JsonLd, PageShell, sectionMetadata } from './page-shell';
import { KineticTitle } from '@/components/motion/kinetic-title';
import { Spotlight } from '@/components/motion/spotlight';
import { InfoproductPage } from './infoproduct-page';

export const productMetadata = (locale: Locale, p: Product) =>
  sectionMetadata('programs', locale, { title: p.nombre[locale], description: p.paraQuien[locale] }, p.slug);

export async function ProductPage({ locale, product: p }: { locale: Locale; product: Product }) {
  if (p.tipo === 'infoproducto') return <InfoproductPage locale={locale} product={p} />;
  const c = pagesCopy(locale);
  const f = FUNNEL[locale];
  const buyable = isBuyable(p);
  const priceText = formatProductPrice(p, locale);
  const isTechnique = p.id === 'revision-tecnica';
  const demo = p.demo?.[locale];

  return (
    <PageShell locale={locale}>
      <ProductViewTracker product={p.id} price={p.precio} />
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-16 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div>
          <p className="animate-fade-in flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-primary">{c.programs.service}</span>
            <span className="draw-line block h-px w-14 bg-primary/70" aria-hidden />
            Kozaef Training
          </p>
          <KineticTitle lines={[p.nombre[locale]]} className="display mt-7 text-[2.75rem] font-bold leading-[0.98] sm:text-6xl xl:text-7xl" />
          <h2 className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-primary">{c.programs.forWho}</h2>
          <p className="mt-2 max-w-[60ch] text-lg leading-relaxed text-muted">{p.paraQuien[locale]}</p>
          <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-primary">{c.programs.includes}</h2>
          <ul className="mt-3 space-y-3">
            {p.incluye[locale].map((item) => (
              <li key={item} className="flex items-start gap-3 text-fg/90">
                <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          {isTechnique && (
            <div className="mt-12">
              <h2 className="display text-2xl font-bold">{c.technique.howTitle}</h2>
              <ol className="mt-6 border-t border-border">
                {c.technique.how.map((step, i) => (
                  <li key={step} className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-6">
                    <span className="display outline-num text-5xl font-bold leading-none" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-lg leading-relaxed text-fg/90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {isTechnique && TECHNIQUE_EXAMPLES.length > 0 && (
            <div className="mt-12">
              <h2 className="display text-2xl font-bold">{c.technique.examplesTitle}</h2>
              <p className="mt-2 text-muted">{c.technique.examplesIntro}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {TECHNIQUE_EXAMPLES.map((v) => (
                  <VideoFacade key={v.youtubeId} id={v.youtubeId} title={v.title[locale]} playLabel={c.technique.play} />
                ))}
              </div>
            </div>
          )}

          {demo && (
            <div className="mt-12 rounded-[var(--radius-xl)] border border-border p-6 sm:p-8">
              <p className="text-xs font-medium text-primary">{c.programs.demo}</p>
              <h2 className="display mt-2 text-2xl font-bold">{demo.titulo}</h2>
              <div className="mt-6 space-y-6">
                {demo.secciones.map((s) => (
                  <div key={s.h}>
                    <h3 className="text-lg font-semibold text-fg">{s.h}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {buyable && p.enlacePago ? (
            <Spotlight className="rounded-[var(--radius-xl)] border border-primary/30 bg-surface p-6">
              {priceText && (
                <p>
                  <span className="display text-4xl font-bold text-fg">{priceText}</span>
                  {p.lanzamiento && <span className="ml-2 text-xs text-primary">{f.launch}</span>}
                </p>
              )}
              <div className="mt-5">
                <BuyButton
                  productId={p.id}
                  href={p.enlacePago}
                  price={p.precio}
                  label={f.buy}
                  consentText={(p.tipo === 'servicio' ? SERVICE_CONSENT : WITHDRAWAL_CONSENT)[locale]}
                  consentRequiredText={f.consentRequired}
                  capacity={p.capacidadSemanal}
                  fullText={f.full}
                />
              </div>
            </Spotlight>
          ) : (
            <ListaEspera locale={locale} productId={p.id} productName={p.nombre[locale]} service={p.tipo === 'servicio'} stacked />
          )}
          {isTechnique && (
            <div className="rounded-[var(--radius-xl)] border border-border p-6">
              <h2 className="font-semibold text-fg">{c.technique.sendTitle}</h2>
              <Link
                href={sectionPath('programs', locale, p.slug[locale], locale === 'es' ? 'enviar' : 'send')}
                className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
              >
                {c.technique.sendCta}
              </Link>
            </div>
          )}
        </aside>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <CtaCoaching locale={locale} location="product" />
      </section>
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
