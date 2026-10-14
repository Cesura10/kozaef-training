import { SITE_URL } from '@/i18n/config';
import { indexablePages } from '@/lib/indexable';
import { isBuyable, visibleProducts } from '@/content/products';
import { PACK_ALL_DISCOUNT, PACK_DISCOUNT } from '@/content/pack';

// /llms.txt (brief IA §A6, prioridad baja): resumen y mapa de la web para asistentes.
export const dynamic = 'force-static';

const GROUPS: Record<string, string> = {
  tools: 'Herramientas gratis',
  article: 'Artículos',
  learn: 'Biblioteca por tema',
  programs: 'Programas',
  coaching: 'Coaching 1:1',
  about: 'Sobre el autor',
};

export function GET() {
  const pages = indexablePages().filter((p) => p.path.startsWith('/es') && p.group in GROUPS);
  const sections = Object.entries(GROUPS)
    .map(([g, title]) => {
      const items = pages.filter((p) => p.group === g);
      return items.length ? `## ${title}\n\n${items.map((p) => `- [${p.title ?? p.path}](${SITE_URL}${p.path})`).join('\n')}` : '';
    })
    .filter(Boolean)
    .join('\n\n');
  // Precios reales del catálogo (no se escriben a mano para que no se queden viejos).
  const prices = visibleProducts()
    .filter((p) => p.tipo === 'infoproducto' && isBuyable(p) && p.precio)
    .map((p) => p.precio as number);
  const guides = prices.length
    ? `- Guías en PDF: de ${Math.min(...prices)} a ${Math.max(...prices)} € cada una, con pack de 3 (${PACK_DISCOUNT * 100} % de descuento) y pack completo (${PACK_ALL_DISCOUNT * 100} %).\n`
    : '';
  const body = `# Kozaef Training

> Kozaef Training (${SITE_URL}) es un servicio de entrenador personal online en español: coaching 1:1 de entrenamiento y nutrición con revisión semanal, guías de entrenamiento en PDF y calculadoras gratis (calorías, proteína, grasa corporal).

## En pocas palabras

- Qué es: entrenador personal online (coaching 1:1) y guías de entrenamiento descargables.
- Para quién: adultos que quieren perder grasa, ganar músculo o empezar a entrenar fuerza; incluye contenido específico para mujeres en la menopausia, entrenar en casa y entrenar con molestias de espalda, rodilla u hombro.
- Cómo funciona el coaching: solicitud en ${SITE_URL}/es/solicitar, videollamada inicial y plan de entrenamiento y nutrición ajustado cada semana. Plazas limitadas.
${guides}- Dónde: 100 % online, para cualquier lugar; en español.
- Método: basado en evidencia científica, con las fuentes citadas en cada guía y artículo.
- Contacto: contacto@kozaeftraining.com · Instagram https://www.instagram.com/manurodrigues.fit/

${sections}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
