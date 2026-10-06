/**
 * Datos del titular para los textos legales (LSSI-CE art. 10 y RGPD art. 13).
 * Decisión de Manu (2026-10-06): no publicar nombre, NIF ni dirección; el titular aparece como la
 * marca con un email de contacto. Si se rellenan (o se crea una sociedad), los textos los muestran.
 * Los textos los debe revisar un gestor o abogado.
 */
export const LEGAL_OWNER: {
  name: string | null;
  nif: string | null;
  address: string | null;
  email: string;
  brand: string;
  updated: string;
} = {
  name: null,
  nif: null,
  address: null,
  // Buzón del dominio reenviado al correo de Manu (Cloudflare Email Routing, gratis).
  email: 'contacto@kozaeftraining.com',
  brand: 'Kozaef Training',
  updated: '2026-10-06',
};

export const LEGAL_SLUGS = ['aviso-legal', 'privacidad', 'cookies'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];
