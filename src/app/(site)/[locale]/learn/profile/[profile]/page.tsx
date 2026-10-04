import { notFound } from 'next/navigation';
import { PROFILES, PROFILE_IDS, profileBySlug } from '@/content/taxonomy';
import { TopicPage, topicMetadata } from '@/components/site/learn-pages';

// Página de perfil (real e indexable, no un filtro): /en/learn/profile/<perfil>
export const dynamicParams = false;
export function generateStaticParams() {
  return PROFILE_IDS.map((id) => ({ locale: 'en', profile: PROFILES[id].slug.en }));
}
export async function generateMetadata({ params }: PageProps<'/[locale]/learn/profile/[profile]'>) {
  const id = profileBySlug('en', (await params).profile);
  return id ? topicMetadata('en', { kind: 'profile', id }) : {};
}
export default async function Page({ params }: PageProps<'/[locale]/learn/profile/[profile]'>) {
  const { locale, profile } = await params;
  if (locale !== 'en') notFound();
  const id = profileBySlug('en', profile);
  if (!id) notFound();
  return <TopicPage locale="en" topic={{ kind: 'profile', id }} />;
}
