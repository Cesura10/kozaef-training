import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { AUTHOR } from '@/content/author';
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
