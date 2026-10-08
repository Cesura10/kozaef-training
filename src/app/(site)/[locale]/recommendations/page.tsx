import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { RecommendationsPage, recommendationsMetadata } from '@/components/site/recommendations-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export async function generateMetadata({ params }: PageProps<'/[locale]/recommendations'>) {
  const { locale } = await params;
  return hasLocale(locale) ? recommendationsMetadata(locale) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/recommendations'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <RecommendationsPage locale={locale} />;
}
