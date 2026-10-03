import Link from 'next/link';
import { Calculator } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { FUNNEL } from '@/content/funnel';
import { TOOL_CONTENT, toolPath, type ToolId } from '@/content/tools';

/** Aviso suave hacia una herramienta gratis (a mitad de artículo o en páginas de tema). */
export function CtaHerramienta({ locale, tool, location = 'article' }: { locale: Locale; tool: ToolId; location?: string }) {
  const f = FUNNEL[locale];
  const c = TOOL_CONTENT[locale][tool];
  return (
    <aside className="not-prose my-10 flex flex-col gap-4 rounded-[var(--radius-xl)] border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <Calculator size={28} weight="duotone" className="mt-0.5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-xs font-medium text-primary">{f.toolEyebrow}</p>
          <p className="mt-1 font-semibold text-fg">{c.h1}</p>
          <p className="mt-1 text-sm text-muted">{c.intro}</p>
        </div>
      </div>
      <Link
        href={toolPath(tool, locale)}
        data-track="cta_click"
        data-cta="tool"
        data-location={location}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
      >
        {f.toolCta}
      </Link>
    </aside>
  );
}
