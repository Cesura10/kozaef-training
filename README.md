# Entrenamiento — Plataforma de Manu

App para gestionar clientes de entrenamiento personal: rutinas, dietas,
check-ins con fotos de progreso y chat 1:1. Next.js (App Router) + Supabase.

Especificación completa: [`docs/spec-backend.md`](docs/spec-backend.md).

---

## Estado actual (pasos 1–2 del roadmap)

- ✅ Proyecto Next.js 16 + TypeScript + Tailwind v4.
- ✅ Autenticación Supabase: **Google OAuth** + **email/contraseña**.
- ✅ Tabla `profiles` con roles `trainer` / `client` y RLS.
  El **primer usuario que se registre** se crea como `trainer` (Manu).
- ✅ Migraciones completas: rutinas, dietas, check-ins, chat (con Realtime),
  comunidad (esquema Fase 3) y bucket privado de Storage — todas con RLS.
- ✅ Shell de la app con navegación por rol y dashboard placeholder.
- ⬜ CRUD funcional de rutinas/dietas, check-ins, chat en vivo (pasos 3–5).

---

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el proyecto Supabase

1. Entra en <https://supabase.com/dashboard> y crea un proyecto nuevo.
2. **Project Settings → API**: copia `Project URL` y la clave `anon` `public`.
3. Copia el ejemplo de entorno y rellénalo:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...            # Settings → API → service_role
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 3. Aplicar las migraciones a Supabase Cloud

```bash
npx supabase login
npx supabase link --project-ref TU-PROYECTO-REF     # el ref sale de la URL del panel
npx supabase db push
```

Esto crea todas las tablas, policies RLS, triggers y el bucket
`check-in-photos`. Para regenerar los tipos TypeScript desde el esquema real:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

### 4. Configurar Google como proveedor de login

1. En [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   crea un **OAuth 2.0 Client ID** (tipo *Web application*).
2. En **Authorized redirect URIs** añade:
   `https://TU-PROYECTO.supabase.co/auth/v1/callback`
3. En el panel de Supabase → **Authentication → Providers → Google**: activa el
   proveedor y pega el *Client ID* y *Client Secret*.
4. En **Authentication → URL Configuration**:
   - *Site URL*: `http://localhost:3000` (y luego la URL de producción).
   - *Redirect URLs*: añade `http://localhost:3000/**` y la de producción.

### 5. Arrancar

```bash
npm run dev
```

Abre <http://localhost:3000>. Si falta configuración de Supabase, la app te
redirige a `/setup` con las instrucciones.

**Regístrate el primero con la cuenta de Manu** → quedará como `trainer`.
Los siguientes registros son `client` y hay que asignarles `trainer_id`
(de momento a mano en el panel de Supabase; el CRUD de clientes llega en el paso 3).

---

## Desarrollo local con Supabase (opcional)

Requiere **Docker Desktop** (no instalado en esta máquina ahora mismo).

```bash
npx supabase start          # levanta Postgres + Auth + Storage en local
npx supabase db reset       # aplica migrations/ + seed.sql
```

Las claves locales las imprime `supabase start`; ponlas en `.env.local`.
Para Google en local, rellena `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` y
`SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` (ver `supabase/config.toml`).

---

## Estructura

```
src/
  proxy.ts                    # ex-"middleware" (Next 16): refresca sesión + protege rutas
  lib/supabase/
    client.ts                 # cliente para componentes de navegador
    server.ts                 # cliente para Server Components / Actions / Route Handlers
    session.ts                # helper updateSession() usado por proxy.ts
    env.ts                    # lee/valida las env de Supabase
  lib/auth.ts                 # getSessionProfile() / requireProfile()
  types/database.ts           # tipos de la BD (regenerables con supabase gen types)
  app/
    page.tsx                  # landing
    login/ · signup/          # formularios de auth
    auth/callback · confirm · signout   # route handlers de OAuth / email / logout
    setup/                    # ayuda si faltan las env
    (app)/                    # rutas privadas (layout con guard de sesión)
      dashboard/
  components/                 # UI (auth-form, button, brand, nav-link)
supabase/
  config.toml
  migrations/                 # esquema + RLS (8 archivos, orden por timestamp)
  seed.sql
```

---

## Despliegue (cuando toque)

1. Push del repo a GitHub e import en [Vercel](https://vercel.com).
2. En Vercel, define las mismas variables de `.env.local` (con
   `NEXT_PUBLIC_SITE_URL` = URL de Vercel).
3. Añade esa URL a *Redirect URLs* en Supabase y al *Client ID* de Google.
4. La PWA es instalable desde el navegador (menú → "Instalar app"). El dominio
   propio se puede añadir en Vercel más adelante sin tocar el código.
