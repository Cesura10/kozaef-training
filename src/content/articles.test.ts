import { describe, expect, it } from 'vitest';
import raw from './generated/articles.json';
import { articlesFor } from './articles';

/**
 * Validación de artículos (la usa GitHub en cada propuesta del bot y `npm run validate:content`).
 * Importar ./articles ya valida los datos con zod; aquí van las reglas editoriales extra.
 */
const REQUIRED: Record<'es' | 'en', string[]> = {
  es: ['Qué dice la evidencia', 'Cómo lo aplico yo', 'Errores comunes'],
  en: ['What the evidence says', 'How I apply it', 'Common mistakes'],
};

const all = [...articlesFor('es'), ...articlesFor('en')];

describe('artículos', () => {
  it('los datos de todos los artículos son válidos (si no, falla al importar)', () => {
    expect(all.length).toBe((raw as unknown[]).length);
  });

  it.each(all.map((a) => [`${a.locale}/${a.slug}`, a] as const))('%s: estructura editorial', (_, a) => {
    expect(a.slug, 'el nombre del archivo debe ser minúsculas-con-guiones').toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const h of REQUIRED[a.locale]) expect(a.headings, `falta la sección "## ${h}"`).toContain(h);
    for (const f of a.fuentes) expect(f.url, 'las fuentes deben ser https').toMatch(/^https:\/\//);
    expect(a.fechaRevision >= a.fechaPublicacion, 'fechaRevision no puede ser anterior a fechaPublicacion').toBe(true);
  });

  it('no hay dos artículos con la misma URL', () => {
    const urls = all.map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
