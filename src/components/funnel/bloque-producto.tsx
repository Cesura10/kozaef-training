import Link from 'next/link';
import { Package } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { isBuyable, relatedProduct, type Product } from '@/content/products';
import type { CategoryId, ProfileId } from '@/content/taxonomy';
import { ListaEspera } from './lista-espera';

const price = (p: Product, locale: Locale) =>
  p.precio === null ? null : p.precio.toLocaleString(locale === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: p.moneda, maximumFractionDigits: 0 });

/**
 * Producto relacionado (por id, o por categoría/perfil). Comprable -> ficha con enlace a su
 * página (demo + compra). Sin enlace de pago -> lista de espera. Sin productos -> lista general.
 */
export async function BloqueProducto({
  locale,
  productId,
  categoria,
  perfiles,
  location = 'page',
}: {
  locale: Locale;
  productId?: string | null;
  categoria?: CategoryId | null;
  perfiles?: ProfileId[];
  location?: string;
}) {
  const p = relatedProduct({ id: productId, categoria, perfiles });
  if (!p) return <ListaEspera locale={locale} />;
  if (!isBuyable(p)) return <ListaEspera locale={locale} productId={p.id} productName={p.nombre[locale]} service={p.tipo === 'servicio'} />;

  const f = FUNNEL[locale];
  const priceText = price(p, locale);
  return (
    <section className="gold-sheen rounded-[var(--radius-xl)] border border-primary/30 p-6 sm:p-8">
      <div className="flex items-center gap-3 text-primary">
        <Package size={22} weight="duotone" aria-hidden />
        <span className="text-sm font-medium">{f.productEyebrow}</span>
      </div>
      <h2 className="display mt-3 text-2xl font-bold">{p.nombre[locale]}</h2>
      <p className="mt-2 max-w-[60ch] text-muted">{p.paraQuien[locale]}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          href={sectionPath('programs', locale, p.slug[locale])}
          data-track="cta_click"
          data-cta="product"
          data-location={location}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          {p.tipo === 'servicio' ? f.seeService : f.seeProduct}
        </Link>
        {priceText && (
          <span className="text-sm text-muted">
            <span className="text-lg font-semibold text-fg">{priceText}</span>
            {p.lanzamiento && <span className="ml-2 text-xs text-primary">{f.launch}</span>}
          </span>
        )}
      </div>
    </section>
  );
}

export { price as formatProductPrice };
