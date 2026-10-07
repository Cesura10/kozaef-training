import type { Locale } from '@/i18n/config';

/**
 * Contacto directo de Manu (público: se muestra en la web).
 * WhatsApp en formato internacional sin "+" ni espacios (lo usa wa.me).
 */
export const CONTACT = {
  whatsapp: '34652144402',
  /** Como se muestra en pantalla. */
  whatsappDisplay: '652 14 44 02',
};

/** Enlace de WhatsApp con un mensaje ya escrito (el usuario lo puede cambiar antes de enviar). */
export const whatsappLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const WHATSAPP_COPY: Record<Locale, { cta: string; footer: string; note: string }> = {
  es: {
    cta: 'Pedirla por WhatsApp',
    footer: 'WhatsApp',
    note: 'Te contesto por WhatsApp, te explico cómo pagar y me envías ahí los vídeos.',
  },
  en: {
    cta: 'Request it on WhatsApp',
    footer: 'WhatsApp',
    note: 'I reply on WhatsApp, explain how to pay and you send me the videos there.',
  },
};
