import { notFound } from 'next/navigation';
import { CATEGORIES, categoryBySlug } from '@/content/taxonomy';
import { articleBy, articlesFor } from '@/content/articles';
import { ArticlePage, articleMetadata } from '@/components/site/article-page';

// Artículo: /es/aprende/<categoria>/<slug>
export const dynamicParams = false;
export function generateStaticParams() {
  return articlesFor('es').map((a) => ({ locale: 'es', categoria: CATEGORIES[a.categoria].slug.es, slug: a.slug }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/aprende/[categoria]/[slug]'>) {
  const p = await params;
  const id = categoryBySlug('es', p.categoria);
  const a = id ? articleBy('es', id, p.slug) : null;
  return a ? articleMetadata(a) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/aprende/[categoria]/[slug]'>) {
  const p = await params;
  if (p.locale !== 'es') notFound();
  const id = categoryBySlug('es', p.categoria);
  const a = id ? articleBy('es', id, p.slug) : null;
  if (!a) notFound();
  return <ArticlePage article={a} />;
}
