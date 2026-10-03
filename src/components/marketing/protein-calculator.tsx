'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { track } from '@/lib/analytics/client';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import {
  PROTEIN_GOALS,
  WEIGHT_LIMITS,
  calculateProtein,
  type ProteinGoal,
} from '@/lib/calculators/protein';
import type { Dictionary } from '@/i18n/dictionaries/es';

const GOALS = Object.keys(PROTEIN_GOALS) as ProteinGoal[];

function fill(template: string, values: Record<string, number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''));
}

/** Número que se desliza hasta el nuevo valor (estático con reduced motion). */
function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { type: 'spring', stiffness: 140, damping: 22 });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export function ProteinCalculator({ t }: { t: Dictionary['calculator'] }) {
  const weightId = useId();
  const [weight, setWeight] = useState(75);
  const [goal, setGoal] = useState<ProteinGoal>('gain');
  const result = calculateProtein(weight, goal);

  // Un evento por objetivo probado (no uno por cada movimiento del slider: menos ruido y menos coste).
  const tracked = useRef(new Set<string>());
  function markUsed(g: ProteinGoal) {
    if (tracked.current.has(g)) return;
    tracked.current.add(g);
    track('calculator_used', { tool: 'protein', goal: g });
  }

  return (
    <div
      id="calculadora"
      className="relative scroll-mt-24 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[0_30px_80px_-30px_rgba(214,169,69,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-fg">{t.title}</h2>
        <span className="text-xs text-faint">{t.badge}</span>
      </div>

      <fieldset className="mt-6">
        <legend className="text-xs text-muted">{t.goal}</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-full border border-border bg-bg p-1">
          {GOALS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setGoal(key);
                markUsed(key);
              }}
              aria-pressed={goal === key}
              className="relative rounded-full px-2 py-2 text-xs font-medium text-muted transition-colors hover:text-fg aria-pressed:text-primary-fg sm:text-[13px]"
            >
              {goal === key && (
                <motion.span
                  layoutId="goal-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative whitespace-nowrap">{t.goals[key]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <label htmlFor={weightId} className="text-xs text-muted">
            {t.weight}
          </label>
          <span className="font-mono text-sm tabular-nums text-fg">{weight} kg</span>
        </div>
        <input
          id={weightId}
          type="range"
          min={WEIGHT_LIMITS.min}
          max={150}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          onPointerUp={() => markUsed(goal)}
          onKeyUp={() => markUsed(goal)}
          className="mt-3 w-full cursor-pointer accent-[var(--color-primary)]"
        />
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-xs text-muted">{t.daily}</p>
        <p className="display mt-1 text-6xl font-bold leading-none text-primary tabular-nums sm:text-7xl">
          <AnimatedNumber value={result.target} />
          <span className="ml-2 text-2xl font-medium text-fg">g</span>
        </p>
        <p className="mt-3 text-sm text-muted">{fill(t.range, result)}</p>
      </div>

      <a
        href="#lista"
        onClick={() => track('calculator_email_click', { tool: 'protein' })}
        className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
      >
        {t.emailCta}
        <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
