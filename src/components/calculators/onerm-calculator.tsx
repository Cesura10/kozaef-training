'use client';

import { useEffect, useState } from 'react';
import { calculateOneRm } from '@/lib/calculators/onerm';
import type { CalcUi } from '@/content/tools';
import { AnimatedNumber } from './animated-number';
import { NumberField, num } from './fields';
import { useToolTracking } from './use-tool-tracking';

export function OneRmCalculator({ ui }: { ui: CalcUi }) {
  const [weight, setWeight] = useState<number | ''>(80);
  const [reps, setReps] = useState<number | ''>(5);
  const [touched, setTouched] = useState(false);
  const markUsed = useToolTracking('onerm');
  const r = calculateOneRm({ weightKg: num(weight, 80, 1, 500), reps: num(reps, 5, 1, 15) });
  const touch = (set: (v: number | '') => void) => (v: number | '') => {
    set(v);
    setTouched(true);
  };
  useEffect(() => {
    if (!touched) return;
    markUsed({ inputs: { reps: num(reps, 5, 1, 15) }, outputs: { oneRm: r.oneRm } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, r.oneRm]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <div className="grid grid-cols-2 content-start gap-3">
        <NumberField label={ui.liftWeight} unit="kg" value={weight} onChange={touch(setWeight)} min={1} max={500} step={0.5} />
        <NumberField label={ui.reps} unit="" value={reps} onChange={touch(setReps)} min={1} max={15} />
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg/60 p-6" aria-live="polite">
        <p className="text-xs text-muted">{ui.oneRm}</p>
        <p className="display mt-1 text-6xl font-bold leading-none text-primary">
          <AnimatedNumber value={r.oneRm} decimals={1} />
          <span className="ml-1 text-3xl">kg</span>
        </p>
        {r.imprecise && <p className="mt-3 text-sm text-warning">{ui.imprecise}</p>}
        <table className="mt-6 w-full border-t border-border text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2 pt-4 font-normal">{ui.percentOf}</th>
              <th className="pb-2 pt-4 text-right font-normal">kg</th>
            </tr>
          </thead>
          <tbody>
            {r.table.map((t) => (
              <tr key={t.percent} className="border-t border-border/60">
                <td className="py-2 text-muted">{t.percent} %</td>
                <td className="py-2 text-right font-semibold tabular-nums text-fg">{t.kg.toLocaleString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
