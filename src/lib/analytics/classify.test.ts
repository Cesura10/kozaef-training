import { describe, expect, it } from 'vitest';
import { channelFor, classifyAgent } from './classify';

describe('bots y navegadores', () => {
  it('reconoce bots por su nombre', () => {
    expect(classifyAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)').label).toBe('Google');
    expect(classifyAgent('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1)').label).toBe('Amazon');
    expect(classifyAgent('Mozilla/5.0 (compatible; bingbot/2.0)').label).toBe('Bing');
    expect(classifyAgent('Mozilla/5.0 (Linux; Android 14; Pixel 7) Chrome/153.0 Mobile Safari/537.36 KozaefMonitor').label).toBe(
      'Monitor de Kozaef (propio)',
    );
  });
  it('programas sin nombre y bots verificados por Cloudflare', () => {
    expect(classifyAgent('node').kind).toBe('bot');
    expect(classifyAgent('Go-http-client/1.1').kind).toBe('bot');
    expect(classifyAgent('').kind).toBe('bot');
    expect(classifyAgent('Mozilla/5.0 (Windows NT 10.0) Chrome/120', 'Monitoring & Analytics')).toMatchObject({ kind: 'bot', label: 'Monitorización', verified: true });
  });
  it('un navegador normal es navegador', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    expect(classifyAgent(ua).kind).toBe('browser');
  });
});

describe('canal de origen', () => {
  it('por dominio de referencia', () => {
    expect(channelFor('www.google.es').id).toBe('google');
    expect(channelFor('l.instagram.com').id).toBe('instagram');
    expect(channelFor('chatgpt.com').id).toBe('ia');
    expect(channelFor('$direct').id).toBe('directo');
    expect(channelFor(null).id).toBe('directo');
    expect(channelFor('foro-ejemplo.com')).toEqual({ id: 'foro-ejemplo.com', label: 'foro-ejemplo.com' });
  });
  it('la utm_source manda sobre la referencia', () => {
    expect(channelFor('$direct', 'instagram').id).toBe('instagram');
    expect(channelFor('www.google.com', 'email').id).toBe('email');
  });
});
