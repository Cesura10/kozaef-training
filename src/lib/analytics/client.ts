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

let ph: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
let failed = false;
const queue: Array<(p: PostHog) => void> = [];

function load(): Promise<PostHog | null> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === 'undefined') return Promise.resolve(null);
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
        persistence: 'memory',
        disable_session_recording: true,
        capture_pageview: true,
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
  metaTrack(name, props as Record<string, unknown>); // solo si hay consentimiento y píxel
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  withPostHog((p) => p.capture(name, props));
}

export function setAnalyticsConsent(granted: boolean) {
  withPostHog((p) => {
    p.set_config({ persistence: granted ? 'localStorage+cookie' : 'memory' });
    if (granted) p.startSessionRecording();
    else p.stopSessionRecording();
  });
}
