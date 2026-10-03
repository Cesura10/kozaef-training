import { notFound } from 'next/navigation';
import { TechniqueSendPage, techniqueSendMetadata } from '@/components/site/technique-send-page';

// Envío de vídeos tras la compra (noindex, fuera del sitemap). Solo para servicios.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es', slug: 'revision-de-tecnica' }];
}
export function generateMetadata() {
  return techniqueSendMetadata('es');
}
export default async function Page({ params }: PageProps<'/[locale]/programas/[slug]/enviar'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <TechniqueSendPage locale="es" />;
}
