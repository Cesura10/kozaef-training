import { notFound } from 'next/navigation';
import { CATEGORIES, categoryBySlug } from '@/content/taxonomy';
import { articleBy, articlesFor } from '@/content/articles';
import { ArticlePage, articleMetadata } from '@/components/site/article-page';

// Artículo: /en/learn/<categoria>/<slug>
export const dynamicParams = false;
export function generateStaticParams() {
  return articlesFor('en').map((a) => ({ locale: 'en', category: CATEGORIES[a.categoria].slug.en, slug: a.slug }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/learn/[category]/[slug]'>) {
  const p = await params;
  const id = categoryBySlug('en', p.category);
  const a = id ? articleBy('en', id, p.slug) : null;
  return a ? articleMetadata(a) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/learn/[category]/[slug]'>) {
  const p = await params;
  if (p.locale !== 'en') notFound();
  const id = categoryBySlug('en', p.category);
  const a = id ? articleBy('en', id, p.slug) : null;
  if (!a) notFound();
  return <ArticlePage article={a} />;
}
