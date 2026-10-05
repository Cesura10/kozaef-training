import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');
}

// Errores en páginas, route handlers y server actions.
export const onRequestError = Sentry.captureRequestError;
