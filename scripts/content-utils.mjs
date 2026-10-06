// Utilidades puras de scripts/build-content.mjs (con tests en content-utils.test.ts).
import { parse } from 'yaml';

/**
 * Separa la cabecera YAML (entre `---`) del cuerpo de un artículo. Sustituye a gray-matter, que
 * arrastraba js-yaml 3 y dependencias con avisos de seguridad sin arreglo.
 * @param {string} raw
 * @returns {{ data: Record<string, unknown>, content: string }}
 */
export function parseFrontMatter(raw) {
  const m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw);
  if (!m) return { data: {}, content: raw };
  const data = parse(m[1]) ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error('La cabecera YAML debe ser una lista de campos');
  return { data, content: raw.slice(m[0].length) };
}

const DATE_FIELDS = ['fechaPublicacion', 'fechaRevision'];

/**
 * YAML convierte una fecha sin comillas (`fechaPublicacion: 2026-10-04`) en un objeto Date,
 * que al pasar a JSON queda como "2026-10-04T00:00:00.000Z" y la validación la rechazaba con
 * un mensaje confuso ("fecha en formato AAAA-MM-DD") aunque el autor la escribiera bien.
 * Se devuelve a AAAA-MM-DD. Lo demás se deja igual.
 * @param {Record<string, unknown>} data
 */
export function normalizeDates(data) {
  for (const key of DATE_FIELDS) {
    const v = data[key];
    if (v instanceof Date && !Number.isNaN(v.getTime())) data[key] = v.toISOString().slice(0, 10);
  }
  return data;
}
