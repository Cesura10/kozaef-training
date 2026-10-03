import { notFound } from 'next/navigation';
import { ApplyPage, applyMetadata } from '@/components/site/apply-page';

// /es/solicitar: solicitud de coaching (solo idioma "es").
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export function generateMetadata() {
  return applyMetadata('es');
}
export default async function Page({ params }: PageProps<'/[locale]/solicitar'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <ApplyPage locale="es" />;
}
