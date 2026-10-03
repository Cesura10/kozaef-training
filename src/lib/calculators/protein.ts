/**
 * Proteína diaria recomendada. Función pura: corre en el navegador, sin servidor.
 * Rangos en g/kg de peso corporal según la evidencia actual
 * (Morton et al. 2018; ISSN 2017: 1,6-2,2 g/kg; más alto en déficit calórico).
 */

export type ProteinGoal = 'lose' | 'maintain' | 'gain';

export const PROTEIN_GOALS: Record<ProteinGoal, { label: string; min: number; max: number }> = {
  lose: { label: 'Perder grasa', min: 1.8, max: 2.4 },
  maintain: { label: 'Mantener', min: 1.4, max: 1.8 },
  gain: { label: 'Ganar músculo', min: 1.6, max: 2.2 },
};

export const WEIGHT_LIMITS = { min: 35, max: 200 } as const;

export type ProteinResult = {
  /** Objetivo diario recomendado (punto medio del rango), en gramos. */
  target: number;
  min: number;
  max: number;
  /** Gramos por comida repartiendo en `meals` tomas. */
  perMeal: number;
  meals: number;
};

export function calculateProtein(weightKg: number, goal: ProteinGoal, meals = 4): ProteinResult {
  const w = Math.min(Math.max(weightKg, WEIGHT_LIMITS.min), WEIGHT_LIMITS.max);
  const { min, max } = PROTEIN_GOALS[goal];
  const target = Math.round((w * (min + max)) / 2);
  return {
    target,
    min: Math.round(w * min),
    max: Math.round(w * max),
    perMeal: Math.round(target / meals),
    meals,
  };
}
