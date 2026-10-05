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
  demo?: Record<Locale, { titulo: string; secciones: Array<{ h: string; p: string }> }>;
  /** Escenas del tráiler: frase corta (k), titular (t) y una línea de apoyo (p). */
  trailer?: Record<Locale, Array<{ k: string; t: string; p: string }>>;
  /** Índice público del infoproducto. */
  capitulos?: Record<Locale, Array<{ t: string; p: string }>>;
  borrador?: boolean;
};

export const PRODUCTS: Product[] = [
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

/** ¿Se puede comprar? Sin enlace de pago o en lista de espera, no: nunca un botón roto. */
export const isBuyable = (p: Product) => p.estado === 'disponible' && Boolean(p.enlacePago);

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
