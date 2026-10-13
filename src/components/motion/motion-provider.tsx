'use client';

import type { ReactNode } from 'react';
import { LazyMotion } from 'motion/react';

const loadFeatures = () => import('./motion-features').then((m) => m.default);

/**
 * Carga diferida de Motion: los componentes usan `m.*` (ligero) y las funciones de animación
 * llegan en un archivo aparte, así no retrasan el primer pintado en móvil (LCP).
 * `strict`: avisa si alguien usa `motion.*`, que volvería a meter la librería entera.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
