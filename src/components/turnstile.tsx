'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, string>) => string;
  reset: (widgetIdOrContainer?: string | HTMLElement) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TOKEN = 'input[name="cf-turnstile-response"]';
/** Si el reto no termina en este tiempo se envía igual: el servidor decide (y el formulario muestra el error). */
const MAX_WAIT_MS = 8000;

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
 * Cloudflare Turnstile (anti-bots, gratis). Añade al <form> un input oculto "cf-turnstile-response".
 * Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no pinta nada.
 *
 * Carga diferida: el script de Cloudflare baja ~2 MB y ocupa el procesador, así que solo se carga
 * cuando alguien empieza a usar el formulario (toca o enfoca un campo). Si se envía antes de tener
 * token (autocompletar y enviar al momento), el envío espera al token y se repite solo.
 */
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!siteKey || !form) return;
    const start = () => setActive(true);
    form.addEventListener('focusin', start, { once: true });
    form.addEventListener('pointerdown', start, { once: true });

    let passThrough = false;
    let waiting = false;
    function onSubmit(e: SubmitEvent) {
      if (passThrough || form!.querySelector<HTMLInputElement>(TOKEN)?.value) {
        passThrough = false;
        return;
      }
      // Sin token todavía: se frena este envío (antes de que lo vea React) y se repite al tenerlo.
      e.preventDefault();
      e.stopImmediatePropagation();
      start();
      if (waiting) return;
      waiting = true;
      const submitter = e.submitter;
      const t0 = Date.now();
      const timer = window.setInterval(() => {
        const ready = !!form!.querySelector<HTMLInputElement>(TOKEN)?.value;
        if (!ready && Date.now() - t0 < MAX_WAIT_MS) return;
        window.clearInterval(timer);
        waiting = false;
        passThrough = true;
        form!.requestSubmit(submitter instanceof HTMLElement && submitter.closest('form') === form ? submitter : undefined);
      }, 150);
    }
    form.addEventListener('submit', onSubmit, { capture: true });
    return () => {
      form.removeEventListener('focusin', start);
      form.removeEventListener('pointerdown', start);
      form.removeEventListener('submit', onSubmit, { capture: true });
    };
  }, [siteKey]);

  if (!siteKey) return null;

  function renderWidget() {
    const el = ref.current;
    if (!el || !window.turnstile || el.dataset.rendered) return;
    el.dataset.rendered = '1';
    window.turnstile.render(el, { sitekey: siteKey!, theme: 'dark', size: 'flexible' });
  }

  return (
    <>
      {active && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderWidget}
        />
      )}
      <div ref={ref} className="cf-turnstile" />
    </>
  );
}
