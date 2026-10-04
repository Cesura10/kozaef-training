'use client';

import { useState } from 'react';
import { ArrowRight, CalendarCheck, Hourglass, Lightbulb } from '@phosphor-icons/react';
import { ANSWERS, QUESTION_KEYS, type APPLY_COPY } from '@/content/apply';
import { toolPath } from '@/content/tools';
import { sectionPath } from '@/content/routes';
import type { Locale } from '@/i18n/config';
import { track } from '@/lib/analytics/client';
import { getAttribution } from '@/lib/analytics/attribution';
import { Turnstile } from '@/components/turnstile';

type Copy = (typeof APPLY_COPY)[Locale];
type Result = { result: 'qualified' | 'waitlist' | 'low'; bookingUrl: string | null; lowBudget?: boolean };
type Status = 'idle' | 'sending' | 'missing' | 'limited' | 'failed';

export function ApplyForm({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const answers = Object.fromEntries(QUESTION_KEYS.map((k) => [k, String(f.get(k) ?? '')]));
    const name = String(f.get('name') ?? '').trim();
    const email = String(f.get('email') ?? '').trim();
    const complete =
      QUESTION_KEYS.every((k) => answers[k]) &&
      name &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      f.get('privacy') === 'on' &&
      f.get('ageOk') === 'on';
    if (!complete) {
      setStatus('missing');
      return;
    }

    setStatus('sending');
    const a = getAttribution();
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          tried: String(f.get('tried') ?? '') || undefined,
          name,
          email,
          privacy: true,
          ageOk: true,
          locale,
          source: a?.source,
          utm: a?.utm,
          turnstileToken: f.get('cf-turnstile-response') ?? undefined,
        }),
      });
      if (!res.ok) {
        setStatus(res.status === 429 ? 'limited' : 'failed');
        return;
      }
      const data = (await res.json()) as Result & { scoreBand: 'low' | 'mid' | 'high' };
      track('application_submitted', { score_band: data.scoreBand });
      setResult({ ...data, lowBudget: answers.budget === 'under50' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('failed');
    }
  }

  if (result) return <ResultView copy={copy} locale={locale} result={result} />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {QUESTION_KEYS.map((k) => (
        <fieldset key={k}>
          <legend className="text-base font-medium text-fg">{copy.questions[k].label}</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ANSWERS[k].map((v) => (
              <label
                key={v}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-border-strong bg-bg px-3 py-2 text-center text-sm text-muted transition-colors hover:border-faint hover:text-fg has-[:checked]:border-primary has-[:checked]:bg-primary/15 has-[:checked]:text-fg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50"
              >
                <input type="radio" name={k} value={v} className="sr-only" />
                {copy.questions[k].options[v]}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div>
        <label htmlFor="tried" className="text-base font-medium text-fg">
          {copy.tried}
        </label>
        <p className="mt-1 text-sm text-faint">{copy.triedHint}</p>
        <textarea
          id="tried"
          name="tried"
          rows={4}
          maxLength={1000}
          className="mt-3 w-full rounded-2xl border border-border-strong bg-bg px-5 py-4 text-[16px] text-fg placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm text-muted">
            {copy.name}
          </label>
          <input
            id="name"
            name="name"
            autoComplete="given-name"
            maxLength={120}
            className="mt-2 h-12 w-full rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-muted">
            {copy.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-full border border-border-strong bg-bg px-5 text-[16px] text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-3 text-sm text-muted">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
          <span>
            {copy.privacy}{' '}
            <a href={`/${locale}/legal/privacidad`} className="text-fg underline underline-offset-4 hover:text-primary">
              {copy.privacyLink}
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="ageOk" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
          <span>{copy.age}</span>
        </label>
      </div>

      <Turnstile />

      {(status === 'missing' || status === 'limited' || status === 'failed') && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {status === 'missing' ? copy.missing : status === 'limited' ? copy.limited : copy.failed}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
      >
        {status === 'sending' ? copy.sending : copy.submit}
        {status !== 'sending' && <ArrowRight size={16} weight="bold" />}
      </button>
    </form>
  );
}

function ResultView({ copy, locale, result }: { copy: Copy; locale: Locale; result: Result }) {
  const r = copy.results;
  const box = 'animate-rise rounded-[var(--radius-xl)] border p-8';
  if (result.result === 'qualified') {
    return (
      <div role="status" className={`${box} gold-sheen border-primary/40`}>
        <CalendarCheck size={36} weight="duotone" className="text-primary" />
        <h2 className="display mt-4 text-3xl font-bold">{r.qualified.title}</h2>
        <p className="mt-3 max-w-[55ch] text-lg text-muted">{r.qualified.body}</p>
        {result.bookingUrl ? (
          <a
            href={result.bookingUrl}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
          >
            {r.qualified.cta}
            <ArrowRight size={16} weight="bold" />
          </a>
        ) : (
          <p className="mt-6 text-fg">{r.qualified.noCalendar}</p>
        )}
      </div>
    );
  }
  if (result.result === 'waitlist') {
    return (
      <div role="status" className={`${box} border-border bg-surface`}>
        <Hourglass size={36} weight="duotone" className="text-primary" />
        <h2 className="display mt-4 text-3xl font-bold">{r.waitlist.title}</h2>
        <p className="mt-3 max-w-[55ch] text-lg text-muted">{r.waitlist.body}</p>
      </div>
    );
  }
  return (
    <div role="status" className={`${box} border-border bg-surface`}>
      <Lightbulb size={36} weight="duotone" className="text-primary" />
      <h2 className="display mt-4 text-3xl font-bold">{r.low.title}</h2>
      <p className="mt-3 max-w-[55ch] text-lg text-muted">{r.low.body}</p>
      <a
        href={toolPath('calories', locale)}
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
      >
        {r.low.cta}
        <ArrowRight size={16} weight="bold" />
      </a>
      {/* Brief: con presupuesto bajo se ofrece el programa autoguiado. */}
      {result.lowBudget && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-medium text-fg">{r.lowBudget.title}</p>
          <p className="mt-1 text-sm text-muted">{r.lowBudget.body}</p>
          <a
            href={sectionPath('programs', locale)}
            data-track="cta_click"
            data-cta="product"
            data-location="apply-low-budget"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            {r.lowBudget.cta}
          </a>
        </div>
      )}
    </div>
  );
}
