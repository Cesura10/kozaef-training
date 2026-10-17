import type { Dictionary } from './es';

const en: Dictionary = {
  meta: {
    title: 'Kozaef Training | Online personal training',
    description: 'Free calculators, training guides and 1:1 coaching with limited spots.',
  },
  nav: {
    home: 'Kozaef Training, home',
    main: 'Main',
    footer: 'Footer',
    tools: 'Tools',
    guides: 'Guides',
    coaching: 'Coaching',
    login: 'Log in',
    apply: 'Free audit',
    learn: 'Learn',
    programs: 'Guides',
    about: 'About',
    diagnosis: 'Free assessment',
    menu: 'Menu',
    language: 'Language',
  },
  hero: {
    titleA: 'Your online',
    titleB: 'personal trainer.',
    subtitle: 'I build a training and nutrition plan for you and we review it every week, so you lose fat, build muscle or start strength training without guessing.',
    ctaTools: 'See the tools',
    ctaHow: 'How I work',
    stepsTitle: 'How we start',
    steps: [
      { h: 'Free audit', p: 'Tell me about your case in 2 minutes and we review it together in a 20-minute video call.' },
      { h: 'Your plan', p: 'Training and nutrition built around your life, schedule and the food you like.' },
      { h: 'Weekly check-in', p: 'We look at your data and adjust. If you stall, we know why.' },
    ],
  },
  paths: {
    eyebrow: 'How I can help',
    title: 'Choose how you want to progress.',
    items: [
      { tag: 'Main', h: '1:1 coaching', p: 'I build your plan and check in every week. We start with a free audit to see if we are a fit.', cta: 'Get your free audit' },
      { tag: 'On your own', h: 'PDF guides', p: 'If you prefer to train alone, step-by-step guides for your goal, from €17. In Spanish.', cta: 'See the guides' },
      { tag: 'Free', h: 'Calculators and articles', p: 'Work out your calories and protein and learn what the evidence says, no sign-up.', cta: 'See the tools' },
    ],
  },
  calculator: {
    title: 'Protein calculator',
    badge: 'Free, no sign-up',
    goal: 'Your goal',
    goals: { lose: 'Lose fat', maintain: 'Maintain', gain: 'Build muscle' },
    weight: 'Body weight',
    daily: 'Your daily target',
    range: 'Useful range {min}-{max} g. About {perMeal} g per meal across {meals} meals.',
    emailCta: 'Get more guides like this',
  },
  tools: {
    eyebrow: 'Free tools',
    title: 'Your numbers, in seconds.',
    soon: 'Coming soon',
    calories: {
      title: 'Calories and macros',
      body: 'Your real daily energy expenditure and how to split protein, fat and carbs for your goal.',
    },
    protein: { title: 'Daily protein', body: 'Grams per day and per meal based on your weight and goal.' },
    bodyfat: { title: 'Body fat', body: 'Estimate from measurements with the Navy method, plus a target weight.' },
  },
  method: {
    title: 'No magic routines. A system.',
    items: [
      { word: 'Measure.', body: 'Calories, protein and strength as real numbers. No guessing what is going wrong.' },
      { word: 'Adjust.', body: 'Small, concrete changes based on your data: volume, rest and food.' },
      { word: 'Progress.', body: 'Progressive overload with weekly check-ins. If you stall, we know why.' },
    ],
  },
  guides: {
    title: 'Articles to break your plateau.',
  },
  coaching: {
    eyebrow: '1:1 coaching',
    title: 'A plan for you. Weekly check-ins.',
    photo: 'Your training photo goes here',
    items: [
      'Training and nutrition plan built around your life',
      'Weekly check-in with photos, measurements and loads',
      'Direct contact with me, not a bot',
    ],
    note: 'A 2-minute application to see if we are a fit',
  },
  newsletter: {
    title: 'One email a week. Only what works.',
    body: 'Technique, nutrition and the mistakes I see every week with my clients.',
    label: 'Your email',
    placeholder: 'name@email.com',
    submit: 'Subscribe',
    idle: 'One email a week at most. Unsubscribe with one click.',
    error: 'Check your email, it looks incomplete.',
    consent: 'I agree to receive emails from Kozaef Training with tips and offers, and I have read the',
    privacy: 'privacy policy',
    consentRequired: 'Tick the box so I can email you.',
    success: 'Done. I will write to you soon with what actually works.',
    rateLimited: 'Too many attempts in a row. Try again in a while.',
    failed: 'Could not save it. Please try again in a moment.',
  },
};

export default en;
