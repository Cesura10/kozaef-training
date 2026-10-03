import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { productBySlug, visibleProducts } from '@/content/products';
import { ProductPage, productMetadata } from '@/components/site/product-page';

// /en/programs/<producto>: página de venta indexable con demo gratis.
export const dynamicParams = false;
export function generateStaticParams() {
  return visibleProducts().map((p) => ({ locale: 'en', slug: p.slug.en }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/programs/[slug]'>) {
  const { locale, slug } = await params;
  const p = hasLocale(locale) ? productBySlug(locale, slug) : null;
  return p && hasLocale(locale) ? productMetadata(locale, p) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/programs/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'en') notFound();
  const p = productBySlug(locale, slug);
  if (!p) notFound();
  return <ProductPage locale={locale} product={p} />;
}
