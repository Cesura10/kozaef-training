import type { Metadata } from 'next';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { ButtonLink } from '@/components/ui/button';
import { Wordmark } from '@/components/brand';

export const metadata: Metadata = { title: 'Configuración' };

export default function SetupPage() {
  const configured = getSupabaseEnv().configured;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <Wordmark className="mb-8" />
      {configured ? (
        <div className="card p-6">
          <h1 className="text-lg font-semibold text-primary">Supabase configurado ✓</h1>
          <p className="mt-2 text-sm text-muted">
            Ya puedes registrarte. El primer usuario que cree cuenta será el
            entrenador (Manu).
          </p>
          <ButtonLink href="/signup" className="mt-5">
            Crear cuenta
          </ButtonLink>
        </div>
      ) : (
        <div className="card p-6">
          <h1 className="text-lg font-semibold">Falta conectar Supabase</h1>
          <p className="mt-2 text-sm text-muted">
            Crea el proyecto en{' '}
            <a
              className="text-primary hover:underline"
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
            >
              supabase.com/dashboard
            </a>{' '}
            y copia sus claves:
          </p>
          <ol className="mt-4 space-y-2 text-sm text-muted">
            <li>
              1. Duplica <code className="text-fg">.env.local.example</code> como{' '}
              <code className="text-fg">.env.local</code>.
            </li>
            <li>
              2. Rellena <code className="text-fg">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
              <code className="text-fg">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (Project
              Settings → API).
            </li>
            <li>
              3. Aplica las migraciones:{' '}
              <code className="text-fg">npx supabase link</code> y{' '}
              <code className="text-fg">npx supabase db push</code>.
            </li>
            <li>4. Reinicia el servidor de desarrollo.</li>
          </ol>
          <p className="mt-4 text-xs text-faint">
            Los pasos completos están en <code>README.md</code>.
          </p>
        </div>
      )}
    </main>
  );
}
