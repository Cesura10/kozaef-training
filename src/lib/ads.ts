/**
 * Interruptor de anuncios (brief §6). false = apagados; el hueco muestra un producto propio.
 * Para activarlos hará falta: cuenta de AdSense aprobada y banner de consentimiento certificado (TCF).
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
