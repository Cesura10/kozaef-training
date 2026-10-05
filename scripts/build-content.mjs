// Convierte los artículos Markdown de content/articulos/{es,en}/*.md en HTML estático
// (src/content/generated/articles.json). La validación de los datos la hace
// src/content/articles.ts con zod: si algo está mal, el build de Next falla.
//
// Uso: node scripts/build-content.mjs          -> producción (SIN borradores)
//      node scripts/build-content.mjs --drafts -> desarrollo (con borradores)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'content', 'articulos');
const OUT = join(ROOT, 'src', 'content', 'generated', 'articles.json');
const withDrafts = process.argv.includes('--drafts');

const md = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeStringify);
const toHtml = (text) =>
  String(md.processSync(text))
    // Enlaces externos: nueva pestaña segura.
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

// Candidatos del bot (SOLO en desarrollo): carpetas privadas de simulacros y borradores.
// Nunca existen en producción ni en GitHub (docs/privado/ está fuera del repositorio público).
const PRIVADO = join(ROOT, 'docs', 'privado');
const candidateDirs = !withDrafts || !existsSync(PRIVADO)
  ? []
  : [
      ...readdirSync(PRIVADO)
        .filter((d) => d.startsWith('simulacro-'))
        .map((d) => ({ dir: join(PRIVADO, d, 'articulos'), label: d })),
      { dir: join(PRIVADO, 'radar', 'borradores'), label: 'borradores-del-bot' },
    ].filter((c) => existsSync(c.dir));

const sources = [
  ...['es', 'en'].map((locale) => ({ locale, dir: join(SRC, locale), candidate: null })),
  ...candidateDirs.map((c) => ({ locale: 'es', dir: c.dir, candidate: c.label })),
];

const articles = [];
const seen = new Set();
for (const { locale, dir, candidate } of sources) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const key = `${locale}/${basename(file, '.md')}`;
    if (candidate) {
      if (seen.has(key)) continue; // si ya existe en la web, manda la versión de la web
      data.borrador = true; // un candidato nunca es publicable desde aquí
    }
    seen.add(key);
    if (data.borrador === true && !withDrafts) continue;

    // El aviso de herramienta va "a mitad del texto": tras la primera sección H2.
    const parts = content.split(/\n(?=## )/);
    const cut = parts.length > 2 ? 2 : parts.length;
    const before = parts.slice(0, cut).join('\n');
    const after = parts.slice(cut).join('\n');

    articles.push({
      locale,
      slug: basename(file, '.md'),
      candidate,
      data,
      html: [toHtml(before), after ? toHtml(after) : ''],
      headings: [...content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
      words: content.split(/\s+/).filter(Boolean).length,
    });
  }
}

mkdirSync(join(ROOT, 'src', 'content', 'generated'), { recursive: true });
writeFileSync(OUT, JSON.stringify(articles, null, 0));
const nCand = articles.filter((a) => a.candidate).length;
console.log(`Contenido: ${articles.length} artículo(s)${withDrafts ? ` (con borradores${nCand ? `, ${nCand} candidato(s) del bot` : ''})` : ''} -> src/content/generated/articles.json`);

// Informes del bot (SOLO en desarrollo, desde docs/privado): para la página "Artículos" del panel.
const reports = [];
if (withDrafts && existsSync(PRIVADO)) {
  const reportDirs = [
    join(PRIVADO, 'radar', 'informes'),
    ...readdirSync(PRIVADO).filter((d) => d.startsWith('simulacro-')).map((d) => join(PRIVADO, d)),
  ].filter(existsSync);
  for (const dir of reportDirs) {
    for (const file of readdirSync(dir).filter((f) => /^(informe-)?\d{4}-\d{2}-\d{2}\.md$/.test(f))) {
      const text = readFileSync(join(dir, file), 'utf8');
      const title = (text.match(/^# (.+)$/m) ?? [, file])[1];
      reports.push({ id: `${basename(dir)}/${file}`, date: file.match(/\d{4}-\d{2}-\d{2}/)[0], title, html: toHtml(text) });
    }
  }
  reports.sort((a, b) => b.date.localeCompare(a.date));
}
writeFileSync(join(ROOT, 'src', 'content', 'generated', 'reports.json'), JSON.stringify(reports));
if (reports.length) console.log(`Informes del bot: ${reports.length}`);
