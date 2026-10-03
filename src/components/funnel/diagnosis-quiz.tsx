'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Compass } from '@phosphor-icons/react';
import type { Locale } from '@/i18n/config';
import { DIAGNOSIS } from '@/content/diagnosis';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';
import { isBuyable, relatedProduct } from '@/content/products';
import { PROFILES, CATEGORIES } from '@/content/taxonomy';
import { TOOL_CONTENT, toolPath } from '@/content/tools';
import { diagnose, type DiagnosisAnswers, type DiagnosisResult } from '@/lib/diagnosis';
import { track } from '@/lib/analytics/client';

export function DiagnosisQuiz({ locale }: { locale: Locale }) {
  const c = DIAGNOSIS[locale];
  const f = FUNNEL[locale];
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [missing, setMissing] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answers = Object.fromEntries(c.questions.map((q) => [q.key, fd.get(q.key)]));
    if (c.questions.some((q) => !answers[q.key])) {
      setMissing(true);
      return;
    }
    const r = diagnose(answers as unknown as DiagnosisAnswers);
    track('diagnosis_completed', { profile: r.profile, category: r.category });
    setResult(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (result) {
    const product = relatedProduct({ categoria: result.category, perfiles: [result.profile] });
    const tool = TOOL_CONTENT[locale][result.tool];
    return (
      <div role="status" className="space-y-6">
        <div className="gold-sheen animate-rise rounded-[var(--radius-xl)] border border-primary/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-primary">
            <Compass size={22} weight="duotone" aria-hidden />
            <span className="text-sm font-medium">
              {c.resultEyebrow}: {PROFILES[result.profile].label[locale]} · {CATEGORIES[result.category].label[locale]}
            </span>
          </div>
          <h2 className="display mt-3 text-3xl font-bold">{c.profileTitle[result.profile]}</h2>
          <ul className="mt-5 space-y-3">
            {c.advice[result.profile].map((a) => (
              <li key={a} className="flex items-start gap-3 text-fg/90">
                <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={toolPath(result.tool, locale)}
              data-track="cta_click"
              data-cta="tool"
              data-location="diagnosis"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
            >
              {tool.h1}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href={sectionPath('learn', locale, locale === 'es' ? 'perfil' : 'profile', PROFILES[result.profile].slug[locale])}
              className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 text-sm text-fg hover:bg-surface-2"
            >
              {c.learnCta}
            </Link>
          </div>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs font-medium text-primary">{f.productEyebrow}</p>
          {product ? (
            <>
              <h3 className="display mt-2 text-2xl font-bold">{product.nombre[locale]}</h3>
              <p className="mt-2 text-muted">{product.paraQuien[locale]}</p>
              <Link
                href={sectionPath('programs', locale, product.slug[locale])}
                data-track="cta_click"
                data-cta="product"
                data-location="diagnosis"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                {isBuyable(product) ? (product.tipo === 'servicio' ? f.seeService : f.seeProduct) : f.waitlistSubmit}
              </Link>
            </>
          ) : (
            <>
              <h3 className="display mt-2 text-2xl font-bold">{f.waitlistGeneralTitle}</h3>
              <Link href={sectionPath('programs', locale)} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
                {f.waitlistSubmit}
              </Link>
            </>
          )}
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border p-6 sm:p-8">
          <p className="text-xs font-medium text-primary">{f.coachingEyebrow}</p>
          <h3 className="display mt-2 text-2xl font-bold">{f.coachingTitle}</h3>
          <p className="mt-2 text-muted">{f.coachingBody}</p>
          <Link
            href={sectionPath('apply', locale)}
            data-track="cta_click"
            data-cta="apply"
            data-location="diagnosis"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
          >
            {f.applyCta}
          </Link>
        </div>

        <button type="button" onClick={() => setResult(null)} className="text-sm text-muted underline underline-offset-4 hover:text-fg">
          {c.restart}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {c.questions.map((q) => (
        <fieldset key={q.key}>
          <legend className="text-base font-medium text-fg">{q.label}</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {q.options.map((o) => (
              <label
                key={o.value}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-border-strong bg-bg px-3 py-2 text-center text-sm text-muted transition-colors hover:border-faint hover:text-fg has-[:checked]:border-primary has-[:checked]:bg-primary/15 has-[:checked]:text-fg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50"
              >
                <input type="radio" name={q.key} value={o.value} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {missing && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {c.missing}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
      >
        {c.submit}
        <ArrowRight size={16} weight="bold" />
      </button>
      <p className="text-xs text-faint">{c.disclaimer}</p>
    </form>
  );
}
