/**
 * Formularios de las fichas de clientes (copiados de los Google Forms de Manu, oct-2026).
 * Cambiar textos aquí no rompe nada; cambiar un `id` deja las respuestas antiguas con la clave vieja
 * (se siguen viendo en la ficha, pero sin su pregunta).
 */
export type FichaTipo = 'inicial' | 'revision';

export type Pregunta = {
  id: string;
  label: string;
  tipo: 'texto' | 'parrafo' | 'escala' | 'opciones' | 'email' | 'tel' | 'numero';
  opciones?: string[];
  obligatoria?: boolean;
};
export type Seccion = { titulo: string; preguntas: Pregunta[] };

const ESCALA_10 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const FORMULARIOS: Record<FichaTipo, { titulo: string; intro: string; secciones: Seccion[] }> = {
  inicial: {
    titulo: 'Formulario inicial',
    intro: 'Con esto preparo tu plan. Cuanto más detalle, mejor. Tardas unos 10 minutos y puedes dejar en blanco lo que no sepas.',
    secciones: [
      {
        titulo: 'Tus datos',
        preguntas: [
          { id: 'nombre', label: 'Nombre y apellidos', tipo: 'texto', obligatoria: true },
          { id: 'email', label: 'Correo electrónico', tipo: 'email', obligatoria: true },
          { id: 'telefono', label: 'Teléfono de contacto', tipo: 'tel', obligatoria: true },
          { id: 'edad', label: 'Edad', tipo: 'numero', obligatoria: true },
          { id: 'peso', label: 'Peso en ayunas (kg)', tipo: 'numero', obligatoria: true },
          { id: 'estatura', label: 'Estatura (cm)', tipo: 'numero', obligatoria: true },
          { id: 'objetivo', label: 'Objetivo (lo más detallado posible)', tipo: 'parrafo', obligatoria: true },
        ],
      },
      {
        titulo: 'Estilo de vida',
        preguntas: [
          { id: 'trabajo', label: 'Actividad laboral', tipo: 'texto' },
          { id: 'trabajo_detalle', label: 'Descripción de tu actividad laboral', tipo: 'parrafo' },
          { id: 'horas_sueno', label: '¿Cuántas horas duermes al día?', tipo: 'texto' },
          { id: 'calidad_sueno', label: '¿Cuál crees que es tu calidad de sueño? (1 = muy mala, 10 = excelente)', tipo: 'escala', opciones: ESCALA_10 },
          { id: 'horas_sentado', label: '¿Cuántas horas pasas sentado al día?', tipo: 'texto' },
        ],
      },
      {
        titulo: 'Nutrición',
        preguntas: [
          { id: 'comidas_dia', label: '¿Cuántas comidas haces al día?', tipo: 'opciones', opciones: ['1', '2', '3', '4', '5', '6', '7', '8', 'Más de 8'] },
          { id: 'comidas_donde', label: '¿Cuáles haces en casa y cuáles fuera?', tipo: 'parrafo' },
          { id: 'comidas_que', label: '¿Qué sueles comer en cada una?', tipo: 'parrafo' },
          { id: 'alimentos_no', label: '¿Qué alimentos no te gustan o no comerías en absoluto?', tipo: 'parrafo' },
          { id: 'alimentos_si', label: '¿Qué alimentos te gustan más e incluyes habitualmente?', tipo: 'parrafo' },
          { id: 'suplementos', label: '¿Tomas algún suplemento? (si es así, ¿cuál?)', tipo: 'parrafo' },
          { id: 'suplementos_dispuesto', label: 'Si no tomas ninguno, ¿estarías dispuesto a tomarlo?', tipo: 'parrafo' },
        ],
      },
      {
        titulo: 'Entrenamiento',
        preguntas: [
          { id: 'gimnasio', label: '¿Entrenas en un gimnasio?', tipo: 'opciones', opciones: ['Sí', 'No'] },
          { id: 'gimnasio_tiempo', label: 'Si es así, ¿cuánto tiempo hace que entrenas?', tipo: 'texto' },
          { id: 'gimnasio_dias', label: '¿Cuántos días a la semana vas y a qué hora?', tipo: 'texto' },
          { id: 'otro_deporte', label: '¿Haces algún otro deporte o actividad física?', tipo: 'texto' },
          { id: 'otro_deporte_dias', label: 'Si es así, ¿cuántos días a la semana y en qué horario?', tipo: 'texto' },
          { id: 'disponibilidad', label: '¿Qué días y horas prefieres y tienes disponibles para entrenar?', tipo: 'texto' },
          { id: 'mejorar', label: '¿Qué grupos musculares o cualidades físicas crees que deberías mejorar?', tipo: 'texto' },
        ],
      },
      {
        titulo: 'Salud',
        preguntas: [
          { id: 'patologia', label: '¿Tienes actualmente alguna patología o lesión?', tipo: 'parrafo' },
          { id: 'patologia_detalle', label: 'Si es así, explícalo con el máximo detalle', tipo: 'parrafo' },
          { id: 'medicacion', label: '¿Tomas alguna medicación habitualmente?', tipo: 'parrafo' },
          { id: 'medicacion_detalle', label: 'Si es así, explícalo con el máximo detalle', tipo: 'parrafo' },
          { id: 'patologia_pasada', label: '¿Has tenido alguna patología, lesión u operación en el pasado?', tipo: 'parrafo' },
          { id: 'patologia_pasada_detalle', label: 'Si es así, explícalo con el máximo detalle', tipo: 'parrafo' },
          {
            id: 'ciclo',
            label: 'Solo mujeres: ¿tu ciclo menstrual es regular? ¿Cuánto dura? ¿Notas limitaciones a lo largo del ciclo (fuerza, energía, ansiedad por la comida…)?',
            tipo: 'parrafo',
          },
        ],
      },
      {
        titulo: 'Algo más',
        preguntas: [{ id: 'extra', label: 'Si quieres añadir cualquier otra información, este es el momento', tipo: 'parrafo' }],
      },
    ],
  },
  revision: {
    titulo: 'Revisión',
    intro: 'Cuéntame cómo ha ido para ajustar tu siguiente plan. Tardas 3 minutos.',
    secciones: [
      {
        titulo: 'Tus datos',
        preguntas: [
          { id: 'nombre', label: 'Nombre y apellidos', tipo: 'texto', obligatoria: true },
          { id: 'peso', label: 'Peso en ayunas (kg). Si no lo sabes, déjalo en blanco y me lo dices por WhatsApp', tipo: 'numero' },
        ],
      },
      {
        titulo: 'Nutrición',
        preguntas: [
          { id: 'hambre', label: '¿Has pasado hambre? ¿Te sientes saciado? Cuéntame cómo te has sentido', tipo: 'parrafo' },
          { id: 'comida_llena', label: '¿En qué comida te sientes más lleno? ¿En cuál pasas más hambre?', tipo: 'parrafo' },
          { id: 'num_comidas', label: '¿Vas bien con el número de comidas? ¿Quitarías o añadirías alguna?', tipo: 'texto' },
          { id: 'anadir_alimento', label: '¿Te gustaría añadir algún alimento que no esté en tu plan?', tipo: 'parrafo' },
          { id: 'quitar_alimento', label: '¿Y alguno que quieras quitar?', tipo: 'parrafo' },
          { id: 'nutricion_otros', label: '¿Algo más sobre la alimentación?', tipo: 'parrafo' },
        ],
      },
      {
        titulo: 'Entrenamiento',
        preguntas: [
          { id: 'cumplido', label: '¿Has podido entrenar todos los días marcados?', tipo: 'parrafo' },
          { id: 'cambiar_dias', label: '¿Te gustaría añadir o quitar días de entrenamiento?', tipo: 'parrafo' },
          { id: 'quitar_ejercicio', label: '¿Hay algún ejercicio que te gustaría quitar?', tipo: 'parrafo' },
          { id: 'anadir_ejercicio', label: '¿Hay algún ejercicio que te gustaría añadir?', tipo: 'parrafo' },
          { id: 'entreno_otros', label: '¿Algo más sobre el entrenamiento?', tipo: 'parrafo' },
        ],
      },
      {
        titulo: 'Otros',
        preguntas: [{ id: 'otros', label: '¿Hay algo más que deba saber de cara al siguiente plan?', tipo: 'parrafo' }],
      },
    ],
  },
};

/** Texto de la casilla obligatoria del formulario inicial (datos de salud: RGPD art. 9.2.a). */
export const CONSENTIMIENTO_SALUD =
  'Doy mi consentimiento expreso para que Kozaef Training trate los datos de salud que indico aquí con el único fin de preparar y ajustar mi plan de entrenamiento y nutrición.';

export const MAX_RESPUESTA = 3000;

export const preguntasDe = (tipo: FichaTipo) => FORMULARIOS[tipo].secciones.flatMap((s) => s.preguntas);
