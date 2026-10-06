// PDF de lectura de un artículo (para que Manu lo revise antes de publicarlo).
// Uso: node scripts/article-pdf.mjs <ruta-del-.md> <salida.pdf>
// Usa el Chromium de Playwright (CHROMIUM_PATH para indicar otro, p. ej. /opt/pw-browsers/chromium).
import { readFileSync } from 'node:fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { chromium } from '@playwright/test';
import { normalizeDates, parseFrontMatter } from './content-utils.mjs';

const [input, output] = process.argv.slice(2);
const METODO = JSON.parse(readFileSync(new URL('../src/content/bloque-metodo.json', import.meta.url), 'utf8')).es;
if (!input || !output) throw new Error('Uso: node scripts/article-pdf.mjs <articulo.md> <salida.pdf>');

const { data, content } = parseFrontMatter(readFileSync(input, 'utf8'));
normalizeDates(data);
const md = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);
const html = (s) => String(md.processSync(s));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const faq = (data.faq ?? [])
  .map((q) => `<div class="faq"><p class="q">${esc(q.pregunta)}</p><p>${esc(q.respuesta)}</p></div>`)
  .join('');
const fuentes = (data.fuentes ?? []).map((f) => `<li><a href="${esc(f.url)}">${esc(f.titulo)}</a></li>`).join('');

const page = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 20mm 18mm; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: Inter, "Helvetica Neue", Arial, sans-serif; font-size: 11.5pt; line-height: 1.6; color: #141416; }
  .brand { font-weight: 800; letter-spacing: .16em; font-size: 9pt; color: #b8891f; }
  .meta { color: #6b675f; font-size: 9.5pt; margin-top: 2mm; }
  h1 { font-size: 23pt; line-height: 1.15; margin: 4mm 0 3mm; }
  h2 { font-size: 15pt; margin: 8mm 0 2mm; padding-bottom: 1.5mm; border-bottom: 2px solid #141416; }
  h3 { font-size: 12pt; margin: 5mm 0 1.5mm; }
  h2, h3 { break-after: avoid; }
  .rapida { background: #f6eedb; border-left: 3px solid #b8891f; border-radius: 2mm; padding: 4mm 5mm; margin: 4mm 0 2mm; }
  .rapida b { display: block; font-size: 8.5pt; letter-spacing: .1em; text-transform: uppercase; color: #b8891f; margin-bottom: 1mm; }
  table { width: 100%; border-collapse: collapse; margin: 3mm 0; font-size: 9.5pt; break-inside: avoid; }
  th, td { border: 1px solid #e3ded3; padding: 1.8mm 2.2mm; text-align: left; vertical-align: top; }
  th { background: #0a0a0b; color: #f2f0eb; }
  a { color: #8a6514; }
  .faq { break-inside: avoid; margin-bottom: 3mm; } .faq .q { font-weight: 700; margin-bottom: 0; }
  .fuentes { font-size: 9.5pt; }
  .nota { margin: 2mm 0 0; font-size: 9pt; color: #6b675f; }
  .metodo { break-inside: avoid; margin-top: 8mm; border: 1px solid #e3ded3; border-left: 3px solid #b8891f; border-radius: 2mm; padding: 5mm 6mm; background: #fbf7ee; }
  .metodo .eb { font-size: 8.5pt; letter-spacing: .1em; text-transform: uppercase; color: #b8891f; margin: 0; }
  .metodo h2 { border: 0; margin: 1mm 0 2mm; padding: 0; }
  .metodo .btn { display: inline-block; border: 1px solid #b8891f; border-radius: 99px; padding: 1.5mm 4mm; margin: 1mm 2mm 0 0; font-size: 9.5pt; }
</style></head><body>
  <div class="brand">KOZAEF TRAINING · VISTA PREVIA PARA REVISAR</div>
  <h1>${esc(data.titulo)}</h1>
  <div class="meta">Categoría: ${esc(data.categoria)} · Perfiles: ${esc((data.perfiles ?? []).join(', '))} · Nivel: ${esc(data.nivel)} · ${esc(data.fechaPublicacion)}</div>
  <div class="rapida"><b>Respuesta rápida</b>${esc(data.respuestaRapida)}</div>
  <p class="nota">En la web, además, se añaden solos: el aviso de la herramienta relacionada, el producto relacionado y el bloque de coaching.</p>
  ${html(content)}
  <div class="metodo"><p class="eb">${esc(METODO.eyebrow)} · bloque fijo de todos los artículos</p><h2>${esc(METODO.title)}</h2>
    <p>${esc(METODO.intro)}</p><p><b>${esc(METODO.listTitle)}</b></p><ul>${METODO.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <p><b>${esc(METODO.closing)}</b></p><span class="btn">${esc(METODO.apply)}</span><span class="btn">${esc(METODO.whatsapp)}</span></div>
  ${faq ? `<h2>Preguntas frecuentes</h2>${faq}` : ''}
  ${fuentes ? `<h2>Fuentes</h2><ol class="fuentes">${fuentes}</ol>` : ''}
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const tab = await browser.newPage();
await tab.setContent(page, { waitUntil: 'load' });
await tab.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`PDF: ${output}`);
