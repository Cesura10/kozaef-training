import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { TOOL_IDS, TOOL_SLUGS, toolBySlug } from '@/content/tools';
import { ToolPage, toolMetadata } from '@/components/site/tool-page';

// /es/herramientas/<slug>: páginas estáticas de herramientas (solo idioma "es").
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_IDS.map((id) => ({ locale: 'es', slug: TOOL_SLUGS[id].es }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/herramientas/[slug]'>) {
  const { locale, slug } = await params;
  const id = hasLocale(locale) ? toolBySlug(locale, slug) : null;
  return id && hasLocale(locale) ? toolMetadata(locale, id) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/herramientas/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'es') notFound();
  const id = toolBySlug(locale, slug);
  if (!id) notFound();
  return <ToolPage locale={locale} id={id} />;
}
