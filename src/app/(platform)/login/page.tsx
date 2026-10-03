import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { Wordmark } from '@/components/brand';

export const metadata: Metadata = { title: 'Iniciar sesión' };

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <Link href="/es" className="mb-8 text-fg/90 transition hover:text-fg">
        <Wordmark />
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}

function FormSkeleton() {
  return <div className="skeleton h-[430px] w-full max-w-sm rounded-2xl" />;
}
