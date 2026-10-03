import type { Locale } from '@/i18n/config';
import { LEGAL_OWNER as O, type LegalSlug } from '@/lib/legal';

/**
 * Textos legales. Plantilla razonable para una web de contenido con captación de
 * emails, analítica sin cookies y solicitudes de coaching. NO es asesoramiento
 * jurídico: revisar con un profesional antes de lanzar y al añadir servicios
 * (anuncios, pagos, app de clientes con datos de salud).
 */
export type LegalDoc = { title: string; intro: string; sections: Array<{ h: string; p: string[] }> };

const owner = `${O.name}, con NIF ${O.nif} y domicilio en ${O.address}`;

const es: Record<LegalSlug, LegalDoc> = {
  'aviso-legal': {
    title: 'Aviso legal',
    intro: `En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE), se informa de los datos del titular de esta web.`,
    sections: [
      {
        h: 'Titular',
        p: [`${O.brand} es una marca de ${owner}. Contacto: ${O.email}.`],
      },
      {
        h: 'Objeto',
        p: [
          'Esta web ofrece contenido gratuito sobre entrenamiento y nutrición, herramientas de cálculo orientativas y la posibilidad de solicitar servicios de entrenamiento personal online.',
        ],
      },
      {
        h: 'Información orientativa',
        p: [
          'Los contenidos y los resultados de las calculadoras son informativos y generales. No sustituyen el consejo de un profesional sanitario. Consulta con tu médico antes de empezar un programa de ejercicio o un cambio de dieta, sobre todo si tienes alguna patología.',
        ],
      },
      {
        h: 'Propiedad intelectual',
        p: [
          `Los textos, diseños, logotipos, vídeos y el código de esta web pertenecen a ${O.name} o se usan con licencia. No se permite su reproducción sin autorización expresa.`,
        ],
      },
      {
        h: 'Responsabilidad',
        p: [
          'El titular no se responsabiliza del mal uso de los contenidos ni de los daños derivados de decisiones tomadas solo a partir de ellos. Los enlaces a webs de terceros se ofrecen como referencia, sin control sobre su contenido.',
        ],
      },
      {
        h: 'Legislación aplicable',
        p: ['Esta web se rige por la legislación española.'],
      },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    intro: 'Cómo se tratan tus datos personales en esta web, según el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).',
    sections: [
      { h: 'Responsable del tratamiento', p: [`${owner}. Email: ${O.email}.`] },
      {
        h: 'Qué datos se recogen y para qué',
        p: [
          'Email (y el resultado numérico de la calculadora que hayas usado, si es el caso), cuando te suscribes: para enviarte consejos de entrenamiento y nutrición y ofertas de mis servicios. Base legal: tu consentimiento.',
          'Datos de la solicitud de coaching (nombre, email, objetivos y las respuestas del formulario): para valorar si puedo ayudarte y contactar contigo. Base legal: aplicación de medidas precontractuales a petición tuya.',
          'Canal por el que llegaste (por ejemplo, TikTok o Google) y uso de la web de forma agregada: para saber qué contenido funciona. Base legal: interés legítimo en mejorar la web. La analítica se hace sin cookies de seguimiento.',
        ],
      },
      {
        h: 'Cuánto tiempo se guardan',
        p: [
          'Los datos de la lista de correo, hasta que te des de baja. Las solicitudes de coaching que no acaben en contratación, un máximo de 12 meses. Después se borran o se anonimizan.',
        ],
      },
      {
        h: 'Quién trata los datos por encargo',
        p: [
          'Proveedores que prestan servicios técnicos con contrato de encargado del tratamiento: Supabase (base de datos, alojada en la Unión Europea), Cloudflare (alojamiento web y protección anti-bots), PostHog (analítica, servidores en la UE) y el proveedor de envío de emails. Algunos pueden tratar datos fuera del Espacio Económico Europeo con las garantías del RGPD (cláusulas contractuales tipo o marco de privacidad UE-EE. UU.).',
          'No se venden ni se ceden tus datos a terceros.',
        ],
      },
      {
        h: 'Tus derechos',
        p: [
          `Puedes acceder, rectificar, suprimir, oponerte, limitar el tratamiento y pedir la portabilidad de tus datos escribiendo a ${O.email}. Puedes retirar tu consentimiento en cualquier momento, por ejemplo con el enlace de baja de cada email.`,
          'Si crees que no se han respetado tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).',
        ],
      },
      {
        h: 'Menores',
        p: ['Esta web no está dirigida a menores de 14 años. Si tienes menos de 14 años, no envíes tus datos.'],
      },
    ],
  },
  cookies: {
    title: 'Política de cookies',
    intro: 'Qué se guarda en tu navegador al usar esta web.',
    sections: [
      {
        h: 'Cookies de terceros y publicidad',
        p: [
          'Actualmente esta web no usa cookies publicitarias ni de seguimiento entre webs. Si en el futuro se añaden (por ejemplo, anuncios), se pedirá tu consentimiento antes, con un aviso donde podrás aceptarlas o rechazarlas.',
        ],
      },
      {
        h: 'Almacenamiento propio y técnico',
        p: [
          'kz_attribution (almacenamiento local, propio): recuerda por qué canal llegaste la primera vez (por ejemplo, TikTok) para saber qué contenido funciona. No contiene datos personales.',
          'kz_last_tool (almacenamiento local, propio): guarda el último resultado de una calculadora para adjuntarlo si decides suscribirte. Solo números.',
          'Cloudflare Turnstile y Cloudflare Web Analytics pueden usar datos técnicos necesarios para proteger la web de bots y medir visitas de forma agregada, sin cookies de seguimiento.',
        ],
      },
      {
        h: 'Cómo borrarlo',
        p: ['Puedes borrar el almacenamiento local y las cookies desde la configuración de tu navegador en cualquier momento.'],
      },
    ],
  },
};

const en: Record<LegalSlug, LegalDoc> = {
  'aviso-legal': {
    title: 'Legal notice',
    intro: 'Information about the owner of this website, as required by Spanish Law 34/2002 (LSSI-CE).',
    sections: [
      { h: 'Owner', p: [`${O.brand} is a brand of ${O.name}, tax ID ${O.nif}, address ${O.address}. Contact: ${O.email}.`] },
      {
        h: 'Purpose',
        p: ['This website offers free training and nutrition content, indicative calculators and the option to apply for online personal training.'],
      },
      {
        h: 'Indicative information',
        p: [
          'Content and calculator results are general information. They do not replace advice from a health professional. Talk to your doctor before starting an exercise programme or changing your diet.',
        ],
      },
      { h: 'Intellectual property', p: [`Texts, designs, logos, videos and code belong to ${O.name} or are used under licence.`] },
      { h: 'Governing law', p: ['This website is governed by Spanish law.'] },
    ],
  },
  privacidad: {
    title: 'Privacy policy',
    intro: 'How your personal data is processed, under the EU General Data Protection Regulation (GDPR).',
    sections: [
      { h: 'Controller', p: [`${O.name}, tax ID ${O.nif}, ${O.address}. Email: ${O.email}.`] },
      {
        h: 'What data and why',
        p: [
          'Email (and the numeric result of a calculator you used, if any) when you subscribe: to send you training tips and offers. Legal basis: your consent.',
          'Coaching application data: to assess whether I can help you and contact you. Legal basis: steps taken at your request before a contract.',
          'Traffic source and aggregated website usage, without tracking cookies: to learn which content works. Legal basis: legitimate interest.',
        ],
      },
      { h: 'Retention', p: ['Mailing list data until you unsubscribe. Applications that do not become clients, up to 12 months.'] },
      {
        h: 'Processors',
        p: [
          'Supabase (database, EU), Cloudflare (hosting and bot protection), PostHog (analytics, EU) and the email provider, under data processing agreements. Your data is never sold.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          `You can access, rectify, erase, object, restrict and port your data by writing to ${O.email}, and withdraw consent at any time. You may complain to the Spanish Data Protection Agency (www.aepd.es).`,
        ],
      },
      { h: 'Minors', p: ['This website is not intended for children under 14.'] },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    intro: 'What is stored in your browser when you use this website.',
    sections: [
      {
        h: 'Third-party and advertising cookies',
        p: ['This website currently uses no advertising or cross-site tracking cookies. If they are added in the future, your consent will be requested first.'],
      },
      {
        h: 'First-party storage',
        p: [
          'kz_attribution (local storage): remembers which channel you first came from. No personal data.',
          'kz_last_tool (local storage): keeps your last calculator result to attach it if you subscribe. Numbers only.',
        ],
      },
      { h: 'How to delete it', p: ['You can clear local storage and cookies from your browser settings at any time.'] },
    ],
  },
};

export const LEGAL: Record<Locale, Record<LegalSlug, LegalDoc>> = { es, en };
