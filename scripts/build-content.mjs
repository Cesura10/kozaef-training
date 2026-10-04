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

const articles = [];
for (const locale of ['es', 'en']) {
  const dir = join(SRC, locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    if (data.borrador === true && !withDrafts) continue;

    // El aviso de herramienta va "a mitad del texto": tras la primera sección H2.
    const parts = content.split(/\n(?=## )/);
    const cut = parts.length > 2 ? 2 : parts.length;
    const before = parts.slice(0, cut).join('\n');
    const after = parts.slice(cut).join('\n');

    articles.push({
      locale,
      slug: basename(file, '.md'),
      data,
      html: [toHtml(before), after ? toHtml(after) : ''],
      headings: [...content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
      words: content.split(/\s+/).filter(Boolean).length,
    });
  }
}

mkdirSync(join(ROOT, 'src', 'content', 'generated'), { recursive: true });
writeFileSync(OUT, JSON.stringify(articles, null, 0));
console.log(`Contenido: ${articles.length} artículo(s)${withDrafts ? ' (con borradores)' : ''} -> src/content/generated/articles.json`);
