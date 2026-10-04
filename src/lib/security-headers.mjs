// Cabeceras de seguridad (brief seguridad §B3). Lista de dominios hecha revisando el código:
// Supabase, PostHog, Cloudflare (Turnstile + Web Analytics), YouTube sin cookies y píxel de Meta.
// Shopify y Cal.com solo se enlazan (navegación), no necesitan entrada en la CSP.
//
// CSP_ENFORCE=true -> obligatoria. Por defecto en modo Report-Only (solo informa) hasta comprobar
// en producción que no rompe nada.

/** @param {{ supabaseUrl?: string, enforce?: boolean }} opts */
export function securityHeaders({ supabaseUrl = '', enforce = false } = {}) {
  const supabase = supabaseUrl ? [supabaseUrl, supabaseUrl.replace(/^https:/, 'wss:')] : [];
  const csp = [
    "default-src 'self'",
    // Next inyecta scripts inline en páginas estáticas (sin nonce posible en SSG).
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://eu-assets.i.posthog.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.ytimg.com https://www.facebook.com",
    "font-src 'self'",
    `connect-src 'self' ${supabase.join(' ')} https://eu.i.posthog.com https://eu-assets.i.posthog.com https://cloudflareinsights.com https://www.facebook.com https://connect.facebook.net`,
    'frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com',
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // Solo tiene efecto en modo obligatorio.
    ...(enforce ? ['upgrade-insecure-requests'] : []),
  ].join('; ');

  return [
    { key: enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', value: csp },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
    { key: 'X-Frame-Options', value: 'DENY' },
  ];
}
