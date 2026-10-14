import type { Locale } from '@/i18n/config';
import type { CategoryId, ProfileId } from './taxonomy';

/**
 * Catálogo ÚNICO de productos de pago (brief biblioteca §5, con Shopify en lugar de Stripe).
 * - enlacePago: enlace de compra de Shopify. Sin él, el producto se muestra como lista de espera.
 * - publicado: false = no aparece en la web (datos pendientes). Nunca se inventan precios ni contenidos.
 * - demo: contenido gratuito de muestra que se ve en la página del producto (indexable).
 * - capacidadSemanal: para servicios manuales; al llenarse se muestra lista de espera.
 * El contenido de pago lo entrega Shopify (descarga digital): nunca está en la web.
 * Infoproductos: `trailer` son las escenas del tráiler en scroll y `capitulos` el índice que se
 *   enseña (títulos y de qué va cada parte, nunca el contenido completo).
 * - borrador: true = solo se ve en desarrollo (npm run dev), para revisar la página antes de publicar.
 */
export type Product = {
  id: string;
  slug: Record<Locale, string>;
  tipo: 'infoproducto' | 'servicio';
  nombre: Record<Locale, string>;
  paraQuien: Record<Locale, string>;
  incluye: Record<Locale, string[]>;
  precio: number | null;
  moneda: 'EUR';
  /** Precio de lanzamiento: se muestra como tal. */
  lanzamiento?: boolean;
  categoria: CategoryId | null;
  perfiles: ProfileId[];
  enlacePago: string | null;
  estado: 'disponible' | 'lista-espera';
  publicado: boolean;
  capacidadSemanal?: number;
  /**
   * Cómo se pide mientras no hay pago en la web: 'whatsapp' muestra el precio y un botón que abre
   * WhatsApp con un mensaje ya escrito (src/content/contact.ts). Quitarlo vuelve a Shopify.
   */
  contacto?: 'whatsapp';
  /** Mensaje ya escrito para WhatsApp. */
  mensajeWhatsapp?: Record<Locale, string>;
  demo?: Record<Locale, { titulo: string; secciones: Array<{ h: string; p: string }> }>;
  /** Escenas del tráiler: frase corta (k), titular (t) y una línea de apoyo (p). */
  trailer?: Record<Locale, Array<{ k: string; t: string; p: string }>>;
  /** Índice público del infoproducto. */
  capitulos?: Record<Locale, Array<{ t: string; p: string }>>;
  borrador?: boolean;
  /** Foto de la guía (nombre en public/img, p. ej. "art-menopausia"): fichas y portada. */
  imagen?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'fuerza-en-casa-8-semanas',
    slug: { es: 'fuerza-en-casa-8-semanas', en: 'home-strength-8-weeks' },
    tipo: 'infoproducto',
    nombre: { es: 'Fuerza en casa: 8 semanas', en: 'Home strength: 8 weeks' },
    paraQuien: {
      es: 'Para quien empieza (o vuelve) a entrenar en casa con poco material y quiere un plan claro: qué hacer cada día y cuándo subir de nivel.',
      en: 'For people starting (or returning) to train at home with little equipment who want a clear plan: what to do each day and when to level up. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Plan de 8 semanas, 3 días por semana y unos 40 minutos por sesión',
        '5 escaleras de progresión (empuje, tirón, pierna, cadera y tronco) con la técnica de cada escalón',
        'Prueba inicial para encontrar tu nivel y prueba final para medir tu avance',
        'Reglas de esfuerzo y progresión para saber cuándo subir de escalón',
        'Lo básico de proteína, calorías y sueño para progresar',
        'Registro imprimible y guía en PDF de 17 páginas',
      ],
      en: [
        '8-week plan, 3 days a week, about 40 minutes per session',
        '5 progression ladders (push, pull, legs, hips and core) with technique cues for every step',
        'Starting test to find your level and final test to measure your progress',
        'Effort and progression rules so you know when to move up',
        'Protein, calorie and sleep basics to keep progressing',
        'Printable training log and 17-page PDF guide (in Spanish)',
      ],
    },
    precio: 19,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'ganar-musculo',
    perfiles: ['entreno-casa', 'principiantes'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55395636019543:1',
    estado: 'disponible',
    publicado: true,
    demo: {
      es: {
        titulo: 'Semana 1 y la escalera de flexiones',
        secciones: [
          {
            h: 'Semana 1: aprender',
            p: '3 sesiones en días no seguidos (por ejemplo, lunes, miércoles y viernes). 2 series por ejercicio, terminando cada serie cuando aún podrías hacer 3-4 repeticiones más con buena técnica. La primera sesión es la prueba inicial: en cada ejercicio buscas el primer escalón en el que haces entre 8 y 15 repeticiones.',
          },
          {
            h: 'La sesión',
            p: 'Calentamiento de 5-7 minutos. Después, empuje y tirón alternados, pierna, y cadera alternada con tronco. Juntar ejercicios que trabajan músculos distintos ahorra unos 10 minutos sin restar calidad.',
          },
          {
            h: 'La escalera de flexiones',
            p: '1. Con manos en la pared. 2. Con manos en una mesa o encimera. 3. Con manos en el asiento de una silla. 4. En el suelo. 5. Con pies elevados. 6. Con mochila. Cuando llegas a 15 repeticiones en todas las series dos sesiones seguidas, subes un escalón.',
          },
          {
            h: 'Técnica: lo que más falla',
            p: 'Cuerpo recto de cabeza a talones y glúteos apretados para que la cadera no se hunda. Codos a unos 45° del cuerpo, no abiertos en cruz. Mejor menos repeticiones completas que muchas a medias.',
          },
        ],
      },
      en: {
        titulo: 'Week 1 and the push-up ladder',
        secciones: [
          {
            h: 'Week 1: learn',
            p: '3 sessions on non-consecutive days (for example Monday, Wednesday and Friday). 2 sets per exercise, ending each set when you could still do 3-4 more good reps. The first session is the starting test: for each exercise you find the first step where you can do 8 to 15 reps.',
          },
          {
            h: 'The session',
            p: 'A 5-7 minute warm-up. Then push and pull alternated, legs, and hips alternated with core. Pairing exercises for different muscles saves about 10 minutes without losing quality.',
          },
          {
            h: 'The push-up ladder',
            p: '1. Hands on a wall. 2. Hands on a table or counter. 3. Hands on a chair seat. 4. On the floor. 5. Feet elevated. 6. With a backpack. When you reach 15 reps on every set for two sessions in a row, move up one step.',
          },
          {
            h: 'Technique: the usual mistakes',
            p: 'Body straight from head to heels and glutes squeezed so the hips do not sag. Elbows at about 45° from your body, not flared out. Fewer full reps beat many half reps.',
          },
        ],
      },
    },
  },
  {
    id: 'fuerte-en-la-menopausia',
    imagen: 'art-menopausia',
    slug: { es: 'fuerte-en-la-menopausia', en: 'strong-through-menopause' },
    tipo: 'infoproducto',
    nombre: { es: 'Fuerte en la Menopausia', en: 'Strong Through Menopause' },
    paraQuien: {
      es: 'Para mujeres sanas en la perimenopausia o la menopausia que quieren empezar a entrenar fuerza y comer mejor, sin miedo a hacerse daño y con un punto de partida claro.',
      en: 'For healthy women in perimenopause or menopause who want to start strength training and eat better, without fear of getting hurt and with a clear starting point. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Rutina de gimnasio: 3 días por semana, 45-55 minutos, cuerpo completo',
        'Rutina en casa: 3 días, 35-45 minutos, casi sin material, con versión express de 25 minutos',
        'Progresión de 4 semanas y escala de esfuerzo para saber cuánto peso usar',
        'Guía de alimentación con el método del plato y la mano, menú semanal y lista de la compra',
        '12 recetas fáciles con ingredientes de supermercado',
        'Seguimiento semanal y respuestas a las dudas más frecuentes · PDF de 16 páginas',
      ],
      en: [
        'Gym routine: 3 days a week, 45-55 minutes, full body',
        'Home routine: 3 days, 35-45 minutes, almost no equipment, with a 25-minute express version',
        '4-week progression and an effort scale so you know how much weight to use',
        'Eating guide with the plate-and-hand method, weekly menu and shopping list',
        '12 easy recipes with supermarket ingredients',
        'Weekly tracking and answers to common questions · 16-page PDF (in Spanish)',
      ],
    },
    precio: 27,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'fuerza-tecnica',
    perfiles: ['mujeres-45', 'principiantes'],
    // Compra directa en Shopify (enlace de carrito: lleva al pago con el producto ya añadido).
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55394011808087:1',
    estado: 'disponible',
    publicado: true,
    trailer: {
      es: [
        { k: 'El punto de partida', t: 'No sabes por dónde empezar.', p: 'Miedo a hacerte daño y la sensación de que "ya no se puede cambiar".' },
        { k: 'Lo que cambia', t: 'Tu cuerpo cambia. Tu plan también.', p: 'Menos músculo, huesos que piden cuidado, más cansancio: la fuerza es la protagonista.' },
        { k: 'El plan', t: 'Tres días. Gimnasio o casa.', p: 'Dos rutinas con progresión de 4 semanas, explicadas paso a paso.' },
        { k: 'En la cocina', t: 'Comer bien sin contar calorías.', p: 'El método del plato y la mano, un menú semanal y 12 recetas fáciles.' },
      ],
      en: [
        { k: 'Where you start', t: 'You do not know where to begin.', p: 'Fear of getting hurt and the feeling that "it is too late to change".' },
        { k: 'What changes', t: 'Your body changes. So does your plan.', p: 'Less muscle, bones that need care, more tiredness: strength takes centre stage.' },
        { k: 'The plan', t: 'Three days. Gym or home.', p: 'Two routines with a 4-week progression, explained step by step.' },
        { k: 'In the kitchen', t: 'Eat well without counting calories.', p: 'The plate-and-hand method, a weekly menu and 12 easy recipes.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Lo básico', p: 'Qué suele cambiar en esta etapa y por qué la fuerza es la protagonista. Mitos que conviene dejar atrás.' },
        { t: 'Reglas de oro', p: 'Seis ideas que valen para cualquier rutina y la escala de esfuerzo del 1 al 10.' },
        { t: 'Rutina de gimnasio', p: 'Sesiones A y B de cuerpo completo, progresión de 4 semanas y alternativas a cada máquina.' },
        { t: 'Rutina en casa', p: 'Dos sesiones casi sin material, cómo progresar sin pesas y versión express.' },
        { t: 'Alimentación', p: 'Siete ideas para empezar, el plato y la mano, menú semanal de ejemplo y lista de la compra.' },
        { t: 'Recetas', p: 'Doce recetas de desayuno, comida, cena y snack, fáciles y con ingredientes de supermercado.' },
        { t: 'Seguimiento y dudas', p: 'Cómo saber si vas bien más allá de la báscula, con tabla semanal y dudas frecuentes.' },
        { t: 'Y ahora, ¿qué?', p: 'Lo que una guía puede darte y lo que no, y cómo seguir si quieres ir más allá.' },
      ],
      en: [
        { t: 'The basics', p: 'What usually changes at this stage and why strength takes centre stage. Myths to leave behind.' },
        { t: 'Golden rules', p: 'Six ideas for any routine and the 1-10 effort scale.' },
        { t: 'Gym routine', p: 'Full-body sessions A and B, a 4-week progression and alternatives for every machine.' },
        { t: 'Home routine', p: 'Two sessions with almost no equipment, how to progress without weights and an express version.' },
        { t: 'Eating', p: 'Seven ideas to start, the plate and the hand, a sample weekly menu and a shopping list.' },
        { t: 'Recipes', p: 'Twelve easy breakfast, lunch, dinner and snack recipes with supermarket ingredients.' },
        { t: 'Tracking and questions', p: 'How to tell you are on track beyond the scale, with a weekly table and FAQs.' },
        { t: 'What next?', p: 'What a guide can and cannot give you, and how to go further.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulos 1 y 2 (muestra): lo básico y las reglas de oro',
        secciones: [
          { h: 'Mito: "Si hago muchas abdominales, perderé la barriga"', p: 'No se puede quitar grasa de una zona concreta. La cintura cambia con el conjunto: fuerza, movimiento diario, alimentación sostenible y descanso.' },
          { h: 'Mito: "Levantar peso me pondrá voluminosa"', p: 'Con las cargas y las hormonas de una mujer adulta es muy poco probable. Lo habitual es ganar firmeza y fuerza.' },
          { h: 'Regla de oro: constancia antes que intensidad', p: 'Tres sesiones a la semana durante meses valen más que seis sesiones durante dos semanas. Si un día no llegas, haz una versión corta: 15 minutos son mejores que nada.' },
          { h: 'La escala de esfuerzo', p: 'La mayoría de las series deben acabar en un 7 sobre 10: exigente, pero podrías hacer unas 3 repeticiones más. El fallo muscular no lo necesitas para progresar.' },
        ],
      },
      en: {
        titulo: 'Chapters 1 and 2 (sample): the basics and the golden rules',
        secciones: [
          { h: 'Myth: "Lots of sit-ups will get rid of my belly"', p: 'You cannot burn fat from one specific spot. Your waist changes with the whole picture: strength, daily movement, sustainable eating and rest.' },
          { h: 'Myth: "Lifting weights will make me bulky"', p: 'With the loads and hormones of an adult woman it is very unlikely. What usually happens is you get firmer and stronger.' },
          { h: 'Golden rule: consistency over intensity', p: 'Three sessions a week for months beat six sessions for two weeks. If you cannot make it one day, do a short version: 15 minutes is better than nothing.' },
          { h: 'The effort scale', p: 'Most sets should end at 7 out of 10: hard, but you could do about 3 more reps. You do not need to train to failure to progress.' },
        ],
      },
    },
  },
  {
    // BORRADOR hasta que Manu apruebe la guía (docs/privado/infoproductos/pierde-grasa-sin-pasar-hambre).
    id: 'pierde-grasa-sin-pasar-hambre',
    imagen: 'art-grasa-abdominal',
    slug: { es: 'pierde-grasa-sin-pasar-hambre', en: 'lose-fat-without-hunger' },
    tipo: 'infoproducto',
    nombre: { es: 'Pierde grasa sin pasar hambre', en: 'Lose Fat Without Hunger' },
    paraQuien: {
      es: 'Para quien quiere perder grasa, también la de la barriga, sin dietas extremas ni alimentos prohibidos, y sin perder músculo por el camino.',
      en: 'For anyone who wants to lose fat, belly fat included, without extreme diets or banned foods, and without losing muscle along the way. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Tus números paso a paso: calorías, proteína y un ritmo realista, con ejemplos resueltos',
        'Las cinco claves para comer sin pasar hambre, el método del plato y la mano y lista de la compra',
        'Entrenamiento de fuerza 3 días, en gimnasio o en casa, con su progresión',
        'Plan de 8 semanas con un hábito nuevo cada semana',
        'Qué hacer con el hambre, los antojos, los fines de semana y las comidas fuera',
        'Las tres grandes dudas: por qué no pierdes peso si comes poco, cardio o pesas y entrenar en ayunas',
        'Cómo medir y ajustar cuando la báscula no se mueve · PDF de 20 páginas',
      ],
      en: [
        'Your numbers step by step: calories, protein and a realistic pace, with worked examples',
        'Five keys to eating without hunger, the plate-and-hand method and a shopping list',
        '3-day strength training, at the gym or at home, with progression',
        '8-week plan with one new habit each week',
        'Handling hunger, cravings, weekends and eating out',
        'The three big questions: why you are not losing weight on low calories, cardio or weights, and fasted training',
        'How to measure and adjust when the scale will not move · 20-page PDF (in Spanish)',
      ],
    },
    precio: 24,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'perder-grasa',
    perfiles: ['sobrepeso', 'principiantes'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55395632841047:1',
    estado: 'disponible',
    publicado: false,
    borrador: true,
    trailer: {
      es: [
        { k: 'El problema', t: 'Dietas que duran tres semanas.', p: 'Pierdes, pasas hambre, lo dejas y lo recuperas todo.' },
        { k: 'La causa', t: 'No es tu fuerza de voluntad.', p: 'Es un déficit demasiado grande y platos que no llenan.' },
        { k: 'El plan', t: 'Déficit moderado. Fuerza. Pasos.', p: 'Tus números, qué comer para no pasar hambre y cómo entrenar.' },
        { k: 'El resultado', t: 'Pierdes grasa, no músculo.', p: 'Y sabes qué hacer cuando la báscula no se mueve.' },
      ],
      en: [
        { k: 'The problem', t: 'Diets that last three weeks.', p: 'You lose, you go hungry, you quit and it all comes back.' },
        { k: 'The cause', t: 'It is not your willpower.', p: 'It is too big a deficit and meals that do not fill you up.' },
        { k: 'The plan', t: 'Moderate deficit. Strength. Steps.', p: 'Your numbers, what to eat to avoid hunger and how to train.' },
        { k: 'The result', t: 'You lose fat, not muscle.', p: 'And you know what to do when the scale stalls.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Lo que de verdad hace perder grasa', p: 'El déficit moderado, por qué proteger el músculo y los mitos que conviene dejar atrás.' },
        { t: 'Tus números', p: 'Mantenimiento, objetivo, proteína y ritmo esperado, con dos ejemplos resueltos.' },
        { t: 'Comer sin pasar hambre', p: 'Las claves de la saciedad, el plato y la mano, un día tipo y la lista de la compra.' },
        { t: 'El entrenamiento', p: 'Dos sesiones de fuerza con alternativas para casa, la doble progresión y los pasos diarios.' },
        { t: 'El plan de 8 semanas', p: 'Qué hacer cada semana en comida, entreno y hábitos.' },
        { t: 'Hambre, antojos y fines de semana', p: 'El papel del sueño, cómo gestionar el hambre y las comidas fuera.' },
        { t: 'Medir y ajustar', p: 'Qué mirar cada semana y cuándo tocar las calorías.' },
        { t: 'Las tres grandes dudas', p: '"Como poco y no pierdo peso", ¿cardio o pesas? y ¿entrenar en ayunas quema más grasa?, con lo que dicen los estudios.' },
        { t: 'Después de la semana 8', p: 'Seguir perdiendo, mantener o pasar a ganar músculo.' },
      ],
      en: [
        { t: 'What really drives fat loss', p: 'A moderate deficit, why to protect muscle and myths to leave behind.' },
        { t: 'Your numbers', p: 'Maintenance, target, protein and expected pace, with two worked examples.' },
        { t: 'Eating without hunger', p: 'Satiety keys, the plate and the hand, a sample day and a shopping list.' },
        { t: 'Training', p: 'Two strength sessions with home options, double progression and daily steps.' },
        { t: 'The 8-week plan', p: 'What to do each week with food, training and habits.' },
        { t: 'Hunger, cravings and weekends', p: 'The role of sleep, managing hunger and eating out.' },
        { t: 'Measure and adjust', p: 'What to track each week and when to change calories.' },
        { t: 'The three big questions', p: '"I eat little and do not lose weight", cardio or weights, and does fasted training burn more fat, with what the studies say.' },
        { t: 'After week 8', p: 'Keep losing, maintain or move on to building muscle.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulo 3 (muestra): lo que de verdad hace perder grasa',
        secciones: [
          { h: 'El déficit: necesario, pero moderado', p: 'Sin déficit no hay pérdida de grasa, da igual la dieta que sigas. Pero un déficit demasiado grande tiene un precio: más hambre, menos energía para entrenar y más pérdida de músculo. Por eso este plan usa uno moderado, que permite perder entre un 0,5 y un 1 % del peso a la semana.' },
          { h: 'Mito: "Haciendo abdominales perderé la barriga"', p: 'No se puede elegir de dónde se pierde la grasa. La barriga baja con el déficit, la fuerza y la constancia. Los abdominales fortalecen, pero no queman la grasa de encima.' },
          { h: 'Mito: "Los hidratos de carbono engordan"', p: 'Engorda comer más energía de la que gastas, venga de donde venga. Arroz, patata, pan o fruta caben en este plan.' },
        ],
      },
      en: {
        titulo: 'Chapter 3 (sample): what really drives fat loss',
        secciones: [
          { h: 'The deficit: necessary, but moderate', p: 'No deficit, no fat loss, whatever diet you follow. But too big a deficit has a cost: more hunger, less energy to train and more muscle loss. That is why this plan uses a moderate one, losing 0.5-1% of bodyweight per week.' },
          { h: 'Myth: "Sit-ups will get rid of my belly"', p: 'You cannot choose where you lose fat. Your belly shrinks with the deficit, strength work and consistency.' },
          { h: 'Myth: "Carbs make you fat"', p: 'Eating more energy than you burn makes you gain fat, wherever it comes from. Rice, potatoes, bread and fruit all fit this plan.' },
        ],
      },
    },
  },
  {
    id: 'entrena-sin-dolor',
    imagen: 'art-espalda',
    slug: { es: 'entrena-sin-dolor', en: 'train-without-pain' },
    tipo: 'infoproducto',
    nombre: { es: 'Entrena sin dolor', en: 'Train Without Pain' },
    paraQuien: {
      es: 'Para quien entrena (o quiere volver) con molestias comunes de espalda baja, rodilla u hombro y no sabe qué puede hacer sin empeorarlas.',
      en: 'For people who train (or want to return) with common low back, knee or shoulder aches and do not know what they can do without making them worse. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Señales de alarma: cuándo ir al médico y cuándo a urgencias',
        'Lo que dicen las guías clínicas sobre la espalda, la rodilla y el hombro',
        'El semáforo del dolor para saber cuánto es aceptable al entrenar',
        'Ejercicios con 3 niveles de progresión para cada zona',
        'Cómo adaptar sentadilla, peso muerto, press y dominadas',
        'Plan de 6 semanas y registro del dolor · PDF de 15 páginas',
      ],
      en: [
        'Red flags: when to see a doctor and when to go to A&E',
        'What clinical guidelines say about the back, knee and shoulder',
        'The pain traffic light to know how much is acceptable when training',
        'Exercises with 3 progression levels for each area',
        'How to adapt squats, deadlifts, presses and pull-ups',
        '6-week plan and pain log · 15-page PDF (in Spanish)',
      ],
    },
    precio: 24,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'recuperacion',
    perfiles: ['principiantes', 'entreno-casa'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55399388315991:1',
    estado: 'disponible',
    publicado: true,
    trailer: {
      es: [
        { k: 'El problema', t: 'Te duele y dejas de entrenar.', p: 'La espalda, la rodilla o el hombro. Y no sabes qué puedes hacer.' },
        { k: 'Lo que dice la evidencia', t: 'El reposo total no es la solución.', p: 'Las guías clínicas recomiendan seguir activo y hacer ejercicio adaptado.' },
        { k: 'El método', t: 'Un semáforo. Tres niveles. Seis semanas.', p: 'Sabes cuánto dolor es aceptable y cómo progresar sin pasarte.' },
        { k: 'El resultado', t: 'Vuelves a entrenar con confianza.', p: 'Y sabes cuándo toca ir al médico.' },
      ],
      en: [
        { k: 'The problem', t: 'It hurts, so you stop training.', p: 'Your back, knee or shoulder. And you do not know what you can do.' },
        { k: 'The evidence', t: 'Complete rest is not the answer.', p: 'Clinical guidelines recommend staying active with adapted exercise.' },
        { k: 'The method', t: 'One traffic light. Three levels. Six weeks.', p: 'You know how much pain is acceptable and how to progress safely.' },
        { k: 'The result', t: 'You train with confidence again.', p: 'And you know when it is time to see a doctor.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Señales de alarma', p: 'Los síntomas que piden ir a urgencias o al médico antes de empezar.' },
        { t: 'Lo que sabemos del dolor', p: 'Por qué dolor no siempre es daño y qué recomiendan las guías clínicas.' },
        { t: 'El semáforo del dolor', p: 'Verde, amarillo y rojo, y la prueba de la mañana siguiente.' },
        { t: 'Espalda baja', p: 'Qué hacer mientras está irritada y ejercicios en tres niveles.' },
        { t: 'Rodilla', p: 'Dolor delantero de rodilla y rodilla con artrosis: ejercicios de cadera y rodilla.' },
        { t: 'Hombro', p: 'Dolor al levantar el brazo: fuerza y control del hombro y la escápula.' },
        { t: 'Volver a tus ejercicios', p: 'Alternativas y las cinco palancas para adaptar cualquier ejercicio.' },
        { t: 'El plan de 6 semanas', p: 'Tres fases, una sesión tipo y cuándo pedir ayuda.' },
      ],
      en: [
        { t: 'Red flags', p: 'Symptoms that call for A&E or a doctor before starting.' },
        { t: 'What we know about pain', p: 'Why pain is not always damage and what clinical guidelines recommend.' },
        { t: 'The pain traffic light', p: 'Green, amber and red, and the next-morning test.' },
        { t: 'Low back', p: 'What to do while it is irritated and exercises in three levels.' },
        { t: 'Knee', p: 'Front-of-knee pain and knee osteoarthritis: hip and knee exercises.' },
        { t: 'Shoulder', p: 'Pain when lifting the arm: shoulder and shoulder-blade strength and control.' },
        { t: 'Back to your lifts', p: 'Alternatives and five levers to adapt any exercise.' },
        { t: 'The 6-week plan', p: 'Three phases, a sample session and when to get help.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulo 4 (muestra): el semáforo del dolor',
        secciones: [
          { h: 'Verde: 0-2 sobre 10', p: 'Molestia leve o nada. Sigue. Si estás así varias sesiones, puedes subir un poco la carga.' },
          { h: 'Amarillo: 3-4 sobre 10', p: 'Molestia que se nota, pero tolerable. Es aceptable si a la mañana siguiente estás igual o mejor que antes de entrenar. Mantén la carga, no la subas.' },
          { h: 'Rojo: 5 o más', p: 'Dolor que te hace cambiar cómo te mueves. Para ese ejercicio y la próxima vez usa menos peso, menos recorrido o la versión más fácil.' },
        ],
      },
      en: {
        titulo: 'Chapter 4 (sample): the pain traffic light',
        secciones: [
          { h: 'Green: 0-2 out of 10', p: 'Mild discomfort or none. Carry on. After a few sessions like this you can add a little load.' },
          { h: 'Amber: 3-4 out of 10', p: 'Noticeable but tolerable. Acceptable if the next morning you feel the same or better than before training. Keep the load, do not increase it.' },
          { h: 'Red: 5 or more', p: 'Pain that changes how you move. Stop that exercise and next time use less weight, less range or the easier version.' },
        ],
      },
    },
  },
  {
    // BORRADOR hasta que Manu apruebe la guía (docs/privado/infoproductos/fuerte-con-mounjaro-u-ozempic).
    id: 'fuerte-con-mounjaro-u-ozempic',
    slug: { es: 'fuerte-con-mounjaro-u-ozempic', en: 'strong-on-glp1' },
    tipo: 'infoproducto',
    nombre: { es: 'Fuerte con Mounjaro u Ozempic', en: 'Strong on Mounjaro or Ozempic' },
    paraQuien: {
      es: 'Para quien usa un medicamento GLP-1 recetado por su médico y quiere que el peso que pierde sea grasa, no músculo. Complementa al seguimiento médico.',
      en: 'For people using a GLP-1 medication prescribed by their doctor who want the weight they lose to be fat, not muscle. A complement to medical care. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Lo que le pasa a tu músculo según los ensayos, explicado sin rodeos',
        'Cuánta proteína comer con poco apetito y cómo llegar, con un día tipo',
        'Cómo comer con náuseas o estreñimiento',
        'Fuerza 3 días por semana, en gimnasio o en casa, con su progresión',
        'Plan de 8 semanas y señales para hablar con tu médico',
        'Qué hacer al dejar la medicación para no recuperar el peso · PDF de 15 páginas',
      ],
      en: [
        'What happens to your muscle according to the trials, explained plainly',
        'How much protein to eat with a small appetite, with a sample day',
        'How to eat with nausea or constipation',
        '3-day strength training, gym or home, with progression',
        '8-week plan and signs to talk to your doctor',
        'What to do when you stop the medication so the weight stays off · 15-page PDF (in Spanish)',
      ],
    },
    precio: 24,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'perder-grasa',
    perfiles: ['sobrepeso'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55399388512599:1',
    estado: 'disponible',
    publicado: false,
    borrador: true,
    trailer: {
      es: [
        { k: 'El problema', t: 'Pierdes peso. ¿Pero qué peso?', p: 'Sin fuerza ni proteína, una parte importante puede ser músculo.' },
        { k: 'Los datos', t: '5,3 de 13,6 kg fueron masa magra.', p: 'Es lo que se midió en el ensayo STEP 1 con semaglutida.' },
        { k: 'El plan', t: 'Proteína. Fuerza. Hábitos.', p: 'Lo que recomiendan cuatro sociedades científicas, convertido en un plan de 8 semanas.' },
        { k: 'El resultado', t: 'Pierdes grasa y conservas tu fuerza.', p: 'Y llegas preparada o preparado al día que dejes la medicación.' },
      ],
      en: [
        { k: 'The problem', t: 'You lose weight. But what weight?', p: 'Without strength work and protein, a big part can be muscle.' },
        { k: 'The data', t: '5.3 of 13.6 kg was lean mass.', p: 'That is what the STEP 1 semaglutide trial measured.' },
        { k: 'The plan', t: 'Protein. Strength. Habits.', p: 'What four scientific societies recommend, turned into an 8-week plan.' },
        { k: 'The result', t: 'You lose fat and keep your strength.', p: 'And you are ready for the day you stop the medication.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Lo que le pasa a tu músculo', p: 'Los datos de los ensayos STEP 1 y SURMOUNT 1 y por qué importa.' },
        { t: 'Seguridad primero', p: 'Cuándo hablar con tu médico antes de empezar y las señales de alarma.' },
        { t: 'Proteína con poco apetito', p: 'Cuánta, cuánta tiene cada alimento y cómo llegar comiendo poco.' },
        { t: 'Comer con náuseas o estreñimiento', p: 'Trucos que recomiendan las sociedades científicas.' },
        { t: 'El entrenamiento', p: 'Dos sesiones de fuerza con versión en casa y cómo progresar.' },
        { t: 'El plan de 8 semanas', p: 'Un hábito nuevo cada semana.' },
        { t: 'Huesos, energía y otras dudas', p: 'Lo que conviene vigilar mientras pierdes peso.' },
        { t: 'Cuando dejes la medicación', p: 'Lo que dicen los datos y qué hacer en la transición.' },
      ],
      en: [
        { t: 'What happens to your muscle', p: 'Data from the STEP 1 and SURMOUNT 1 trials and why it matters.' },
        { t: 'Safety first', p: 'When to talk to your doctor before starting and the warning signs.' },
        { t: 'Protein with a small appetite', p: 'How much, how much each food has and how to get there.' },
        { t: 'Eating with nausea or constipation', p: 'Tips recommended by scientific societies.' },
        { t: 'Training', p: 'Two strength sessions with a home version and how to progress.' },
        { t: 'The 8-week plan', p: 'One new habit each week.' },
        { t: 'Bones, energy and other questions', p: 'What to watch while you lose weight.' },
        { t: 'When you stop the medication', p: 'What the data says and what to do in the transition.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulo 2 (muestra): lo que le pasa a tu músculo',
        secciones: [
          { h: 'Lo que dicen los ensayos', p: 'En el ensayo STEP 1 (semaglutida), de los 13,6 kg perdidos de media, 8,3 kg fueron grasa y 5,3 kg masa magra. Los autores del documento de consenso de 2025 estiman que alrededor de un 20 % del peso perdido sería músculo.' },
          { h: 'Sin entrenamiento de fuerza', p: 'Los modelos estiman que el músculo sería un 10-15 % del peso perdido en mujeres y un 20-25 % en hombres. La fuerza y la proteína están para reducir esa cifra.' },
          { h: 'Lo que recomiendan', p: 'Entrenamiento de fuerza al menos 3 veces por semana, al menos 150 minutos de actividad aeróbica moderada a la semana y suficiente proteína.' },
        ],
      },
      en: {
        titulo: 'Chapter 2 (sample): what happens to your muscle',
        secciones: [
          { h: 'What the trials show', p: 'In the STEP 1 trial (semaglutide), of the 13.6 kg lost on average, 8.3 kg was fat and 5.3 kg lean mass. The 2025 joint advisory estimates about 20% of the weight lost would be muscle.' },
          { h: 'Without strength training', p: 'Models estimate muscle would be 10-15% of weight lost in women and 20-25% in men. Strength work and protein are there to reduce that.' },
          { h: 'What they recommend', p: 'Strength training at least 3 times a week, at least 150 minutes of moderate aerobic activity a week and enough protein.' },
        ],
      },
    },
  },
  {
    id: 'tu-primer-mes-en-el-gimnasio',
    imagen: 'art-cuanto-tarda',
    slug: { es: 'tu-primer-mes-en-el-gimnasio', en: 'your-first-month-at-the-gym' },
    tipo: 'infoproducto',
    nombre: { es: 'Tu primer mes en el gimnasio', en: 'Your First Month at the Gym' },
    paraQuien: {
      es: 'Para mujeres que empiezan (o vuelven) al gimnasio y quieren saber exactamente qué hacer cada día para ganar firmeza, glúteos y brazos, sin miedo a la zona de pesas.',
      en: 'For women starting (or returning to) the gym who want to know exactly what to do each day to get firmer, with stronger glutes and arms, without fear of the weights area. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Plan de 4 semanas, 3 días por semana, con series, repeticiones y descansos',
        'Los 10 ejercicios explicados, de la prensa al hip thrust',
        'Conoce el gimnasio: zonas, cómo ajustar una máquina y cómo perder el miedo',
        'Glúteos y brazos: lo que de verdad los cambia',
        'Comer para notar cambios: proteína y el método del plato',
        'Problemas frecuentes y registro de entrenamiento · PDF de 16 páginas',
      ],
      en: [
        '4-week plan, 3 days a week, with sets, reps and rest times',
        'The 10 exercises explained, from leg press to hip thrust',
        'Know the gym: areas, how to set up a machine and how to lose the fear',
        'Glutes and arms: what actually changes them',
        'Eating to see changes: protein and the plate method',
        'Common problems and training log · 16-page PDF (in Spanish)',
      ],
    },
    precio: 19,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'fuerza-tecnica',
    perfiles: ['principiantes'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55395633529175:1',
    estado: 'disponible',
    publicado: true,
    trailer: {
      es: [
        { k: 'El miedo', t: 'Entras y no sabes qué hacer.', p: 'Acabas en la cinta mientras la zona de pesas te intimida.' },
        { k: 'La verdad', t: 'Tu cuerpo responde igual de bien.', p: 'Con el mismo entrenamiento, las mujeres ganan músculo y fuerza como los hombres.' },
        { k: 'El plan', t: 'Tres días. Diez ejercicios.', p: 'Qué hacer cada día durante 4 semanas, explicado paso a paso.' },
        { k: 'El resultado', t: 'Entras sabiendo a qué vas.', p: 'Y en un mes, con más fuerza y el hábito creado.' },
      ],
      en: [
        { k: 'The fear', t: 'You walk in and do not know what to do.', p: 'You end up on the treadmill while the weights area intimidates you.' },
        { k: 'The truth', t: 'Your body responds just as well.', p: 'With the same training, women gain muscle and strength like men.' },
        { k: 'The plan', t: 'Three days. Ten exercises.', p: 'What to do each day for 4 weeks, explained step by step.' },
        { k: 'The result', t: 'You walk in knowing what to do.', p: 'And a month later, stronger and with the habit built.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Antes de empezar', p: 'Seguridad, qué llevar y cómo perder el miedo a la zona de pesas.' },
        { t: 'Conoce el gimnasio', p: 'Las zonas, cómo ajustar una máquina y las normas no escritas.' },
        { t: 'Las cuatro reglas', p: 'Esfuerzo, técnica, progresión y registro.' },
        { t: 'Los 10 ejercicios', p: 'Cómo se hace cada uno, con las claves de técnica.' },
        { t: 'El plan de 4 semanas', p: 'Días A, B y C, con su progresión semana a semana.' },
        { t: 'Glúteos y brazos', p: 'Lo que de verdad los cambia y lo que no.' },
        { t: 'Comer para notar cambios', p: 'Proteína, el método del plato y qué hacer si también quieres perder grasa.' },
        { t: 'Después del primer mes', p: 'Cómo seguir progresando.' },
      ],
      en: [
        { t: 'Before you start', p: 'Safety, what to bring and how to lose the fear of the weights area.' },
        { t: 'Know the gym', p: 'The areas, setting up a machine and the unwritten rules.' },
        { t: 'The four rules', p: 'Effort, technique, progression and logging.' },
        { t: 'The 10 exercises', p: 'How to do each one, with technique cues.' },
        { t: 'The 4-week plan', p: 'Days A, B and C, with week-by-week progression.' },
        { t: 'Glutes and arms', p: 'What actually changes them and what does not.' },
        { t: 'Eating to see changes', p: 'Protein, the plate method and what to do if you also want to lose fat.' },
        { t: 'After the first month', p: 'How to keep progressing.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulos 2 y 5 (muestra): perder el miedo y el hip thrust',
        secciones: [
          { h: 'Ve en horas tranquilas', p: 'A media mañana o a primera hora de la tarde suele haber menos gente. Pregunta en recepción cuándo hay menos afluencia.' },
          { h: 'Pide ayuda al personal', p: 'Los monitores están para eso. Pedir que te enseñen a ajustar una máquina es lo más normal del mundo.' },
          { h: 'El hip thrust', p: 'Espalda alta apoyada en un banco, pies apoyados y peso sobre la cadera. Sube la cadera apretando glúteos hasta que el cuerpo quede recto de hombros a rodillas. Pausa de un segundo arriba, sin arquear la zona lumbar.' },
        ],
      },
      en: {
        titulo: 'Chapters 2 and 5 (sample): losing the fear and the hip thrust',
        secciones: [
          { h: 'Go at quiet times', p: 'Mid-morning or early afternoon is usually quieter. Ask at reception when it is least busy.' },
          { h: 'Ask the staff', p: 'That is what instructors are there for. Asking how to set up a machine is completely normal.' },
          { h: 'The hip thrust', p: 'Upper back on a bench, feet planted and weight on your hips. Drive your hips up squeezing your glutes until your body is straight from shoulders to knees. Pause for a second at the top without arching your lower back.' },
        ],
      },
    },
  },
  {
    id: 'gana-peso-y-musculo',
    imagen: 'art-delgado',
    slug: { es: 'gana-peso-y-musculo', en: 'gain-weight-and-muscle' },
    tipo: 'infoproducto',
    nombre: { es: 'Gana peso y músculo', en: 'Gain Weight and Muscle' },
    paraQuien: {
      es: 'Para quien está delgado, siente que come mucho y no sube de peso, y quiere que lo que gane sea músculo y no barriga.',
      en: 'For people who are thin, feel they eat a lot but do not gain weight, and want what they gain to be muscle, not belly. The guide is in Spanish.',
    },
    incluye: {
      es: [
        'Por qué no subes de peso y cómo detectarlo',
        'Tus números: superávit moderado, proteína, grasa e hidratos, con ejemplos resueltos',
        'Comer más sin reventar: siete trucos, un día tipo y un batido casero',
        'Entrenamiento de fuerza de 3 días (cuerpo completo) o 4 días (torso y pierna)',
        'Suplementos: lo que sí merece la pena y lo que no',
        'Plan de 8 semanas, cómo ajustar y registro · PDF de 16 páginas',
      ],
      en: [
        'Why you are not gaining weight and how to spot it',
        'Your numbers: moderate surplus, protein, fat and carbs, with worked examples',
        'Eating more without feeling stuffed: seven tricks, a sample day and a homemade shake',
        '3-day full-body or 4-day upper/lower strength training',
        'Supplements: what is worth it and what is not',
        '8-week plan, how to adjust and a log · 16-page PDF (in Spanish)',
      ],
    },
    precio: 17,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'ganar-musculo',
    perfiles: ['cuesta-ganar-peso', 'principiantes'],
    enlacePago: 'https://cxdjyg-7c.myshopify.com/cart/55395634807127:1',
    estado: 'disponible',
    publicado: true,
    trailer: {
      es: [
        { k: 'El problema', t: 'Comes mucho. No subes.', p: 'Te dicen "come más", pero nadie te dice cuánto ni cómo.' },
        { k: 'La causa', t: 'No es solo tu metabolismo.', p: 'Comes mucho unos días y poco otros, y la media no llega.' },
        { k: 'El plan', t: 'Un poco más, todos los días.', p: 'Un superávit moderado, trucos para comerlo y fuerza para que vaya al músculo.' },
        { k: 'El resultado', t: 'Subes de peso. Y de fuerza.', p: 'Sin llenarte de grasa por el camino.' },
      ],
      en: [
        { k: 'The problem', t: 'You eat a lot. You do not gain.', p: 'People say "eat more" but nobody tells you how much or how.' },
        { k: 'The cause', t: 'It is not just your metabolism.', p: 'You eat a lot some days and little on others, and the average falls short.' },
        { k: 'The plan', t: 'A little more, every day.', p: 'A moderate surplus, tricks to eat it and strength work so it goes to muscle.' },
        { k: 'The result', t: 'You gain weight. And strength.', p: 'Without piling on fat along the way.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Por qué no subes de peso', p: 'Las causas más habituales y lo que casi nadie te cuenta.' },
        { t: 'Tus números', p: 'Mantenimiento, objetivo y macronutrientes, con dos ejemplos resueltos.' },
        { t: 'Comer más sin reventar', p: 'Siete trucos, un día tipo y un batido casero.' },
        { t: 'El entrenamiento', p: 'Opción de 3 o 4 días y las claves para que el peso vaya al músculo.' },
        { t: 'El plan de 8 semanas', p: 'Qué hacer cada semana en comida, entreno y hábitos.' },
        { t: 'Suplementos', p: 'Lo que sí y lo que no, sin gastar de más.' },
        { t: 'Medir y ajustar', p: 'Qué mirar cada semana y cuándo tocar las calorías.' },
        { t: 'Las tres grandes dudas', p: '"Como poco y no pierdo peso", ¿cardio o pesas? y ¿entrenar en ayunas quema más grasa?, con lo que dicen los estudios.' },
        { t: 'Después de la semana 8', p: 'Cómo seguir creciendo.' },
      ],
      en: [
        { t: 'Why you are not gaining', p: 'The usual causes and what almost nobody tells you.' },
        { t: 'Your numbers', p: 'Maintenance, target and macros, with two worked examples.' },
        { t: 'Eating more without feeling stuffed', p: 'Seven tricks, a sample day and a homemade shake.' },
        { t: 'Training', p: '3- or 4-day options and the keys to making weight go to muscle.' },
        { t: 'The 8-week plan', p: 'What to do each week with food, training and habits.' },
        { t: 'Supplements', p: 'What is worth it and what is not.' },
        { t: 'Measure and adjust', p: 'What to track each week and when to change calories.' },
        { t: 'The three big questions', p: '"I eat little and do not lose weight", cardio or weights, and does fasted training burn more fat, with what the studies say.' },
        { t: 'After week 8', p: 'How to keep growing.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulo 3 (muestra): por qué no subes de peso',
        secciones: [
          { h: 'Comes mucho algunos días, pero poco otros', p: 'Recuerdas la cena enorme del sábado, pero no el día que solo desayunaste un café. Lo que cuenta es la media de la semana.' },
          { h: 'Te llenas muy rápido', p: 'Platos con mucho volumen y poca energía (ensaladas enormes, mucha verdura, caldos) te sacian antes de llegar a lo que necesitas.' },
          { h: 'Lo que no es', p: '"Tener un metabolismo rapidísimo" casi nunca es la explicación completa. La solución es la misma para todos: saber cuánto comes y comer algo más de forma constante.' },
        ],
      },
      en: {
        titulo: 'Chapter 3 (sample): why you are not gaining weight',
        secciones: [
          { h: 'You eat a lot some days, but little on others', p: 'You remember the huge Saturday dinner, not the day you only had coffee for breakfast. What counts is the weekly average.' },
          { h: 'You fill up fast', p: 'High-volume, low-energy meals (huge salads, lots of veg, broths) fill you up before you reach what you need.' },
          { h: 'What it is not', p: '"A super-fast metabolism" is rarely the whole story. The fix is the same for everyone: know how much you eat and eat a bit more, consistently.' },
        ],
      },
    },
  },
  {
    id: 'revision-tecnica',
    imagen: 'portada',
    slug: { es: 'revision-de-tecnica', en: 'technique-review' },
    tipo: 'servicio',
    nombre: { es: 'Revisión de técnica en vídeo', en: 'Video technique review' },
    paraQuien: {
      es: 'Para quien entrena por su cuenta y quiere saber si está haciendo bien los ejercicios antes de cargar más peso.',
      en: 'For people who train on their own and want to know if their form is right before adding weight.',
    },
    incluye: {
      es: ['Revisión de 3 vídeos de tus ejercicios', 'Correcciones concretas de técnica para cada vídeo'],
      en: ['Review of 3 videos of your lifts', 'Specific technique corrections for each video'],
    },
    precio: 19,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'fuerza-tecnica',
    perfiles: ['principiantes', 'entreno-casa'],
    enlacePago: null, // PENDIENTE: enlace de compra de Shopify
    estado: 'disponible',
    publicado: true,
    capacidadSemanal: 10,
    // Mientras se programa el envío en la web, se pide y se hace por WhatsApp.
    contacto: 'whatsapp',
    mensajeWhatsapp: {
      es: 'Hola Manu, quiero la revisión de técnica en vídeo.',
      en: 'Hi Manu, I would like the video technique review.',
    },
  },
  {
    // BORRADOR para revisar la página de venta. Textos de estructura, NO el método: los
    // capítulos reales, el precio y el enlace de Shopify los decide Manu (docs/privado/infoproducto/).
    id: 'metodo-kozaef',
    slug: { es: 'metodo-kozaef', en: 'kozaef-method' },
    tipo: 'infoproducto',
    nombre: { es: 'Método Kozaef', en: 'Kozaef Method' },
    paraQuien: {
      es: 'Para quien entrena por su cuenta, lleva tiempo sin ver cambios y quiere un sistema claro para medir, ajustar y progresar sin depender de nadie.',
      en: 'For people who train on their own, have stopped seeing changes and want a clear system to measure, adjust and progress independently.',
    },
    incluye: {
      es: ['Guía completa en PDF, maquetada y con imágenes', 'Plantillas para registrar tus entrenos y tus números', 'Acceso a las actualizaciones de la guía'],
      en: ['Full PDF guide, designed and illustrated', 'Templates to log your training and your numbers', 'Access to guide updates'],
    },
    precio: null,
    moneda: 'EUR',
    categoria: 'ganar-musculo',
    perfiles: ['principiantes'],
    enlacePago: null,
    estado: 'lista-espera',
    publicado: false,
    borrador: true,
    trailer: {
      es: [
        { k: 'El problema', t: 'Entrenas. Pero no cambias.', p: 'Meses haciendo lo mismo y el espejo no se mueve.' },
        { k: 'La causa', t: 'No es falta de ganas.', p: 'Es entrenar sin datos: sin saber qué funciona ni qué falla.' },
        { k: 'El sistema', t: 'Mide. Ajusta. Progresa.', p: 'Las tres fases con las que trabajo, explicadas paso a paso.' },
        { k: 'El resultado', t: 'Sabes qué hacer cada semana.', p: 'Y cuando te atasques, sabes por qué.' },
      ],
      en: [
        { k: 'The problem', t: 'You train. But nothing changes.', p: 'Months of the same and the mirror does not move.' },
        { k: 'The cause', t: 'It is not lack of effort.', p: 'It is training without data: not knowing what works or what fails.' },
        { k: 'The system', t: 'Measure. Adjust. Progress.', p: 'The three phases I work with, explained step by step.' },
        { k: 'The result', t: 'You know what to do every week.', p: 'And when you get stuck, you know why.' },
      ],
    },
    capitulos: {
      es: [
        { t: 'Mide', p: 'Qué números importan, cómo tomarlos sin obsesionarte y cómo leerlos.' },
        { t: 'Ajusta', p: 'Cuándo y cómo cambiar volumen, descanso y comida según tus datos.' },
        { t: 'Progresa', p: 'Cómo planificar la sobrecarga semana a semana para seguir avanzando.' },
        { t: 'Cuando te estancas', p: 'Cómo detectar un estancamiento real y qué revisar primero.' },
      ],
      en: [
        { t: 'Measure', p: 'Which numbers matter, how to track them without obsessing and how to read them.' },
        { t: 'Adjust', p: 'When and how to change volume, rest and food based on your data.' },
        { t: 'Progress', p: 'How to plan overload week by week to keep moving forward.' },
        { t: 'When you stall', p: 'How to spot a real plateau and what to check first.' },
      ],
    },
    demo: {
      es: {
        titulo: 'Capítulo 1 (muestra): Mide',
        secciones: [
          { h: 'Por qué empezar midiendo', p: 'Sin un punto de partida no hay forma de saber si lo que haces funciona. Medir no es obsesionarse: es tener una referencia para decidir.' },
          { h: 'Los tres números básicos', p: 'Peso medio semanal, perímetro de cintura y las cargas de tus ejercicios principales. Con eso ya se pueden tomar casi todas las decisiones.' },
        ],
      },
      en: {
        titulo: 'Chapter 1 (sample): Measure',
        secciones: [
          { h: 'Why start by measuring', p: 'Without a starting point there is no way to know if what you do works. Measuring is not obsessing: it is having a reference to decide.' },
          { h: 'The three basic numbers', p: 'Weekly average weight, waist measurement and the loads on your main lifts. With that you can make almost every decision.' },
        ],
      },
    },
  },
];

/** Publicados; en desarrollo también los borradores (nunca llegan a producción). */
export const visibleProducts = () =>
  PRODUCTS.filter((p) => p.publicado || (p.borrador && process.env.NODE_ENV === 'development'));

/** ¿Se puede comprar? Sin enlace de pago (ni WhatsApp) o en lista de espera, no: nunca un botón roto. */
export const isBuyable = (p: Product) => p.estado === 'disponible' && (Boolean(p.enlacePago) || p.contacto === 'whatsapp');

export const productBySlug = (locale: Locale, slug: string) =>
  visibleProducts().find((p) => p.slug[locale] === slug) ?? null;

/**
 * Producto relacionado: primero el indicado (productoRelacionado), si no el de la misma
 * categoría y perfil, después solo categoría. null si no hay ninguno publicado.
 */
export function relatedProduct(opts: { id?: string | null; categoria?: CategoryId | null; perfiles?: ProfileId[] }): Product | null {
  const list = visibleProducts();
  if (opts.id) {
    const byId = list.find((p) => p.id === opts.id);
    if (byId) return byId;
  }
  const perfiles = opts.perfiles ?? [];
  return (
    list.find((p) => p.categoria === opts.categoria && p.perfiles.some((x) => perfiles.includes(x))) ??
    list.find((p) => p.categoria === opts.categoria) ??
    list.find((p) => p.perfiles.some((x) => perfiles.includes(x))) ??
    // Páginas generales (índices de /aprende y herramientas): el primer infoproducto.
    (!opts.categoria && perfiles.length === 0 ? list.find((p) => p.tipo === 'infoproducto') : undefined) ??
    null
  );
}

/** Texto legal de la casilla de desistimiento (contenido digital). REVISAR CON GESTOR. */
export const WITHDRAWAL_CONSENT: Record<Locale, string> = {
  es: 'Acepto que el contenido digital se me entregue de inmediato y entiendo que, una vez recibido, pierdo el derecho de desistimiento.',
  en: 'I agree to receive the digital content immediately and understand that once received I lose my right of withdrawal.',
};

/** Texto de la casilla para servicios (revisión de técnica). REVISAR CON GESTOR. */
export const SERVICE_CONSENT: Record<Locale, string> = {
  es: 'Solicito que el servicio empiece de inmediato y entiendo que, una vez completado, pierdo el derecho de desistimiento.',
  en: 'I ask for the service to start immediately and understand that once completed I lose my right of withdrawal.',
};
