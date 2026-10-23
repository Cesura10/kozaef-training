import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Barbell, Calculator, ChatsCircle, InstagramLogo, Lightning } from '@phosphor-icons/react/dist/ssr';
import { LogoMark } from '@/components/brand';
import { FondoFoto } from '@/components/site/foto';
import { articlesFor } from '@/content/articles';
import { AUTHOR } from '@/content/author';
import { sectionPath } from '@/content/routes';
import { toolPath } from '@/content/tools';

/**
 * Página de enlaces para la bio de TikTok/Instagram (/es/enlaces): botones grandes, pensada para
 * móvil. No se indexa (es una página puente) y no sale en el sitemap.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }];
}
export const metadata: Metadata = {
  title: 'Enlaces',
  description: 'Calculadoras gratis, guías de entrenamiento, artículos y coaching 1:1 de Kozaef Training.',
  robots: { index: false, follow: true },
};

const btn =
  'group flex items-center gap-4 rounded-2xl border border-border-strong bg-surface/80 px-5 py-4 text-left transition hover:border-primary active:scale-[0.98]';

export default async function Page({ params }: PageProps<'/[locale]/enlaces'>) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  const articles = articlesFor('es')
    .filter((a) => a.imagen)
    .slice(0, 4);
  const items = [
    { href: toolPath('calories', 'es'), icon: Calculator, title: 'Calculadora de calorías gratis', sub: 'Tus calorías y macros en 30 segundos', cta: 'tool' as const },
    { href: toolPath('protein', 'es'), icon: Lightning, title: 'Calculadora de proteína', sub: 'Cuánta necesitas al día según tu objetivo', cta: 'tool' as const },
    { href: sectionPath('programs', 'es'), icon: Barbell, title: 'Guías de entrenamiento', sub: 'Elige 3 y paga un 25 % menos', cta: 'product' as const },
    { href: sectionPath('coaching', 'es'), icon: ChatsCircle, title: 'Coaching 1:1 online', sub: 'Plan hecho para ti y revisión semanal', cta: 'coaching' as const },
  ];
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 pb-16 pt-12">
      <div className="flex flex-col items-center text-center">
        <LogoMark className="h-14 w-14" />
        <h1 className="display mt-5 text-3xl font-bold">Kozaef Training</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Entrenador personal online · Fuerza, pérdida de grasa y menopausia, con evidencia</p>
      </div>

      <ul className="mt-9 space-y-3">
        {items.map(({ href, icon: Icon, title, sub, cta }) => (
          <li key={href}>
            <Link href={href} className={btn} data-track="cta_click" data-cta={cta} data-location="enlaces">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <Icon size={22} weight="duotone" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-fg">{title}</span>
                <span className="block text-xs text-muted">{sub}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {articles.length > 0 && (
        <>
          <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-primary">Artículos</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {articles.map((a) => (
              <li key={a.url}>
                <Link
                  href={a.url}
                  data-track="cta_click"
                  data-cta="product"
                  data-location="enlaces-articulo"
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-primary/20 bg-surface p-3"
                >
                  <FondoFoto name={a.imagen!.nombre} sizes="200px" fuerte />
                  <span className="relative text-sm font-semibold leading-snug text-fg">{a.titulo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {AUTHOR.social.instagram && (
        <a
          href={AUTHOR.social.instagram}
          target="_blank"
          rel="noopener"
          data-track="cta_click"
          data-cta="instagram"
          data-location="enlaces"
          className="mx-auto mt-10 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <InstagramLogo size={18} aria-hidden /> @manurodrigues.fit
        </a>
      )}
      <Link href="/es" className="mx-auto mt-4 text-xs text-faint hover:text-fg">
        kozaeftraining.com
      </Link>
    </main>
  );
}
