import type { Locale } from '@/i18n/config';
import { sectionPath } from './routes';

/**
 * Solicitud de coaching. Las CLAVES de preguntas y respuestas deben coincidir con
 * public.scoring_rules (migración 20261003150000). Los textos se pueden cambiar libremente.
 */
export const applyPath = (locale: Locale) => sectionPath('apply', locale);

export const QUESTION_KEYS = ['goal', 'experience', 'stuck', 'days', 'commitment', 'invest'] as const;
export type QuestionKey = (typeof QUESTION_KEYS)[number];

export const ANSWERS: Record<QuestionKey, readonly string[]> = {
  goal: ['fat_loss', 'muscle', 'performance', 'health'],
  experience: ['none', 'under1', '1to3', 'over3'],
  stuck: ['starting', 'under3m', '3to12m', 'over1y'],
  days: ['1to2', '3to4', '5plus'],
  commitment: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  /** Filtro sin importes (2026-10-17). Sin reglas en scoring_rules: no suma puntos; 'not_now' muestra el plan B. */
  invest: ['yes', 'more_info', 'not_now'],
};

type Copy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** scale: textos de los extremos para preguntas de escala (1 y 10). */
  questions: Record<QuestionKey, { label: string; options: Record<string, string>; scale?: [string, string] }>;
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
    /** Plan B (guía en PDF): solo si responde "Ahora mismo no" a invertir en su entrenamiento. */
    planB: { title: string; body: string; cta: string };
  };
};

export const APPLY_COPY: Record<Locale, Copy> = {
  es: {
    metaTitle: 'Solicitar plaza de coaching 1:1 online',
    metaDescription: 'Solicita tu plaza de coaching 1:1: cuéntame tu caso en 2 minutos y lo revisamos juntos en una videollamada gratuita de 20 minutos.',
    h1: 'Solicita tu plaza',
    intro: 'Cuéntame tu caso en 2 minutos. Si puedo ayudarte, lo revisamos juntos en una videollamada de 20 minutos. Gratis y sin compromiso.',
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
      commitment: {
        label: 'Del 1 al 10, ¿cuál es tu compromiso para conseguir tu objetivo?',
        options: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10' },
        scale: ['1 = Solo estoy mirando', '10 = Voy a por todas'],
      },
      invest: {
        label: '¿Puedes invertir ahora en tu entrenamiento?',
        options: { yes: 'Sí', more_info: 'Quiero más información', not_now: 'Ahora mismo no' },
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
        title: 'Encajamos. Elige día para la videollamada.',
        body: 'Por lo que me cuentas, puedo ayudarte. Reserva tu videollamada gratuita de 20 minutos y revisamos tu caso.',
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
      planB: {
        title: 'Mientras tanto, puedes empezar por tu cuenta',
        body: 'Si ahora no es el momento para el coaching, esta guía en PDF te da un plan paso a paso para tu objetivo.',
        cta: 'Ver la guía',
      },
    },
  },
  en: {
    metaTitle: 'Apply for 1:1 online coaching',
    metaDescription: 'Tell me about your situation in 2 minutes and we will see if I can help with a plan built for you.',
    h1: 'Apply for your spot',
    intro: 'Tell me about your case in 2 minutes. If I can help, we review it together in a free 20-minute video call. No strings attached.',
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
      commitment: {
        label: 'From 1 to 10, how committed are you to reaching your goal?',
        options: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10' },
        scale: ['1 = Just looking', '10 = All in'],
      },
      invest: {
        label: 'Can you invest in your training right now?',
        options: { yes: 'Yes', more_info: 'I want more information', not_now: 'Not right now' },
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
      planB: {
        title: 'In the meantime, you can start on your own',
        body: 'If now is not the time for coaching, this PDF guide gives you a step-by-step plan for your goal.',
        cta: 'See the guide',
      },
    },
  },
};
