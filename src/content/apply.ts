import type { Locale } from '@/i18n/config';
import { sectionPath } from './routes';

/**
 * Solicitud de coaching. Las CLAVES de preguntas y respuestas deben coincidir con
 * public.scoring_rules (migración 20261003150000). Los textos se pueden cambiar libremente.
 */
export const applyPath = (locale: Locale) => sectionPath('apply', locale);

export const QUESTION_KEYS = ['goal', 'experience', 'stuck', 'days', 'budget', 'start'] as const;
export type QuestionKey = (typeof QUESTION_KEYS)[number];

export const ANSWERS: Record<QuestionKey, readonly string[]> = {
  goal: ['fat_loss', 'muscle', 'performance', 'health'],
  experience: ['none', 'under1', '1to3', 'over3'],
  stuck: ['starting', 'under3m', '3to12m', 'over1y'],
  days: ['1to2', '3to4', '5plus'],
  budget: ['under50', '50to100', '100to200', 'over200'],
  start: ['now', 'month', 'looking'],
};

type Copy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  questions: Record<QuestionKey, { label: string; options: Record<string, string> }>;
  tried: string;
  triedHint: string;
  name: string;
  email: string;
  privacy: string;
  privacyLink: string;
  age: string;
  submit: string;
  sending: string;
  missing: string;
  limited: string;
  failed: string;
  results: {
    qualified: { title: string; body: string; cta: string; noCalendar: string };
    waitlist: { title: string; body: string };
    low: { title: string; body: string; cta: string };
    lowBudget: { title: string; body: string; cta: string };
  };
};

export const APPLY_COPY: Record<Locale, Copy> = {
  es: {
    metaTitle: 'Solicitar plaza de coaching 1:1',
    metaDescription: 'Cuéntame tu situación en 2 minutos y vemos si puedo ayudarte con un plan de entrenamiento y nutrición hecho para ti.',
    h1: 'Solicita tu plaza',
    intro: 'Dos minutos para ver si encajamos. Trabajo con pocas personas a la vez para dedicar a cada una el tiempo que necesita.',
    questions: {
      goal: {
        label: '¿Cuál es tu objetivo principal?',
        options: { fat_loss: 'Perder grasa', muscle: 'Ganar músculo', performance: 'Rendir más', health: 'Salud y hábitos' },
      },
      experience: {
        label: '¿Cuánto tiempo llevas entrenando?',
        options: { none: 'Empiezo ahora', under1: 'Menos de 1 año', '1to3': '1-3 años', over3: 'Más de 3 años' },
      },
      stuck: {
        label: '¿Cuánto llevas sin ver los resultados que quieres?',
        options: { starting: 'Acabo de empezar', under3m: 'Menos de 3 meses', '3to12m': '3-12 meses', over1y: 'Más de 1 año' },
      },
      days: {
        label: '¿Cuántos días a la semana puedes entrenar?',
        options: { '1to2': '1-2 días', '3to4': '3-4 días', '5plus': '5 o más' },
      },
      budget: {
        label: '¿Cuánto puedes invertir al mes en tu entrenamiento?',
        options: { under50: 'Menos de 50 €', '50to100': '50-100 €', '100to200': '100-200 €', over200: 'Más de 200 €' },
      },
      start: {
        label: '¿Cuándo quieres empezar?',
        options: { now: 'Ya', month: 'En el próximo mes', looking: 'Solo estoy mirando' },
      },
    },
    tried: '¿Qué has probado hasta ahora y qué no ha funcionado? (opcional)',
    triedHint: 'Cuanto más concreto, mejor puedo valorar tu caso.',
    name: 'Nombre',
    email: 'Email',
    privacy: 'He leído la',
    privacyLink: 'política de privacidad',
    age: 'Tengo 14 años o más',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    missing: 'Responde todas las preguntas y acepta la privacidad para continuar.',
    limited: 'Ya has enviado una solicitud hace poco. Te responderé pronto.',
    failed: 'No se pudo enviar. Inténtalo de nuevo en un momento.',
    results: {
      qualified: {
        title: 'Encajamos. Elige tu llamada.',
        body: 'Por lo que me cuentas, puedo ayudarte. Reserva una videollamada de 20 minutos y vemos tu plan.',
        cta: 'Elegir día y hora',
        noCalendar: 'Te escribo en las próximas 48 horas para cerrar la llamada.',
      },
      waitlist: {
        title: 'Plazas completas esta semana',
        body: 'Tu perfil encaja, pero ahora mismo no tengo huecos. Te escribo en cuanto se libere una plaza.',
      },
      low: {
        title: 'Gracias por contármelo',
        body: 'Ahora mismo te va a ayudar más empezar por lo básico. Usa las herramientas gratis y apúntate a la lista: cada semana mando lo que funciona.',
        cta: 'Ver herramientas gratis',
      },
      lowBudget: {
        title: 'Empieza por tu cuenta con un programa guiado',
        body: 'Programas y guías para entrenar con un método claro, por mucho menos que un coaching personal.',
        cta: 'Ver programas',
      },
    },
  },
  en: {
    metaTitle: 'Apply for 1:1 coaching',
    metaDescription: 'Tell me about your situation in 2 minutes and we will see if I can help with a plan built for you.',
    h1: 'Apply for a spot',
    intro: 'Two minutes to see if we are a fit. I work with a small number of people so each one gets the time they need.',
    questions: {
      goal: {
        label: 'What is your main goal?',
        options: { fat_loss: 'Lose fat', muscle: 'Build muscle', performance: 'Perform better', health: 'Health and habits' },
      },
      experience: {
        label: 'How long have you been training?',
        options: { none: 'Just starting', under1: 'Under 1 year', '1to3': '1-3 years', over3: 'Over 3 years' },
      },
      stuck: {
        label: 'How long without the results you want?',
        options: { starting: 'Just started', under3m: 'Under 3 months', '3to12m': '3-12 months', over1y: 'Over 1 year' },
      },
      days: {
        label: 'How many days a week can you train?',
        options: { '1to2': '1-2 days', '3to4': '3-4 days', '5plus': '5 or more' },
      },
      budget: {
        label: 'How much can you invest per month?',
        options: { under50: 'Under €50', '50to100': '€50-100', '100to200': '€100-200', over200: 'Over €200' },
      },
      start: {
        label: 'When do you want to start?',
        options: { now: 'Right away', month: 'Within a month', looking: 'Just looking' },
      },
    },
    tried: 'What have you tried so far and what did not work? (optional)',
    triedHint: 'The more specific, the better I can assess your case.',
    name: 'Name',
    email: 'Email',
    privacy: 'I have read the',
    privacyLink: 'privacy policy',
    age: 'I am 14 or older',
    submit: 'Send application',
    sending: 'Sending…',
    missing: 'Answer every question and accept the privacy policy to continue.',
    limited: 'You sent an application recently. I will reply soon.',
    failed: 'Could not send it. Please try again in a moment.',
    results: {
      qualified: {
        title: 'We are a fit. Pick your call.',
        body: 'From what you told me, I can help. Book a 20-minute video call and we will go over your plan.',
        cta: 'Pick a day and time',
        noCalendar: 'I will email you within 48 hours to set up the call.',
      },
      waitlist: {
        title: 'Spots are full this week',
        body: 'You are a good fit, but I have no openings right now. I will email you as soon as a spot opens.',
      },
      low: {
        title: 'Thanks for sharing',
        body: 'Right now the basics will help you most. Use the free tools and join the list: every week I send what works.',
        cta: 'See the free tools',
      },
      lowBudget: {
        title: 'Start on your own with a guided programme',
        body: 'Programmes and guides to train with a clear method, for much less than 1:1 coaching.',
        cta: 'See programmes',
      },
    },
  },
};
