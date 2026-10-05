'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Último recurso si falla un layout raíz: avisa a Sentry y muestra una pantalla digna.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ background: '#0a0a0b', color: '#f2f0eb', fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100dvh', margin: 0 }}>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Algo ha fallado</h1>
          <p style={{ color: '#a8a59e' }}>Ya me ha llegado el aviso y lo estoy revisando. Inténtalo de nuevo en un momento.</p>
          <button onClick={reset} style={{ marginTop: 16, background: '#d6a945', color: '#0a0a0b', border: 0, borderRadius: 999, padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}>
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
