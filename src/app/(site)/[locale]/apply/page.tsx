import { notFound } from 'next/navigation';
import { ApplyPage, applyMetadata } from '@/components/site/apply-page';

// /en/apply: solicitud de coaching (solo idioma "en").
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export function generateMetadata() {
  return applyMetadata('en');
}
export default async function Page({ params }: PageProps<'/[locale]/apply'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <ApplyPage locale="en" />;
}
