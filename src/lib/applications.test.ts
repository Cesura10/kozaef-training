import { describe, expect, it } from 'vitest';
import { bookingUrl, scoreApplication } from './applications';

const answers = { goal: 'fat_loss', experience: 'over3', stuck: '3to12m', days: '3to4', commitment: '9' };
const rules = [
  { question: 'experience', answer: 'over3', points: 10 },
  { question: 'stuck', answer: '3to12m', points: 15 },
  { question: 'days', answer: '3to4', points: 15 },
  { question: 'days', answer: '1to2', points: 0 },
  { question: 'commitment', answer: '9', points: 20 },
];

describe('puntuación de solicitudes', () => {
  it('suma solo las reglas que coinciden y usa los valores por defecto', () => {
    expect(scoreApplication(answers, rules, [], 0)).toMatchObject({ score: 60, threshold: 40, status: 'qualified', scoreBand: 'high' });
  });
  it('con el cupo semanal lleno pasa a lista de espera', () => {
    const flags = [{ key: 'weekly_call_capacity', value: { max: 2 } }];
    expect(scoreApplication(answers, rules, flags, 2).status).toBe('waitlist');
    expect(scoreApplication(answers, rules, flags, 1).status).toBe('qualified');
  });
  it('respeta el umbral configurado y calcula la banda', () => {
    const flags = [{ key: 'application_threshold', value: { score: 100 } }];
    expect(scoreApplication(answers, rules, flags, 0)).toMatchObject({ status: 'new', scoreBand: 'mid' });
  });
  it('ignora flags mal formados', () => {
    const flags = [
      { key: 'application_threshold', value: { score: '20' } },
      { key: 'weekly_call_capacity', value: null },
    ];
    expect(scoreApplication(answers, rules, flags, 0)).toMatchObject({ threshold: 40, status: 'qualified' });
  });
});

describe('enlace de reserva', () => {
  it('añade nombre, email y token', () => {
    const u = new URL(bookingUrl('https://cal.com/manu/20min', 'Ana', 'ana@x.com', 'tok')!);
    expect(u.searchParams.get('name')).toBe('Ana');
    expect(u.searchParams.get('email')).toBe('ana@x.com');
    expect(u.searchParams.get('metadata[token]')).toBe('tok');
  });
  it('sin URL o con URL mal escrita devuelve null en vez de lanzar', () => {
    expect(bookingUrl(undefined, 'Ana', 'ana@x.com', 'tok')).toBeNull();
    expect(bookingUrl('cal.com/manu', 'Ana', 'ana@x.com', 'tok')).toBeNull();
    expect(bookingUrl('javascript:alert(1)', 'Ana', 'ana@x.com', 'tok')).toBeNull();
  });
});
