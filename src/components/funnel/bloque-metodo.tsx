import Link from 'next/link';
import { Check, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { sectionPath } from '@/content/routes';
import { whatsappLink } from '@/content/contact';

/**
 * "Saber el método no es lo mismo que aplicarlo". Va en TODOS los artículos, justo después del
 * cuerpo (cuando el lector ya entiende el tema y se pregunta cómo hacerlo él). Lleva a la
 * solicitud de coaching. Sin promesas de resultados ni cifras inventadas.
 */
const COPY = {
  es: {
    eyebrow: 'Lo que no cabe en un artículo',
    title: 'Saber el método no es lo mismo que saber aplicarlo',
    intro:
      'Aquí tienes el punto de partida, y es el mismo para todos. Los resultados llegan cuando ese método se ajusta a ti: a tu cuerpo, a tus horarios, a las máquinas que tiene tu gimnasio (o las que no tiene) y a lo que te pasa cada semana. Eso no sale de una tabla, sale de haberlo ajustado muchas veces con personas reales.',
    listTitle: 'Lo que ajusto contigo',
    list: [
      'Tu rutina con los ejercicios y las máquinas que de verdad tienes, en el gimnasio o en casa.',
      'Cuándo subir peso, cuándo mantener y cuándo cambiar, semana a semana.',
      'Qué hacer cuando te estancas, te molesta algo, viajas o tienes una mala racha.',
      'La comida, adaptada a tus horarios y a lo que te gusta comer.',
    ],
    closing: 'Tú entrenas y me cuentas cómo te ha ido. Del plan y de los ajustes me encargo yo.',
    apply: 'Quiero un plan a mi medida',
    whatsapp: 'Prefiero escribirte por WhatsApp',
    whatsappText: 'Hola Manu, he leído uno de tus artículos y quiero que me ayudes con mi entrenamiento.',
  },
  en: {
    eyebrow: 'What does not fit in an article',
    title: 'Knowing the method is not the same as knowing how to apply it',
    intro:
      'This is the starting point, and it is the same for everyone. Results come when the method is adjusted to you: your body, your schedule, the machines your gym has (or does not have) and whatever happens each week. That does not come from a table, it comes from having adjusted it many times with real people.',
    listTitle: 'What I adjust with you',
    list: [
      'Your routine, with the exercises and machines you actually have, at the gym or at home.',
      'When to add weight, when to hold and when to change, week by week.',
      'What to do when you stall, something hurts, you travel or you have a rough patch.',
      'Your food, adapted to your schedule and to what you like to eat.',
    ],
    closing: 'You train and tell me how it went. I take care of the plan and the adjustments.',
    apply: 'I want a plan made for me',
    whatsapp: 'I would rather message you on WhatsApp',
    whatsappText: 'Hi Manu, I read one of your articles and I would like your help with my training.',
  },
} satisfies Record<Locale, unknown>;

export function BloqueMetodo({ locale, location = 'article' }: { locale: Locale; location?: string }) {
  const c = COPY[locale];
  return (
    <section aria-labelledby="metodo" className="gold-sheen mt-12 rounded-[var(--radius-xl)] border border-primary/30 p-6 sm:p-8">
      <p className="text-xs font-medium text-primary">{c.eyebrow}</p>
      <h2 id="metodo" className="display mt-2 text-2xl font-bold leading-tight sm:text-3xl">
        {c.title}
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{c.intro}</p>
      <h3 className="mt-6 text-sm font-medium text-fg">{c.listTitle}</h3>
      <ul className="mt-3 space-y-3">
        {c.list.map((item) => (
          <li key={item} className="flex items-start gap-3 text-fg/90">
            <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-medium text-fg">{c.closing}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={sectionPath('apply', locale)}
          data-track="cta_click"
          data-cta="apply"
          data-location={location}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          {c.apply}
        </Link>
        <a
          href={whatsappLink(c.whatsappText)}
          target="_blank"
          rel="noopener"
          data-track="cta_click"
          data-cta="whatsapp"
          data-location={location}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm text-fg hover:bg-surface-2"
        >
          <WhatsappLogo size={18} aria-hidden />
          {c.whatsapp}
        </a>
      </div>
    </section>
  );
}
