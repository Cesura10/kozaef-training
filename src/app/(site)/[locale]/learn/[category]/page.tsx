import { notFound } from 'next/navigation';
import { CATEGORIES, CATEGORY_IDS, categoryBySlug } from '@/content/taxonomy';
import { TopicPage, topicMetadata } from '@/components/site/learn-pages';

// Página de categoría: /en/learn/<categoria>
export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORY_IDS.map((id) => ({ locale: 'en', category: CATEGORIES[id].slug.en }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/learn/[category]'>) {
  const id = categoryBySlug('en', (await params).category);
  return id ? topicMetadata('en', { kind: 'category', id }) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/learn/[category]'>) {
  const { locale, category } = await params;
  if (locale !== 'en') notFound();
  const id = categoryBySlug('en', category);
  if (!id) notFound();
  return <TopicPage locale="en" topic={{ kind: 'category', id }} />;
}
