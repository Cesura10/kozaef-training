'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Status = Database['public']['Enums']['application_status'];
const STATUSES: Status[] = ['new', 'qualified', 'rejected', 'booked', 'won', 'lost', 'waitlist'];

/** Cambia el estado de una solicitud. La RLS garantiza que solo el entrenador puede. */
export async function setApplicationStatus(form: FormData) {
  const id = String(form.get('id') ?? '');
  const status = String(form.get('status') ?? '') as Status;
  if (!id || !STATUSES.includes(status)) return;
  const supabase = await createClient();
  await supabase.from('applications').update({ status }).eq('id', id);
  revalidatePath('/solicitudes');
  revalidatePath('/analitica');
}
