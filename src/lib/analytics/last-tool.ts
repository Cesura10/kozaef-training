/**
 * Último resultado de calculadora (solo números, sin datos personales), guardado en
 * localStorage para adjuntarlo al lead si la persona deja su email después.
 */
const KEY = 'kz_last_tool';

export type LastToolResult = {
  tool: 'protein' | 'calories' | 'bodyfat';
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
};

export function saveLastToolResult(value: LastToolResult) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // almacenamiento bloqueado: no pasa nada
  }
}

export function readLastToolResult(): LastToolResult | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as LastToolResult) : null;
  } catch {
    return null;
  }
}
