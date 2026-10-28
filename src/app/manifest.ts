import type { MetadataRoute } from 'next';

// Datos de la web instalada en el móvil (icono y nombre en la pantalla de inicio).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kozaef Training',
    short_name: 'Kozaef',
    description: 'Entrenador personal online: tu plan de entrenamiento y nutrición con seguimiento.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0a0a0b',
    theme_color: '#0a0a0b',
    lang: 'es',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
