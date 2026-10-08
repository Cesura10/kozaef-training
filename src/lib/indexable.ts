import type { Locale } from '@/i18n/config';
import { LOCALES } from '@/i18n/config';
import { sectionPath } from '@/content/routes';
import { TOOL_CONTENT, TOOL_IDS, toolPath } from '@/content/tools';
import { visibleProducts } from '@/content/products';
import { AUTHOR } from '@/content/author';
import { DIAGNOSIS_APPROVED } from '@/content/diagnosis';
import { CATEGORY_IDS, PROFILE_IDS } from '@/content/taxonomy';
import { articlesFor, categoryPath, forProfile, inCategory, profilePath } from '@/content/articles';
import { LEGAL_SLUGS } from './legal';

/**
 * Fuente ÚNICA de páginas indexables (sitemap, llms.txt, IndexNow).
 * Fuera a propósito: gracias, envío de vídeos, borradores y páginas incompletas o vacías.
 */
export type IndexablePage = {
  path: string;
  /** Misma página en otros idiomas (hreflang). */
  alternates?: Partial<Record<Locale, string>>;
  lastmod?: string;
  priority: number;
  title?: string;
  group: 'home' | 'tools' | 'learn' | 'article' | 'programs' | 'coaching' | 'about' | 'legal';
};

const each = (fn: (l: Locale) => string) => Object.fromEntries(LOCALES.map((l) => [l, fn(l)])) as Record<Locale, string>;
const latest = (dates: string[]) => (dates.length ? dates.sort().at(-1) : undefined);

export function indexablePages(): IndexablePage[] {
  const out: IndexablePage[] = [];
  for (const l of LOCALES) {
    out.push({ path: `/${l}`, alternates: each((x) => `/${x}`), priority: 1, group: 'home' });
    out.push({ path: sectionPath('tools', l), alternates: each((x) => sectionPath('tools', x)), priority: 0.9, group: 'tools' });
    for (const id of TOOL_IDS) out.push({ path: toolPath(id, l), alternates: each((x) => toolPath(id, x)), priority: 0.9, group: 'tools', title: TOOL_CONTENT[l][id].h1 });
    out.push({ path: sectionPath('coaching', l), alternates: each((x) => sectionPath('coaching', x)), priority: 0.8, group: 'coaching' });
    out.push({ path: sectionPath('apply', l), alternates: each((x) => sectionPath('apply', x)), priority: 0.7, group: 'coaching' });
    out.push({ path: sectionPath('programs', l), alternates: each((x) => sectionPath('programs', x)), priority: 0.8, group: 'programs' });
    out.push({ path: sectionPath('recommendations', l), alternates: each((x) => sectionPath('recommendations', x)), priority: 0.6, group: 'programs' });
    for (const p of visibleProducts())
      out.push({ path: sectionPath('programs', l, p.slug[l]), alternates: each((x) => sectionPath('programs', x, p.slug[x])), priority: 0.8, group: 'programs', title: p.nombre[l] });
    if (AUTHOR.name && AUTHOR.qualification)
      out.push({ path: sectionPath('about', l), alternates: each((x) => sectionPath('about', x)), priority: 0.6, group: 'about' });
    if (DIAGNOSIS_APPROVED)
      out.push({ path: sectionPath('diagnosis', l), alternates: each((x) => sectionPath('diagnosis', x)), priority: 0.8, group: 'tools' });

    const arts = articlesFor(l).filter((a) => !a.borrador);
    if (arts.length) {
      out.push({ path: sectionPath('learn', l), lastmod: latest(arts.map((a) => a.fechaRevision)), priority: 0.8, group: 'learn' });
      for (const id of CATEGORY_IDS) {
        const list = inCategory(l, id).filter((a) => !a.borrador);
        if (list.length) out.push({ path: categoryPath(l, id), lastmod: latest(list.map((a) => a.fechaRevision)), priority: 0.7, group: 'learn' });
      }
      for (const id of PROFILE_IDS) {
        const list = forProfile(l, id).filter((a) => !a.borrador);
        if (list.length) out.push({ path: profilePath(l, id), lastmod: latest(list.map((a) => a.fechaRevision)), priority: 0.6, group: 'learn' });
      }
      for (const a of arts) out.push({ path: a.url, lastmod: a.fechaRevision, priority: 0.7, group: 'article', title: a.titulo });
    }
    for (const slug of LEGAL_SLUGS) out.push({ path: `/${l}/legal/${slug}`, alternates: each((x) => `/${x}/legal/${slug}`), priority: 0.2, group: 'legal' });
  }
  return out;
}
