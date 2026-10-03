/**
 * Datos del titular para los textos legales (LSSI-CE art. 10 y RGPD art. 13).
 * RELLENAR antes de lanzar. Los textos los debe revisar un gestor o abogado.
 */
export const LEGAL_OWNER = {
  name: '[NOMBRE Y APELLIDOS]',
  nif: '[NIF]',
  address: '[DIRECCIÓN POSTAL COMPLETA]',
  email: '[EMAIL DE CONTACTO]',
  brand: 'Kozaef Training',
  updated: '2026-10-03',
} as const;

export const LEGAL_SLUGS = ['aviso-legal', 'privacidad', 'cookies'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];
