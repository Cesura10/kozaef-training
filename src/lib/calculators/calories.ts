/**
 * Gasto calórico diario (TDEE) y reparto de macros. Función pura (navegador).
 * - Metabolismo basal: Mifflin-St Jeor (1990), la ecuación más precisa en población general.
 * - Actividad: factores estándar 1,2 a 1,9.
 * - Objetivo: déficit 20 % / superávit 10 % (moderados, sostenibles).
 * - Macros: proteína según calculateProtein, grasa 0,8 g/kg (mín. 20 % de kcal, sin pasarse del
 *   objetivo), resto carbohidrato.
 */
import { calculateProtein, type ProteinGoal } from './protein';

export type Sex = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete';

export const ACTIVITY_FACTORS: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

const GOAL_ADJUST: Record<ProteinGoal, number> = { lose: -0.2, maintain: 0, gain: 0.1 };
/** Por debajo de esto no se recomienda sin supervisión profesional. */
export const MIN_KCAL: Record<Sex, number> = { male: 1500, female: 1200 };

export type CaloriesInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: ProteinGoal;
};

export type CaloriesResult = {
  bmr: number;
  tdee: number;
  target: number;
  /** true si el objetivo se ha subido al mínimo seguro. */
  floored: boolean;
  protein: number;
  fat: number;
  carbs: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function calculateCalories(input: CaloriesInput): CaloriesResult {
  const age = clamp(input.age, 14, 90);
  const h = clamp(input.heightCm, 120, 230);
  const w = clamp(input.weightKg, 35, 250);

  const bmr = 10 * w + 6.25 * h - 5 * age + (input.sex === 'male' ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTORS[input.activity];
  const raw = tdee * (1 + GOAL_ADJUST[input.goal]);
  const min = MIN_KCAL[input.sex];
  const target = Math.max(raw, min);

  const protein = calculateProtein(w, input.goal).target;
  // Grasa: 0,8 g/kg, pero sin que proteína + grasa superen las kcal objetivo (pesos altos o
  // mínimo seguro), y nunca por debajo del 20 % de las kcal.
  const fatFloor = Math.round((target * 0.2) / 9);
  const fatRoom = Math.floor((target - protein * 4) / 9);
  const fat = Math.max(fatFloor, Math.min(Math.round(w * 0.8), fatRoom));
  const carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    floored: raw < min,
    protein,
    fat,
    carbs,
  };
}
