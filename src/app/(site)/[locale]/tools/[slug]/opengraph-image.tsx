import { TOOL_CONTENT, TOOL_IDS, TOOL_SLUGS, toolBySlug } from '@/content/tools';
import { OG_SIZE, ogCard } from '@/lib/og-card';

// Imagen al compartir cada calculadora (generada en el build). Sin ella, WhatsApp/Instagram no muestran nada.
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Kozaef Training';

export function generateStaticParams() {
  return TOOL_IDS.map((id) => ({ locale: 'en', slug: TOOL_SLUGS[id].en }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = toolBySlug('en', slug) ?? TOOL_IDS[0];
  return ogCard({ eyebrow: 'Free calculator', title: TOOL_CONTENT.en[id].h1, accent: 'No sign-up.' });
}
