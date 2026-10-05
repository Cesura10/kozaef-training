/**
 * Clasificación de propuestas del bot (lógica pura, con tests). Sin dependencias de red.
 */
export type ValidationState = 'passed' | 'failed' | 'running' | 'unknown';

export type Proposal = {
  number: number;
  url: string;
  slug: string;
  title: string;
  kind: 'articulo' | 'novedad';
  createdAt: string;
  status: 'abierta' | 'publicada' | 'descartada';
  closedAt: string | null;
  validation: ValidationState;
  preview: string | null;
  categoria: string | null;
  perfiles: string[];
  nivel: string | null;
  fuentes: number;
};

type Input = {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  slug: string;
  frontmatter: Record<string, unknown> | null;
  validation: ValidationState;
  preview: string | null;
};

const str = (v: unknown) => (typeof v === 'string' ? v : null);

export function classifyProposal(p: Input): Proposal {
  const fm = p.frontmatter ?? {};
  const kind = /^novedad:/i.test(p.title) ? 'novedad' : 'articulo';
  const title = str(fm.titulo) ?? p.title.replace(/^(art[ií]culo|novedad):\s*/i, '');
  return {
    number: p.number,
    url: p.html_url,
    slug: p.slug,
    title,
    kind,
    createdAt: p.created_at,
    status: p.merged_at ? 'publicada' : p.closed_at ? 'descartada' : 'abierta',
    closedAt: p.merged_at ?? p.closed_at,
    validation: p.validation,
    preview: p.preview,
    categoria: str(fm.categoria),
    perfiles: Array.isArray(fm.perfiles) ? fm.perfiles.filter((x): x is string => typeof x === 'string') : [],
    nivel: str(fm.nivel),
    fuentes: Array.isArray(fm.fuentes) ? fm.fuentes.length : 0,
  };
}
