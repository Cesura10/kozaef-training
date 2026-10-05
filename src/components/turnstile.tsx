'use client';

import Script from 'next/script';

declare global {
  interface Window {
    turnstile?: { reset: (widgetIdOrContainer?: string | HTMLElement) => void };
  }
}

/**
 * Pide un token nuevo tras un envío fallido: cada token de Turnstile solo vale una vez, así que
 * sin esto el reintento se rechazaba siempre como bot (403) aunque el primer fallo fuera de red.
 */
export function resetTurnstile(form: HTMLFormElement | null) {
  const el = form?.querySelector<HTMLElement>('.cf-turnstile');
  if (!el) return;
  try {
    window.turnstile?.reset(el);
  } catch {
    // el script aún no ha cargado: no hay token que renovar
  }
}

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
