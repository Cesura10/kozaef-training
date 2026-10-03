import type { Locale } from '@/i18n/config';

/**
 * Herramientas públicas: slugs por idioma y textos (SEO + interfaz).
 * Añadir una herramienta = una entrada aquí + su componente en components/calculators.
 */
export const TOOL_IDS = ['calories', 'protein', 'bodyfat'] as const;
export type ToolId = (typeof TOOL_IDS)[number];

/** Segmento de la URL por idioma: /es/herramientas/..., /en/tools/... */
export const TOOLS_SEGMENT: Record<Locale, string> = { es: 'herramientas', en: 'tools' };

export const TOOL_SLUGS: Record<ToolId, Record<Locale, string>> = {
  calories: { es: 'calculadora-calorias', en: 'calorie-calculator' },
  protein: { es: 'calculadora-proteina', en: 'protein-calculator' },
  bodyfat: { es: 'calculadora-grasa-corporal', en: 'body-fat-calculator' },
};

export const toolPath = (id: ToolId, locale: Locale) => `/${locale}/${TOOLS_SEGMENT[locale]}/${TOOL_SLUGS[id][locale]}`;

export function toolBySlug(locale: Locale, slug: string): ToolId | null {
  return TOOL_IDS.find((id) => TOOL_SLUGS[id][locale] === slug) ?? null;
}

export type ToolContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  how: Array<{ h: string; p: string }>;
  faq: Array<{ q: string; a: string }>;
  ctaTitle: string;
  ctaBody: string;
};

/** Textos de interfaz compartidos por las calculadoras. */
const CALC_UI_RAW = {
  es: {
    sex: 'Sexo',
    male: 'Hombre',
    female: 'Mujer',
    age: 'Edad',
    years: 'años',
    height: 'Altura',
    weight: 'Peso',
    activity: 'Actividad diaria',
    activities: {
      sedentary: 'Sedentaria (oficina, sin entrenar)',
      light: 'Ligera (1-3 entrenos/semana)',
      moderate: 'Moderada (3-5 entrenos/semana)',
      high: 'Alta (6-7 entrenos/semana)',
      athlete: 'Muy alta (trabajo físico + entreno)',
    },
    goal: 'Objetivo',
    goals: { lose: 'Perder grasa', maintain: 'Mantener', gain: 'Ganar músculo' },
    neck: 'Cuello',
    waist: 'Cintura (a la altura del ombligo)',
    hip: 'Cadera (parte más ancha)',
    targetPercent: 'Tu % de grasa objetivo (opcional)',
    calculate: 'Calcular',
    resultTitle: 'Tu resultado',
    kcalDay: 'kcal al día',
    maintenance: 'Mantenimiento',
    bmr: 'Metabolismo basal',
    protein: 'Proteína',
    fat: 'Grasa',
    carbs: 'Carbohidratos',
    floored:
      'Hemos subido el objetivo al mínimo recomendado sin supervisión. Bajar más puede costarte músculo y salud.',
    bodyfat: 'Grasa corporal estimada',
    fatMass: 'Masa grasa',
    leanMass: 'Masa magra',
    targetWeight: 'Peso con tu % objetivo',
    categories: {
      essential: 'Grasa esencial',
      athlete: 'Atlético',
      fitness: 'En forma',
      average: 'Promedio',
      high: 'Elevado',
    },
    invalid: 'Revisa las medidas: parecen mal tomadas (la cintura debe ser mayor que el cuello).',
    emailTitle: 'Guarda tu resultado',
    emailBody: 'Te mando guías para sacarle partido a estos números.',
    disclaimer: 'Estimación orientativa. No sustituye el consejo de un profesional sanitario.',
  },
  en: {
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    age: 'Age',
    years: 'years',
    height: 'Height',
    weight: 'Weight',
    activity: 'Daily activity',
    activities: {
      sedentary: 'Sedentary (desk job, no training)',
      light: 'Light (1-3 workouts/week)',
      moderate: 'Moderate (3-5 workouts/week)',
      high: 'High (6-7 workouts/week)',
      athlete: 'Very high (physical job + training)',
    },
    goal: 'Goal',
    goals: { lose: 'Lose fat', maintain: 'Maintain', gain: 'Build muscle' },
    neck: 'Neck',
    waist: 'Waist (at navel level)',
    hip: 'Hips (widest point)',
    targetPercent: 'Your target body fat % (optional)',
    calculate: 'Calculate',
    resultTitle: 'Your result',
    kcalDay: 'kcal per day',
    maintenance: 'Maintenance',
    bmr: 'Basal metabolic rate',
    protein: 'Protein',
    fat: 'Fat',
    carbs: 'Carbs',
    floored: 'We raised the target to the minimum recommended without supervision. Going lower can cost muscle and health.',
    bodyfat: 'Estimated body fat',
    fatMass: 'Fat mass',
    leanMass: 'Lean mass',
    targetWeight: 'Weight at your target %',
    categories: {
      essential: 'Essential fat',
      athlete: 'Athletic',
      fitness: 'Fit',
      average: 'Average',
      high: 'High',
    },
    invalid: 'Check your measurements: they look off (waist must be larger than neck).',
    emailTitle: 'Save your result',
    emailBody: 'I will send you guides to make the most of these numbers.',
    disclaimer: 'Indicative estimate. Not a substitute for advice from a health professional.',
  },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type CalcUi = Widen<(typeof CALC_UI_RAW)['es']>;
/** Inglés y español deben tener las mismas claves (lo comprueba el tipo). */
export const CALC_UI: Record<Locale, CalcUi> = CALC_UI_RAW;

export const TOOL_CONTENT: Record<Locale, Record<ToolId, ToolContent>> = {
  es: {
    calories: {
      metaTitle: 'Calculadora de calorías y macros (TDEE) gratis',
      metaDescription:
        'Calcula cuántas calorías necesitas al día para perder grasa, mantener o ganar músculo, y cómo repartir proteína, grasa y carbohidratos.',
      h1: 'Calculadora de calorías y macros',
      intro: 'Cuántas calorías gastas al día y cuántas comer según tu objetivo, con el reparto de macros listo para aplicar.',
      how: [
        {
          h: 'Cómo se calcula',
          p: 'Primero se estima tu metabolismo basal con la ecuación de Mifflin-St Jeor, la más precisa en población general. Después se multiplica por tu nivel de actividad para obtener tu gasto diario total (TDEE).',
        },
        {
          h: 'Déficit y superávit',
          p: 'Para perder grasa se aplica un déficit del 20 %, y para ganar músculo un superávit del 10 %. Son cifras moderadas: perder demasiado rápido suele costar músculo y abandonar la dieta.',
        },
        {
          h: 'Reparto de macros',
          p: 'La proteína se fija según tu peso y objetivo (1,6 a 2,4 g/kg), la grasa en unos 0,8 g/kg para cuidar tus hormonas, y el resto de calorías van a carbohidratos, la gasolina de tus entrenos.',
        },
      ],
      faq: [
        {
          q: '¿Es exacto el resultado?',
          a: 'Es un punto de partida muy bueno, con un margen de un 10 % arriba o abajo. Pésate 2-3 semanas: si el peso no se mueve como esperabas, ajusta 100-200 kcal.',
        },
        {
          q: '¿Qué nivel de actividad elijo?',
          a: 'Si dudas entre dos, elige el más bajo. La mayoría sobrestimamos lo que nos movemos.',
        },
        {
          q: '¿Tengo que comer siempre lo mismo?',
          a: 'No. Lo que importa es la media semanal. Puedes comer algo más los días de entreno y menos los de descanso.',
        },
      ],
      ctaTitle: '¿Haces todo bien y no cambias?',
      ctaBody: 'Calcular es el primer paso. Si llevas meses sin resultados, te ayudo a encontrar qué falla con un plan hecho para ti.',
    },
    protein: {
      metaTitle: 'Calculadora de proteína diaria gratis',
      metaDescription: 'Cuántos gramos de proteína necesitas al día y por comida según tu peso y tu objetivo, basado en la evidencia científica.',
      h1: 'Calculadora de proteína diaria',
      intro: 'Los gramos de proteína que necesitas al día y en cada comida para perder grasa, mantener o ganar músculo.',
      how: [
        {
          h: 'Cómo se calcula',
          p: 'Se usan los rangos de la evidencia actual: entre 1,6 y 2,2 g por kilo de peso para ganar músculo, y algo más (hasta 2,4 g/kg) cuando estás en déficit, para no perder masa muscular.',
        },
        {
          h: 'Por qué repartirla',
          p: 'Repartir la proteína en 3-5 comidas de 25-50 g ayuda a aprovecharla mejor que concentrarla en una sola comida.',
        },
      ],
      faq: [
        { q: '¿Es malo tomar tanta proteína?', a: 'En personas sanas, estas cantidades son seguras. Si tienes una enfermedad renal, consulta con tu médico.' },
        { q: '¿Necesito batidos?', a: 'No. Son cómodos, pero puedes llegar a tu cifra con carne, pescado, huevos, lácteos y legumbres.' },
      ],
      ctaTitle: '¿Llegas a tu proteína y sigues igual?',
      ctaBody: 'La proteína es una pieza. Si llevas meses estancado, revisamos juntos entrenamiento, descanso y comida.',
    },
    bodyfat: {
      metaTitle: 'Calculadora de grasa corporal (método Navy) gratis',
      metaDescription: 'Estima tu porcentaje de grasa corporal con una cinta métrica, tu masa magra y el peso que tendrías con tu % objetivo.',
      h1: 'Calculadora de grasa corporal',
      intro: 'Estima tu porcentaje de grasa con una cinta métrica y descubre qué peso tendrías con tu objetivo sin perder músculo.',
      how: [
        {
          h: 'Cómo se calcula',
          p: 'Se usa el método de la Marina de EE. UU., que estima la grasa a partir de tu altura y del perímetro de cuello y cintura (y cadera en mujeres). Su margen de error es de unos 3-4 puntos.',
        },
        {
          h: 'Cómo medirte bien',
          p: 'Mídete por la mañana, en ayunas y sin apretar la cinta. El cuello, justo debajo de la nuez; la cintura, a la altura del ombligo; la cadera, en la parte más ancha. Repite cada medida dos veces.',
        },
        {
          h: 'Peso objetivo',
          p: 'Si indicas tu % de grasa objetivo, se calcula el peso que tendrías manteniendo tu masa magra actual. Es la cifra realista a la que apuntar.',
        },
      ],
      faq: [
        { q: '¿Es más fiable que una báscula de bioimpedancia?', a: 'Suele ser igual o más fiable que las básculas domésticas, que varían mucho con lo que bebes. Lo importante es medir siempre igual y mirar la tendencia.' },
        { q: '¿Qué porcentaje es saludable?', a: 'En hombres, entre un 10 y un 20 % es un buen rango; en mujeres, entre un 18 y un 28 %. Por debajo de lo esencial no es saludable.' },
      ],
      ctaTitle: '¿Quieres bajar grasa sin perder músculo?',
      ctaBody: 'Te ayudo a llegar a tu porcentaje objetivo con un plan de entrenamiento y nutrición hecho para ti.',
    },
  },
  en: {
    calories: {
      metaTitle: 'Free calorie and macro calculator (TDEE)',
      metaDescription: 'Work out how many calories you need per day to lose fat, maintain or build muscle, and how to split protein, fat and carbs.',
      h1: 'Calorie and macro calculator',
      intro: 'How many calories you burn per day and how many to eat for your goal, with a macro split ready to use.',
      how: [
        { h: 'How it works', p: 'Your basal metabolic rate is estimated with the Mifflin-St Jeor equation, then multiplied by your activity level to get your total daily energy expenditure (TDEE).' },
        { h: 'Deficit and surplus', p: 'A 20% deficit to lose fat and a 10% surplus to build muscle. Moderate numbers you can sustain without losing muscle.' },
        { h: 'Macro split', p: 'Protein is set from your weight and goal (1.6 to 2.4 g/kg), fat at about 0.8 g/kg, and the remaining calories go to carbs.' },
      ],
      faq: [
        { q: 'Is it accurate?', a: 'It is a strong starting point within about 10%. Track your weight for 2-3 weeks and adjust by 100-200 kcal if needed.' },
        { q: 'Which activity level should I pick?', a: 'If unsure between two, pick the lower one. Most people overestimate how active they are.' },
      ],
      ctaTitle: 'Doing everything right and not changing?',
      ctaBody: 'Numbers are step one. If you have been stuck for months, I will help you find what is wrong with a plan built for you.',
    },
    protein: {
      metaTitle: 'Free daily protein calculator',
      metaDescription: 'How many grams of protein you need per day and per meal for your weight and goal, based on current evidence.',
      h1: 'Daily protein calculator',
      intro: 'The grams of protein you need per day and per meal to lose fat, maintain or build muscle.',
      how: [
        { h: 'How it works', p: 'It uses evidence-based ranges: 1.6 to 2.2 g per kg to build muscle, and up to 2.4 g/kg in a deficit to protect muscle.' },
        { h: 'Why split it', p: 'Spreading protein across 3-5 meals of 25-50 g helps you use it better than one large meal.' },
      ],
      faq: [
        { q: 'Is that much protein safe?', a: 'For healthy people these amounts are safe. If you have kidney disease, ask your doctor.' },
        { q: 'Do I need shakes?', a: 'No. They are convenient, but meat, fish, eggs, dairy and legumes get you there.' },
      ],
      ctaTitle: 'Hitting your protein and still stuck?',
      ctaBody: 'Protein is one piece. If you have plateaued for months, we review training, sleep and food together.',
    },
    bodyfat: {
      metaTitle: 'Free body fat calculator (Navy method)',
      metaDescription: 'Estimate your body fat percentage with a tape measure, your lean mass and your weight at a target body fat.',
      h1: 'Body fat calculator',
      intro: 'Estimate your body fat with a tape measure and see your weight at your target without losing muscle.',
      how: [
        { h: 'How it works', p: 'The US Navy method estimates body fat from height and neck and waist circumference (plus hips for women). Typical error is 3-4 points.' },
        { h: 'How to measure', p: 'Measure in the morning, fasted, without squeezing the tape. Neck just below the Adam’s apple, waist at the navel, hips at the widest point.' },
      ],
      faq: [
        { q: 'Is it better than a smart scale?', a: 'It is usually as reliable or better than home bioimpedance scales. Measure the same way each time and watch the trend.' },
        { q: 'What is a healthy range?', a: 'Roughly 10-20% for men and 18-28% for women.' },
      ],
      ctaTitle: 'Want to lose fat without losing muscle?',
      ctaBody: 'I will help you reach your target with a training and nutrition plan built for you.',
    },
  },
};
