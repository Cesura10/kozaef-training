import { notFound } from 'next/navigation';
import { CATEGORIES, CATEGORY_IDS, categoryBySlug } from '@/content/taxonomy';
import { TopicPage, topicMetadata } from '@/components/site/learn-pages';

// Página de categoría: /es/aprende/<categoria>
export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORY_IDS.map((id) => ({ locale: 'es', categoria: CATEGORIES[id].slug.es }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/aprende/[categoria]'>) {
  const id = categoryBySlug('es', (await params).categoria);
  return id ? topicMetadata('es', { kind: 'category', id }) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/aprende/[categoria]'>) {
  const { locale, categoria } = await params;
  if (locale !== 'es') notFound();
  const id = categoryBySlug('es', categoria);
  if (!id) notFound();
  return <TopicPage locale="es" topic={{ kind: 'category', id }} />;
}
