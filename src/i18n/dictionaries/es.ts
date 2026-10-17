const es = {
  meta: {
    title: 'Kozaef Training | Entrenador personal online',
    description: 'Kozaef Training: entrenador personal online en español. Coaching 1:1 de entrenamiento y nutrición, guías en PDF y calculadoras gratis de calorías y proteína.',
  },
  nav: {
    home: 'Kozaef Training, inicio',
    main: 'Principal',
    footer: 'Pie de página',
    tools: 'Herramientas',
    guides: 'Guías',
    coaching: 'Coaching',
    login: 'Entrar',
    apply: 'Auditoría gratis',
    learn: 'Aprende',
    programs: 'Guías',
    about: 'Sobre mí',
    diagnosis: 'Diagnóstico gratis',
    menu: 'Menú',
    language: 'Idioma',
  },
  hero: {
    titleA: 'Tu entrenador',
    titleB: 'personal online.',
    subtitle:
      'Te hago un plan de entrenamiento y nutrición para ti y lo revisamos cada semana, para que pierdas grasa, ganes músculo o empieces a entrenar fuerza sin adivinar.',
    ctaTools: 'Ver herramientas',
    ctaHow: 'Cómo trabajo',
    stepsTitle: 'Así empezamos',
    steps: [
      { h: 'Auditoría gratis', p: 'Me cuentas tu caso en 2 minutos y lo revisamos juntos en una videollamada de 20.' },
      { h: 'Tu plan', p: 'Entrenamiento y nutrición ajustados a tu vida, tu horario y lo que te gusta comer.' },
      { h: 'Revisión cada semana', p: 'Miramos tus datos y ajustamos. Si no avanzas, sabemos por qué.' },
    ],
  },
  paths: {
    eyebrow: 'Cómo puedo ayudarte',
    title: 'Elige cómo quieres avanzar.',
    items: [
      { tag: 'Lo principal', h: 'Coaching 1:1', p: 'Te hago el plan y te acompaño cada semana. Empezamos con una auditoría gratis para ver si encajamos.', cta: 'Pedir auditoría gratis' },
      { tag: 'Por tu cuenta', h: 'Guías en PDF', p: 'Si prefieres entrenar solo, guías con un plan paso a paso para tu objetivo, desde 17 €.', cta: 'Ver guías' },
      { tag: 'Gratis', h: 'Calculadoras y artículos', p: 'Calcula tus calorías y tu proteína, y aprende lo que dice la evidencia, sin registrarte.', cta: 'Ver herramientas' },
    ],
  },
  calculator: {
    title: 'Calculadora de proteína',
    badge: 'Gratis, sin registro',
    goal: 'Tu objetivo',
    goals: { lose: 'Perder grasa', maintain: 'Mantener', gain: 'Ganar músculo' },
    weight: 'Peso corporal',
    daily: 'Tu objetivo diario',
    /** {min}, {max}, {perMeal}, {meals} */
    range: 'Rango útil {min}-{max} g. Unos {perMeal} g por comida en {meals} tomas.',
    emailCta: 'Quiero más guías como esta',
  },
  tools: {
    eyebrow: 'Herramientas gratis',
    title: 'Tus números, en segundos.',
    soon: 'Muy pronto',
    calories: {
      title: 'Calorías y macros',
      body: 'Tu gasto diario real y el reparto de proteína, grasa y carbohidrato según tu objetivo.',
    },
    protein: { title: 'Proteína diaria', body: 'Gramos al día y por comida según tu peso y objetivo.' },
    bodyfat: { title: 'Grasa corporal', body: 'Estimación por medidas con el método Navy y peso objetivo.' },
  },
  method: {
    title: 'Sin rutinas mágicas. Con un sistema.',
    items: [
      { word: 'Mide.', body: 'Calorías, proteína y fuerza en números reales. Sin adivinar qué está fallando.' },
      { word: 'Ajusta.', body: 'Cambios pequeños y concretos según tus datos: volumen, descanso y comida.' },
      { word: 'Progresa.', body: 'Sobrecarga progresiva con seguimiento semanal. Si no avanzas, sabemos por qué.' },
    ],
  },
  guides: {
    title: 'Artículos para dejar de estancarte.',
  },
  coaching: {
    eyebrow: 'Coaching 1:1',
    title: 'Un plan para ti. Revisión cada semana.',
    photo: 'Aquí va tu foto entrenando',
    items: [
      'Plan de entrenamiento y nutrición ajustado a tu vida',
      'Revisión semanal con fotos, medidas y cargas',
      'Contacto directo conmigo, no con un bot',
    ],
    note: 'Solicitud de 2 minutos para ver si encajamos',
  },
  newsletter: {
    title: 'Un correo a la semana. Solo lo que funciona.',
    body: 'Técnica, nutrición y los errores que veo cada semana en mis clientes.',
    label: 'Tu email',
    placeholder: 'nombre@correo.com',
    submit: 'Suscribirme',
    idle: 'Un email a la semana como mucho. Te das de baja con un clic.',
    error: 'Revisa el email, parece incompleto.',
    consent: 'Acepto recibir emails de Kozaef Training con consejos y ofertas, y he leído la',
    privacy: 'política de privacidad',
    consentRequired: 'Marca la casilla para poder escribirte.',
    success: 'Hecho. Te escribiré pronto con lo que funciona de verdad.',
    rateLimited: 'Demasiados intentos seguidos. Prueba de nuevo en un rato.',
    failed: 'No se pudo guardar. Inténtalo de nuevo en un momento.',
  },
};

export type Dictionary = typeof es;
export default es;
