'use client';

import type { ReactNode } from 'react';
import { MotionConfig, motion } from 'motion/react';

/**
 * Aparición al entrar en pantalla. Jerarquía: guía la lectura sección a sección.
 * Mismo estado inicial en servidor y cliente (sin hydration mismatch); con
 * reduced motion, MotionConfig elimina el desplazamiento y deja solo el fundido.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
