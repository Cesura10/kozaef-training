'use client';

import Script from 'next/script';

/**
 * Cloudflare Turnstile (anti-bots, gratis). Renderizado implícito: añade al <form>
 * un input oculto "cf-turnstile-response". Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no pinta nada.
 */
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" data-size="flexible" />
    </>
  );
}
