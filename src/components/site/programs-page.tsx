import type { Locale } from '@/i18n/config';
import { pagesCopy } from '@/content/pages';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { isBuyable, visibleProducts } from '@/content/products';
import { CATEGORIES, CATEGORY_IDS, PROFILES, PROFILE_IDS } from '@/content/taxonomy';
import { ProductFilter, type ProductCard } from '@/components/funnel/product-filter';
import { formatProductPrice } from '@/components/funnel/bloque-producto';
import { ListaEspera } from '@/components/funnel/lista-espera';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { PageShell, sectionMetadata } from './page-shell';
import { PageHero } from './page-hero';

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
  }));
  const showWaitlist = !visibleProducts().some((p) => p.tipo === 'infoproducto');
  return (
    <PageShell locale={locale}>
      <PageHero index="03" label={c.h1} title={[c.h1]} intro={c.intro} />
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div>
          <ProductFilter
            products={products}
            categories={CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].label[locale] }))}
            profiles={PROFILE_IDS.map((id) => ({ id, label: PROFILES[id].label[locale] }))}
            labels={{ all: c.all, empty: c.empty, launch: f.launch, waitlist: f.waitlistTitle }}
          />
        </div>
        {/* El aviso general "en camino" solo tiene sentido mientras no haya ningún programa. */}
        <div className={`mt-16 grid gap-6 ${showWaitlist ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]' : ''}`}>
          {showWaitlist && <ListaEspera locale={locale} />}
          <CtaCoaching locale={locale} location="programs" />
        </div>
      </section>
    </PageShell>
  );
}
