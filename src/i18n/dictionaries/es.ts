const es = {
  meta: {
    title: 'Kozaef Training | Entrenamiento personal online',
    description: 'Calculadoras gratis, guías de entrenamiento y coaching 1:1 con plazas limitadas.',
  },
  nav: {
    home: 'Kozaef Training, inicio',
    main: 'Principal',
    footer: 'Pie de página',
    tools: 'Herramientas',
    guides: 'Guías',
    coaching: 'Coaching',
    login: 'Entrar',
    apply: 'Solicitar plaza',
    language: 'Idioma',
  },
  hero: {
    titleA: 'Entrena con criterio.',
    titleB: 'Progresa con datos.',
    subtitle:
      'Herramientas gratis, guías claras y coaching 1:1 para quien lleva meses entrenando sin ver cambios.',
    ctaTools: 'Ver herramientas',
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
    emailCta: 'Recibir el plan completo por email',
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
    title: 'Guías para dejar de estancarte.',
    items: [
      { tag: 'Estancamiento', title: 'Llevo meses sin ganar músculo: las 5 causas reales' },
      { tag: 'Nutrición', title: 'Cuánta proteína necesitas de verdad (y cuándo tomarla)' },
      { tag: 'Técnica', title: 'Errores en el press banca que frenan tu fuerza' },
      { tag: 'Programación', title: 'Sobrecarga progresiva explicada sin humo' },
    ],
  },
  coaching: {
    eyebrow: 'Coaching 1:1',
    title: 'Plazas limitadas. Trabajo de verdad.',
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
    idle: 'Puedes darte de baja con un clic.',
    error: 'Revisa el email, parece incompleto.',
    preview: 'Vista previa: el envío se activa en cuanto conectemos el email.',
  },
};

export type Dictionary = typeof es;
export default es;
