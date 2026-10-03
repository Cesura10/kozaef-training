import { ImageResponse } from 'next/og';
import { LOCALES } from '@/i18n/config';

// Imagen al compartir la web en WhatsApp, Instagram, X... Generada en el build (estática).
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Kozaef Training';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [a, b] = locale === 'en' ? ['Train with intent.', 'Progress with data.'] : ['Entrena con criterio.', 'Progresa con datos.'];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 85% 0%, rgba(214,169,69,0.28), transparent 55%), #0a0a0b',
          color: '#f2f0eb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: '3px solid #d6a945',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d6a945',
              fontSize: 34,
            }}
          >
            K
          </div>
          KOZAEF <span style={{ color: '#a8a59e', fontWeight: 400 }}>TRAINING</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>{a}</span>
          <span style={{ color: '#d6a945' }}>{b}</span>
        </div>
      </div>
    ),
    size,
  );
}
