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
  }));
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">{c.intro}</p>
        <div className="mt-10">
          <ProductFilter
            products={products}
            categories={CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].label[locale] }))}
            profiles={PROFILE_IDS.map((id) => ({ id, label: PROFILES[id].label[locale] }))}
            labels={{ all: c.all, empty: c.empty, launch: f.launch, waitlist: f.waitlistTitle }}
          />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <ListaEspera locale={locale} />
          <CtaCoaching locale={locale} location="programs" />
        </div>
      </section>
    </PageShell>
  );
}
