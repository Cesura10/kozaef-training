import { notFound } from 'next/navigation';
import { DiagnosisPage, diagnosisMetadata } from '@/components/site/diagnosis-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export function generateMetadata() {
  return diagnosisMetadata('en');
}
export default async function Page({ params }: PageProps<'/[locale]/diagnosis'>) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <DiagnosisPage locale="en" />;
}
