/**
 * Catálogo de eventos de analítica. Añadir aquí ANTES de medir algo nuevo
 * (docs/privado/ecosistema.md §15). Nombres en snake_case, propiedades pequeñas y sin datos personales.
 */
export type AnalyticsEvents = {
  calculator_used: { tool: 'protein' | 'calories' | 'bodyfat'; goal?: string };
  calculator_email_click: { tool: 'protein' | 'calories' | 'bodyfat' };
  /** Clic en cualquier CTA: cuál y dónde (la página va en $pathname automáticamente). */
  cta_click: { cta: CtaId; location: string };
  waitlist_join: { product: string };
  /** Clic en "Comprar" de un infoproducto: base para decidir precios. */
  buy_click: { product: string; price: number | null; currency: string };
  product_view: { product: string; price: number | null };
  diagnosis_completed: { profile: string; category: string };
  technique_request: { status: 'ok' | 'error' };
  newsletter_submit: { status: 'ok' | 'invalid' | 'error' };
  language_switch: { to: string };
  application_submitted: { score_band: 'low' | 'mid' | 'high' };
  call_booked: { source?: string };
  purchase: { product: string; value: number; currency: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export type CtaId =
  | 'apply'
  | 'tools'
  | 'login'
  | 'diagnosis'
  | 'coaching'
  | 'product'
  | 'tool'
  | 'technique'
  | 'instagram'
  | 'whatsapp';
