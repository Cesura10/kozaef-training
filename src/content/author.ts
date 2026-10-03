/**
 * Datos del autor (Manu). Fuente única para /sobre-mi, la caja de autor y el
 * dato estructurado Person. NO INVENTAR: lo que esté a null no se muestra en la web.
 */
export const AUTHOR = {
  name: null as string | null,
  /** Titulación exacta, p. ej. el nombre oficial del título de entrenador. */
  qualification: null as string | null,
  city: null as string | null,
  /** Foto (ruta en /public o URL). */
  photo: null as string | null,
  /** Perfiles sociales (para sameAs). */
  social: {
    instagram: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },
};

/** Lista de datos que faltan, para el informe de pendientes. */
export function authorPending(): string[] {
  const missing: string[] = [];
  if (!AUTHOR.name) missing.push('Nombre');
  if (!AUTHOR.qualification) missing.push('Titulación');
  if (!AUTHOR.city) missing.push('Ciudad');
  if (!AUTHOR.photo) missing.push('Foto');
  if (!Object.values(AUTHOR.social).some(Boolean)) missing.push('Redes sociales');
  return missing;
}

export const authorSameAs = () => Object.values(AUTHOR.social).filter((v): v is string => Boolean(v));
