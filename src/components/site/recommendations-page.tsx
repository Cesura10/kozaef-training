import type { Locale } from '@/i18n/config';
import { AFFILIATE, AFFILIATE_COPY, AFFILIATE_PRODUCTS } from '@/content/affiliates';
import { RecomendacionAfiliado } from '@/components/funnel/recomendacion-afiliado';
import { CtaCoaching } from '@/components/funnel/cta-coaching';
import { Reveal } from '@/components/marketing/reveal';
import { PageShell, sectionMetadata } from './page-shell';
import { PageHero } from './page-hero';

const COPY = {
  es: {
    metaTitle: 'Suplementos que recomiendo: creatina y proteína',
    metaDescription: 'Los únicos suplementos que recomiendo, con la evidencia detrás: creatina monohidrato y proteína de suero. Cómo tomarlos y dónde comprarlos.',
    label: 'Recomendaciones',
    title: ['Lo que', { text: 'recomiendo', accent: true }],
    intro: 'Solo dos suplementos. Son los que tienen evidencia sólida detrás y los que de verdad marcan la diferencia si ya entrenas y comes bien. El resto, casi siempre, es gasto.',
    criteriaTitle: 'Cómo elijo lo que recomiendo',
    criteria: [
      { h: 'Evidencia antes que moda', p: 'Solo recomiendo suplementos con estudios sólidos detrás. Si no hay evidencia, no aparece aquí, por mucho que se venda.' },
      { h: 'La forma más simple', p: 'Creatina monohidrato y proteína de suero, sin mezclas ni "fórmulas avanzadas" que cuestan más y no funcionan mejor.' },
      { h: 'Primero lo básico', p: 'Ningún suplemento compensa un mal entrenamiento, poca comida o poco descanso. Son un extra cuando lo demás ya está en orden.' },
    ],
  },
  en: {
    metaTitle: 'Supplements I recommend: creatine and protein',
    metaDescription: 'The only supplements I recommend, with the evidence behind them: creatine monohydrate and whey protein. How to take them and where to buy.',
    label: 'Recommendations',
    title: ['What I', { text: 'recommend', accent: true }],
    intro: 'Just two supplements. They are the ones with solid evidence and the ones that make a real difference if you already train and eat well. Most of the rest is wasted money.',
    criteriaTitle: 'How I choose what I recommend',
    criteria: [
      { h: 'Evidence over hype', p: 'I only recommend supplements backed by solid research. No evidence, no recommendation, however well it sells.' },
      { h: 'The simplest form', p: 'Creatine monohydrate and whey protein, no blends or "advanced formulas" that cost more and work no better.' },
      { h: 'Basics first', p: 'No supplement makes up for poor training, too little food or poor sleep. They are an extra once the rest is in place.' },
    ],
  },
} as const;

export const recommendationsMetadata = (locale: Locale) => {
  const c = COPY[locale];
  return sectionMetadata('recommendations', locale, { title: c.metaTitle, description: c.metaDescription });
};

export async function RecommendationsPage({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const a = AFFILIATE_COPY[locale];
  return (
    <PageShell locale={locale}>
      <PageHero index="05" label={c.label} title={[...c.title]} intro={c.intro} />

      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {AFFILIATE_PRODUCTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <RecomendacionAfiliado locale={locale} id={p.id} location="recommendations-page" />
          </Reveal>
        ))}
      </section>

      <section className="border-t border-border/60 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display max-w-[18ch] text-3xl font-bold leading-[1.05] md:text-5xl">{c.criteriaTitle}</h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {c.criteria.map((item, i) => (
              <li key={item.h}>
                <Reveal delay={i * 0.1}>
                  <span className="display outline-num text-5xl font-bold leading-none" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-fg">{item.h}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.p}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="mt-14 max-w-[70ch] text-sm leading-relaxed text-faint">{AFFILIATE.code ? a.disclosure : a.disclosureNoCode}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <CtaCoaching locale={locale} location="recommendations" />
      </section>
    </PageShell>
  );
}
