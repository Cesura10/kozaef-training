'use client';

import { useEffect, useState } from 'react';
import { calculateBodyfat, InvalidMeasurementsError, type BodyfatResult } from '@/lib/calculators/bodyfat';
import type { Sex } from '@/lib/calculators/calories';
import type { CalcUi } from '@/content/tools';
import { AnimatedNumber } from './animated-number';
import { NumberField, Segmented, num } from './fields';
import { useToolTracking } from './use-tool-tracking';

export function BodyfatCalculator({ ui }: { ui: CalcUi }) {
  const [sex, setSex] = useState<Sex>('male');
  const [height, setHeight] = useState<number | ''>(178);
  const [weight, setWeight] = useState<number | ''>(80);
  const [neck, setNeck] = useState<number | ''>(38);
  const [waist, setWaist] = useState<number | ''>(86);
  const [hip, setHip] = useState<number | ''>(98);
  const [target, setTarget] = useState<number | ''>('');
  const markUsed = useToolTracking('bodyfat');

  let r: BodyfatResult | null = null;
  try {
    r = calculateBodyfat({
      sex,
      heightCm: num(height, 178, 120, 230),
      weightKg: num(weight, 80, 35, 250),
      neckCm: num(neck, 38, 20, 70),
      waistCm: num(waist, 86, 40, 200),
      hipCm: sex === 'female' ? num(hip, 98, 50, 200) : undefined,
      targetPercent: target === '' ? undefined : num(target, 0, 3, 50),
    });
  } catch (e) {
    if (!(e instanceof InvalidMeasurementsError)) throw e;
  }

  const [touched, setTouched] = useState(false);
  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setTouched(true);
  };
  useEffect(() => {
    if (!touched || !r) return;
    markUsed({
      inputs: { sex, height: num(height, 178, 120, 230), neck: num(neck, 38, 20, 70), waist: num(waist, 86, 40, 200) },
      outputs: { percent: r.percent, category: r.category },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, r?.percent, r?.category]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <div className="space-y-5">
        <Segmented
          name="bf-sex"
          legend={ui.sex}
          value={sex}
          onChange={touch(setSex)}
          options={[
            { value: 'male', label: ui.male },
            { value: 'female', label: ui.female },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={ui.height} unit="cm" value={height} onChange={touch(setHeight)} min={120} max={230} />
          <NumberField label={ui.weight} unit="kg" value={weight} onChange={touch(setWeight)} min={35} max={250} step={0.1} />
          <NumberField label={ui.neck} unit="cm" value={neck} onChange={touch(setNeck)} min={20} max={70} step={0.5} />
          <NumberField label={ui.waist} unit="cm" value={waist} onChange={touch(setWaist)} min={40} max={200} step={0.5} />
          {sex === 'female' && (
            <NumberField label={ui.hip} unit="cm" value={hip} onChange={touch(setHip)} min={50} max={200} step={0.5} />
          )}
          <NumberField label={ui.targetPercent} unit="%" value={target} onChange={touch(setTarget)} min={3} max={50} step={0.5} optional />
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-bg/60 p-6" aria-live="polite">
        {r ? (
          <>
            <p className="text-xs text-muted">{ui.bodyfat}</p>
            <p className="display mt-1 text-6xl font-bold leading-none text-primary">
              <AnimatedNumber value={r.percent} decimals={1} />
              <span className="ml-1 text-3xl">%</span>
            </p>
            <p className="mt-3 inline-flex rounded-full border border-primary/30 px-3 py-1 text-sm text-fg">{ui.categories[r.category]}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
              <div>
                <dt className="text-xs text-muted">{ui.fatMass}</dt>
                <dd className="mt-1 text-2xl font-semibold text-fg">
                  <AnimatedNumber value={r.fatMassKg} decimals={1} /> <span className="text-sm font-normal text-muted">kg</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{ui.leanMass}</dt>
                <dd className="mt-1 text-2xl font-semibold text-fg">
                  <AnimatedNumber value={r.leanMassKg} decimals={1} /> <span className="text-sm font-normal text-muted">kg</span>
                </dd>
              </div>
              {r.targetWeightKg !== null && (
                <div className="col-span-2">
                  <dt className="text-xs text-muted">{ui.targetWeight}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-primary">
                    <AnimatedNumber value={r.targetWeightKg} decimals={1} /> <span className="text-sm font-normal text-muted">kg</span>
                  </dd>
                </div>
              )}
            </dl>
          </>
        ) : (
          <p role="alert" className="text-sm text-danger">
            {ui.invalid}
          </p>
        )}
      </div>
    </div>
  );
}
