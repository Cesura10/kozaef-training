'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

export type TrailerScene = { k: string; t: string; p: string };

/**
 * Tráiler en scroll: la sección se fija y las escenas se suceden con el desplazamiento
 * (solo transform y opacity). Con reduced motion se muestra como lista estática.
 */
export function ScrollTrailer({ scenes, label }: { scenes: TrailerScene[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowX = useTransform(scrollYProgress, [0, 1], ['20%', '80%']);

  const n = scenes.length;
  return (
    <>
      {/* Versión estática para reduced motion (se decide por CSS: mismo HTML en servidor y cliente). */}
      <section aria-label={label} className="mx-auto hidden w-full max-w-7xl space-y-14 px-4 py-24 motion-reduce:block sm:px-6">
        {scenes.map((s) => (
          <div key={s.t}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{s.k}</p>
            <h3 className="display mt-3 text-4xl font-bold md:text-6xl">{s.t}</h3>
            <p className="mt-3 text-lg text-muted">{s.p}</p>
          </div>
        ))}
      </section>
      <section ref={ref} aria-label={label} className="relative motion-reduce:hidden" style={{ height: `${(n + 0.5) * 100}dvh` }}>
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <motion.div
            aria-hidden
            style={{ left: glowX }}
            className="pointer-events-none absolute top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(214,169,69,0.14),transparent)]"
          />
          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[6rem_minmax(0,1fr)]">
            {/* Contador y progreso */}
            <div className="flex items-center gap-4 md:flex-col md:items-start">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
              <div className="relative h-px w-24 bg-border md:h-40 md:w-px">
                <motion.span style={{ scaleX: bar, scaleY: bar }} className="absolute inset-0 origin-left bg-primary md:origin-top" />
              </div>
            </div>
            <div className="relative min-h-[22rem] md:min-h-[26rem]">
              {scenes.map((s, i) => (
                <Scene key={s.t} scene={s} index={i} total={n} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Scene({ scene, index, total, progress }: { scene: TrailerScene; index: number; total: number; progress: MotionValue<number> }) {
  const step = 1 / total;
  const a = index * step;
  const b = a + step;
  const first = index === 0;
  const last = index === total - 1;
  // Puntos de entrada/salida limitados a [0, 1]: la animación acelerada del navegador no admite otros.
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const range = [a - step * 0.05, a + step * 0.15, b - step * 0.3, b - step * 0.1].map(clamp);
  // Entra desde abajo, se queda y sale hacia arriba; sale del todo antes de que entre la siguiente. La primera ya está visible; la última se queda.
  const opacity = useTransform(progress, range, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, range, [first ? 0 : 80, 0, 0, last ? 0 : -80]);
  const blur = useTransform(progress, range, [first ? 0 : 8, 0, 0, last ? 0 : 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div style={{ opacity, y, filter }} className="absolute inset-0 flex flex-col justify-center">
      <span
        aria-hidden
        className="display pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none text-[22rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,169,69,0.22)] lg:block"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className="flex items-baseline gap-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        <span className="display text-5xl font-bold tracking-tight text-primary/90 md:text-6xl">{String(index + 1).padStart(2, '0')}</span>
        {scene.k}
      </p>
      <h3 className="display mt-6 max-w-[16ch] text-[2.6rem] font-bold leading-[0.98] sm:text-6xl lg:text-[5.5rem] [text-wrap:balance]">
        {scene.t}
      </h3>
      <p className="mt-6 max-w-[44ch] text-lg text-muted md:text-xl">{scene.p}</p>
    </motion.div>
  );
}
