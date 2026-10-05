import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/config';
import { PRODUCTS, isBuyable, relatedProduct, visibleProducts } from './products';

describe('catálogo de productos', () => {
  it('ids y slugs únicos en cada idioma', () => {
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(PRODUCTS.length);
    for (const l of LOCALES) expect(new Set(PRODUCTS.map((p) => p.slug[l])).size).toBe(PRODUCTS.length);
  });

  it('el enlace de pago, si existe, es https', () => {
    for (const p of PRODUCTS) if (p.enlacePago) expect(p.enlacePago).toMatch(/^https:\/\//);
  });

  it('sin enlace de pago nunca se puede comprar', () => {
    for (const p of PRODUCTS) if (!p.enlacePago) expect(isBuyable(p)).toBe(false);
  });

  it('las páginas generales muestran un infoproducto si hay alguno publicado', () => {
    const info = visibleProducts().find((p) => p.tipo === 'infoproducto');
    expect(relatedProduct({})).toBe(info ?? null);
  });
});
