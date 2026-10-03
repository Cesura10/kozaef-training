import { notFound } from 'next/navigation';
import { TechniqueSendPage, techniqueSendMetadata } from '@/components/site/technique-send-page';

// Envío de vídeos tras la compra (noindex, fuera del sitemap). Solo para servicios.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en', slug: 'technique-review' }];
}
export function generateMetadata() {
  return techniqueSendMetadata('en');
}
export default async function Page({ params }: PageProps<'/[locale]/programs/[slug]/send'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <TechniqueSendPage locale="en" />;
}
