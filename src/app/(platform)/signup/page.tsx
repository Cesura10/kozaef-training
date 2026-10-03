import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { Wordmark } from '@/components/brand';
import { redirect } from 'next/navigation';
import { PLATFORM_OPEN } from '@/lib/platform';

export const metadata: Metadata = { title: 'Crear cuenta' };

export default function SignupPage() {
  if (!PLATFORM_OPEN) redirect('/login');
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <Link href="/es" className="mb-8 text-fg/90 transition hover:text-fg">
        <Wordmark />
      </Link>
      <Suspense fallback={<div className="skeleton h-[430px] w-full max-w-sm rounded-2xl" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
