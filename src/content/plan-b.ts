import type { Locale } from '@/i18n/config';
import type { QuestionKey } from './apply';
import { visibleProducts } from './products';
import { sectionPath } from './routes';

/**
 * Plan B de la solicitud: SOLO para quien responde "Ahora mismo no" a si puede invertir en su
 * entrenamiento. El coaching es la oferta principal; la guía es la salida para quien no encaja ahora.
 * Por objetivo, en orden de preferencia; se usa la primera guía publicada.
 */
const BY_GOAL: Record<string, string[]> = {
  fat_loss: ['pierde-grasa-sin-pasar-hambre', 'tu-primer-mes-en-el-gimnasio', 'fuerza-en-casa-8-semanas'],
  muscle: ['gana-peso-y-musculo', 'fuerza-en-casa-8-semanas'],
  performance: ['fuerza-en-casa-8-semanas', 'gana-peso-y-musculo'],
  health: ['entrena-sin-dolor', 'fuerza-en-casa-8-semanas'],
};
/** Quien empieza de cero: antes que nada, el primer mes. */
const BEGINNER = 'tu-primer-mes-en-el-gimnasio';

export type PlanB = { name: string; href: string; price: number | null; image: string | null };

export function planBFor(answers: Record<QuestionKey, string>, locale: Locale): PlanB | null {
  if (answers.invest !== 'not_now') return null;
  const guides = visibleProducts().filter((p) => p.tipo === 'infoproducto' && p.publicado);
  const prefs = [...(answers.experience === 'none' ? [BEGINNER] : []), ...(BY_GOAL[answers.goal] ?? [])];
  const p = prefs.map((id) => guides.find((g) => g.id === id)).find(Boolean) ?? guides[0];
  if (!p) return null;
  return { name: p.nombre[locale], href: sectionPath('programs', locale, p.slug[locale]), price: p.precio, image: p.imagen ?? null };
}
