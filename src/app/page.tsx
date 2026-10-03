import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Barbell,
  Camera,
  ChatsCircle,
  Check,
  Drop,
  Fire,
  Ruler,
} from '@phosphor-icons/react/dist/ssr';
import { Wordmark } from '@/components/brand';
import { ButtonLink } from '@/components/ui/button';
import { ProteinCalculator } from '@/components/marketing/protein-calculator';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { Reveal } from '@/components/marketing/reveal';

// A los usuarios con sesión los redirige src/proxy.ts a /dashboard.
// Vista previa visual: los textos pasarán a archivos de traducción (es/en) en la fase de i18n.

const NAV = [
  { href: '#herramientas', label: 'Herramientas' },
  { href: '#guias', label: 'Guías' },
  { href: '#coaching', label: 'Coaching' },
];

const METHOD = [
  {
    word: 'Mide.',
    body: 'Calorías, proteína y fuerza en números reales. Sin adivinar qué está fallando.',
  },
  {
    word: 'Ajusta.',
    body: 'Cambios pequeños y concretos según tus datos: volumen, descanso y comida.',
  },
  {
    word: 'Progresa.',
    body: 'Sobrecarga progresiva con seguimiento semanal. Si no avanzas, sabemos por qué.',
  },
];

const GUIDES = [
  { tag: 'Estancamiento', title: 'Llevo meses sin ganar músculo: las 5 causas reales' },
  { tag: 'Nutrición', title: 'Cuánta proteína necesitas de verdad (y cuándo tomarla)' },
  { tag: 'Técnica', title: 'Errores en el press banca que frenan tu fuerza' },
  { tag: 'Programación', title: 'Sobrecarga progresiva explicada sin humo' },
];

const COACHING = [
  'Plan de entrenamiento y nutrición ajustado a tu vida',
  'Revisión semanal con fotos, medidas y cargas',
  'Contacto directo conmigo, no con un bot',
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Navegación */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Kozaef Training, inicio">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-fg">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Entrar
            </ButtonLink>
            <ButtonLink href="#coaching" size="sm" className="whitespace-nowrap px-4">
              Solicitar plaza
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: mensaje a la izquierda, herramienta real a la derecha */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pb-24">
          {/* Hero con animación CSS: visible antes de hidratar (LCP) */}
          <div className="animate-rise">
            <h1 className="display text-[2.4rem] font-bold leading-[1.02] sm:text-6xl lg:text-[3.25rem] xl:text-[3.6rem]">
              Entrena con criterio.
              <br />
              <span className="text-primary">Progresa con datos.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
              Herramientas gratis, guías claras y coaching 1:1 para quien lleva meses entrenando sin ver
              cambios.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#herramientas" className="h-12 px-6">
                Ver herramientas
                <ArrowRight size={16} weight="bold" />
              </ButtonLink>
              <ButtonLink href="#coaching" variant="outline" className="h-12 px-6">
                Solicitar plaza
              </ButtonLink>
            </div>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <ProteinCalculator />
          </div>
        </section>

        {/* Herramientas: bento de 3 celdas */}
        <section id="herramientas" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Herramientas gratis</p>
              <h2 className="display mt-4 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                Tus números, en segundos.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
              <Reveal className="md:col-span-2 md:row-span-2">
                <article className="gold-sheen relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-primary/25 p-8 md:p-10">
                  <div className="flex items-center justify-between">
                    <Fire size={28} weight="duotone" className="text-primary" />
                    <span className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">
                      Muy pronto
                    </span>
                  </div>
                  <div>
                    <p className="display text-[5.5rem] font-bold leading-none text-fg/10 sm:text-[8rem]" aria-hidden>
                      kcal
                    </p>
                    <h3 className="display mt-2 text-3xl font-bold md:text-4xl">Calorías y macros</h3>
                    <p className="mt-3 max-w-[44ch] text-muted">
                      Tu gasto diario real y el reparto de proteína, grasa y carbohidrato según tu objetivo.
                    </p>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.08}>
                <a
                  href="#calculadora"
                  className="group flex h-full flex-col justify-between gap-10 rounded-[var(--radius-xl)] border border-border bg-surface p-7 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <Drop size={26} weight="duotone" className="text-primary" />
                    <ArrowUpRight
                      size={20}
                      className="text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Proteína diaria</h3>
                    <p className="mt-2 text-sm text-muted">Gramos al día y por comida según tu peso y objetivo.</p>
                  </div>
                </a>
              </Reveal>

              <Reveal delay={0.16}>
                <article className="flex h-full flex-col justify-between gap-10 rounded-[var(--radius-xl)] border border-border bg-surface-2 p-7">
                  <div className="flex items-center justify-between">
                    <Ruler size={26} weight="duotone" className="text-primary" />
                    <span className="text-xs text-faint">Muy pronto</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Grasa corporal</h3>
                    <p className="mt-2 text-sm text-muted">Estimación por medidas con el método Navy y peso objetivo.</p>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Método: filas tipográficas */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display max-w-[22ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                Sin rutinas mágicas. Con un sistema.
              </h2>
            </Reveal>
            <div className="mt-14 divide-y divide-border">
              {METHOD.map((m, i) => (
                <Reveal key={m.word} delay={i * 0.06}>
                  <div className="group grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-12 md:py-10">
                    <p className="display text-6xl font-bold leading-none text-fg/90 transition-colors duration-300 group-hover:text-primary md:text-8xl">
                      {m.word}
                    </p>
                    <p className="max-w-[42ch] text-lg leading-relaxed text-muted">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Guías: carrusel horizontal con scroll-snap */}
        <section id="guias" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display max-w-[20ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                Guías para dejar de estancarte.
              </h2>
            </Reveal>
          </div>
          <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 xl:px-[calc((100vw_-_80rem)/2_+_1.5rem)] xl:scroll-px-[calc((100vw_-_80rem)/2_+_1.5rem)]">
            {GUIDES.map((g, i) => (
              <article
                key={g.title}
                className={`flex aspect-[4/5] w-[78vw] max-w-[20rem] shrink-0 snap-start flex-col justify-between rounded-[var(--radius-xl)] border p-7 sm:w-[20rem] ${
                  i % 2 === 0 ? 'gold-sheen border-primary/20' : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{g.tag}</span>
                  <span className="text-xs text-faint">Muy pronto</span>
                </div>
                <h3 className="display text-2xl font-bold leading-[1.1]">{g.title}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* Coaching: zona de venta, sin anuncios */}
        <section id="coaching" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal>
              {/* TODO: foto real de Manu entrenando, 1200x1500 (o generada con Higgsfield) */}
              <div className="gold-sheen relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 text-center">
                <Camera size={32} weight="duotone" className="text-primary/70" />
                <p className="max-w-[24ch] text-sm text-faint">Aquí va tu foto entrenando</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Coaching 1:1</p>
              <h2 className="display mt-4 max-w-[16ch] text-4xl font-bold leading-[1.02] md:text-6xl">
                Plazas limitadas. Trabajo de verdad.
              </h2>
              <ul className="mt-8 space-y-4">
                {COACHING.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-lg text-fg/90">
                    <Check size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href="#coaching" className="h-12 px-7">
                  Solicitar plaza
                  <ArrowRight size={16} weight="bold" />
                </ButtonLink>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <ChatsCircle size={18} className="text-faint" />
                  Solicitud de 2 minutos para ver si encajamos
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Lista de correo */}
        <section id="lista" className="scroll-mt-20 border-t border-border/60 py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <Barbell size={30} weight="duotone" className="text-primary" />
              <h2 className="display mt-6 max-w-[18ch] text-4xl font-bold leading-[1.02] md:text-5xl">
                Un correo a la semana. Solo lo que funciona.
              </h2>
              <p className="mt-5 max-w-[48ch] text-lg text-muted">
                Técnica, nutrición y los errores que veo cada semana en mis clientes.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:justify-self-end">
              <NewsletterForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Wordmark />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Pie de página">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-fg">
                {n.label}
              </a>
            ))}
          </nav>
          <p className="text-sm text-faint">© {new Date().getFullYear()} Kozaef Training</p>
        </div>
      </footer>
    </div>
  );
}
