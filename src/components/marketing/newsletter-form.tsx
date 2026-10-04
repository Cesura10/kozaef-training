'use client';

import { useId, useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { track } from '@/lib/analytics/client';
import { getAttribution } from '@/lib/analytics/attribution';
import { readLastToolResult } from '@/lib/analytics/last-tool';
import { Turnstile } from '@/components/turnstile';
import { Honeypot } from '@/components/honeypot';

type Status = 'idle' | 'sending' | 'ok' | 'invalid' | 'consent' | 'limited' | 'failed';

/**
 * Captura de email real: POST /api/leads (Turnstile + límites + RGPD).
 * Si la persona usó una calculadora antes, se adjunta su resultado (solo números).
 */
export function NewsletterForm({
  t,
  locale,
  waitlistProduct,
  submitLabel,
  successText,
  stacked,
}: {
  t: Dictionary['newsletter'];
  locale: string;
  /** Si se indica, el alta es en la lista de espera de ese producto ('programas' = general). */
  waitlistProduct?: string;
  submitLabel?: string;
  successText?: string;
  stacked?: boolean;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('invalid');
      track('newsletter_submit', { status: 'invalid' });
      return;
    }
    if (form.get('consent') !== 'on') {
      setStatus('consent');
      return;
    }

    setStatus('sending');
    const attribution = getAttribution();
    const last = readLastToolResult();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentText: `${t.consent} ${t.privacy}.`,
          locale,
          source: attribution?.source,
          utm: attribution?.utm,
          ...(last && !waitlistProduct ? { tool: last.tool, toolInputs: last.inputs, toolOutputs: last.outputs } : {}),
          ...(waitlistProduct ? { waitlistProduct } : {}),
          website: String(form.get('website') ?? ''),
          turnstileToken: form.get('cf-turnstile-response') ?? undefined,
        }),
      });
      if (res.ok) {
        setStatus('ok');
        if (waitlistProduct) track('waitlist_join', { product: waitlistProduct });
        else track('newsletter_submit', { status: 'ok' });
      } else {
        setStatus(res.status === 429 ? 'limited' : 'failed');
        track('newsletter_submit', { status: 'error' });
      }
    } catch {
      setStatus('failed');
      track('newsletter_submit', { status: 'error' });
    }
  }

  if (status === 'ok') {
    return (
      <p role="status" className="max-w-md rounded-[var(--radius-xl)] border border-primary/30 bg-primary/10 p-5 text-fg">
        {successText ?? t.success}
      </p>
    );
  }

  const message =
    status === 'invalid'
      ? { text: t.error, cls: 'text-danger' }
      : status === 'consent'
        ? { text: t.consentRequired, cls: 'text-danger' }
        : status === 'limited'
          ? { text: t.rateLimited, cls: 'text-danger' }
          : status === 'failed'
            ? { text: t.failed, cls: 'text-danger' }
            : { text: t.idle, cls: 'text-faint' };

  return (
    <form onSubmit={onSubmit} noValidate className="relative w-full max-w-md">
      <Honeypot />
      <label htmlFor={id} className="text-sm text-muted">
        {t.label}
      </label>
      <div className={`mt-2 flex flex-col gap-2 ${stacked ? '' : 'sm:flex-row'}`}>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t.placeholder}
          aria-invalid={status === 'invalid'}
          aria-describedby={`${id}-msg`}
          className="h-12 flex-1 rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
        >
          {status === 'sending' ? '…' : (submitLabel ?? t.submit)}
        </button>
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="consent"
          aria-invalid={status === 'consent'}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
        />
        <span>
          {t.consent}{' '}
          <a href={`/${locale}/legal/privacidad`} className="text-fg underline underline-offset-4 hover:text-primary">
            {t.privacy}
          </a>
          .
        </span>
      </label>
      <div className="mt-3">
        <Turnstile />
      </div>
      <p id={`${id}-msg`} role="status" className={`mt-3 min-h-5 text-sm ${message.cls}`}>
        {message.text}
      </p>
    </form>
  );
}
