import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MagnifyingGlass, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { SITE_URL } from '@/i18n/config';
import { CopiarEnlace } from '@/components/fichas/copiar-enlace';
import { borrarEnlace, crearEnlaceInicial } from './actions';

export const metadata: Metadata = { title: 'Fichas' };
export const dynamic = 'force-dynamic';

const ESTADO_LABEL: Record<string, string> = { activa: 'Activa', pausada: 'Pausada', baja: 'Baja' };
const FILTROS = ['activa', 'pausada', 'baja', 'todas'] as const;
const fecha = (d: string) => new Date(d).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short', year: 'numeric' });
// Para el filtro de búsqueda en PostgREST: sin comas ni paréntesis, que romperían el "or".
const limpiar = (s: string) => s.replace(/[,()*%\\]/g, ' ').trim().slice(0, 80);

export default async function FichasPage({ searchParams }: PageProps<'/fichas'>) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== 'trainer') redirect('/dashboard');

  const sp = await searchParams;
  const q = limpiar(typeof sp.q === 'string' ? sp.q : '');
  const filtro = FILTROS.find((f) => f === sp.estado) ?? 'activa';
  const nuevo = typeof sp.nuevo === 'string' ? sp.nuevo : null;

  const supabase = await createClient();
  let consulta = supabase
    .from('fichas')
    .select('id, nombre, email, telefono, edad, estado, ultima_actividad, created_at, ficha_respuestas(tipo, peso, created_at)')
    .order('ultima_actividad', { ascending: false })
    .limit(200);
  if (filtro !== 'todas') consulta = consulta.eq('estado', filtro);
  if (q) consulta = consulta.or(`nombre.ilike.%${q}%,email.ilike.%${q}%,telefono.ilike.%${q}%`);
  const [{ data: fichas, error }, { data: enlaces }] = await Promise.all([
    consulta,
    supabase.from('ficha_enlaces').select('token, etiqueta, caduca_at, created_at').is('usado_at', null).gt('caduca_at', new Date().toISOString()).order('created_at', { ascending: false }),
  ]);

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">Fichas</h1>
          <p className="mt-1 text-sm text-muted">Tus clientes, con su formulario inicial y todas sus revisiones. Busca por nombre, email o teléfono.</p>
        </div>
        <form action={crearEnlaceInicial} className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="etiqueta">
            Para quién es el enlace
          </label>
          <input
            id="etiqueta"
            name="etiqueta"
            placeholder="Para quién (opcional)"
            className="h-10 w-48 rounded-full border border-border-strong bg-bg px-4 text-sm text-fg placeholder:text-faint"
          />
          <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
            <Plus size={16} weight="bold" aria-hidden /> Enlace para cliente nuevo
          </button>
        </form>
      </header>

      {nuevo && (
        <section className="card space-y-3 border border-primary/40 p-5">
          <p className="font-medium text-fg">Enlace creado. Mándaselo a tu cliente: sirve una sola vez y caduca en 30 días.</p>
          <CopiarEnlace url={`${SITE_URL}/ficha/${nuevo}`} mensaje="Hola, rellena este formulario para preparar tu plan:" />
        </section>
      )}

      {(enlaces ?? []).length > 0 && (
        <section aria-labelledby="pendientes-h" className="card p-5">
          <h2 id="pendientes-h" className="text-sm font-medium text-fg">
            Enlaces enviados sin rellenar ({enlaces!.length})
          </h2>
          <ul className="mt-3 divide-y divide-border">
            {enlaces!.map((e) => (
              <li key={e.token} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-fg">{e.etiqueta || 'Sin nombre'}</p>
                  <p className="text-xs text-faint">
                    Creado el {fecha(e.created_at)} · caduca el {fecha(e.caduca_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CopiarEnlace url={`${SITE_URL}/ficha/${e.token}`} mensaje="Hola, rellena este formulario para preparar tu plan:" />
                  <form action={borrarEnlace}>
                    <input type="hidden" name="token" value={e.token} />
                    <button type="submit" aria-label="Anular el enlace" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-muted hover:text-danger">
                      <Trash size={14} aria-hidden />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="relative w-full max-w-sm" role="search">
          <MagnifyingGlass size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
          <label className="sr-only" htmlFor="q">
            Buscar cliente
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Buscar cliente…" className="h-11 w-full rounded-full border border-border-strong bg-bg pl-10 pr-4 text-sm text-fg placeholder:text-faint" />
          {filtro !== 'activa' && <input type="hidden" name="estado" value={filtro} />}
        </form>
        <nav aria-label="Filtrar" className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {FILTROS.map((f) => (
            <Link
              key={f}
              href={`/fichas?estado=${f}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              aria-current={f === filtro ? 'page' : undefined}
              className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:text-fg aria-[current=page]:bg-primary aria-[current=page]:text-primary-fg"
            >
              {f === 'todas' ? 'Todas' : ESTADO_LABEL[f]}
            </Link>
          ))}
        </nav>
      </div>

      {error && <p className="card p-5 text-sm text-danger">No se pudieron cargar las fichas ({error.message}).</p>}
      {!error && (fichas ?? []).length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-faint">
          {q ? `Ninguna ficha coincide con «${q}».` : 'Aún no hay fichas aquí. Crea un enlace y mándaselo a tu primer cliente.'}
        </p>
      )}

      <ul className="grid gap-3 md:grid-cols-2">
        {(fichas ?? []).map((f) => {
          const resp = [...(f.ficha_respuestas ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at));
          const revisiones = resp.filter((r) => r.tipo === 'revision').length;
          const pesoActual = resp.find((r) => r.peso !== null)?.peso ?? null;
          return (
            <li key={f.id}>
              <Link href={`/fichas/${f.id}`} className="card block p-5 transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-fg">{f.nombre || 'Sin nombre'}</p>
                    <p className="truncate text-sm text-muted">{[f.email, f.telefono].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{ESTADO_LABEL[f.estado]}</span>
                </div>
                <p className="mt-3 text-xs text-faint">
                  {[f.edad ? `${f.edad} años` : null, pesoActual ? `${pesoActual} kg` : null, `${revisiones} ${revisiones === 1 ? 'revisión' : 'revisiones'}`, `última actividad ${fecha(f.ultima_actividad)}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
