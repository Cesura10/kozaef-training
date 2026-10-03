'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics/client';

/** Visita a la página de un producto (base del embudo demo -> compra por producto y precio). */
export function ProductViewTracker({ product, price }: { product: string; price: number | null }) {
  useEffect(() => {
    track('product_view', { product, price });
  }, [product, price]);
  return null;
}
