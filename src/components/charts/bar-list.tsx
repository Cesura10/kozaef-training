import { CHART } from './tokens';

/**
 * Ranking en barras horizontales (una serie, un color). Etiqueta, barra y valor en
 * la misma fila: la propia lista hace de tabla. Hover: resalta la fila + tooltip nativo.
 */
export function BarList({
  data,
  format = (n) => n.toLocaleString('es-ES'),
  total,
}: {
  data: Array<{ label: string; value: number }>;
  format?: (n: number) => string;
  /** Si se pasa, muestra también el % sobre el total. */
  total?: number;
}) {
  if (data.length === 0) {
    return <p className="flex h-24 items-center justify-center text-sm text-faint">Sin datos en este periodo.</p>;
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ol className="space-y-1">
      {data.map((d) => {
        const share = total ? ` (${Math.round((d.value / total) * 100)} %)` : '';
        return (
          <li
            key={d.label}
            title={`${d.label}: ${format(d.value)}${share}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2"
          >
            <span className="truncate text-sm text-fg">{d.label}</span>
            <span className="text-right text-sm tabular-nums text-fg">
              {format(d.value)}
              {share && <span className="ml-1.5 text-xs text-faint">{share.trim()}</span>}
            </span>
            <span className="col-span-2 h-1.5" aria-hidden>
              <span
                className="block h-full rounded-r-[4px]"
                style={{ width: `${Math.max(1, (d.value / max) * 100)}%`, background: CHART.series[0] }}
              />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
