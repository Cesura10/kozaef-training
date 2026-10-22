import { TOOL_CONTENT, TOOL_SLUGS, VISIBLE_TOOL_IDS, toolBySlug } from '@/content/tools';
import { OG_SIZE, ogCard } from '@/lib/og-card';

// Imagen al compartir cada calculadora (generada en el build). Sin ella, WhatsApp/Instagram no muestran nada.
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Kozaef Training';

export function generateStaticParams() {
  return VISIBLE_TOOL_IDS.map((id) => ({ locale: 'es', slug: TOOL_SLUGS[id].es }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = toolBySlug('es', slug) ?? VISIBLE_TOOL_IDS[0];
  return ogCard({ eyebrow: 'Calculadora gratis', title: TOOL_CONTENT.es[id].h1, accent: 'Sin registro.' });
}
