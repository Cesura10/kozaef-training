'use client';

import { useState } from 'react';
import type { PagesCopy } from '@/content/pages';
import { track } from '@/lib/analytics/client';
import { Turnstile, resetTurnstile } from '@/components/turnstile';
import { Honeypot } from '@/components/honeypot';

type Status = 'idle' | 'sending' | 'ok' | 'missing' | 'failed';
const input =
  'mt-2 h-12 w-full rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40';

export function TechniqueSendForm({ c, locale, productId }: { c: PagesCopy['send']; locale: string; productId: string }) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    // Un enlace escrito sin https:// no se descarta en silencio: se pide corregirlo.
    const filled = [get('v1'), get('v2'), get('v3')].filter(Boolean);
    const videos = filled.filter((v) => v.startsWith('https://'));
    if (
      !get('name') ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email')) ||
      !get('order') ||
      videos.length === 0 ||
      videos.length !== filled.length ||
      f.get('privacy') !== 'on'
    ) {
      setStatus('missing');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: get('name'),
          email: get('email'),
          orderRef: get('order'),
          videos,
          notes: get('notes') || undefined,
          privacy: true,
          website: get('website'),
          turnstileToken: f.get('cf-turnstile-response') ?? undefined,
        }),
      });
      setStatus(res.ok ? 'ok' : 'failed');
      track('technique_request', { status: res.ok ? 'ok' : 'error' });
      if (!res.ok) resetTurnstile(formEl);
    } catch {
      setStatus('failed');
      resetTurnstile(formEl);
    }
  }

  if (status === 'ok') {
    return (
      <p role="status" className="rounded-[var(--radius-xl)] border border-primary/30 bg-primary/10 p-6 text-fg">
        {c.ok}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-muted">
          {c.name}
          <input name="name" autoComplete="name" maxLength={120} className={input} />
        </label>
        <label className="block text-sm text-muted">
          {c.email}
          <input name="email" type="email" inputMode="email" autoComplete="email" className={input} />
        </label>
      </div>
      <label className="block text-sm text-muted">
        {c.order}
        <input name="order" maxLength={80} className={input} />
      </label>
      {[1, 2, 3].map((n) => (
        <label key={n} className="block text-sm text-muted">
          {c.video} {n}
          <input name={`v${n}`} type="url" inputMode="url" placeholder="https://" maxLength={500} className={input} />
        </label>
      ))}
      <label className="block text-sm text-muted">
        {c.notes}
        <span className="mt-1 block text-xs text-faint">{c.notesHint}</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={1000}
          className="mt-2 w-full rounded-2xl border border-border-strong bg-bg px-5 py-4 text-[16px] text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
        <span>
          {c.privacy}{' '}
          <a href={`/${locale}/legal/privacidad`} className="text-fg underline underline-offset-4 hover:text-primary">
            {c.privacyLink}
          </a>
          .
        </span>
      </label>
      <Turnstile />
      {(status === 'missing' || status === 'failed') && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {status === 'missing' ? c.missing : c.failed}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-60"
      >
        {status === 'sending' ? '…' : c.submit}
      </button>
    </form>
  );
}
