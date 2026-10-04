import { notFound } from 'next/navigation';
import { ThanksPage, thanksMetadata } from '@/components/site/thanks-page';

// Gracias tras la compra (URL de retorno de Shopify). noindex y fuera del sitemap.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export function generateMetadata() {
  return thanksMetadata('es');
}
export default async function Page({ params }: PageProps<'/[locale]/gracias'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <ThanksPage locale="es" />;
}
