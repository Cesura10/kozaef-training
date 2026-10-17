import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { AUTHOR, bylineReady } from '@/content/author';
import { FUNNEL } from '@/content/funnel';
import { sectionPath } from '@/content/routes';

/** Caja de autor. Si faltan nombre o titulación, NO se muestra (brief: nada inventado ni huecos visibles). */
export function CajaAutor({ locale }: { locale: Locale }) {
  if (!AUTHOR.name || !AUTHOR.qualification) return null;
  const f = FUNNEL[locale];
  return (
    <aside className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border p-5">
      {AUTHOR.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={AUTHOR.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
      )}
      <div>
        <p className="text-xs text-faint">{f.authorLabel}</p>
        <p className="font-semibold text-fg">{AUTHOR.name}</p>
        <p className="text-sm text-muted">{AUTHOR.qualification}</p>
        <Link href={sectionPath('about', locale)} className="mt-1 inline-block text-sm text-primary hover:underline">
          {f.authorMore}
        </Link>
      </div>
    </aside>
  );
}

/**
 * Firma bajo el título del artículo: foto, nombre y enlace a "Sobre mí".
 * Solo aparece con nombre, foto y página "Sobre mí" publicada (nada de huecos a la vista).
 */
export function FirmaAutor({ locale }: { locale: Locale }) {
  if (!bylineReady() || !AUTHOR.name || !AUTHOR.photo) return null;
  return (
    <Link href={sectionPath('about', locale)} className="group mt-5 inline-flex items-center gap-3" rel="author">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={AUTHOR.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-primary/30 object-cover" />
      <span className="text-sm text-muted">
        {locale === 'es' ? 'Por ' : 'By '}
        <span className="font-semibold text-fg group-hover:text-primary">{AUTHOR.name}</span>
        {AUTHOR.qualification && <span className="block text-xs text-faint">{AUTHOR.qualification}</span>}
      </span>
    </Link>
  );
}
