'use client';

import { useId, useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { track } from '@/lib/analytics/client';

type Status = 'idle' | 'error' | 'preview';

/**
 * Captura de email. Aún sin backend: la ruta /api/leads (doble opt-in + Turnstile)
 * se conecta en la fase de leads. Mientras, se valida y se avisa con honestidad.
 */
export function NewsletterForm({ t }: { t: Dictionary['newsletter'] }) {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setStatus(valid ? 'preview' : 'error');
    track('newsletter_submit', { status: valid ? 'ok' : 'invalid' });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="text-sm text-muted">
        {t.label}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t.placeholder}
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-msg`}
          className="h-12 flex-1 rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98]"
        >
          {t.submit}
        </button>
      </div>
      <p id={`${id}-msg`} role="status" className="mt-3 min-h-5 text-sm">
        {status === 'error' && <span className="text-danger">{t.error}</span>}
        {status === 'preview' && (
          <span className="text-primary">{t.preview}</span>
        )}
        {status === 'idle' && <span className="text-faint">{t.idle}</span>}
      </p>
    </form>
  );
}
