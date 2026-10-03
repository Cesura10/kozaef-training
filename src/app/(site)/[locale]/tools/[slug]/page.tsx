import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { TOOL_IDS, TOOL_SLUGS, toolBySlug } from '@/content/tools';
import { ToolPage, toolMetadata } from '@/components/site/tool-page';

// /en/tools/<slug>: páginas estáticas de herramientas (solo idioma "en").
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_IDS.map((id) => ({ locale: 'en', slug: TOOL_SLUGS[id].en }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/tools/[slug]'>) {
  const { locale, slug } = await params;
  const id = hasLocale(locale) ? toolBySlug(locale, slug) : null;
  return id && hasLocale(locale) ? toolMetadata(locale, id) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/tools/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'en') notFound();
  const id = toolBySlug(locale, slug);
  if (!id) notFound();
  return <ToolPage locale={locale} id={id} />;
}
