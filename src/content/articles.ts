import { z } from 'zod';
import type { Locale } from '@/i18n/config';
import raw from './generated/articles.json';
import { CATEGORIES, CATEGORY_IDS, LEVEL_IDS, PROFILES, PROFILE_IDS, type CategoryId, type ProfileId, type LevelId } from './taxonomy';
import { TOOL_IDS, type ToolId } from './tools';
import { PRODUCTS } from './products';
import { sectionPath } from './routes';
import { isIsoDate } from './dates';

/**
 * Artículos de /aprende. Fuente: content/articulos/{es,en}/<slug>.md (ver docs/contenido.md).
 * Se validan AL COMPILAR: un dato que falte o una categoría que no exista rompe el build,
 * así nunca se publica un artículo incompleto.
 */
const date = z.string().refine(isIsoDate, 'fecha real en formato AAAA-MM-DD');

const Frontmatter = z.object({
  titulo: z.string().min(10).max(110),
  descripcion: z.string().min(50).max(170),
  /** Respuesta directa a la pregunta del título (2-3 líneas). Se muestra arriba del todo. */
  respuestaRapida: z.string().min(40).max(400),
  categoria: z.enum(CATEGORY_IDS as [CategoryId, ...CategoryId[]]),
  perfiles: z.array(z.enum(PROFILE_IDS as [ProfileId, ...ProfileId[]])).min(1),
  nivel: z.enum(LEVEL_IDS as [LevelId, ...LevelId[]]),
  fechaPublicacion: date,
  fechaRevision: date,
  herramientaRelacionada: z.enum(TOOL_IDS as unknown as [ToolId, ...ToolId[]]).nullable().default(null),
  productoRelacionado: z
    .string()
    .nullable()
    .default(null)
    .refine((id) => id === null || PRODUCTS.some((p) => p.id === id), 'productoRelacionado no existe en products.ts'),
  fuentes: z.array(z.object({ titulo: z.string().min(3), url: z.string().url() })).min(1, 'al menos una fuente'),
  faq: z.array(z.object({ pregunta: z.string().min(5), respuesta: z.string().min(10) })).default([]),
  borrador: z.boolean().default(false),
});

export type Article = z.infer<typeof Frontmatter> & {
  locale: Locale;
  slug: string;
  html: [string, string];
  headings: string[];
  readingMinutes: number;
  url: string;
  /** Candidato del bot leído de docs/privado (solo en desarrollo); p. ej. 'simulacro-2026-11'. */
  candidato: string | null;
};

type RawArticle = { locale: Locale; slug: string; candidate?: string | null; data: unknown; html: [string, string]; headings: string[]; words: number };

const LEVEL_ORDER: Record<LevelId, number> = { basico: 0, intermedio: 1, avanzado: 2 };

function load(): Article[] {
  return (raw as RawArticle[]).map((a) => {
    const parsed = Frontmatter.safeParse(a.data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
      const where = a.candidate ? `candidato del bot (${a.candidate}) ${a.slug}.md` : `content/articulos/${a.locale}/${a.slug}.md`;
      throw new Error(`Artículo ${where} no válido:\n${issues}`);
    }
    const f = parsed.data;
    return {
      ...f,
      locale: a.locale,
      slug: a.slug,
      html: a.html,
      headings: a.headings,
      readingMinutes: Math.max(1, Math.round(a.words / 200)),
      url: articlePath(a.locale, f.categoria, a.slug),
      candidato: a.candidate ?? null,
    };
  });
}

export function articlePath(locale: Locale, categoria: CategoryId, slug: string) {
  return sectionPath('learn', locale, CATEGORIES[categoria].slug[locale], slug);
}
export const categoryPath = (locale: Locale, id: CategoryId) => sectionPath('learn', locale, CATEGORIES[id].slug[locale]);
export const profileSegment: Record<Locale, string> = { es: 'perfil', en: 'profile' };
export const profilePath = (locale: Locale, id: ProfileId) =>
  sectionPath('learn', locale, profileSegment[locale], PROFILES[id].slug[locale]);

const ALL = load();

/** Artículos publicables de un idioma, del más reciente al más antiguo. */
export const articlesFor = (locale: Locale) =>
  ALL.filter((a) => a.locale === locale).sort((x, y) => y.fechaPublicacion.localeCompare(x.fechaPublicacion));

export const articleBy = (locale: Locale, categoria: CategoryId, slug: string) =>
  articlesFor(locale).find((a) => a.categoria === categoria && a.slug === slug) ?? null;

/** Ordenados por nivel (básico primero) y, dentro, por fecha. */
export const byLevel = (list: Article[]) =>
  [...list].sort((a, b) => LEVEL_ORDER[a.nivel] - LEVEL_ORDER[b.nivel] || b.fechaPublicacion.localeCompare(a.fechaPublicacion));

export const inCategory = (locale: Locale, id: CategoryId) => byLevel(articlesFor(locale).filter((a) => a.categoria === id));
export const forProfile = (locale: Locale, id: ProfileId) => byLevel(articlesFor(locale).filter((a) => a.perfiles.includes(id)));

/** 3 relacionados: misma categoría y perfil, luego misma categoría, luego mismo perfil. */
export function related(a: Article, n = 3): Article[] {
  const others = articlesFor(a.locale).filter((x) => x.slug !== a.slug);
  const shares = (x: Article) => x.perfiles.some((p) => a.perfiles.includes(p));
  const ranked = [
    ...others.filter((x) => x.categoria === a.categoria && shares(x)),
    ...others.filter((x) => x.categoria === a.categoria && !shares(x)),
    ...others.filter((x) => x.categoria !== a.categoria && shares(x)),
  ];
  return [...new Set(ranked)].slice(0, n);
}

/** Índice del buscador estático (solo datos públicos, sin el cuerpo completo). */
export const searchIndex = (locale: Locale) =>
  articlesFor(locale).map((a) => ({
    url: a.url,
    titulo: a.titulo,
    descripcion: a.descripcion,
    categoria: a.categoria,
    perfiles: a.perfiles,
    nivel: a.nivel,
    texto: `${a.titulo} ${a.descripcion} ${a.headings.join(' ')}`,
  }));

export type SearchEntry = ReturnType<typeof searchIndex>[number];
