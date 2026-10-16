/**
 * Repetición máxima estimada (1RM) a partir de un peso y las repeticiones hechas con él.
 * Media de las fórmulas de Epley (peso × (1 + reps/30)) y Brzycki (peso × 36 / (37 − reps)).
 * Las ecuaciones son más precisas con menos de 10 repeticiones (Mayhew et al., 2008).
 */
export type OneRmResult = {
  oneRm: number;
  /** true si se usaron más de 10 repeticiones: la estimación pierde precisión. */
  imprecise: boolean;
  /** Peso para cada porcentaje del 1RM (redondeado a 0,5 kg). */
  table: Array<{ percent: number; kg: number }>;
};

const half = (n: number) => Math.round(n * 2) / 2;
export const PERCENTS = [95, 90, 85, 80, 75, 70, 65, 60];

export function calculateOneRm({ weightKg, reps }: { weightKg: number; reps: number }): OneRmResult {
  const r = Math.max(1, Math.min(Math.round(reps), 15));
  const oneRm = r === 1 ? weightKg : (weightKg * (1 + r / 30) + (weightKg * 36) / (37 - r)) / 2;
  return {
    oneRm: half(oneRm),
    imprecise: r > 10,
    table: PERCENTS.map((p) => ({ percent: p, kg: half((oneRm * p) / 100) })),
  };
}
