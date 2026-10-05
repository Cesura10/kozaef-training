import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Navegador mínimo: el script de Meta no se descarga, solo se comprueba qué llega a fbq.
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '123');
  vi.stubGlobal('window', {});
  vi.stubGlobal('document', { createElement: () => ({}), head: { appendChild: () => {} } });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const calls = () => (window.fbq as unknown as { queue: unknown[][] }).queue;

describe('píxel de Meta y consentimiento', () => {
  it('tras aceptar, los eventos llegan a Meta', async () => {
    const { loadMetaPixel, metaTrack } = await import('./meta');
    loadMetaPixel();
    metaTrack('waitlist_join', { product: 'x' });
    expect(calls().some((c) => c[0] === 'track' && c[1] === 'Lead')).toBe(true);
  });
  it('al retirar el consentimiento deja de enviar eventos y avisa a Meta', async () => {
    const { loadMetaPixel, metaTrack, revokeMetaPixel } = await import('./meta');
    loadMetaPixel();
    revokeMetaPixel();
    const before = calls().length;
    metaTrack('waitlist_join', { product: 'x' });
    metaTrack('cta_click', { cta: 'apply', location: 'nav' });
    expect(calls().slice(before)).toEqual([]);
    expect(calls()).toContainEqual(['consent', 'revoke']);
  });
  it('volver a aceptar reactiva el envío sin cargar el script dos veces', async () => {
    const { loadMetaPixel, metaTrack, revokeMetaPixel } = await import('./meta');
    loadMetaPixel();
    const fbq = window.fbq;
    revokeMetaPixel();
    loadMetaPixel();
    expect(window.fbq).toBe(fbq);
    metaTrack('waitlist_join', { product: 'x' });
    expect(calls().at(-1)?.[1]).toBe('Lead');
  });
});
