/**
 * Índice de masa corporal (IMC = kg / m²) con la clasificación de la Organización Mundial de la Salud.
 * Limitación: no distingue grasa de músculo (ver tools.ts, fuentes).
 */
export type BmiCategory = 'under' | 'normal' | 'over' | 'obese1' | 'obese2' | 'obese3';

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  /** Rango de peso con IMC 18,5-24,9 para esa altura. */
  healthyMinKg: number;
  healthyMaxKg: number;
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export function calculateBmi({ heightCm, weightKg }: { heightCm: number; weightKg: number }): BmiResult {
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  const category: BmiCategory =
    bmi < 18.5 ? 'under' : bmi < 25 ? 'normal' : bmi < 30 ? 'over' : bmi < 35 ? 'obese1' : bmi < 40 ? 'obese2' : 'obese3';
  return { bmi: r1(bmi), category, healthyMinKg: r1(18.5 * m * m), healthyMaxKg: r1(24.9 * m * m) };
}
