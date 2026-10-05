// Detección de errores en el navegador (Sentry). Sin DSN no se activa.
// Sin grabación de sesiones (privacidad y cuota gratis); los datos personales se filtran.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? 'production',
    tracesSampleRate: 0.05,
    // RGPD: solo el error técnico. Ni usuario, ni cookies, ni cabeceras, ni formularios (emails), ni query.
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
    // Errores de extensiones del navegador y de red que no son de la web.
    ignoreErrors: ['ResizeObserver loop', 'Non-Error promise rejection captured', /^Network ?Error/i],
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^moz-extension:\/\//i],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
