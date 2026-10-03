import type { Locale } from '@/i18n/config';
import { DIAGNOSIS, DIAGNOSIS_APPROVED } from '@/content/diagnosis';
import { DiagnosisQuiz } from '@/components/funnel/diagnosis-quiz';
import { PageShell, sectionMetadata } from './page-shell';

export const diagnosisMetadata = (locale: Locale) => {
  const c = DIAGNOSIS[locale];
  return sectionMetadata('diagnosis', locale, { title: c.metaTitle, description: c.metaDescription }, {}, { noindex: !DIAGNOSIS_APPROVED });
};

export async function DiagnosisPage({ locale }: { locale: Locale }) {
  const c = DIAGNOSIS[locale];
  return (
    <PageShell locale={locale}>
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        {!DIAGNOSIS_APPROVED && (
          <p className="mb-6 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
            Borrador pendiente de revisión: esta página no está enlazada ni indexada.
          </p>
        )}
        <h1 className="display animate-rise text-4xl font-bold leading-[1.02] md:text-6xl">{c.h1}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{c.intro}</p>
        <div className="mt-10 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 sm:p-8">
          <DiagnosisQuiz locale={locale} />
        </div>
      </section>
    </PageShell>
  );
}
