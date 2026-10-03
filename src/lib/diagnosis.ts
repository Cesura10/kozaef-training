/**
 * Diagnóstico gratis: asigna un perfil y una categoría a partir de las respuestas.
 * Función pura (corre en el navegador). Las reglas son un BORRADOR para que Manu las revise.
 */
import type { CategoryId, ProfileId } from '@/content/taxonomy';
import type { ToolId } from '@/content/tools';

export type DiagnosisAnswers = {
  goal: 'fat' | 'muscle' | 'strength' | 'health';
  sex: 'female' | 'male';
  age: 'under30' | '30to44' | '45plus';
  where: 'gym' | 'home' | 'none';
  experience: 'starting' | 'under1' | 'over1';
  weight: 'lot' | 'few' | 'hard_gain' | 'fine';
  obstacle: 'routine' | 'no_results' | 'time' | 'pain' | 'food';
};

export type DiagnosisResult = { profile: ProfileId; category: CategoryId; tool: ToolId };

export function diagnose(a: DiagnosisAnswers): DiagnosisResult {
  // Perfil: de lo más específico a lo más general.
  const profile: ProfileId =
    a.sex === 'female' && a.age === '45plus'
      ? 'mujeres-45'
      : a.weight === 'lot'
        ? 'sobrepeso'
        : a.weight === 'hard_gain'
          ? 'cuesta-ganar-peso'
          : a.where === 'home'
            ? 'entreno-casa'
            : 'principiantes';

  // Categoría: el obstáculo manda si es dolor o comida; si no, el objetivo.
  const category: CategoryId =
    a.obstacle === 'pain'
      ? 'recuperacion'
      : a.obstacle === 'food'
        ? 'nutricion'
        : a.goal === 'fat'
          ? 'perder-grasa'
          : a.goal === 'muscle'
            ? 'ganar-musculo'
            : a.goal === 'strength'
              ? 'fuerza-tecnica'
              : 'nutricion';

  const tool: ToolId = profile === 'sobrepeso' ? 'bodyfat' : category === 'ganar-musculo' ? 'protein' : 'calories';
  return { profile, category, tool };
}
