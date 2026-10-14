'use client';

import type { AnalyticsEventName, AnalyticsEvents } from './events';
import { metaTrack } from './meta';

/**
 * Capa de analítica independiente del proveedor. Hoy: PostHog (UE), solo si hay
 * NEXT_PUBLIC_POSTHOG_KEY. Sin clave, track() no hace nada (desarrollo, o analítica apagada).
 *
 * Privacidad: hasta que haya consentimiento, PostHog va en modo memoria (sin cookies
 * ni localStorage) y sin grabaciones. setAnalyticsConsent(true) activa ambas cosas.
 */
type PostHog = typeof import('posthog-js').default;

/**
 * Tráfico que NO se mide, para que la analítica cuente solo personas:
 * - navegadores automatizados (navigator.webdriver: Playwright, Puppeteer, Selenium, monitores, muchos bots);
 * - agentes que se identifican (bots, rastreadores, IA, vistas previas de enlaces, Lighthouse);
 * - visitas internas de Manu: abrir una vez la web con ?kz_interno=1 en cada dispositivo (?kz_interno=0 lo quita).
 */
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|claude|gpt|perplexity|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios/i;
function excludedTraffic(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get('kz_interno');
    if (q === '1') localStorage.setItem('kz_interno', '1');
    if (q === '0') localStorage.removeItem('kz_interno');
    if (localStorage.getItem('kz_interno') === '1') return true;
  } catch {
    // sin almacenamiento: seguimos con las demás comprobaciones
  }
  return navigator.webdriver === true || BOT_UA.test(navigator.userAgent);
}

let ph: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
let failed = false;
const queue: Array<(p: PostHog) => void> = [];

function load(): Promise<PostHog | null> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === 'undefined') return Promise.resolve(null);
  if (!loading && excludedTraffic()) {
    failed = true;
    return Promise.resolve(null);
  }
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
        persistence: 'memory',
        // Sin cookies hasta que se acepta (y si se rechaza): PostHog cuenta la visita con un hash
        // anónimo en su servidor. Sin esto, esta versión no registra nada hasta el consentimiento.
        cookieless_mode: 'on_reject',
        opt_out_capturing_by_default: true,
        disable_session_recording: true,
        // También las páginas a las que se llega navegando dentro de la web (sin esto solo contaba la primera).
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: false, // solo eventos del catálogo: datos limpios y menos volumen (coste)
      });
      ph = posthog;
      queue.splice(0).forEach((fn) => fn(posthog));
      return posthog;
    }).catch(() => {
      // Bloqueador o fallo de red: la web sigue igual, sin analítica ni promesas rechazadas sin capturar.
      failed = true;
      queue.length = 0;
      return null;
    });
  }
  return loading;
}

function withPostHog(fn: (p: PostHog) => void) {
  if (ph) fn(ph);
  else if (!failed) {
    queue.push(fn);
    void load();
  }
}

export function initAnalytics(superProps: Record<string, unknown>) {
  withPostHog((p) => p.register(superProps));
}

export function track<K extends AnalyticsEventName>(name: K, props: AnalyticsEvents[K]) {
  if (typeof window !== 'undefined' && excludedTraffic()) return;
  metaTrack(name, props as Record<string, unknown>); // solo si hay consentimiento y píxel
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  withPostHog((p) => p.capture(name, props));
}

export function setAnalyticsConsent(granted: boolean) {
  withPostHog((p) => {
    // Aceptar: PostHog pasa a modo normal con cookies. Rechazar: sigue el modo sin cookies.
    if (granted) p.opt_in_capturing();
    else p.opt_out_capturing();
    p.set_config({ persistence: granted ? 'localStorage+cookie' : 'memory' });
    if (granted) p.startSessionRecording();
    else p.stopSessionRecording();
  });
}
