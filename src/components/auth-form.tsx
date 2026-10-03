'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

type Mode = 'login' | 'signup';

const COPY: Record<Mode, { title: string; cta: string; alt: string; altHref: string; altLabel: string }> = {
  login: {
    title: 'Inicia sesión',
    cta: 'Entrar',
    alt: '¿Aún no tienes cuenta?',
    altHref: '/signup',
    altLabel: 'Crear cuenta',
  },
  signup: {
    title: 'Crea tu cuenta',
    cta: 'Crear cuenta',
    alt: '¿Ya tienes cuenta?',
    altHref: '/login',
    altLabel: 'Inicia sesión',
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const nextParam = params.get('next');
  const next = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard';
  const initialError = params.get('error')
    ? 'No se pudo completar la autenticación. Inténtalo de nuevo.'
    : null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(initialError);
  const [notice, setNotice] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const copy = COPY[mode];

  async function signInWithGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
      // Si no hay error, el navegador ya está redirigiendo a Google.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al conectar con Google.');
      setGoogleLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    startTransition(async () => {
      const supabase = createClient();

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(traducirError(error.message));
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() || null },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(traducirError(error.message));
        return;
      }
      if (data.session) {
        router.replace(next);
        router.refresh();
      } else {
        setNotice(
          'Te hemos enviado un correo para confirmar la cuenta. Ábrelo para continuar.',
        );
      }
    });
  }

  const busy = pending || googleLoading;

  return (
    <div className="animate-[rise_0.5s_cubic-bezier(0.22,1,0.36,1)_both] w-full max-w-sm">
      <div className="card p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Rutinas, dietas, revisiones y chat con tu entrenador.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={busy}
          className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border-strong bg-surface-2 text-sm font-medium text-fg transition hover:border-faint hover:bg-elevated disabled:opacity-50 active:scale-[0.98]"
        >
          <GoogleGlyph />
          {googleLoading ? 'Conectando…' : 'Continuar con Google'}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-faint">
          <span className="h-px flex-1 bg-border" />o con tu email
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <Field
              label="Nombre"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={setFullName}
              placeholder="Tu nombre"
            />
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={setEmail}
            placeholder="tu@email.com"
          />
          <Field
            label="Contraseña"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            value={password}
            onChange={setPassword}
            placeholder="Mínimo 8 caracteres"
          />

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}
          {notice && (
            <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{notice}</p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {pending ? 'Un momento…' : copy.cta}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {copy.alt}{' '}
          <Link
            href={copy.altHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {copy.altLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-surface-2 px-3.5 text-sm text-fg placeholder:text-faint transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
    </label>
  );
}

function traducirError(message: string) {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (m.includes('user already registered')) return 'Ese email ya tiene una cuenta.';
  if (m.includes('email not confirmed')) return 'Confirma tu email antes de entrar.';
  if (m.includes('password')) return 'La contraseña no cumple los requisitos (mínimo 8 caracteres).';
  return message;
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
