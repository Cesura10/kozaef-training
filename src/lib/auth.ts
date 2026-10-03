import 'server-only';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Row } from '@/types/database';

export type Profile = Row<'profiles'>;

/** Devuelve el usuario y su profile, o nulls si no hay sesión. */
export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null as Profile | null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile: (profile as Profile | null) ?? null };
}

/** Igual que getSessionProfile pero redirige a /login si no hay sesión. */
export async function requireProfile() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect('/login');
  return { user, profile };
}
