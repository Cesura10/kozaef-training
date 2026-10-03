import type { Locale } from '@/i18n/config';
import type { DiagnosisAnswers } from '@/lib/diagnosis';
import type { ProfileId } from './taxonomy';

/**
 * BORRADOR del diagnóstico gratis, PENDIENTE DE REVISIÓN de Manu.
 * Mientras APPROVED sea false: la página no se indexa, no va al sitemap y el botón de la
 * cabecera sigue siendo "Solicitar plaza". Se revisa entrando a /es/diagnostico.
 */
export const DIAGNOSIS_APPROVED = false;

type Q<K extends keyof DiagnosisAnswers> = { key: K; label: string; options: Array<{ value: DiagnosisAnswers[K]; label: string }> };
type Questions = [
  Q<'goal'>,
  Q<'sex'>,
  Q<'age'>,
  Q<'where'>,
  Q<'experience'>,
  Q<'weight'>,
  Q<'obstacle'>,
];

type Copy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  questions: Questions;
  submit: string;
  missing: string;
  resultEyebrow: string;
  profileTitle: Record<ProfileId, string>;
  advice: Record<ProfileId, string[]>;
  toolTitle: string;
  learnCta: string;
  restart: string;
  disclaimer: string;
};

export const DIAGNOSIS: Record<Locale, Copy> = {
  es: {
    metaTitle: 'Diagnóstico gratis de entrenamiento',
    metaDescription: 'Responde 7 preguntas y descubre qué te frena y por dónde empezar, con recomendaciones según tu perfil.',
    h1: 'Diagnóstico gratis',
    intro: 'Siete preguntas rápidas para saber qué te está frenando y por dónde empezar. El resultado sale al momento, sin dejar tu email.',
    questions: [
      {
        key: 'goal',
        label: '¿Qué quieres conseguir?',
        options: [
          { value: 'fat', label: 'Perder grasa' },
          { value: 'muscle', label: 'Ganar músculo' },
          { value: 'strength', label: 'Ser más fuerte' },
          { value: 'health', label: 'Salud y energía' },
        ],
      },
      { key: 'sex', label: 'Sexo', options: [{ value: 'female', label: 'Mujer' }, { value: 'male', label: 'Hombre' }] },
      {
        key: 'age',
        label: 'Edad',
        options: [
          { value: 'under30', label: 'Menos de 30' },
          { value: '30to44', label: '30 a 44' },
          { value: '45plus', label: '45 o más' },
        ],
      },
      {
        key: 'where',
        label: '¿Dónde entrenas?',
        options: [
          { value: 'gym', label: 'Gimnasio' },
          { value: 'home', label: 'En casa' },
          { value: 'none', label: 'Aún no entreno' },
        ],
      },
      {
        key: 'experience',
        label: '¿Cuánto llevas entrenando?',
        options: [
          { value: 'starting', label: 'Empiezo ahora' },
          { value: 'under1', label: 'Menos de 1 año' },
          { value: 'over1', label: 'Más de 1 año' },
        ],
      },
      {
        key: 'weight',
        label: '¿Cómo describirías tu peso?',
        options: [
          { value: 'lot', label: 'Me sobran bastantes kilos' },
          { value: 'few', label: 'Me sobran unos pocos' },
          { value: 'hard_gain', label: 'Me cuesta ganar peso' },
          { value: 'fine', label: 'Estoy bien' },
        ],
      },
      {
        key: 'obstacle',
        label: '¿Qué te frena más?',
        options: [
          { value: 'routine', label: 'No sé qué rutina seguir' },
          { value: 'no_results', label: 'Entreno y no veo cambios' },
          { value: 'time', label: 'Falta de tiempo' },
          { value: 'pain', label: 'Molestias o lesiones' },
          { value: 'food', label: 'No sé comer bien' },
        ],
      },
    ],
    submit: 'Ver mi diagnóstico',
    missing: 'Responde todas las preguntas para ver tu resultado.',
    resultEyebrow: 'Tu diagnóstico',
    profileTitle: {
      principiantes: 'Necesitas una base sólida y sencilla',
      'mujeres-45': 'Tu cuerpo necesita un enfoque adaptado a esta etapa',
      sobrepeso: 'Lo primero es un déficit sostenible, no una dieta extrema',
      'cuesta-ganar-peso': 'Probablemente comes menos de lo que crees',
      'entreno-casa': 'Puedes progresar en casa si aplicas progresión',
    },
    advice: {
      principiantes: [
        'Entrena todo el cuerpo 3 días a la semana con pocos ejercicios básicos.',
        'Apunta pesos y repeticiones: sube un poco cuando completes todas las series.',
        'Llega a tu proteína diaria y duerme 7-8 horas antes de buscar suplementos.',
      ],
      'mujeres-45': [
        'Prioriza el entrenamiento de fuerza 2-3 días por semana: protege músculo y huesos.',
        'Sube la proteína: con la edad se necesita algo más para mantener la masa muscular.',
        'Cuida el sueño y el estrés, que influyen mucho en esta etapa.',
      ],
      sobrepeso: [
        'Busca un déficit moderado que puedas mantener meses, no semanas.',
        'Camina más cada día: es la forma más fácil de aumentar el gasto.',
        'Entrena fuerza para perder grasa sin perder músculo.',
      ],
      'cuesta-ganar-peso': [
        'Calcula tus calorías y come unas 300 kcal más de tu mantenimiento.',
        'Añade comidas fáciles de tomar: frutos secos, batidos caseros, aceite de oliva.',
        'Céntrate en subir peso en los ejercicios básicos semana a semana.',
      ],
      'entreno-casa': [
        'Progresa con más repeticiones, más series o ejercicios más difíciles.',
        'Unas gomas elásticas o mancuernas ajustables multiplican tus opciones.',
        'Programa tus sesiones como citas fijas para no saltártelas.',
      ],
    },
    toolTitle: 'Empieza por calcular tus números',
    learnCta: 'Artículos para tu perfil',
    restart: 'Repetir el diagnóstico',
    disclaimer: 'Orientación general. No sustituye el consejo de un profesional sanitario.',
  },
  en: {
    metaTitle: 'Free training assessment',
    metaDescription: 'Answer 7 questions and find out what is holding you back and where to start, with tips for your profile.',
    h1: 'Free assessment',
    intro: 'Seven quick questions to find what is holding you back and where to start. Instant result, no email needed.',
    questions: [
      {
        key: 'goal',
        label: 'What do you want to achieve?',
        options: [
          { value: 'fat', label: 'Lose fat' },
          { value: 'muscle', label: 'Build muscle' },
          { value: 'strength', label: 'Get stronger' },
          { value: 'health', label: 'Health and energy' },
        ],
      },
      { key: 'sex', label: 'Sex', options: [{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }] },
      {
        key: 'age',
        label: 'Age',
        options: [
          { value: 'under30', label: 'Under 30' },
          { value: '30to44', label: '30 to 44' },
          { value: '45plus', label: '45 or over' },
        ],
      },
      {
        key: 'where',
        label: 'Where do you train?',
        options: [
          { value: 'gym', label: 'Gym' },
          { value: 'home', label: 'At home' },
          { value: 'none', label: 'I do not train yet' },
        ],
      },
      {
        key: 'experience',
        label: 'How long have you been training?',
        options: [
          { value: 'starting', label: 'Just starting' },
          { value: 'under1', label: 'Under 1 year' },
          { value: 'over1', label: 'Over 1 year' },
        ],
      },
      {
        key: 'weight',
        label: 'How would you describe your weight?',
        options: [
          { value: 'lot', label: 'I have quite a lot to lose' },
          { value: 'few', label: 'A few kilos to lose' },
          { value: 'hard_gain', label: 'I struggle to gain weight' },
          { value: 'fine', label: 'I am fine' },
        ],
      },
      {
        key: 'obstacle',
        label: 'What holds you back most?',
        options: [
          { value: 'routine', label: 'I do not know what routine to follow' },
          { value: 'no_results', label: 'I train but see no change' },
          { value: 'time', label: 'Lack of time' },
          { value: 'pain', label: 'Aches or injuries' },
          { value: 'food', label: 'I do not know how to eat well' },
        ],
      },
    ],
    submit: 'See my assessment',
    missing: 'Answer every question to see your result.',
    resultEyebrow: 'Your assessment',
    profileTitle: {
      principiantes: 'You need a simple, solid base',
      'mujeres-45': 'Your body needs an approach suited to this stage',
      sobrepeso: 'Start with a sustainable deficit, not an extreme diet',
      'cuesta-ganar-peso': 'You probably eat less than you think',
      'entreno-casa': 'You can progress at home with real progression',
    },
    advice: {
      principiantes: [
        'Train your whole body 3 days a week with a few basic exercises.',
        'Log weights and reps: add a little when you complete every set.',
        'Hit your daily protein and sleep 7-8 hours before looking at supplements.',
      ],
      'mujeres-45': [
        'Prioritise strength training 2-3 days a week to protect muscle and bone.',
        'Eat more protein: you need a bit more with age to keep muscle.',
        'Look after sleep and stress, which matter a lot at this stage.',
      ],
      sobrepeso: [
        'Aim for a moderate deficit you can keep for months, not weeks.',
        'Walk more every day: the easiest way to burn more.',
        'Strength train to lose fat without losing muscle.',
      ],
      'cuesta-ganar-peso': [
        'Work out your calories and eat about 300 kcal above maintenance.',
        'Add easy foods: nuts, homemade shakes, olive oil.',
        'Focus on adding weight to the main lifts week by week.',
      ],
      'entreno-casa': [
        'Progress with more reps, more sets or harder variations.',
        'Resistance bands or adjustable dumbbells multiply your options.',
        'Book your sessions like fixed appointments so you do not skip them.',
      ],
    },
    toolTitle: 'Start by working out your numbers',
    learnCta: 'Articles for your profile',
    restart: 'Retake the assessment',
    disclaimer: 'General guidance. Not a substitute for advice from a health professional.',
  },
};
