/**
 * Catálogo de eventos de analítica. Añadir aquí ANTES de medir algo nuevo
 * (docs/ecosistema.md §15). Nombres en snake_case, propiedades pequeñas y sin datos personales.
 */
export type AnalyticsEvents = {
  calculator_used: { tool: 'protein' | 'calories' | 'bodyfat'; goal?: string };
  calculator_email_click: { tool: 'protein' | 'calories' | 'bodyfat' };
  cta_click: { cta: 'apply' | 'tools' | 'login'; location: 'nav' | 'hero' | 'coaching' };
  newsletter_submit: { status: 'ok' | 'invalid' | 'error' };
  language_switch: { to: string };
  application_submitted: { score_band: 'low' | 'mid' | 'high' };
  call_booked: { source?: string };
  purchase: { product: string; value: number; currency: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;
