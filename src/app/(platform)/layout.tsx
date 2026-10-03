import type { Metadata, Viewport } from 'next';
import { fontVariables } from '../fonts';
import '../globals.css';

// Layout raíz de la plataforma privada (login, app de clientes, panel). Solo español por ahora.
export const metadata: Metadata = {
  title: { default: 'Kozaef Training', template: '%s | Kozaef Training' },
  applicationName: 'Kozaef Training',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Kozaef', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="app-backdrop grain min-h-full flex flex-col">{children}</body>
    </html>
  );
}
