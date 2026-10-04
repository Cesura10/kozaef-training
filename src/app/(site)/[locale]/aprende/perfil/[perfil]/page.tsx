import { notFound } from 'next/navigation';
import { PROFILES, PROFILE_IDS, profileBySlug } from '@/content/taxonomy';
import { TopicPage, topicMetadata } from '@/components/site/learn-pages';

// Página de perfil (real e indexable, no un filtro): /es/aprende/perfil/<perfil>
export const dynamicParams = false;
export function generateStaticParams() {
  return PROFILE_IDS.map((id) => ({ locale: 'es', perfil: PROFILES[id].slug.es }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/aprende/perfil/[perfil]'>) {
  const id = profileBySlug('es', (await params).perfil);
  return id ? topicMetadata('es', { kind: 'profile', id }) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/aprende/perfil/[perfil]'>) {
  const { locale, perfil } = await params;
  if (locale !== 'es') notFound();
  const id = profileBySlug('es', perfil);
  if (!id) notFound();
  return <TopicPage locale="es" topic={{ kind: 'profile', id }} />;
}
