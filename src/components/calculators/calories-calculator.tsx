'use client';

import { useEffect, useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { calculateCalories, type Activity, type Sex } from '@/lib/calculators/calories';
import type { ProteinGoal } from '@/lib/calculators/protein';
import type { CalcUi } from '@/content/tools';
import { AnimatedNumber } from './animated-number';
import { NumberField, Segmented, SelectField, num } from './fields';
import { useToolTracking } from './use-tool-tracking';

const ACTIVITIES: Activity[] = ['sedentary', 'light', 'moderate', 'high', 'athlete'];

export function CaloriesCalculator({ ui }: { ui: CalcUi }) {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number | ''>(30);
  const [height, setHeight] = useState<number | ''>(175);
  const [weight, setWeight] = useState<number | ''>(75);
  const [activity, setActivity] = useState<Activity>('moderate');
  const [goal, setGoal] = useState<ProteinGoal>('gain');
  const markUsed = useToolTracking('calories');

  const input = { sex, age: num(age, 30), heightCm: num(height, 175), weightKg: num(weight, 75), activity, goal };
  const r = calculateCalories(input);

  // Se marca como usada al primer cambio; el resultado se guarda tras recalcular.
  const [touched, setTouched] = useState(false);
  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setTouched(true);
  };
  useEffect(() => {
    if (!touched) return;
    markUsed(
      {
        inputs: { sex, age: input.age, height: input.heightCm, weight: input.weightKg, activity, goal },
        outputs: { target: r.target, protein: r.protein, fat: r.fat, carbs: r.carbs },
      },
      goal,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, r.target, r.protein, r.fat, r.carbs, goal]);

  const macros = [
    { label: ui.protein, g: r.protein, kcal: r.protein * 4 },
    { label: ui.fat, g: r.fat, kcal: r.fat * 9 },
    { label: ui.carbs, g: r.carbs, kcal: r.carbs * 4 },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <div className="space-y-5">
        <Segmented
          name="cal-sex"
          legend={ui.sex}
          value={sex}
          onChange={touch(setSex)}
          options={[
            { value: 'male', label: ui.male },
            { value: 'female', label: ui.female },
          ]}
        />
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <NumberField label={ui.age} unit={ui.years} value={age} onChange={touch(setAge)} min={14} max={90} />
          <NumberField label={ui.height} unit="cm" value={height} onChange={touch(setHeight)} min={120} max={230} />
          <NumberField label={ui.weight} unit="kg" value={weight} onChange={touch(setWeight)} min={35} max={250} step={0.1} />
        </div>
        <SelectField
          label={ui.activity}
          value={activity}
          onChange={touch(setActivity)}
          options={ACTIVITIES.map((a) => ({ value: a, label: ui.activities[a] }))}
        />
        <Segmented
          name="cal-goal"
          legend={ui.goal}
          value={goal}
          onChange={touch(setGoal)}
          options={(['lose', 'maintain', 'gain'] as const).map((g) => ({ value: g, label: ui.goals[g] }))}
        />
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-bg/60 p-6" aria-live="polite">
        <p className="text-xs text-muted">{ui.resultTitle}</p>
        <p className="display mt-1 text-6xl font-bold leading-none text-primary">
          <AnimatedNumber value={r.target} />
        </p>
        <p className="mt-2 text-sm text-fg">{ui.kcalDay}</p>
        {r.floored && (
          <p className="mt-4 flex gap-2 rounded-2xl bg-warning/10 p-3 text-sm text-warning">
            <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
            {ui.floored}
          </p>
        )}
        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
          {macros.map((m) => (
            <div key={m.label}>
              <dt className="text-xs text-muted">{m.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-fg">
                <AnimatedNumber value={m.g} /> <span className="text-sm font-normal text-muted">g</span>
              </dd>
              <dd className="text-xs text-faint">{Math.round((m.kcal / r.target) * 100)} %</dd>
            </div>
          ))}
        </dl>
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <div>
            {ui.maintenance}: <span className="text-fg">{r.tdee.toLocaleString('es-ES')} kcal</span>
          </div>
          <div>
            {ui.bmr}: <span className="text-fg">{r.bmr.toLocaleString('es-ES')} kcal</span>
          </div>
        </dl>
      </div>
    </div>
  );
}
