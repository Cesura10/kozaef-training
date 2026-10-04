import { notFound } from 'next/navigation';
import { ThanksPage, thanksMetadata } from '@/components/site/thanks-page';

// Gracias tras la compra (URL de retorno de Shopify). noindex y fuera del sitemap.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export function generateMetadata() {
  return thanksMetadata('en');
}
export default async function Page({ params }: PageProps<'/[locale]/thanks'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <ThanksPage locale="en" />;
}
