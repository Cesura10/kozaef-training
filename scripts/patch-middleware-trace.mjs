// Tras `next build` y antes de empaquetar para Cloudflare.
// Sentry instala @opentelemetry/api; Next lo carga desde el proxy, pero su traza solo incluye la
// versión CommonJS (build/src) y el empaquetador de OpenNext resuelve la versión ESM (build/esm).
// Este script añade build/esm a la traza del proxy para que se copie.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, cpSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const nft = join(root, '.next/server/middleware.js.nft.json');
const pkg = join(root, 'node_modules/@opentelemetry/api');
if (!existsSync(pkg)) process.exit(0);

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const extra = ['build/esm', 'build/esnext']
  .map((d) => join(pkg, d))
  .filter(existsSync)
  .flatMap(walk)
  .map((f) => relative(join(root, '.next/server'), f));

// Lectura directa (sin comprobar antes si existe: evita condiciones de carrera).
let data;
try {
  data = JSON.parse(readFileSync(nft, 'utf8'));
} catch {
  process.exit(0); // sin traza del proxy (p. ej. no hay proxy): nada que parchear
}
const before = data.files.length;
data.files = [...new Set([...data.files, ...extra])];
writeFileSync(nft, JSON.stringify(data));

// La salida standalone (la que empaqueta OpenNext) se genera durante `next build`: copiar también allí.
const standalonePkg = join(root, '.next/standalone/node_modules/@opentelemetry/api');
if (existsSync(join(root, '.next/standalone'))) cpSync(pkg, standalonePkg, { recursive: true });
console.log(`Traza del proxy: +${data.files.length - before} archivos de @opentelemetry/api (ESM)`);
