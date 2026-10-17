'use client';

import { useEffect, useState } from 'react';
import { calculateBmi } from '@/lib/calculators/bmi';
import type { CalcUi } from '@/content/tools';
import { AnimatedNumber } from './animated-number';
import { NumberField, num } from './fields';
import { useToolTracking } from './use-tool-tracking';

export function BmiCalculator({ ui }: { ui: CalcUi }) {
  const [height, setHeight] = useState<number | ''>(175);
  const [weight, setWeight] = useState<number | ''>(75);
  const [touched, setTouched] = useState(false);
  const markUsed = useToolTracking('bmi');
  const r = calculateBmi({ heightCm: num(height, 175, 120, 230), weightKg: num(weight, 75, 30, 300) });
  const touch = (set: (v: number | '') => void) => (v: number | '') => {
    set(v);
    setTouched(true);
  };
  useEffect(() => {
    if (!touched) return;
    markUsed({ inputs: { height: num(height, 175, 120, 230) }, outputs: { bmi: r.bmi, category: r.category } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, r.bmi]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <div className="grid grid-cols-2 content-start gap-3">
        <NumberField label={ui.height} unit="cm" value={height} onChange={touch(setHeight)} min={120} max={230} />
        <NumberField label={ui.weight} unit="kg" value={weight} onChange={touch(setWeight)} min={30} max={300} step={0.1} />
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg/60 p-6" aria-live="polite">
        <p className="text-xs text-muted">{ui.bmi}</p>
        <p className="display mt-1 text-6xl font-bold leading-none text-primary">
          <AnimatedNumber value={r.bmi} decimals={1} />
        </p>
        <p className="mt-3 inline-flex rounded-full border border-primary/30 px-3 py-1 text-sm text-fg">{ui.bmiCategories[r.category]}</p>
        <dl className="mt-6 border-t border-border pt-5">
          <dt className="text-xs text-muted">{ui.healthyRange}</dt>
          <dd className="mt-1 text-2xl font-semibold text-fg">
            {r.healthyMinKg.toLocaleString('es-ES')}–{r.healthyMaxKg.toLocaleString('es-ES')} <span className="text-sm font-normal text-muted">kg</span>
          </dd>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-muted">{ui.bmiNote}</p>
      </div>
    </div>
  );
}
