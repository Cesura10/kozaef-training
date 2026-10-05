import { describe, expect, it } from 'vitest';
import { classifyProposal } from './bot-proposals-core';

const base = {
  number: 12,
  title: 'Artículo: ¿Pesas o cardio?',
  html_url: 'https://github.com/x/y/pull/12',
  created_at: '2026-11-02T08:00:00Z',
  closed_at: null,
  merged_at: null,
  slug: 'pesas-o-cardio',
  frontmatter: { titulo: '¿Pesas o cardio para perder grasa?', categoria: 'perder-grasa', perfiles: ['sobrepeso', 7], nivel: 'basico', fuentes: [{}, {}] },
  validation: 'passed' as const,
  preview: null,
};

describe('clasificación de propuestas del bot', () => {
  it('abierta, con datos de la cabecera del artículo', () => {
    expect(classifyProposal(base)).toMatchObject({
      status: 'abierta', kind: 'articulo', title: '¿Pesas o cardio para perder grasa?',
      categoria: 'perder-grasa', perfiles: ['sobrepeso'], nivel: 'basico', fuentes: 2,
    });
  });
  it('publicada si se hizo merge; descartada si se cerró sin merge', () => {
    expect(classifyProposal({ ...base, closed_at: '2026-11-03', merged_at: '2026-11-03' }).status).toBe('publicada');
    expect(classifyProposal({ ...base, closed_at: '2026-11-03' }).status).toBe('descartada');
  });
  it('novedad y título de reserva sin cabecera', () => {
    const p = classifyProposal({ ...base, title: 'Novedad: Estudio nuevo', frontmatter: null });
    expect(p).toMatchObject({ kind: 'novedad', title: 'Estudio nuevo', categoria: null, perfiles: [], fuentes: 0 });
  });
});
