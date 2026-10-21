'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { CONSENTIMIENTO_SALUD, FORMULARIOS, MAX_RESPUESTA, preguntasDe, type FichaTipo, type Pregunta } from '@/content/fichas';
import { Honeypot } from '@/components/honeypot';
import { Turnstile, resetTurnstile } from '@/components/turnstile';

type Estado = 'idle' | 'enviando' | 'faltan' | 'consentimiento' | 'caducado' | 'limite' | 'error' | 'ok';

const input =
  'mt-2 w-full rounded-2xl border border-border-strong bg-bg px-5 py-3 text-[16px] text-fg placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 aria-[invalid=true]:border-danger';

export function FichaForm({ token, tipo, nombre }: { token: string; tipo: FichaTipo; nombre: string }) {
  const [estado, setEstado] = useState<Estado>('idle');
  const [faltan, setFaltan] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const respuestas: Record<string, string> = {};
    for (const p of preguntasDe(tipo)) respuestas[p.id] = String(f.get(p.id) ?? '').trim();
    const sinRellenar = preguntasDe(tipo).filter((p) => p.obligatoria && !respuestas[p.id]).map((p) => p.id);
    if (sinRellenar.length) {
      setFaltan(sinRellenar);
      setEstado('faltan');
      document.getElementById(`p-${sinRellenar[0]}`)?.focus();
      return;
    }
    if (tipo === 'inicial' && f.get('consentimiento') !== 'on') {
      setEstado('consentimiento');
      return;
    }
    setEstado('enviando');
    try {
      const res = await fetch('/api/fichas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          respuestas,
          consentimiento: tipo === 'inicial' ? true : undefined,
          website: String(f.get('website') ?? ''),
          turnstileToken: f.get('cf-turnstile-response') ?? undefined,
        }),
      });
      if (res.ok) {
        setEstado('ok');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { faltan?: string[] };
      if (res.status === 410) setEstado('caducado');
      else if (res.status === 429 || res.status === 503) setEstado('limite');
      else if (data.faltan?.length) {
        setFaltan(data.faltan);
        setEstado('faltan');
      } else setEstado('error');
      resetTurnstile(form);
    } catch {
      setEstado('error');
      resetTurnstile(form);
    }
  }

  if (estado === 'ok') {
    return (
      <div role="status" className="animate-rise rounded-[var(--radius-xl)] border border-primary/40 p-8 gold-sheen">
        <CheckCircle size={40} weight="duotone" className="text-primary" />
        <h2 className="display mt-4 text-3xl font-bold">Recibido, gracias</h2>
        <p className="mt-3 max-w-[55ch] text-lg text-muted">
          {tipo === 'inicial'
            ? 'Ya tengo todo lo que necesito. Me pongo con tu plan y te escribo en cuanto esté listo.'
            : 'Reviso lo que me cuentas y ajusto tu siguiente plan. Te escribo pronto.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-12">
      <Honeypot />
      {FORMULARIOS[tipo].secciones.map((s) => (
        <fieldset key={s.titulo} className="space-y-6">
          <legend className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{s.titulo}</legend>
          {s.preguntas.map((p) => (
            <Campo key={p.id} p={p} invalido={faltan.includes(p.id)} porDefecto={p.id === 'nombre' ? nombre : ''} />
          ))}
        </fieldset>
      ))}

      {tipo === 'inicial' && (
        <label className="flex items-start gap-3 rounded-2xl border border-border p-5 text-sm text-muted">
          <input type="checkbox" name="consentimiento" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
          <span>
            {CONSENTIMIENTO_SALUD}{' '}
            <a href="/es/legal/privacidad" target="_blank" className="text-fg underline underline-offset-4 hover:text-primary">
              Política de privacidad
            </a>
            .
          </span>
        </label>
      )}

      <Turnstile />

      {estado !== 'idle' && estado !== 'enviando' && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {estado === 'faltan' && 'Revisa las preguntas marcadas: faltan respuestas obligatorias o alguna no es válida.'}
          {estado === 'consentimiento' && 'Para enviar el formulario necesito que marques la casilla de consentimiento.'}
          {estado === 'caducado' && 'Este enlace ya se ha usado o ha caducado. Escríbeme por WhatsApp y te mando uno nuevo.'}
          {estado === 'limite' && 'Se han hecho demasiados envíos seguidos. Espera unos minutos y vuelve a intentarlo.'}
          {estado === 'error' && 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo; no se ha perdido nada de lo que has escrito.'}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
        {estado !== 'enviando' && <ArrowRight size={16} weight="bold" />}
      </button>
    </form>
  );
}

function Campo({ p, invalido, porDefecto }: { p: Pregunta; invalido: boolean; porDefecto: string }) {
  const id = `p-${p.id}`;
  const etiqueta = (
    <span className="text-base font-medium text-fg">
      {p.label}
      {p.obligatoria && <span className="text-primary"> *</span>}
    </span>
  );
  if (p.opciones) {
    return (
      <fieldset aria-invalid={invalido || undefined}>
        <legend>{etiqueta}</legend>
        <div className={`mt-3 grid gap-2 ${p.opciones.length > 4 ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {p.opciones.map((o, i) => (
            <label
              key={o}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-border-strong bg-bg px-2 py-2 text-center text-sm text-muted transition-colors hover:text-fg has-[:checked]:border-primary has-[:checked]:bg-primary/15 has-[:checked]:text-fg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50"
            >
              <input id={i === 0 ? id : undefined} type="radio" name={p.id} value={o} className="sr-only" />
              {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <label className="block">
      {etiqueta}
      {p.tipo === 'parrafo' ? (
        <textarea id={id} name={p.id} rows={3} maxLength={MAX_RESPUESTA} aria-invalid={invalido} className={input} />
      ) : (
        <input
          id={id}
          name={p.id}
          type={p.tipo === 'email' ? 'email' : p.tipo === 'tel' ? 'tel' : 'text'}
          inputMode={p.tipo === 'numero' ? 'decimal' : undefined}
          autoComplete={p.id === 'nombre' ? 'name' : p.tipo === 'email' ? 'email' : p.tipo === 'tel' ? 'tel' : 'off'}
          defaultValue={porDefecto}
          maxLength={p.tipo === 'texto' ? 300 : 120}
          aria-invalid={invalido}
          className={input}
        />
      )}
    </label>
  );
}
