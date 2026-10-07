'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { track } from '@/lib/analytics/client';

/**
 * Botón de compra (Shopify). Exige la casilla de desistimiento antes de habilitarse.
 * Servicios con cupo: consulta las plazas usadas y, si está lleno, avisa (onFull).
 */
export function BuyButton({
  productId,
  href,
  price,
  label,
  consentText,
  consentRequiredText,
  capacity,
  fullText,
}: {
  productId: string;
  href: string;
  price: number | null;
  label: string;
  consentText: string;
  consentRequiredText: string;
  capacity?: number;
  fullText: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const [warn, setWarn] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!capacity) return;
    let cancelled = false;
    createClient()
      .rpc('service_capacity_used', { p_product: productId })
      .then(({ data }) => {
        if (!cancelled && typeof data === 'number' && data >= capacity) setFull(true);
      });
    return () => {
      cancelled = true;
    };
  }, [capacity, productId]);

  if (full) return <p className="rounded-2xl bg-warning/10 p-4 text-sm text-warning">{fullText}</p>;

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            setWarn(false);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
        />
        <span>{consentText}</span>
      </label>
      {/* Es un enlace (lleva a Shopify), no un botón. Sin la casilla no tiene href, así que se
          mantiene enfocable y responde al teclado para mostrar el aviso. */}
      <a
        href={accepted ? href : undefined}
        // Sin href un <a> pierde el rol de enlace: se lo devolvemos para los lectores de pantalla.
        role={accepted ? undefined : 'link'}
        aria-disabled={!accepted}
        tabIndex={accepted ? undefined : 0}
        onKeyDown={(e) => {
          if (!accepted && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setWarn(true);
          }
        }}
        onClick={(e) => {
          if (!accepted) {
            e.preventDefault();
            setWarn(true);
            return;
          }
          track('buy_click', { product: productId, price, currency: 'EUR' });
        }}
        className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover aria-disabled:opacity-50"
      >
        {label}
      </a>
      {warn && (
        <p role="alert" className="text-sm text-danger">
          {consentRequiredText}
        </p>
      )}
    </div>
  );
}
