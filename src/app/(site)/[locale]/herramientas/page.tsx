import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { ToolsIndexPage, toolsIndexMetadata } from '@/components/site/tools-index-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export async function generateMetadata({ params }: PageProps<'/[locale]/herramientas'>) {
  const { locale } = await params;
  return hasLocale(locale) ? toolsIndexMetadata(locale) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/herramientas'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <ToolsIndexPage locale={locale} />;
}
