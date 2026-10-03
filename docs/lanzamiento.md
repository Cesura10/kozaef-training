# Lanzamiento de la web (fase captación)

Qué se lanza: web pública (/es, /en), 3 calculadoras con página propia, solicitud de coaching con puntuación, captación de emails, páginas
legales y SEO. La plataforma (login, app de clientes) queda **oculta** con
`NEXT_PUBLIC_PLATFORM_OPEN=false`; Manu entra a su panel por `/login`.

## Probado en local con el motor de Cloudflare (`npm run cf:preview`)
- `/es`, `/en` y legales servidos desde caché (`x-opennext-cache: HIT`).
- Proxy protegiendo `/dashboard` y `/analitica`.
- `/api/leads` guardando en Supabase. Sin claves de Turnstile, en producción los formularios
  se bloquean a propósito (respuesta `bot`).

## Lo que necesita Manu antes de publicar

| # | Qué | Coste | Por qué |
|---|---|---|---|
| 1 | Datos fiscales en `src/lib/legal.ts` (nombre, NIF, dirección, email) | 0 € | Obligatorio por la LSSI. Que un gestor revise los textos |
| 2 | Cuenta de Cloudflare (plan Free, **sin tarjeta**) | 0 € | Alojamiento + Turnstile + analítica sin cookies |
| 3 | Claves de Turnstile (Cloudflare → Turnstile → Add site) | 0 € | Sin ellas los formularios no aceptan envíos en producción |
| 4 | Dominio (p. ej. kozaeftraining.com) | ~10-15 €/año | Opcional para lanzar (sirve `kozaef-training.<cuenta>.workers.dev`), necesario para emails y marca |
| 5 | PostHog (región EU, sin tarjeta) | 0 € | Gráficos reales en /analitica. Opcional para lanzar |
| 6 | Cal.com (gratis) + `CALCOM_URL` | 0 € | Las solicitudes cualificadas reservan llamada solas. Sin él, se les avisa de que les escribirás en 48 h |

## Pasos de publicación (los ejecuta Claude con Manu)
1. `npx wrangler login` (Manu autoriza en el navegador).
2. Variables de entorno:
   - **De build** (se incrustan en el JS, en `.env.production` o en el entorno del build):
     `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (dominio final),
     `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_PLATFORM_OPEN=false`.
   - **Secretos de runtime** (`npx wrangler secret put NOMBRE`): `SUPABASE_SERVICE_ROLE_KEY`,
     `TURNSTILE_SECRET_KEY`, `POSTHOG_PERSONAL_API_KEY`, `POSTHOG_PROJECT_ID`.
3. Supabase → Auth: añadir el dominio final a `site_url` y a las redirecciones (`supabase/config.toml` + `npx supabase config push`).
4. `npm run cf:deploy`.
5. Comprobar en producción con Playwright: portada, calculadora, suscripción, legales, 404, `robots.txt`, `sitemap.xml`.
6. Dar de alta el dominio en Google Search Console y enviar el sitemap.

## Lanzar la plataforma más adelante
Cuando login y app estén listos: `NEXT_PUBLIC_PLATFORM_OPEN=true` (y los métodos de acceso
`NEXT_PUBLIC_AUTH_*` que se quieran), Resend como SMTP de Supabase y `npm run cf:deploy`.
No hay que tocar la web pública.

## Nota técnica
El `proxy.ts` de Next 16 corre en Node y en Cloudflare ese modo es experimental. Probado y
funcionando; si una actualización lo rompiera, el plan B es quitar el proxy y refrescar la
sesión en el layout privado (la web pública no depende de él).
