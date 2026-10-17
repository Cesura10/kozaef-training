import { OG_SIZE, ogCard } from '@/lib/og-card';
import { LOCALES } from '@/i18n/config';

// Imagen al compartir la web en WhatsApp, Instagram, X... Generada en el build (estática).
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Kozaef Training';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [a, b] = locale === 'en' ? ['Train with intent.', 'Progress with data.'] : ['Entrena con criterio.', 'Progresa con datos.'];
  return ogCard({ title: a, accent: b });
}
