import type { Locale } from '@/i18n/config';

/**
 * Clasificación ÚNICA de artículos y productos (brief biblioteca §2).
 * Añadir o renombrar aquí: no hace falta tocar código. El slug es la URL; si cambias
 * un slug ya publicado, añade una redirección en next.config.ts.
 */
type Entry = { slug: Record<Locale, string>; label: Record<Locale, string>; intro: Record<Locale, string> };

export const CATEGORIES = {
  'perder-grasa': {
    slug: { es: 'perder-grasa', en: 'fat-loss' },
    label: { es: 'Perder grasa', en: 'Fat loss' },
    intro: { es: 'Cómo perder grasa sin perder músculo ni pasar hambre todo el día.', en: 'How to lose fat without losing muscle or starving.' },
  },
  'ganar-musculo': {
    slug: { es: 'ganar-musculo-y-peso', en: 'build-muscle' },
    label: { es: 'Ganar músculo y peso', en: 'Build muscle and gain weight' },
    intro: { es: 'Qué hacer cuando entrenas y comes pero no ganas músculo ni peso.', en: 'What to do when you train and eat but do not grow.' },
  },
  'fuerza-tecnica': {
    slug: { es: 'fuerza-y-tecnica', en: 'strength-and-technique' },
    label: { es: 'Fuerza y técnica', en: 'Strength and technique' },
    intro: { es: 'Técnica de los ejercicios básicos y cómo progresar en fuerza.', en: 'Technique on the main lifts and how to get stronger.' },
  },
  nutricion: {
    slug: { es: 'nutricion', en: 'nutrition' },
    label: { es: 'Nutrición', en: 'Nutrition' },
    intro: { es: 'Calorías, proteína y hábitos de comida que funcionan en la vida real.', en: 'Calories, protein and eating habits that work in real life.' },
  },
  recuperacion: {
    slug: { es: 'recuperacion-y-lesiones', en: 'recovery-and-injuries' },
    label: { es: 'Recuperación y lesiones', en: 'Recovery and injuries' },
    intro: { es: 'Descanso, sueño y cómo entrenar alrededor de las molestias.', en: 'Rest, sleep and training around aches.' },
  },
} as const satisfies Record<string, Entry>;

export const PROFILES = {
  principiantes: {
    slug: { es: 'principiantes', en: 'beginners' },
    label: { es: 'Principiantes', en: 'Beginners' },
    intro: { es: 'Si empiezas ahora, empieza por aquí.', en: 'If you are just starting, start here.' },
  },
  'mujeres-45': {
    slug: { es: 'mujeres-45-y-menopausia', en: 'women-45-and-menopause' },
    label: { es: 'Mujeres 45+ y menopausia', en: 'Women 45+ and menopause' },
    intro: { es: 'Entrenamiento y nutrición adaptados a los cambios a partir de los 45.', en: 'Training and nutrition for the changes after 45.' },
  },
  sobrepeso: {
    slug: { es: 'sobrepeso', en: 'overweight' },
    label: { es: 'Sobrepeso', en: 'Overweight' },
    intro: { es: 'Bajar de peso de forma sostenible, sin dietas extremas.', en: 'Sustainable weight loss without extreme diets.' },
  },
  'cuesta-ganar-peso': {
    slug: { es: 'me-cuesta-ganar-peso', en: 'hard-gainers' },
    label: { es: 'Me cuesta ganar peso', en: 'Hard to gain weight' },
    intro: { es: 'Para quien come y entrena pero la báscula no se mueve.', en: 'For people who eat and train but the scale will not move.' },
  },
  'entreno-casa': {
    slug: { es: 'entreno-en-casa', en: 'home-training' },
    label: { es: 'Entreno en casa', en: 'Home training' },
    intro: { es: 'Progresar con poco material y poco espacio.', en: 'Progress with little equipment and space.' },
  },
} as const satisfies Record<string, Entry>;

export const LEVELS = {
  basico: { es: 'Básico', en: 'Beginner' },
  intermedio: { es: 'Intermedio', en: 'Intermediate' },
  avanzado: { es: 'Avanzado', en: 'Advanced' },
} as const;

export type CategoryId = keyof typeof CATEGORIES;
export type ProfileId = keyof typeof PROFILES;
export type LevelId = keyof typeof LEVELS;

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];
export const PROFILE_IDS = Object.keys(PROFILES) as ProfileId[];
export const LEVEL_IDS = Object.keys(LEVELS) as LevelId[];

export const categoryBySlug = (locale: Locale, slug: string) =>
  CATEGORY_IDS.find((id) => CATEGORIES[id].slug[locale] === slug) ?? null;
export const profileBySlug = (locale: Locale, slug: string) =>
  PROFILE_IDS.find((id) => PROFILES[id].slug[locale] === slug) ?? null;
