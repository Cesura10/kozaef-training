/**
 * Porcentaje de grasa corporal por el método de la Marina de EE. UU. (Hodgdon y
 * Beckett, 1984), con medidas en cm. Error típico ±3-4 puntos: es una estimación.
 * Categorías: American Council on Exercise (ACE).
 */
import type { Sex } from './calories';

export type BodyfatInput = {
  sex: Sex;
  heightCm: number;
  weightKg: number;
  neckCm: number;
  waistCm: number;
  /** Solo mujeres. */
  hipCm?: number;
  /** % de grasa objetivo para calcular el peso objetivo. */
  targetPercent?: number;
};

export type BodyfatCategory = 'essential' | 'athlete' | 'fitness' | 'average' | 'high';

export type BodyfatResult = {
  percent: number;
  category: BodyfatCategory;
  fatMassKg: number;
  leanMassKg: number;
  /** Peso con el % objetivo manteniendo la masa magra. null si no hay objetivo. */
  targetWeightKg: number | null;
};

const BANDS: Record<Sex, Array<[number, BodyfatCategory]>> = {
  male: [[6, 'essential'], [14, 'athlete'], [18, 'fitness'], [25, 'average'], [Infinity, 'high']],
  female: [[14, 'essential'], [21, 'athlete'], [25, 'fitness'], [32, 'average'], [Infinity, 'high']],
};

export class InvalidMeasurementsError extends Error {}

export function calculateBodyfat(input: BodyfatInput): BodyfatResult {
  const { sex, heightCm: h, weightKg: w, neckCm: neck, waistCm: waist, hipCm: hip } = input;
  // La cintura siempre es mayor que el cuello en un adulto; si no, las medidas están mal.
  if (waist <= neck || neck < 20 || waist < 40 || h < 120) {
    throw new InvalidMeasurementsError('La cintura debe ser mayor que el cuello.');
  }
  let percent: number;
  if (sex === 'male') {
    percent = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
  } else {
    if (!hip || waist + hip - neck <= 0) throw new InvalidMeasurementsError('Faltan medidas o no son coherentes.');
    percent = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(h)) - 450;
  }
  // Fuera de lo fisiológico = medidas mal tomadas: mejor avisar que dar un número falso.
  if (!Number.isFinite(percent) || percent < 2 || percent > 65) {
    throw new InvalidMeasurementsError('Las medidas no son coherentes.');
  }
  const rounded = Math.round(percent * 10) / 10;
  const fatMass = (w * percent) / 100;
  const lean = w - fatMass;
  const category = BANDS[sex].find(([max]) => percent < max)![1];
  const target = input.targetPercent;
  return {
    percent: rounded,
    category,
    fatMassKg: Math.round(fatMass * 10) / 10,
    leanMassKg: Math.round(lean * 10) / 10,
    targetWeightKg: target && target > 2 && target < 60 ? Math.round((lean / (1 - target / 100)) * 10) / 10 : null,
  };
}
