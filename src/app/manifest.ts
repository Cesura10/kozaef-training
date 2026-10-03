import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Entrenamiento — Plataforma de Manu',
    short_name: 'Entrenamiento',
    description:
      'Rutinas, dietas, revisiones y chat 1:1 para el seguimiento de entrenamiento personal.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0b0f14',
    theme_color: '#0b0f14',
    lang: 'es',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
