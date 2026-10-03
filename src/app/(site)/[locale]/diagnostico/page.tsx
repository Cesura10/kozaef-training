import { notFound } from 'next/navigation';
import { DiagnosisPage, diagnosisMetadata } from '@/components/site/diagnosis-page';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export function generateMetadata() {
  return diagnosisMetadata('es');
}
export default async function Page({ params }: PageProps<'/[locale]/diagnostico'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return <DiagnosisPage locale="es" />;
}
