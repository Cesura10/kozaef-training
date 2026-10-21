'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { nuevoToken } from '@/lib/fichas';

// Acciones del panel de fichas. La RLS garantiza que solo el entrenador puede ejecutarlas.
const ESTADOS = ['activa', 'pausada', 'baja'] as const;

export async function crearEnlaceInicial(form: FormData) {
  const etiqueta = String(form.get('etiqueta') ?? '').trim().slice(0, 120);
  const token = nuevoToken();
  const supabase = await createClient();
  const { error } = await supabase.from('ficha_enlaces').insert({ token, etiqueta });
  revalidatePath('/fichas');
  redirect(error ? '/fichas?error=enlace' : `/fichas?nuevo=${token}`);
}

export async function borrarEnlace(form: FormData) {
  const token = String(form.get('token') ?? '');
  const supabase = await createClient();
  await supabase.from('ficha_enlaces').delete().eq('token', token).is('usado_at', null);
  revalidatePath('/fichas');
}

export async function guardarFicha(form: FormData) {
  const id = String(form.get('id') ?? '');
  const estado = String(form.get('estado') ?? '') as (typeof ESTADOS)[number];
  const notas = String(form.get('notas') ?? '').slice(0, 20000);
  if (!id || !ESTADOS.includes(estado)) return;
  const supabase = await createClient();
  await supabase.from('fichas').update({ estado, notas }).eq('id', id);
  revalidatePath(`/fichas/${id}`);
  revalidatePath('/fichas');
}

/** Nuevo enlace de revisión (si el anterior se ha compartido por error, deja de valer). */
export async function renovarEnlaceRevision(form: FormData) {
  const id = String(form.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('fichas').update({ token_revision: nuevoToken() }).eq('id', id);
  revalidatePath(`/fichas/${id}`);
}

/** Borrado definitivo (derecho de supresión, RGPD): pide escribir BORRAR. */
export async function borrarFicha(form: FormData) {
  const id = String(form.get('id') ?? '');
  if (!id || String(form.get('confirmar') ?? '').trim().toUpperCase() !== 'BORRAR') redirect(`/fichas/${id}?error=confirmar`);
  const supabase = await createClient();
  await supabase.from('fichas').delete().eq('id', id);
  revalidatePath('/fichas');
  redirect('/fichas');
}
