'use client';

import { MotionConfig, motion } from 'motion/react';

/** Línea que se dibuja de izquierda a derecha al entrar en pantalla. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.span
        aria-hidden
        className={`block origin-left ${className ?? ''}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </MotionConfig>
  );
}
