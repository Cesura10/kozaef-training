/**
 * LÍMITES DE USO Y COSTE. Un solo sitio para ajustarlos.
 *
 * Regla: todo servicio externo se usa en su plan GRATIS y la web se frena
 * ANTES de llegar a su tope. Si se alcanza un tope, la web degrada con elegancia
 * (las calculadoras siguen funcionando en el navegador; el email se pospone),
 * nunca genera una factura. Ver docs/ecosistema.md §13.
 */
export const LIMITS = {
  /** Peticiones por IP y endpoint. */
  perIp: {
    leads: { max: 5, windowSeconds: 3600 },
    applications: { max: 3, windowSeconds: 86_400 },
    magicLink: { max: 5, windowSeconds: 3600 },
  },
  /** Topes globales por día (se reinician a medianoche UTC). */
  daily: {
    leads: 2_000,
    applications: 150,
    /** Resend gratis: 100/día y 3.000/mes. Nos quedamos por debajo. */
    emails: 90,
  },
  /** Tamaño máximo del cuerpo de cualquier POST público. */
  maxBodyBytes: 8_192,
} as const;

export type RateLimitKey = keyof typeof LIMITS.perIp;
export type DailyCounter = keyof typeof LIMITS.daily;
