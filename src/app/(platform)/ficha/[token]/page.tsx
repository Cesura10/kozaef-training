import type { Metadata } from 'next';
import { Wordmark } from '@/components/brand';
import { FichaForm } from '@/components/fichas/ficha-form';
import { FORMULARIOS } from '@/content/fichas';
import { CONTACT, whatsappLink } from '@/content/contact';
import { resolverEnlace } from '@/lib/fichas';

// Formulario de ficha que abre el cliente con el enlace privado de Manu. Sin sesión, fuera de Google.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tu ficha', robots: { index: false, follow: false } };

export default async function FichaPage({ params }: PageProps<'/ficha/[token]'>) {
  const { token } = await params;
  const enlace = await resolverEnlace(token);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center px-4 sm:px-6">
          <Wordmark />
        </div>
      </header>
      <main id="contenido" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 md:py-14">
        {!enlace ? (
          <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-8">
            <h1 className="display text-3xl font-bold">Este enlace ya no es válido</h1>
            <p className="mt-3 text-muted">
              Puede que ya lo hayas usado o que haya caducado. Escríbeme y te mando uno nuevo.
            </p>
            <a href={whatsappLink('Hola Manu, mi enlace del formulario no funciona.')} className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
              WhatsApp: {CONTACT.whatsappDisplay}
            </a>
          </section>
        ) : (
          <>
            <h1 className="display text-4xl font-bold leading-[1.05] md:text-5xl">
              {enlace.tipo === 'revision' && enlace.nombre ? `${FORMULARIOS.revision.titulo}: ${enlace.nombre.split(' ')[0]}` : FORMULARIOS[enlace.tipo].titulo}
            </h1>
            <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">{FORMULARIOS[enlace.tipo].intro}</p>
            <div className="mt-10">
              <FichaForm token={token} tipo={enlace.tipo} nombre={enlace.tipo === 'revision' ? enlace.nombre : ''} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
