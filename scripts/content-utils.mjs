// Utilidades puras de scripts/build-content.mjs (con tests en content-utils.test.ts).

const DATE_FIELDS = ['fechaPublicacion', 'fechaRevision'];

/**
 * YAML convierte una fecha sin comillas (`fechaPublicacion: 2026-10-04`) en un objeto Date,
 * que al pasar a JSON queda como "2026-10-04T00:00:00.000Z" y la validación la rechazaba con
 * un mensaje confuso ("fecha en formato AAAA-MM-DD") aunque el autor la escribiera bien.
 * Se devuelve a AAAA-MM-DD. Lo demás se deja igual.
 * @param {Record<string, unknown>} data
 */
export function normalizeDates(data) {
  for (const key of DATE_FIELDS) {
    const v = data[key];
    if (v instanceof Date && !Number.isNaN(v.getTime())) data[key] = v.toISOString().slice(0, 10);
  }
  return data;
}
