/**
 * Atribución de primer contacto: UTM + referrer de la PRIMERA visita.
 * Se guarda en localStorage (dato funcional propio, sin terceros) y se adjunta al lead.
 */
const KEY = 'kz_attribution';

export type Attribution = {
  source: string;          // tiktok | instagram | google | youtube | directo | <dominio>
  utm: Record<string, string>;
  referrer: string | null;
  landing: string;
  at: string;
};

// Canal "ia" (brief IA §A7): asistentes que enlazan a la web. Va antes que google.
const AI_HOSTS = /(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com)$/;

const SOURCE_BY_HOST: Array<[RegExp, string]> = [
  [AI_HOSTS, 'ia'],
  [/tiktok\./, 'tiktok'],
  [/instagram\.|l\.instagram\./, 'instagram'],
  [/google\./, 'google'],
  [/youtube\.|youtu\.be/, 'youtube'],
  [/facebook\.|fb\./, 'facebook'],
];

function detectSource(utm: Record<string, string>, referrer: string | null): string {
  if (utm.utm_source) {
    const src = utm.utm_source.toLowerCase();
    if (AI_HOSTS.test(src)) return 'ia'; // p. ej. utm_source=chatgpt.com
    return src.slice(0, 40);
  }
  if (!referrer) return 'directo';
  try {
    const host = new URL(referrer).hostname;
    if (host === window.location.hostname) return 'directo';
    return SOURCE_BY_HOST.find(([re]) => re.test(host))?.[1] ?? host.slice(0, 40);
  } catch {
    return 'directo';
  }
}

/** Guarda la atribución solo la primera vez. Devuelve la vigente. */
export function captureAttribution(): Attribution | null {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return JSON.parse(existing) as Attribution;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = params.get(k);
      if (v) utm[k] = v.slice(0, 100);
    }
    const referrer = document.referrer || null;
    const value: Attribution = {
      source: detectSource(utm, referrer),
      utm,
      referrer,
      landing: window.location.pathname,
      at: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(value));
    return value;
  } catch {
    return null; // modo privado o almacenamiento bloqueado: seguimos sin atribución
  }
}

export function getAttribution(): Attribution | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Attribution) : null;
  } catch {
    return null;
  }
}
