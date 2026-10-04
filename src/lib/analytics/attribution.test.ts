import { describe, expect, it, beforeEach, vi } from 'vitest';

// Entorno mínimo de navegador para probar la detección de canal.
function setup(search: string, referrer: string) {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  });
  vi.stubGlobal('window', { location: { search, pathname: '/es', hostname: 'kozaeftraining.com' } });
  vi.stubGlobal('document', { referrer });
}

describe('atribución de canal', () => {
  beforeEach(() => vi.resetModules());
  it.each([
    ['', 'https://chatgpt.com/', 'ia'],
    ['', 'https://www.perplexity.ai/search', 'ia'],
    ['', 'https://gemini.google.com/app', 'ia'],
    ['', 'https://claude.ai/chat/1', 'ia'],
    ['?utm_source=chatgpt.com', '', 'ia'],
    ['', 'https://www.google.com/', 'google'],
    ['', 'https://www.tiktok.com/', 'tiktok'],
    ['?utm_source=Instagram', '', 'instagram'],
    ['', '', 'directo'],
  ])('%s %s -> %s', async (search, referrer, expected) => {
    setup(search, referrer);
    const { captureAttribution } = await import('./attribution');
    expect(captureAttribution()?.source).toBe(expected);
  });
});
