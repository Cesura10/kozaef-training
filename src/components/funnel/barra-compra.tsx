'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, X } from '@phosphor-icons/react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

/** Rutas donde la barra estorba: formularios, gracias, legal y la propia página de pago. */
const HIDDEN = /\/(solicitar|apply|gracias|thanks|legal|diagnostico|diagnosis|enviar|send)(\/|$)/;
const KEY = 'kz-barra-compra-cerrada';

/**
 * Barra de compra fija con el producto estrella (src/content/pack.ts). Aparece al bajar,
 * se oculta cuando ya se ve una zona de compra (#comprar o los packs) o el aviso de cookies,
 * y se puede cerrar (solo durante la visita). Lleva a la ficha, donde está la casilla de
 * desistimiento obligatoria antes de pagar.
 */
export function BarraCompra({
  id,
  href,
  name,
  priceText,
  kicker,
  cta,
  closeLabel,
}: {
  id: string;
  href: string;
  name: string;
  priceText: string | null;
  kicker: string;
  cta: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [covered, setCovered] = useState(false);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    let wasClosed = false;
    try {
      wasClosed = sessionStorage.getItem(KEY) === '1';
    } catch {}
    const t = setTimeout(() => setClosed(wasClosed), 0);
    const zones = Array.from(document.querySelectorAll('#comprar, #pack-title'));
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCovered(visible.size > 0 || Boolean(document.querySelector('[role="dialog"][aria-label="Cookies"]')));
    });
    zones.forEach((z) => io.observe(z));
    const onScroll = () => {
      setScrolled(window.scrollY > 640);
      setCovered(visible.size > 0 || Boolean(document.querySelector('[role="dialog"][aria-label="Cookies"]')));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const show = scrolled && !covered && !closed && !HIDDEN.test(pathname);
  const close = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {show && (
          <motion.aside
            aria-label={kicker}
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl sm:bottom-5"
          >
            <div className="flex items-center gap-3 rounded-full border border-primary/40 bg-elevated/95 py-2 pl-5 pr-2 shadow-[0_18px_50px_-12px_rgba(214,169,69,0.35)] backdrop-blur">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {kicker}
                  {priceText && <span className="ml-2 tabular-nums text-fg">· {priceText}</span>}
                </p>
                <p className="truncate text-sm font-semibold text-fg">{name}</p>
              </div>
              <Link
                href={href}
                data-track="cta_click"
                data-cta="product"
                data-location={`barra-compra:${id}`}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98]"
              >
                {cta}
                <ArrowRight size={16} weight="bold" />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="grid size-9 shrink-0 place-items-center rounded-full text-faint transition hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
