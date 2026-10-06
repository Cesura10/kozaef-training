// Resumen (markdown) de los artículos añadidos o cambiados respecto a la rama base.
// Uso: node scripts/articles-summary.mjs origin/main  -> imprime "markdown<<EOF ... EOF" para GITHUB_OUTPUT
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { parseFrontMatter } from './content-utils.mjs';

const base = process.argv[2] ?? 'origin/main';
// Solo nombres de rama válidos; argumentos como lista (sin pasar por la terminal).
if (!/^[\w./-]{1,100}$/.test(base)) throw new Error(`Rama base no válida: ${base}`);
const files = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`, '--', 'content/articulos'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.endsWith('.md') && existsSync(f));

const rows = files.map((f) => {
  const { data, content } = parseFrontMatter(readFileSync(f, 'utf8'));
  const words = content.split(/\s+/).filter(Boolean).length;
  const flag = data.borrador ? ' ⚠️ borrador: no se publicará' : '';
  return `| ${data.titulo ?? f} | ${data.categoria ?? '-'} | ${(data.perfiles ?? []).join(', ')} | ${(data.fuentes ?? []).length} | ${words} |${flag}`;
});

const md = rows.length
  ? ['| Título | Categoría | Perfiles | Fuentes | Palabras |', '|---|---|---|---|---|', ...rows].join('\n')
  : '';
console.log(`markdown<<EOF\n${md}\nEOF`);
