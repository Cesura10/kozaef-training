'use client';

import { useId } from 'react';
import { motion } from 'motion/react';

/** Selector de opciones en píldora (2-3 opciones). */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="text-xs text-muted">{legend}</legend>
      <div
        className="mt-2 grid gap-1 rounded-full border border-border bg-bg p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className="relative rounded-full px-1 py-2 text-[11px] font-medium text-muted transition-colors hover:text-fg aria-pressed:text-primary-fg min-[400px]:px-2 min-[400px]:text-xs sm:text-[13px]"
          >
            {value === o.value && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative whitespace-nowrap">{o.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Campo numérico con unidad. Teclado numérico en móvil y 16px para que iOS no haga zoom. */
export function NumberField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
  optional,
}: {
  label: string;
  unit: string;
  value: number | '';
  onChange: (v: number | '') => void;
  min: number;
  max: number;
  step?: number;
  optional?: boolean;
}) {
  const id = useId();
  const outOfRange = value !== '' && (value < min || value > max);
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          aria-invalid={outOfRange || undefined}
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          required={!optional}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="h-12 w-full min-w-0 rounded-full border border-border-strong bg-bg pl-3 pr-10 text-[16px] tabular-nums text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 aria-invalid:border-danger sm:pl-5 sm:pr-14"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-faint sm:right-5 sm:text-sm">{unit}</span>
      </div>
    </div>
  );
}

/** Desplegable nativo (accesible y cómodo en móvil). */
export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-2 h-12 w-full appearance-none rounded-full border border-border-strong bg-bg bg-[length:12px] bg-[right_1.25rem_center] bg-no-repeat pl-5 pr-12 text-[16px] text-ellipsis text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a8a59e' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Convierte '' en el valor por defecto para calcular sin romper mientras se escribe,
 * y acota al rango del campo (una edad negativa no debe dar un resultado).
 */
export const num = (v: number | '', fallback: number, min = -Infinity, max = Infinity) =>
  v === '' || Number.isNaN(v) ? fallback : Math.min(max, Math.max(min, v));
