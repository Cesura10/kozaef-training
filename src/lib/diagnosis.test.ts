import { describe, expect, it } from 'vitest';
import { diagnose, type DiagnosisAnswers } from './diagnosis';

const base: DiagnosisAnswers = {
  goal: 'fat', sex: 'male', age: '30to44', where: 'gym', experience: 'over1', weight: 'few', obstacle: 'no_results',
};

describe('diagnóstico', () => {
  it('mujer de 45+ tiene prioridad sobre el resto', () => {
    expect(diagnose({ ...base, sex: 'female', age: '45plus', weight: 'lot', where: 'home' }).profile).toBe('mujeres-45');
  });
  it('sobrepeso -> herramienta de grasa corporal', () => {
    expect(diagnose({ ...base, weight: 'lot' })).toMatchObject({ profile: 'sobrepeso', tool: 'bodyfat' });
  });
  it('le cuesta ganar peso y quiere músculo -> proteína', () => {
    expect(diagnose({ ...base, goal: 'muscle', weight: 'hard_gain' })).toMatchObject({
      profile: 'cuesta-ganar-peso', category: 'ganar-musculo', tool: 'protein',
    });
  });
  it('las molestias llevan a recuperación', () => {
    expect(diagnose({ ...base, obstacle: 'pain' }).category).toBe('recuperacion');
  });
  it('entreno en casa y por defecto principiantes', () => {
    expect(diagnose({ ...base, where: 'home' }).profile).toBe('entreno-casa');
    expect(diagnose(base).profile).toBe('principiantes');
  });
});
