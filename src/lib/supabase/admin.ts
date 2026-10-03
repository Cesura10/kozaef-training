import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Cliente con service role: salta RLS. SOLO en route handlers / server actions,
 * y siempre detrás de guardPublicWrite().
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
