'use client';

import { m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LogoMark } from '@/components/brand';

/**
 * Portada 3D del infoproducto hecha en código (sin imagen): se inclina siguiendo el cursor con
 * física de muelle. `photo` (nombre en public/img) pone la foto de la guía de fondo bajo el título;
 * `image` sustituiría la cara entera por una portada ya diseñada.
 */
export function BookCover({ title, subtitle, image, photo }: { title: string; subtitle: string; image?: string; photo?: string }) {
  const longWord = Math.max(...title.split(' ').map((w) => w.length)) > 8;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-28, -8]), { stiffness: 140, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 18 });
  const glare = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);

  return (
    <div
      className="mx-auto w-[15rem] [perspective:1400px] sm:w-[18rem]"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <m.div
        style={{ rotateY: rotY, rotateX: rotX }}
        initial={{ opacity: 0, y: 40, rotateZ: -4 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative aspect-[3/4] [transform-style:preserve-3d]"
      >
        {/* Lomo */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-8 origin-left bg-[linear-gradient(90deg,#0d0c09,#2a2416)] [transform:rotateY(90deg)_translateX(-100%)]"
        />
        {/* Cara frontal */}
        <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm border border-primary/30 bg-[linear-gradient(155deg,#1f1a10_0%,#0e0d0b_55%,#16130c_100%)] shadow-[30px_40px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(214,169,69,0.08)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="relative flex h-full flex-col justify-between p-6">
              {photo && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizados */}
                  <img
                    src={`/img/${photo}-800.webp`}
                    srcSet={`/img/${photo}-480.webp 480w, /img/${photo}-800.webp 800w`}
                    sizes="288px"
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.25)_0%,rgba(10,10,11,0.35)_35%,rgba(10,10,11,0.92)_70%,rgba(10,10,11,0.98)_100%)]" />
                </>
              )}
              <LogoMark className="relative h-9 w-9" />
              <div className="relative">
                <span className="block h-px w-10 bg-primary/70" />
                <p className={`display foil-text mt-4 font-bold uppercase leading-[0.92] ${longWord ? 'text-[1.45rem] sm:text-[1.75rem]' : 'text-[2.1rem] sm:text-[2.5rem]'}`}>{title}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted">{subtitle}</p>
              </div>
              <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-faint">Kozaef Training</p>
            </div>
          )}
          {/* Reflejo que se desplaza con la inclinación */}
          <m.div
            aria-hidden
            style={{ backgroundPositionX: glare }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,240,200,0.10)_50%,transparent_65%)] bg-[length:250%_100%]"
          />
          {/* Pliegue junto al lomo */}
          <div aria-hidden className="absolute inset-y-0 left-3 w-px bg-black/50 shadow-[1px_0_0_rgba(255,255,255,0.05)]" />
        </div>
      </m.div>
      <div aria-hidden className="mx-auto mt-6 h-6 w-3/4 rounded-[100%] bg-black/60 blur-xl" />
    </div>
  );
}
