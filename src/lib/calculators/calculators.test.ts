import { describe, expect, it } from 'vitest';
import { calculateProtein } from './protein';
import { calculateCalories } from './calories';
import { calculateBodyfat, InvalidMeasurementsError } from './bodyfat';

describe('proteína', () => {
  it('75 kg ganando músculo: 1,6-2,2 g/kg', () => {
    expect(calculateProtein(75, 'gain')).toMatchObject({ min: 120, max: 165, target: 143, perMeal: 36 });
  });
  it('limita pesos imposibles', () => {
    expect(calculateProtein(5, 'maintain').min).toBe(Math.round(35 * 1.4));
  });
});

describe('calorías (Mifflin-St Jeor)', () => {
  it('hombre 30 años, 180 cm, 80 kg, moderado, mantener', () => {
    const r = calculateCalories({ sex: 'male', age: 30, heightCm: 180, weightKg: 80, activity: 'moderate', goal: 'maintain' });
    // BMR = 800 + 1125 - 150 + 5 = 1780; TDEE = 1780 * 1,55 = 2759
    expect(r.bmr).toBe(1780);
    expect(r.tdee).toBe(2759);
    expect(r.target).toBe(2759);
    // Las macros suman las kcal objetivo (±4 kcal por redondeo)
    expect(Math.abs(r.protein * 4 + r.fat * 9 + r.carbs * 4 - r.target)).toBeLessThanOrEqual(4);
  });
  it('con pesos altos las macros no superan las kcal objetivo', () => {
    const r = calculateCalories({ sex: 'male', age: 30, heightCm: 175, weightKg: 250, activity: 'sedentary', goal: 'lose' });
    expect(r.carbs).toBeGreaterThanOrEqual(0);
    expect(r.protein * 4 + r.fat * 9 + r.carbs * 4).toBeLessThanOrEqual(r.target + 4);
    expect(r.fat * 9).toBeGreaterThanOrEqual(r.target * 0.2 - 9);
  });
  it('déficit del 20 % y nunca por debajo del mínimo seguro', () => {
    const r = calculateCalories({ sex: 'female', age: 60, heightCm: 150, weightKg: 45, activity: 'sedentary', goal: 'lose' });
    expect(r.target).toBe(1200);
    expect(r.floored).toBe(true);
  });
});

describe('grasa corporal (Navy)', () => {
  it('hombre 180 cm, cuello 38, cintura 85: ~17 %', () => {
    const r = calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: 80, neckCm: 38, waistCm: 85 });
    expect(r.percent).toBeGreaterThan(15);
    expect(r.percent).toBeLessThan(19);
    expect(r.category).toBe('fitness');
    expect(r.fatMassKg + r.leanMassKg).toBeCloseTo(80, 0);
  });
  it('mujer 165 cm, cuello 33, cintura 72, cadera 98: ~27 %', () => {
    const r = calculateBodyfat({ sex: 'female', heightCm: 165, weightKg: 62, neckCm: 33, waistCm: 72, hipCm: 98 });
    expect(r.percent).toBeGreaterThan(24);
    expect(r.percent).toBeLessThan(30);
  });
  it('peso objetivo mantiene la masa magra', () => {
    const r = calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: 90, neckCm: 40, waistCm: 100, targetPercent: 15 });
    expect(r.targetWeightKg).toBeCloseTo(r.leanMassKg / 0.85, 0);
  });
  it('medidas incoherentes lanzan un error claro', () => {
    expect(() => calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: 80, neckCm: 40, waistCm: 38 })).toThrow(InvalidMeasurementsError);
  });
  it('la categoría corresponde al porcentaje mostrado (redondeado)', () => {
    // Buscamos medidas cuyo % sin redondear quede justo por debajo de 18 y se muestre como 18,0.
    let found = false;
    for (let waist = 80; waist < 95 && !found; waist += 0.1) {
      const r = calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: 80, neckCm: 38, waistCm: waist });
      if (r.percent === 18) {
        expect(r.category).toBe('average');
        found = true;
      }
    }
    expect(found).toBe(true);
  });
  it('un peso imposible da error (no masas negativas)', () => {
    expect(() => calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: 0, neckCm: 38, waistCm: 85 })).toThrow(InvalidMeasurementsError);
    expect(() => calculateBodyfat({ sex: 'male', heightCm: 180, weightKg: -80, neckCm: 38, waistCm: 85 })).toThrow(InvalidMeasurementsError);
  });
  it('mujer con cintura imposible también da error (no un % falso)', () => {
    expect(() => calculateBodyfat({ sex: 'female', heightCm: 165, weightKg: 80, neckCm: 38, waistCm: 20, hipCm: 98 })).toThrow(InvalidMeasurementsError);
  });
});
