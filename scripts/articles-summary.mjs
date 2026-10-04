// Resumen (markdown) de los artículos añadidos o cambiados respecto a la rama base.
// Uso: node scripts/articles-summary.mjs origin/main  -> imprime "markdown<<EOF ... EOF" para GITHUB_OUTPUT
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';

const base = process.argv[2] ?? 'origin/main';
const files = execSync(`git diff --name-only ${base}...HEAD -- content/articulos`, { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.endsWith('.md') && existsSync(f));

const rows = files.map((f) => {
  const { data, content } = matter(readFileSync(f, 'utf8'));
  const words = content.split(/\s+/).filter(Boolean).length;
  const flag = data.borrador ? ' ⚠️ borrador: no se publicará' : '';
  return `| ${data.titulo ?? f} | ${data.categoria ?? '-'} | ${(data.perfiles ?? []).join(', ')} | ${(data.fuentes ?? []).length} | ${words} |${flag}`;
});

const md = rows.length
  ? ['| Título | Categoría | Perfiles | Fuentes | Palabras |', '|---|---|---|---|---|', ...rows].join('\n')
  : '';
console.log(`markdown<<EOF\n${md}\nEOF`);
