import { describe, expect, it } from 'vitest';
import { escapeLike } from './like';

/** Simula ILIKE de Postgres (escape por defecto: barra invertida) para comprobar el escapado. */
function ilike(text: string, pattern: string) {
  let re = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === '\\') re += pattern[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    else if (c === '%') re += '.*';
    else if (c === '_') re += '.';
    else re += c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, 'i').test(text);
}

describe('escapeLike', () => {
  it('escapa %, _ y la barra invertida', () => {
    expect(escapeLike('ana_p%x\\y@x.com')).toBe('ana\\_p\\%x\\\\y@x.com');
  });
  it('un email con _ ya no encaja con otros emails', () => {
    expect(ilike('anaxp@x.com', 'ana_p@x.com')).toBe(true); // el fallo original
    expect(ilike('anaxp@x.com', escapeLike('ana_p@x.com'))).toBe(false);
    expect(ilike('ANA_P@x.com', escapeLike('ana_p@x.com'))).toBe(true); // sigue sin distinguir mayúsculas
  });
  it('no cambia emails sin comodines', () => {
    expect(escapeLike('manu@kozaef.com')).toBe('manu@kozaef.com');
  });
});
