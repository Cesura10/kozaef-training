import { Hourglass } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { FUNNEL } from '@/content/funnel';
import { NewsletterForm } from '@/components/marketing/newsletter-form';

/** Lista de espera de un producto (o general si no se indica). Guarda el alta como lead + evento 'waitlist'. */
export async function ListaEspera({
  locale,
  productId,
  productName,
  service,
  stacked,
}: {
  locale: Locale;
  productId?: string;
  productName?: string;
  /** Servicio (p. ej. revisión de técnica): texto distinto al de un programa en preparación. */
  service?: boolean;
  /** Columna estrecha: formulario en vertical. */
  stacked?: boolean;
}) {
  const t = await getDictionary(locale);
  const f = FUNNEL[locale];
  return (
    <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3 text-primary">
        <Hourglass size={22} weight="duotone" aria-hidden />
        <span className="text-sm font-medium">{productName ? f.waitlistTitle : f.productEyebrow}</span>
      </div>
      <h2 className="display mt-3 text-2xl font-bold">{productName ?? f.waitlistGeneralTitle}</h2>
      <p className="mt-2 max-w-[60ch] text-muted">{productName ? (service ? f.waitlistServiceBody : f.waitlistBody) : f.waitlistGeneralBody}</p>
      <div className="mt-5">
        <NewsletterForm
          t={t.newsletter}
          locale={locale}
          waitlistProduct={productId ?? 'programas'}
          submitLabel={f.waitlistSubmit}
          successText={f.waitlistSuccess}
          stacked={stacked}
        />
      </div>
    </section>
  );
}
