import Link from 'next/link';
import { Wordmark } from '@/components/brand';

// 404 de la web pública. Sin acceso a params aquí: textos bilingües cortos.
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <Wordmark />
      <p className="display text-8xl font-bold text-primary">404</p>
      <h1 className="display text-3xl font-bold">Esta página no existe</h1>
      <p className="max-w-md text-muted">Puede que el enlace esté mal o que la hayamos movido. / This page does not exist.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/es" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
          Ir al inicio
        </Link>
        <Link href="/en" className="rounded-full border border-border-strong px-6 py-3 text-sm text-fg hover:bg-surface-2">
          English
        </Link>
      </div>
    </main>
  );
}
