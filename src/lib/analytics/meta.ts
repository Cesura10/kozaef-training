'use client';

/**
 * Píxel de Meta. Se carga SOLO tras el consentimiento (loadMetaPixel) y solo si hay
 * NEXT_PUBLIC_META_PIXEL_ID. Mapea los eventos propios a eventos estándar de Meta.
 */
type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let loaded = false;
/** Consentimiento vigente: si se retira, el script ya cargado deja de recibir eventos. */
let granted = false;

export function loadMetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id || typeof window === 'undefined') return;
  granted = true;
  if (loaded) {
    window.fbq?.('consent', 'grant');
    return;
  }
  loaded = true;
  // Snippet oficial de Meta, sin inline script (compatible con la CSP).
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = window._fbq = fbq;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  fbq('init', id);
  fbq('track', 'PageView');
}

const STANDARD: Record<string, string> = {
  newsletter_submit: 'Lead',
  waitlist_join: 'Lead',
  buy_click: 'InitiateCheckout',
  application_submitted: 'SubmitApplication',
  technique_request: 'Contact',
};

/** Retirada del consentimiento desde el banner: no se envía nada más a Meta en esta visita. */
export function revokeMetaPixel() {
  granted = false;
  if (loaded) window.fbq?.('consent', 'revoke');
}

/** Reenvía un evento propio a Meta (si el píxel está cargado y el consentimiento sigue vigente). */
export function metaTrack(name: string, props: Record<string, unknown>) {
  if (!loaded || !granted || !window.fbq) return;
  if (name === 'newsletter_submit' && props.status !== 'ok') return;
  const std = STANDARD[name];
  if (std) {
    const value = typeof props.price === 'number' ? { value: props.price, currency: props.currency ?? 'EUR' } : {};
    window.fbq('track', std, { content_name: props.product ?? name, ...value });
  } else if (name === 'cta_click') {
    window.fbq('trackCustom', 'CTAClick', { cta: props.cta, location: props.location });
  }
}
