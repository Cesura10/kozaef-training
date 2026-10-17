import { describe, expect, it } from 'vitest';
import raw from './generated/articles.json';
import { articlesFor } from './articles';

/**
 * Validación de artículos (la usa GitHub en cada propuesta del bot y `npm run validate:content`).
 * Importar ./articles ya valida los datos con zod; aquí van las reglas editoriales extra.
 */
const REQUIRED: Record<'es' | 'en', string[]> = {
  es: ['Qué dice la evidencia', 'Errores comunes', '¿Quieres saber cómo lo hago yo?'],
  en: ['What the evidence says', 'Common mistakes', 'Want to know how I do it?'],
};

/**
 * Decisión de Manu (2026-10-14): el método propio NO se explica en los artículos (es su trabajo y
 * lo que vende). En su lugar, la sección final invita a agendar una llamada y a la guía.
 */
const FORBIDDEN_SECTIONS = ['Cómo lo aplico yo', 'How I apply it'];

const all = [...articlesFor('es'), ...articlesFor('en')];

/**
 * Huecos que nunca deben llegar a la web: un "PENDIENTE" o un "[tu dato]" a la vista queda fatal.
 * Las palabras en mayúsculas distinguen mayúsculas ("todo" en minúscula es una palabra normal).
 */
const PLACEHOLDERS = [
  /\b(PENDIENTE|TODO|TBD|XXX)\b/,
  /\[(tu|tus|your|pon|añade|añadir|completa|completar|dato|datos|nombre|enlace|link|experiencia|insertar|ejemplo)\b[^\]]*\]/i,
  /lorem ipsum/i,
];

describe('artículos', () => {
  it('los datos de todos los artículos son válidos (si no, falla al importar)', () => {
    expect(all.length).toBe((raw as unknown[]).length);
  });

  it.each(all.map((a) => [`${a.locale}/${a.slug}`, a] as const))('%s: estructura editorial', (_, a) => {
    expect(a.slug, 'el nombre del archivo debe ser minúsculas-con-guiones').toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const h of REQUIRED[a.locale]) expect(a.headings, `falta la sección "## ${h}"`).toContain(h);
    for (const h of FORBIDDEN_SECTIONS) expect(a.headings, `sección prohibida "## ${h}": no se explica el método propio`).not.toContain(h);
    for (const f of a.fuentes) expect(f.url, 'las fuentes deben ser https').toMatch(/^https:\/\//);
    expect(a.fechaRevision >= a.fechaPublicacion, 'fechaRevision no puede ser anterior a fechaPublicacion').toBe(true);
  });

  it('los artículos publicables no tienen huecos ni marcadores a la vista', () => {
    for (const a of all.filter((x) => !x.borrador)) {
      const visible = [
        a.titulo,
        a.descripcion,
        a.respuestaRapida,
        ...a.faq.flatMap((q) => [q.pregunta, q.respuesta]),
        ...a.fuentes.map((f) => f.titulo),
        ...a.html,
      ].join('\n');
      for (const re of PLACEHOLDERS) expect(visible, `${a.locale}/${a.slug}: hueco sin rellenar (${re})`).not.toMatch(re);
    }
  });

  /**
   * Ritmo de publicación (decisión de Manu, 2026-10-17): 2 artículos por semana, lunes y jueves,
   * para que el contenido de calidad dure. Se aplica a lo publicado desde esa fecha.
   */
  it('desde el 19-10-2026 se publica un artículo por idioma en lunes o jueves', () => {
    const DESDE = '2026-10-19';
    const seen = new Set<string>();
    for (const a of all.filter((x) => !x.borrador && x.fechaPublicacion >= DESDE)) {
      const day = new Date(`${a.fechaPublicacion}T12:00:00Z`).getUTCDay();
      expect([1, 4], `${a.locale}/${a.slug}: fechaPublicacion ${a.fechaPublicacion} no es lunes ni jueves`).toContain(day);
      const slot = `${a.locale}/${a.fechaPublicacion}`;
      expect(seen.has(slot), `${a.locale}/${a.slug}: ya hay otro artículo el ${a.fechaPublicacion}; usa el siguiente hueco libre`).toBe(false);
      seen.add(slot);
    }
  });

  it('no hay dos artículos con la misma URL', () => {
    const urls = all.map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
