import type { Locale } from '@/i18n/config';

/**
 * Recomendaciones con enlace de afiliado (Prozis).
 * - code: el código de afiliado de Manu. Prozis atribuye la venta con el parámetro ?ot=<código>.
 *   Mientras sea null, los enlaces llevan a la página del producto sin código (no dan comisión).
 * - discount: descuento para el cliente con el código (p. ej. "10 %"). Solo lo que Prozis confirme.
 * Nunca se muestran precios: cambian a diario en la tienda.
 * Los textos de "por qué" y "cómo tomarla" salen de los artículos (con sus fuentes).
 */
export const AFFILIATE = {
  brand: 'Prozis',
  code: null as string | null,
  discount: null as string | null,
};

export type AffiliateProductId = 'creatina' | 'proteina';

export type AffiliateProduct = {
  id: AffiliateProductId;
  url: string;
  /** Palabra grande del visual (tipografía, sin fotos de producto). */
  mark: string;
  nombre: Record<Locale, string>;
  formato: Record<Locale, string>;
  claim: Record<Locale, string>;
  porQue: Record<Locale, string[]>;
  comoTomar: Record<Locale, string>;
  /** Artículo o herramienta donde se explica a fondo. */
  masInfo: Record<Locale, { label: string; href: string }>;
};

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'creatina',
    url: 'https://www.prozis.com/es/es/prozis/monohidrato-de-creatina-300-g',
    mark: 'CREA',
    nombre: { es: 'Creatina monohidrato', en: 'Creatine monohydrate' },
    formato: { es: 'Prozis · 300 g en polvo', en: 'Prozis · 300 g powder' },
    claim: {
      es: 'El suplemento con más evidencia para rendir más y ganar masa magra entrenando fuerza.',
      en: 'The supplement with the strongest evidence for performance and lean mass with strength training.',
    },
    porQue: {
      es: ['Monohidrato: la forma más estudiada y ninguna otra es mejor', 'Más rendimiento en esfuerzos cortos e intensos', 'Segura a las dosis recomendadas en personas sanas'],
      en: ['Monohydrate: the most studied form, none is better', 'Better performance in short, intense efforts', 'Safe at recommended doses in healthy people'],
    },
    comoTomar: {
      es: '3-5 g al día, todos los días, a la hora que no se te olvide.',
      en: '3-5 g a day, every day, at whatever time you will not forget.',
    },
    masInfo: {
      es: { label: 'Guía completa de la creatina', href: '/es/aprende/nutricion/creatina-para-que-sirve-cuanta-tomar' },
      en: { label: 'Read the guide (Spanish)', href: '/es/aprende/nutricion/creatina-para-que-sirve-cuanta-tomar' },
    },
  },
  {
    id: 'proteina',
    url: 'https://www.prozis.com/es/es/prozis/100-real-whey-protein-1000-g',
    mark: 'WHEY',
    nombre: { es: 'Proteína de suero (whey)', en: 'Whey protein' },
    formato: { es: 'Prozis 100 % Real Whey · 1 kg', en: 'Prozis 100% Real Whey · 1 kg' },
    claim: {
      es: 'La forma más cómoda de llegar a tu proteína diaria cuando con la comida no te da.',
      en: 'The easiest way to hit your daily protein when food alone falls short.',
    },
    porQue: {
      es: ['Un cacito cubre una buena ración de proteína', 'Práctica después de entrenar o entre comidas', 'Te ayuda a llegar a la cifra de tu calculadora'],
      en: ['One scoop covers a good protein serving', 'Handy after training or between meals', 'Helps you reach your calculator target'],
    },
    comoTomar: {
      es: 'Un cacito cuando te falte proteína para llegar a tu cifra del día. No sustituye a la comida.',
      en: 'One scoop when you fall short of your daily target. It does not replace food.',
    },
    masInfo: {
      es: { label: 'Calcula cuánta proteína necesitas', href: '/es/herramientas/calculadora-proteina' },
      en: { label: 'Calculate your protein', href: '/en/tools/protein-calculator' },
    },
  },
];

export const affiliateProduct = (id: AffiliateProductId) => AFFILIATE_PRODUCTS.find((p) => p.id === id)!;

/** Enlace con el código de afiliado, si lo hay. */
export function affiliateUrl(p: AffiliateProduct) {
  if (!AFFILIATE.code) return p.url;
  const u = new URL(p.url);
  u.searchParams.set('ot', AFFILIATE.code);
  return u.toString();
}

export const AFFILIATE_COPY: Record<
  Locale,
  { eyebrow: string; buy: string; code: string; copy: string; copied: string; howTo: string; disclosure: string; disclosureNoCode: string }
> = {
  es: {
    eyebrow: 'Mi recomendación',
    buy: 'Comprar en Prozis',
    code: 'Código',
    copy: 'Copiar',
    copied: 'Copiado',
    howTo: 'Cómo tomarla',
    disclosure: 'Enlace de afiliado: si compras con él o con mi código, recibo una comisión sin coste extra para ti.',
    disclosureNoCode: 'Enlace a la tienda de Prozis. Recomiendo solo lo que tiene respaldo de la evidencia.',
  },
  en: {
    eyebrow: 'My pick',
    buy: 'Buy at Prozis',
    code: 'Code',
    copy: 'Copy',
    copied: 'Copied',
    howTo: 'How to take it',
    disclosure: 'Affiliate link: if you buy through it or with my code, I earn a commission at no extra cost to you.',
    disclosureNoCode: 'Link to the Prozis store. I only recommend what the evidence supports.',
  },
};
