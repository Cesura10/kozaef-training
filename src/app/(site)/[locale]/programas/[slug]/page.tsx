import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { productBySlug, visibleProducts } from '@/content/products';
import { ProductPage, productMetadata } from '@/components/site/product-page';

// /es/programas/<producto>: página de venta indexable con demo gratis.
export const dynamicParams = false;
export function generateStaticParams() {
  return visibleProducts().map((p) => ({ locale: 'es', slug: p.slug.es }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/programas/[slug]'>) {
  const { locale, slug } = await params;
  const p = hasLocale(locale) ? productBySlug(locale, slug) : null;
  return p && hasLocale(locale) ? productMetadata(locale, p) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/programas/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'es') notFound();
  const p = productBySlug(locale, slug);
  if (!p) notFound();
  return <ProductPage locale={locale} product={p} />;
}
