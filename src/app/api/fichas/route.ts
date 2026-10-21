import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isBot } from '@/components/honeypot';
import { guardPublicWrite } from '@/lib/guard';
import { LIMITS } from '@/lib/limits';
import { createAdminClient } from '@/lib/supabase/admin';
import { leerEdad, leerPeso, nuevoToken, resolverEnlace, TOKEN_RE, validarRespuestas } from '@/lib/fichas';
import { notifyFicha } from '@/lib/notify';
import type { Json } from '@/types/database';

// Formulario de ficha (enlace privado de Manu): crea la ficha (inicial) o añade una revisión.
// Escribe con service_role tras validar el enlace; el público nunca toca las tablas directamente.

const Body = z.object({
  token: z.string().regex(TOKEN_RE),
  respuestas: z.record(z.string(), z.string()),
  consentimiento: z.boolean().optional(),
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

const fail = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return fail(400, 'invalid_json');
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return fail(400, 'invalid_body');
  const b = parsed.data;
  if (isBot(b.website)) return NextResponse.json({ ok: true });

  const guard = await guardPublicWrite(req.headers, {
    endpoint: 'fichas',
    daily: 'fichas',
    flag: 'fichas_open',
    turnstileToken: b.turnstileToken,
    maxBytes: LIMITS.maxFichaBytes,
  });
  if (!guard.ok) return fail(guard.status, guard.reason);

  const enlace = await resolverEnlace(b.token);
  if (!enlace) return fail(410, 'enlace_no_valido');

  const v = validarRespuestas(enlace.tipo, b.respuestas);
  if (!v.ok) return fail(400, 'faltan_respuestas', { faltan: v.faltan });
  if (enlace.tipo === 'inicial' && b.consentimiento !== true) return fail(400, 'falta_consentimiento');

  const r = v.respuestas;
  const peso = leerPeso(r.peso);
  const db = createAdminClient();

  if (enlace.tipo === 'inicial') {
    // Marcar el enlace como usado de forma atómica: dos envíos a la vez no crean dos fichas.
    const { data: usado } = await db
      .from('ficha_enlaces')
      .update({ usado_at: new Date().toISOString() })
      .eq('token', b.token)
      .is('usado_at', null)
      .gt('caduca_at', new Date().toISOString())
      .select('token');
    if (!usado?.length) return fail(410, 'enlace_no_valido');

    const { data: ficha, error } = await db
      .from('fichas')
      .insert({
        nombre: r.nombre ?? '',
        email: r.email?.toLowerCase() ?? null,
        telefono: r.telefono ?? null,
        edad: leerEdad(r.edad),
        token_revision: nuevoToken(),
      })
      .select('id')
      .single();
    if (error || !ficha) {
      await db.from('ficha_enlaces').update({ usado_at: null }).eq('token', b.token); // que pueda reintentar
      return fail(500, 'store_failed');
    }
    await db.from('ficha_respuestas').insert({ ficha_id: ficha.id, tipo: 'inicial', respuestas: r as Json, peso });
    await db.from('ficha_enlaces').update({ ficha_id: ficha.id }).eq('token', b.token);
    await notifyFicha({ nombre: r.nombre ?? '', tipo: 'inicial', fichaId: ficha.id, peso });
    return NextResponse.json({ ok: true, tipo: 'inicial' });
  }

  const { error } = await db.from('ficha_respuestas').insert({ ficha_id: enlace.fichaId, tipo: 'revision', respuestas: r as Json, peso });
  if (error) return fail(500, 'store_failed');
  await db.from('fichas').update({ ultima_actividad: new Date().toISOString() }).eq('id', enlace.fichaId);
  await notifyFicha({ nombre: r.nombre || enlace.nombre, tipo: 'revision', fichaId: enlace.fichaId, peso });
  return NextResponse.json({ ok: true, tipo: 'revision' });
}
