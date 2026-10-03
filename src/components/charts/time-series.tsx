'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { CHART } from './tokens';

type Series = { key: string; label: string };

const fmtDay = (d: string) => {
  const [, m, day] = d.split('-');
  return `${Number(day)}/${Number(m)}`;
};
const fmtNum = (n: number) => n.toLocaleString('es-ES');

/** Línea temporal: hasta 2 series, leyenda + etiqueta directa al final, cursor con tooltip y tabla. */
export function TimeSeries({
  data,
  series,
  height = 260,
}: {
  data: Array<Record<string, string | number>>;
  series: Series[];
  height?: number;
}) {
  if (data.length === 0) {
    return <p className="flex h-40 items-center justify-center text-sm text-faint">Sin datos en este periodo.</p>;
  }
  const last = data[data.length - 1];

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-4 text-xs text-muted" aria-label="Leyenda">
        {series.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded-full" style={{ background: CHART.series[i] }} aria-hidden />
            {s.label}
            <span className="text-fg">{fmtNum(Number(last[s.key]))}</span>
            <span className="text-faint">último día</span>
          </li>
        ))}
      </ul>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="day"
              tickFormatter={fmtDay}
              stroke={CHART.axis}
              tick={{ fontSize: 11, fill: CHART.axis }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              minTickGap={24}
            />
            <YAxis
              stroke={CHART.axis}
              tick={{ fontSize: 11, fill: CHART.axis }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtNum}
              width={56}
            />
            <Tooltip
              cursor={{ stroke: CHART.axis, strokeWidth: 1 }}
              content={(p: TooltipContentProps<ValueType, NameType>) => <ChartTooltip {...p} series={series} />}
            />
            {series.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={CHART.series[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: CHART.surface, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer select-none hover:text-fg">Ver tabla</summary>
        <div className="mt-2 max-h-56 overflow-auto">
          <table className="w-full tabular-nums">
            <thead className="text-left text-faint">
              <tr>
                <th className="py-1 font-medium">Día</th>
                {series.map((s) => (
                  <th key={s.key} className="py-1 text-right font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={String(row.day)} className="border-t border-border">
                  <td className="py-1">{fmtDay(String(row.day))}</td>
                  {series.map((s) => (
                    <td key={s.key} className="py-1 text-right text-fg">
                      {fmtNum(Number(row[s.key]))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  series,
}: TooltipContentProps<ValueType, NameType> & { series: Series[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-strong bg-elevated px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-muted">{fmtDay(String(label))}</p>
      {series.map((s, i) => {
        const item = payload.find((p) => p.dataKey === s.key);
        return (
          <p key={s.key} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: CHART.series[i] }} aria-hidden />
            <span className="text-muted">{s.label}</span>
            <span className="ml-auto pl-4 tabular-nums text-fg">{fmtNum(Number(item?.value ?? 0))}</span>
          </p>
        );
      })}
    </div>
  );
}
