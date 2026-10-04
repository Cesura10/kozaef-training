import { notFound } from 'next/navigation';
import { LearnIndexPage, learnIndexMetadata } from '@/components/site/learn-pages';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export function generateMetadata() {
  return learnIndexMetadata('en');
}
export default async function Page({ params }: PageProps<'/[locale]/learn'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <LearnIndexPage locale="en" />;
}
