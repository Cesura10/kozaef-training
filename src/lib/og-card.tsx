import { ImageResponse } from 'next/og';

/** Tarjeta para compartir (1200x630) con la marca: etiqueta pequeña + titular en dos tonos. */
export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard({ eyebrow, title, accent }: { eyebrow?: string; title: string; accent?: string }) {
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow && <span style={{ fontSize: 30, color: '#d6a945', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>{eyebrow}</span>}
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 80, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>
            <span>{title}</span>
            {accent && <span style={{ color: '#d6a945' }}>{accent}</span>}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
