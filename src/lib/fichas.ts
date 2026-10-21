import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { TOKEN_RE } from './fichas-validar';

export { leerEdad, leerPeso, validarRespuestas, TOKEN_RE } from './fichas-validar';

/** Token aleatorio para los enlaces privados (32 caracteres, no adivinable). */
export function nuevoToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export type EnlaceResuelto =
  | { tipo: 'inicial'; etiqueta: string }
  | { tipo: 'revision'; fichaId: string; nombre: string }
  | null;

/** ¿A qué formulario lleva este enlace? (inicial sin usar y sin caducar, o revisión de un cliente). */
export async function resolverEnlace(token: string): Promise<EnlaceResuelto> {
  if (!TOKEN_RE.test(token)) return null;
  const db = createAdminClient();
  const { data: enlace } = await db
    .from('ficha_enlaces')
    .select('etiqueta, usado_at, caduca_at')
    .eq('token', token)
    .maybeSingle();
  if (enlace) {
    if (enlace.usado_at || new Date(enlace.caduca_at) < new Date()) return null;
    return { tipo: 'inicial', etiqueta: enlace.etiqueta };
  }
  const { data: ficha } = await db.from('fichas').select('id, nombre, estado').eq('token_revision', token).maybeSingle();
  if (ficha && ficha.estado !== 'baja') return { tipo: 'revision', fichaId: ficha.id, nombre: ficha.nombre };
  return null;
}

