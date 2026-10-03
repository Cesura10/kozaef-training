import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { AboutPage, aboutMetadata } from '@/components/site/about-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export async function generateMetadata({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  return hasLocale(locale) ? aboutMetadata(locale) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <AboutPage locale={locale} />;
}
