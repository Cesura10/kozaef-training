import { notFound } from 'next/navigation';
import { LearnIndexPage, learnIndexMetadata } from '@/components/site/learn-pages';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export function generateMetadata() {
  return learnIndexMetadata('es');
}
export default async function Page({ params }: PageProps<'/[locale]/aprende'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <LearnIndexPage locale="es" />;
}
