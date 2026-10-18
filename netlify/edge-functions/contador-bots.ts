// Cuenta cada PÁGINA servida por tipo de visitante (navegador o el bot que sea) para el panel
// /analitica. Netlify gratis no da registros de acceso y Cloudflare ya no ve el tráfico.
// Nunca bloquea ni retrasa la respuesta: la anotación va en segundo plano y cualquier fallo se ignora.
import type { Config, Context } from '@netlify/edge-functions';
import { classifyAgent } from '../../src/lib/analytics/classify.ts';

export default async function contadorBots(req: Request, context: Context) {
  try {
    const accept = req.headers.get('accept') ?? '';
    const url = Netlify.env.get('NEXT_PUBLIC_SUPABASE_URL');
    const key = Netlify.env.get('SUPABASE_SERVICE_ROLE_KEY');
    // Solo páginas (no imágenes, scripts ni llamadas a la API). Los bots no siempre envían Accept.
    if (req.method === 'GET' && url && key && (accept.includes('text/html') || accept === '' || accept === '*/*')) {
      const a = classifyAgent(req.headers.get('user-agent') ?? '', null);
      context.waitUntil(
        fetch(`${url}/rest/v1/rpc/bump_bot_hit`, {
          method: 'POST',
          headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_label: a.label }),
        }).catch(() => undefined),
      );
    }
  } catch {
    // contar es secundario: la web sigue igual
  }
  return context.next();
}

export const config: Config = {
  path: '/*',
  excludedPath: ['/_next/*', '/img/*', '/api/*', '/favicon.ico', '/*.png', '/*.svg', '/*.txt', '/*.xml', '/*.webmanifest', '/*.html', '/*.js', '/*.css'],
  onError: 'bypass',
};
