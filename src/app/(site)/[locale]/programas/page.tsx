import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { ProgramsPage, programsMetadata } from '@/components/site/programs-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export async function generateMetadata({ params }: PageProps<'/[locale]/programas'>) {
  const { locale } = await params;
  return hasLocale(locale) ? programsMetadata(locale) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/programas'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <ProgramsPage locale={locale} />;
}
