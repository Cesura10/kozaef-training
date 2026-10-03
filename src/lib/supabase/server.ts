import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { requireSupabaseEnv } from './env';

/**
 * Cliente Supabase para Server Components, Route Handlers y Server Actions.
 * Lee/escribe la sesión en cookies. En Server Components el `setAll` puede
 * fallar (contexto de solo lectura); el middleware refresca la sesión, así
 * que ahí lo ignoramos.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Invocado desde un Server Component: sin acción, refresca el middleware.
        }
      },
    },
  });
}
