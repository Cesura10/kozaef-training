import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { CoachingPage, coachingMetadata } from '@/components/site/coaching-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }];
}
export async function generateMetadata({ params }: PageProps<'/[locale]/coaching'>) {
  const { locale } = await params;
  return hasLocale(locale) ? coachingMetadata(locale) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/coaching'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  if (!hasLocale(locale)) notFound();
  return <CoachingPage locale={locale} />;
}
