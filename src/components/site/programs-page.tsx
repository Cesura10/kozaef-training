import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { WITHDRAWAL_CONSENT, isBuyable, visibleProducts } from '@/content/products';
import { CATEGORIES, CATEGORY_IDS, PROFILES, PROFILE_IDS } from '@/content/taxonomy';
import { ProductFilter, type ProductCard } from '@/components/funnel/product-filter';
import { formatProductPrice } from '@/components/funnel/bloque-producto';
import { ListaEspera } from '@/components/funnel/lista-espera';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { PackElige3, type PackItem } from '@/components/funnel/pack-elige-3';
import { PACK_SIZE } from '@/content/pack';
import { PageShell, sectionMetadata } from './page-shell';
import { PageHero } from './page-hero';
import { Foto } from './foto';

export const programsMetadata = (locale: Locale) => {
  const c = pagesCopy(locale).programs;
  return sectionMetadata('programs', locale, { title: c.metaTitle, description: c.metaDescription });
};

export async function ProgramsPage({ locale }: { locale: Locale }) {
  const c = pagesCopy(locale).programs;
  const f = FUNNEL[locale];
  const products: ProductCard[] = visibleProducts().map((p) => ({
    id: p.id,
    href: sectionPath('programs', locale, p.slug[locale]),
    name: p.nombre[locale],
    forWho: p.paraQuien[locale],
    priceText: formatProductPrice(p, locale),
    launch: Boolean(p.lanzamiento),
    categoria: p.categoria,
    perfiles: p.perfiles,
    waitlist: !isBuyable(p),
    kind: p.tipo === 'infoproducto' ? c.kind : c.service,
    infoproduct: p.tipo === 'infoproducto',
    image: p.imagen,
  }));
  // Pack "elige 3": solo guías con compra en Shopify (enlace /cart/VARIANTE:1) y precio.
  const SHOPIFY_CART = /^(https:\/\/[^/]+)\/cart\/(\d+):1$/;
  const packItems: PackItem[] = visibleProducts().flatMap((p) => {
    const m = p.tipo === 'infoproducto' && isBuyable(p) && p.precio ? SHOPIFY_CART.exec(p.enlacePago ?? '') : null;
    return m ? [{ id: p.id, name: p.nombre[locale], price: p.precio!, variant: m[2], shop: m[1] }] : [];
  });
  const showWaitlist = !visibleProducts().some((p) => p.tipo === 'infoproducto');
  return (
    <PageShell locale={locale}>
      <PageHero index="03" label={c.h1} title={[c.h1]} intro={c.intro} />
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <Foto
          name="programas"
          alt={locale === 'es' ? 'Guía de entrenamiento en una tablet y cuaderno de notas en el gimnasio' : 'Training guide on a tablet with a notebook at the gym'}
          className="mb-14 aspect-[16/9] lg:aspect-[21/9]"
        />
        <div>
          <ProductFilter
            products={products}
            categories={CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].label[locale] }))}
            profiles={PROFILE_IDS.map((id) => ({ id, label: PROFILES[id].label[locale] }))}
            labels={{ all: c.all, empty: c.empty, launch: f.launch, waitlist: f.waitlistTitle }}
          />
        </div>
        {packItems.length >= PACK_SIZE && (
          <PackElige3
            items={packItems}
            locale={locale}
            labels={c.pack}
            consentText={WITHDRAWAL_CONSENT[locale]}
            consentRequiredText={f.consentRequired}
          />
        )}
        {/* El aviso general "en camino" solo tiene sentido mientras no haya ningún programa. */}
        <div className={`mt-16 grid gap-6 ${showWaitlist ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]' : ''}`}>
          {showWaitlist && <ListaEspera locale={locale} />}
          <CtaCoaching locale={locale} location="programs" />
        </div>
      </section>
    </PageShell>
  );
}
