import { SITE_URL } from '@/i18n/config';
import { indexablePages } from '@/lib/indexable';

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
  const body = `# Kozaef Training

> Entrenamiento personal online: calculadoras gratis (calorías, proteína, grasa corporal), artículos basados en evidencia y coaching 1:1. Contenido en español (y parte en inglés en ${SITE_URL}/en).

${sections}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
