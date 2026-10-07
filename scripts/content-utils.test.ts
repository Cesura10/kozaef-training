import { describe, expect, it } from 'vitest';
import { normalizeDates, parseFrontMatter } from './content-utils.mjs';

describe('parseFrontMatter', () => {
  it('separa la cabecera YAML del cuerpo', () => {
    const { data, content } = parseFrontMatter('---\ntitulo: "Hola"\nperfiles: [a, b]\n---\n\n## Sección\ntexto');
    expect(data).toEqual({ titulo: 'Hola', perfiles: ['a', 'b'] });
    expect(content).toBe('\n## Sección\ntexto');
  });
  it('sin cabecera devuelve todo como cuerpo', () => {
    expect(parseFrontMatter('solo texto')).toEqual({ data: {}, content: 'solo texto' });
  });
  it('las fechas sin comillas quedan como AAAA-MM-DD', () => {
    const { data } = parseFrontMatter('---\nfechaPublicacion: 2026-10-04\nfechaRevision: "2026-10-05"\n---\ntexto');
    normalizeDates(data);
    expect(data).toMatchObject({ fechaPublicacion: '2026-10-04', fechaRevision: '2026-10-05' });
  });
});

describe('normalizeDates', () => {
  it('un objeto Date vuelve a AAAA-MM-DD', () => {
    const data: Record<string, unknown> = { fechaPublicacion: new Date('2026-10-04T00:00:00Z') };
    expect(normalizeDates(data)).toEqual({ fechaPublicacion: '2026-10-04' });
  });
  it('no toca otros campos ni valores no válidos', () => {
    const data: Record<string, unknown> = { titulo: 'x', fechaPublicacion: 'mañana' };
    expect(normalizeDates(data)).toEqual({ titulo: 'x', fechaPublicacion: 'mañana' });
  });
});
