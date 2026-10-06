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
    precio: 24,
    moneda: 'EUR',
    lanzamiento: true,
    categoria: 'ganar-musculo',
    perfiles: ['entreno-casa', 'principiantes'],
    enlacePago: null, // Enlace de compra de Shopify: mientras sea null se muestra lista de espera.
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
    id: 'revision-tecnica',
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
