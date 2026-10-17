import 'server-only';
import { SITE_URL } from '@/i18n/config';
import { APPLY_COPY } from '@/content/apply';

/**
 * Avisos a Manu por Telegram (bot propio, gratis) cuando llega algo desde la web.
 * Secretos del Worker: TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID. Sin ellos no hace nada.
 * Nunca rompe la petición del visitante: errores y lentitud (4 s máx.) se ignoran.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function send(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Telegram caído o lento: el envío del visitante ya está guardado en la base de datos.
  }
}

const STATUS: Record<string, string> = {
  qualified: '🟢 Pasa a videollamada',
  waitlist: '🟡 Cualificado, cupo semanal lleno (lista de espera)',
  new: '⚪️ No llega al mínimo (se le sugieren las herramientas)',
};

export function notifyApplication(a: {
  name: string;
  email: string;
  score: number;
  status: string;
  answers: Record<string, string>;
  tried?: string | null;
  /** Origen de la visita (utm_source o referrer): instagram, google, directo… */
  source?: string | null;
}) {
  const q = APPLY_COPY.es.questions;
  const label = (k: string) => (q as Record<string, { options: Record<string, string> }>)[k]?.options[a.answers[k]] ?? a.answers[k] ?? '—';
  const lines = [
    `<b>📝 Solicitud de coaching</b>`,
    `${esc(a.name)} · ${esc(a.email)}`,
    `${STATUS[a.status] ?? a.status} · <b>${a.score} puntos</b>`,
    ``,
    `Objetivo: ${esc(label('goal'))}`,
    `Entrenando: ${esc(label('experience'))} · Estancado: ${esc(label('stuck'))}`,
    `Días: ${esc(label('days'))} · Compromiso: <b>${esc(a.answers.commitment ?? '—')}/10</b>`,
    `Invertir ahora: <b>${esc(label('invest'))}</b> · Origen: ${esc(a.source ?? 'directo')}`,
    ...(a.tried ? [``, `Ha probado: ${esc(a.tried.slice(0, 400))}`] : []),
    ``,
    `<a href="${SITE_URL}/solicitudes">Ver en el panel</a>`,
  ];
  return send(lines.join('\n'));
}

export function notifyServiceRequest(r: { name: string; email: string; product: string; videos: number; notes?: string | null }) {
  const lines = [
    `<b>🎥 Revisión de técnica: vídeos recibidos</b>`,
    `${esc(r.name)} · ${esc(r.email)}`,
    `Producto: ${esc(r.product)} · ${r.videos} vídeo(s)`,
    ...(r.notes ? [`Notas: ${esc(r.notes.slice(0, 300))}`] : []),
    ``,
    `<a href="${SITE_URL}/solicitudes">Ver en el panel</a>`,
  ];
  return send(lines.join('\n'));
}

export function notifyLead(l: { email: string; kind: 'subscribed' | 'waitlist' | 'tool_email'; source: string; product?: string | null; tool?: string | null }) {
  const what =
    l.kind === 'waitlist' ? `lista de espera de <b>${esc(l.product ?? 'programas')}</b>` : l.kind === 'tool_email' ? `email desde la calculadora (${esc(l.tool ?? '')})` : 'lista de correo';
  return send([`<b>📩 Nueva suscripción</b>`, `${esc(l.email)}`, `${what} · llegó por: ${esc(l.source)}`].join('\n'));
}
