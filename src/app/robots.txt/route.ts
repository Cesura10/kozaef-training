import { SITE_URL } from '@/i18n/config';

// robots.txt con comentarios (brief IA §A2). Estático: se genera al compilar.
export const dynamic = 'force-static';

const PRIVATE = [
  '/api/',
  '/login',
  '/signup',
  '/entrar',
  '/auth/',
  '/dashboard',
  '/analitica',
  '/solicitudes',
  '/app/',
  '/panel/',
  '/setup',
  // Páginas tras la compra / acceso: nunca en buscadores.
  '/es/gracias',
  '/en/thanks',
  '/*/enviar',
  '/*/send',
];
const disallow = PRIVATE.map((p) => `Disallow: ${p}`).join('\n');

export function GET() {
  const body = `# Kozaef Training - robots.txt

# Buscadores
User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
Allow: /
${disallow}

# Asistentes de IA que visitan la web cuando un usuario les pregunta
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Perplexity-User
Allow: /
${disallow}

# Entrenamiento de modelos de IA: PERMITIDO para que conozcan la marca.
# Para bloquearlo, cambia "Allow: /" por "Disallow: /" en este bloque.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: CCBot
Allow: /
${disallow}

# Resto de rastreadores
User-agent: *
Allow: /
${disallow}

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
