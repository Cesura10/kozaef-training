/**
 * Clasificación para el panel /analitica (lógica pura, con tests):
 * - classifyAgent: bot (con nombre) o navegador, a partir del user agent y de la categoría de
 *   "bot verificado" que da Cloudflare.
 * - channelFor: de dónde llega una visita (Google, Instagram, directo…), a partir del dominio de
 *   referencia y de la utm_source.
 */

const NAMED_BOTS: Array<[RegExp, string]> = [
  [/KozaefMonitor/, 'Monitor de Kozaef (propio)'],
  [/googlebot|google-inspectiontool|googleother|google-lens|adsbot-google|mediapartners-google|google-extended|storebot-google/i, 'Google'],
  [/bingbot|bingpreview|msnbot/i, 'Bing'],
  [/gptbot|chatgpt-user|oai-searchbot/i, 'ChatGPT (OpenAI)'],
  [/claudebot|claude-user|claude-searchbot|anthropic/i, 'Claude (Anthropic)'],
  [/perplexity/i, 'Perplexity'],
  [/amazonbot/i, 'Amazon'],
  [/applebot/i, 'Apple'],
  [/facebookexternalhit|meta-externalagent|meta-externalfetcher|facebot/i, 'Meta (Facebook / Instagram)'],
  [/whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot/i, 'Vista previa de enlaces'],
  [/yandex/i, 'Yandex'],
  [/ahrefs|semrush|mj12bot|dotbot|dataforseo|serpstat|seznam|petalbot|bytespider|ccbot|barkrowler|blexbot|piperic/i, 'Herramientas SEO y otros rastreadores'],
  [/headlesschrome|lighthouse|pagespeed|chrome-lighthouse|gtmetrix/i, 'Pruebas de velocidad'],
];

const GENERIC_BOT =
  /bot\b|bot\/|crawl|spider|slurp|scan|fetch|http-client|python|curl|wget|axios|^node|java\/|okhttp|libwww|go-http|scrapy|headless|monitor|uptime|^$/i;

/** Categorías de "bot verificado" de Cloudflare, en español. */
const VERIFIED_LABELS: Record<string, string> = {
  'Search Engine Crawler': 'Otros buscadores',
  'Search Engine Optimization': 'Herramientas SEO y otros rastreadores',
  'AI Search': 'Buscadores de IA',
  'AI Crawler': 'Rastreadores de IA',
  'AI Assistant': 'Asistentes de IA',
  'Page Preview': 'Vista previa de enlaces',
  Security: 'Escáneres de seguridad',
  Archiver: 'Archivo de webs',
  'Monitoring & Analytics': 'Monitorización',
  'Advertising & Marketing': 'Publicidad y marketing',
};

export type AgentKind = { kind: 'bot' | 'browser'; label: string; verified: boolean };

export function classifyAgent(userAgent: string, verifiedCategory?: string | null): AgentKind {
  const ua = userAgent ?? '';
  const named = NAMED_BOTS.find(([re]) => re.test(ua));
  if (named) return { kind: 'bot', label: named[1], verified: Boolean(verifiedCategory) };
  if (verifiedCategory) return { kind: 'bot', label: VERIFIED_LABELS[verifiedCategory] ?? verifiedCategory, verified: true };
  if (GENERIC_BOT.test(ua)) return { kind: 'bot', label: 'Programas automáticos sin nombre', verified: false };
  return { kind: 'browser', label: 'Navegador', verified: false };
}

export type Channel = { id: string; label: string };

const CHANNELS: Array<[RegExp, Channel]> = [
  [/(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com)$/, { id: 'ia', label: 'Asistentes de IA' }],
  [/(^|\.)google\.[a-z.]+$/, { id: 'google', label: 'Google (búsqueda)' }],
  [/(^|\.)bing\.com$|(^|\.)duckduckgo\.com$|(^|\.)yahoo\.|(^|\.)ecosia\.org$|(^|\.)yandex\./, { id: 'buscadores', label: 'Otros buscadores' }],
  [/(^|\.)instagram\.com$/, { id: 'instagram', label: 'Instagram' }],
  [/(^|\.)tiktok\.com$/, { id: 'tiktok', label: 'TikTok' }],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, { id: 'facebook', label: 'Facebook' }],
  [/(^|\.)(youtube\.com|youtu\.be)$/, { id: 'youtube', label: 'YouTube' }],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, { id: 'x', label: 'X (Twitter)' }],
  [/(^|\.)(wa\.me|whatsapp\.com)$/, { id: 'whatsapp', label: 'WhatsApp' }],
];

const UTM_CHANNELS: Record<string, Channel> = {
  google: { id: 'google', label: 'Google (búsqueda)' },
  instagram: { id: 'instagram', label: 'Instagram' },
  ig: { id: 'instagram', label: 'Instagram' },
  tiktok: { id: 'tiktok', label: 'TikTok' },
  facebook: { id: 'facebook', label: 'Facebook' },
  youtube: { id: 'youtube', label: 'YouTube' },
  whatsapp: { id: 'whatsapp', label: 'WhatsApp' },
  email: { id: 'email', label: 'Email' },
  newsletter: { id: 'email', label: 'Email' },
};

export const DIRECT: Channel = { id: 'directo', label: 'Directo (sin referencia)' };

/** utm_source manda (la pones tú en los enlaces); si no, el dominio de referencia. */
export function channelFor(referringDomain: string | null | undefined, utmSource?: string | null): Channel {
  const utm = utmSource?.trim().toLowerCase();
  if (utm) return UTM_CHANNELS[utm] ?? { id: utm, label: utm };
  const host = (referringDomain ?? '').toLowerCase().replace(/^www\./, '');
  if (!host || host === '$direct') return DIRECT;
  if (host === 'kozaeftraining.com' || host.endsWith('.kozaeftraining.com')) return DIRECT; // navegación interna sin primera página registrada
  return CHANNELS.find(([re]) => re.test(host))?.[1] ?? { id: host, label: host };
}
