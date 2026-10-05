// Detección de errores en el servidor (Cloudflare Worker vía OpenNext). Sin DSN no se activa.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? 'production',
    tracesSampleRate: 0.05,
    // RGPD: solo el error técnico. Ni usuario, ni cookies, ni cabeceras, ni formularios (emails), ni query.
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
  });
}
