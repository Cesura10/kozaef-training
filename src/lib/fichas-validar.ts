import { MAX_RESPUESTA, preguntasDe, type FichaTipo } from '@/content/fichas';

/** Validación de los formularios de ficha (lógica pura, con tests). */
export const TOKEN_RE = /^[A-Za-z0-9_-]{20,80}$/;

export type Validacion = { ok: true; respuestas: Record<string, string> } | { ok: false; faltan: string[] };

/** Solo las preguntas del formulario, recortadas; comprueba las obligatorias. */
export function validarRespuestas(tipo: FichaTipo, raw: unknown): Validacion {
  const entrada = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const respuestas: Record<string, string> = {};
  const faltan: string[] = [];
  for (const p of preguntasDe(tipo)) {
    const v = typeof entrada[p.id] === 'string' ? (entrada[p.id] as string).trim().slice(0, MAX_RESPUESTA) : '';
    if (p.opciones && v && !p.opciones.includes(v)) {
      faltan.push(p.id);
      continue;
    }
    if (p.tipo === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) faltan.push(p.id);
    if (p.obligatoria && !v) faltan.push(p.id);
    if (v) respuestas[p.id] = v;
  }
  return faltan.length ? { ok: false, faltan } : { ok: true, respuestas };
}

/** "72,5" o "72.5 kg" -> 72.5; fuera de rango o ilegible -> null. */
export function leerPeso(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v.replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n >= 20 && n <= 400 ? Math.round(n * 10) / 10 : null;
}

export function leerEdad(v: string | undefined): number | null {
  const n = Number.parseInt(v ?? '', 10);
  return Number.isInteger(n) && n >= 10 && n <= 110 ? n : null;
}
