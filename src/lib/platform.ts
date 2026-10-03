/**
 * Interruptor de la PLATAFORMA (login, app de clientes, registro).
 *
 * false (lanzamiento actual): la web pública no muestra "Entrar", nadie puede crear
 * cuenta y solo las cuentas existentes (Manu) entran por /login al panel.
 * true: se abre la plataforma. Lanzarla = cambiar NEXT_PUBLIC_PLATFORM_OPEN y redesplegar.
 */
export const PLATFORM_OPEN = process.env.NEXT_PUBLIC_PLATFORM_OPEN === 'true';
