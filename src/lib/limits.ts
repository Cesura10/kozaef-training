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
    serviceRequests: { max: 3, windowSeconds: 86_400 },
  },
  /** Topes globales por día (se reinician a medianoche UTC). */
  daily: {
    leads: 2_000,
    applications: 150,
    serviceRequests: 60,
    /** Resend gratis: 100/día y 3.000/mes. Nos quedamos por debajo. */
    emails: 90,
  },
  /** Tamaño máximo del cuerpo de cualquier POST público. */
  maxBodyBytes: 8_192,
} as const;

export type RateLimitKey = keyof typeof LIMITS.perIp;
export type DailyCounter = keyof typeof LIMITS.daily;

/**
 * Coste mensual real de la infraestructura, en euros. Actualizar al contratar algo.
 * El panel de analítica lo compara con los ingresos (regla: subir de plan solo si
 * ingresos >= 3 x coste; docs/ecosistema.md §14).
 */
export const MONTHLY_COSTS_EUR = {
  cloudflare: 0,
  supabase: 0,
  email: 0,
  analytics: 0,
  domain: 0, // ~1,25 €/mes cuando se compre (15 €/año)
} as const;

/** Topes de los planes gratis, para mostrar el margen en el panel. */
export const FREE_PLAN_QUOTAS = {
  emailsPerDay: 100,
  emailsPerMonth: 3_000,
  workerRequestsPerDay: 100_000,
  dbMegabytes: 500,
  monthlyActiveUsers: 50_000,
} as const;
