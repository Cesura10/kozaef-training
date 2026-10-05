'use client';

import { useEffect, useState } from 'react';
import { CONSENT_EVENT, consentNeeded, readConsent, saveConsent } from '@/lib/analytics/consent';
import { setAnalyticsConsent } from '@/lib/analytics/client';
import { loadMetaPixel, revokeMetaPixel } from '@/lib/analytics/meta';

const COPY = {
  es: {
    text: 'Uso la analítica anónima, sin cookies, para saber qué funciona. Si aceptas, también cookies de Meta para mostrarte contenido relevante en redes y grabaciones anónimas de uso para mejorar la web.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    policy: 'Política de cookies',
  },
  en: {
    text: 'I use anonymous, cookie-free analytics to learn what works. If you accept, I also use Meta cookies to show you relevant content on social media and anonymous session recordings to improve the site.',
    accept: 'Accept',
    reject: 'Reject',
    policy: 'Cookie policy',
  },
} as const;

function apply(marketing: boolean) {
  setAnalyticsConsent(marketing);
  if (marketing) loadMetaPixel();
  else revokeMetaPixel();
}

/** Banner de consentimiento. Rechazar y Aceptar con la misma visibilidad. */
export function ConsentBanner({ locale }: { locale: 'es' | 'en' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!consentNeeded()) return;
    const c = readConsent();
    // Se abre en el siguiente tick: el HTML del servidor (sin banner) y el primer render coinciden.
    const timer = c ? undefined : setTimeout(() => setOpen(true), 0);
    if (c) apply(c.marketing);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(CONSENT_EVENT, reopen);
    };
  }, []);

  if (!open) return null;
  const t = COPY[locale];
  const choose = (marketing: boolean) => {
    saveConsent(marketing);
    apply(marketing);
    setOpen(false);
  };
  const btn = 'h-11 flex-1 rounded-full border border-border-strong px-5 text-sm font-semibold text-fg transition hover:border-primary hover:text-primary sm:flex-none';
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-border bg-elevated p-5 shadow-2xl sm:inset-x-6">
      <p className="text-sm leading-relaxed text-muted">
        {t.text}{' '}
        <a href={`/${locale}/legal/cookies`} className="text-fg underline underline-offset-4 hover:text-primary">
          {t.policy}
        </a>
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose(false)} className={btn}>
          {t.reject}
        </button>
        <button type="button" onClick={() => choose(true)} className={btn}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}

/** Enlace del pie para cambiar la decisión. */
export function ConsentSettingsLink({ label }: { label: string }) {
  if (!consentNeeded()) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))} className="hover:text-fg">
      {label}
    </button>
  );
}
