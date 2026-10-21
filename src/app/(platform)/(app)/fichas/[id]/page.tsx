import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { SITE_URL } from '@/i18n/config';
import { FORMULARIOS, preguntasDe, type FichaTipo } from '@/content/fichas';
import { CopiarEnlace } from '@/components/fichas/copiar-enlace';
import { borrarFicha, guardarFicha, renovarEnlaceRevision } from '../actions';

export const metadata: Metadata = { title: 'Ficha' };
export const dynamic = 'force-dynamic';

const fecha = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric' });

export default async function FichaPage({ params, searchParams }: PageProps<'/fichas/[id]'>) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== 'trainer') redirect('/dashboard');
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: f }, { data: respuestas }] = await Promise.all([
    supabase.from('fichas').select('*').eq('id', id).maybeSingle(),
    supabase.from('ficha_respuestas').select('id, tipo, respuestas, peso, created_at').eq('ficha_id', id).order('created_at', { ascending: false }),
  ]);
  if (!f) notFound();

  const inicial = (respuestas ?? []).find((r) => r.tipo === 'inicial');
  const revisiones = (respuestas ?? []).filter((r) => r.tipo === 'revision');
  const pesos = [...(respuestas ?? [])].filter((r) => r.peso !== null).reverse();

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-8">
      <Link href="/fichas" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={14} aria-hidden /> Todas las fichas
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">{f.nombre || 'Sin nombre'}</h1>
          <p className="mt-1 text-sm text-muted">
            {[f.edad ? `${f.edad} años` : null, f.email, f.telefono].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-1 text-xs text-faint">Cliente desde el {fecha(f.created_at)}</p>
        </div>
        {f.telefono && (
          <a href={`https://wa.me/${f.telefono.replace(/[^\d]/g, '').replace(/^(?!34)(\d{9})$/, '34$1')}`} target="_blank" rel="noopener" className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-sm text-fg hover:border-primary">
            Abrir WhatsApp
          </a>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          {/* Evolución del peso */}
          {pesos.length > 0 && (
            <section aria-labelledby="peso-h" className="card p-6">
              <h2 id="peso-h" className="text-lg font-semibold">Peso</h2>
              <ol className="mt-4 flex flex-wrap gap-2 tabular-nums">
                {pesos.map((r, i) => {
                  const dif = i > 0 && pesos[i - 1].peso !== null ? Math.round((Number(r.peso) - Number(pesos[i - 1].peso)) * 10) / 10 : null;
                  return (
                    <li key={r.id} className="rounded-xl border border-border px-3 py-2 text-sm">
                      <span className="block text-xs text-faint">{new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                      <span className="font-semibold text-fg">{r.peso} kg</span>
                      {dif !== null && dif !== 0 && <span className={`ml-1 text-xs ${dif < 0 ? 'text-primary' : 'text-muted'}`}>{dif > 0 ? `+${dif}` : dif}</span>}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {revisiones.map((r) => (
            <Respuestas key={r.id} titulo={`Revisión del ${fecha(r.created_at)}`} tipo="revision" datos={r.respuestas as Record<string, string>} />
          ))}
          {inicial ? (
            <Respuestas titulo={`Formulario inicial (${fecha(inicial.created_at)})`} tipo="inicial" datos={inicial.respuestas as Record<string, string>} abierto={revisiones.length === 0} />
          ) : (
            <p className="card p-5 text-sm text-muted">Esta ficha no tiene formulario inicial.</p>
          )}
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="revision-h" className="card space-y-3 p-5">
            <h2 id="revision-h" className="text-sm font-medium text-fg">Enlace de revisión</h2>
            <p className="text-xs text-muted">Es solo de este cliente y sirve todos los meses. Cada envío se añade aquí.</p>
            {f.token_revision ? (
              <CopiarEnlace url={`${SITE_URL}/ficha/${f.token_revision}`} mensaje="Hola, toca revisión. Cuéntame cómo ha ido aquí:" />
            ) : (
              <p className="text-xs text-faint">Sin enlace todavía.</p>
            )}
            <form action={renovarEnlaceRevision}>
              <input type="hidden" name="id" value={f.id} />
              <button type="submit" className="text-xs text-muted underline underline-offset-4 hover:text-fg">
                {f.token_revision ? 'Crear uno nuevo (el anterior deja de valer)' : 'Crear enlace'}
              </button>
            </form>
          </section>

          <form action={guardarFicha} className="card space-y-4 p-5">
            <input type="hidden" name="id" value={f.id} />
            <label className="block text-sm font-medium text-fg">
              Estado
              <select name="estado" defaultValue={f.estado} className="mt-2 h-10 w-full rounded-full border border-border-strong bg-bg px-4 text-sm text-fg">
                <option value="activa">Activa</option>
                <option value="pausada">Pausada</option>
                <option value="baja">Baja (su enlace de revisión deja de funcionar)</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-fg">
              Tus notas
              <textarea name="notas" defaultValue={f.notas} rows={10} className="mt-2 w-full rounded-2xl border border-border-strong bg-bg px-4 py-3 text-sm text-fg" placeholder="Lo que quieras recordar de este cliente: ajustes, lesiones, conversaciones…" />
            </label>
            <button type="submit" className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
              Guardar
            </button>
          </form>

          <details className="card p-5 text-sm">
            <summary className="cursor-pointer text-muted">Borrar esta ficha</summary>
            <form action={borrarFicha} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={f.id} />
              <p className="text-xs text-muted">Se borran la ficha y todas sus respuestas para siempre (por ejemplo, si el cliente lo pide). Escribe BORRAR para confirmar.</p>
              {sp.error === 'confirmar' && <p className="text-xs text-danger">Escribe BORRAR exactamente.</p>}
              <input name="confirmar" aria-label="Escribe BORRAR para confirmar" className="h-10 w-full rounded-full border border-border-strong bg-bg px-4 text-sm text-fg" />
              <button type="submit" className="h-10 rounded-full border border-danger/60 px-5 text-sm text-danger hover:bg-danger/10">
                Borrar definitivamente
              </button>
            </form>
          </details>
        </aside>
      </div>
    </div>
  );
}

function Respuestas({ titulo, tipo, datos, abierto = true }: { titulo: string; tipo: FichaTipo; datos: Record<string, string>; abierto?: boolean }) {
  const conocidas = new Set(preguntasDe(tipo).map((p) => p.id));
  const sueltas = Object.entries(datos).filter(([k, v]) => !conocidas.has(k) && v);
  return (
    <details open={abierto} className="card group p-6">
      <summary className="cursor-pointer list-none text-lg font-semibold [&::-webkit-details-marker]:hidden">
        {titulo} <span className="text-sm font-normal text-faint group-open:hidden">(ver)</span>
      </summary>
      <div className="mt-5 space-y-6">
        {FORMULARIOS[tipo].secciones.map((s) => {
          const filas = s.preguntas.filter((p) => datos[p.id]);
          if (!filas.length) return null;
          return (
            <section key={s.titulo}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{s.titulo}</h3>
              <dl className="mt-3 space-y-3">
                {filas.map((p) => (
                  <div key={p.id}>
                    <dt className="text-xs text-faint">{p.label}</dt>
                    <dd className="mt-0.5 whitespace-pre-line text-sm text-fg">{datos[p.id]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
        {sueltas.length > 0 && (
          <section>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Otras respuestas</h3>
            <dl className="mt-3 space-y-3">
              {sueltas.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-faint">{k}</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-sm text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </details>
  );
}
