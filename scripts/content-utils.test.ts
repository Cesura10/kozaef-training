import { describe, expect, it } from 'vitest';
import matter from 'gray-matter';
import { normalizeDates } from './content-utils.mjs';

describe('normalizeDates', () => {
  it('las fechas YAML sin comillas vuelven a AAAA-MM-DD', () => {
    const { data } = matter('---\nfechaPublicacion: 2026-10-04\nfechaRevision: "2026-10-05"\n---\ntexto');
    expect(data.fechaPublicacion).toBeInstanceOf(Date); // lo que hace YAML por sí solo
    normalizeDates(data);
    expect(data).toMatchObject({ fechaPublicacion: '2026-10-04', fechaRevision: '2026-10-05' });
  });
  it('no toca otros campos ni valores no válidos', () => {
    const data: Record<string, unknown> = { titulo: 'x', fechaPublicacion: 'mañana' };
    expect(normalizeDates(data)).toEqual({ titulo: 'x', fechaPublicacion: 'mañana' });
  });
});
