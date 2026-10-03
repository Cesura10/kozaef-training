@AGENTS.md

# Proyecto: App de Entrenamiento Online (plataforma de Manu)

**PRIMERO lee `docs/ecosistema.md`** (arquitectura y decisiones vigentes del ecosistema: web pública,
herramientas, leads, solicitudes, i18n, Cloudflare). Prevalece sobre lo que contradiga abajo.
Contexto de la app privada de clientes: **`docs/spec-backend.md`**.
Puesta en marcha y estado actual: **`README.md`**.

> **Regla de coste (no negociable):** todo en planes gratis. No añadir APIs ni servicios de pago
> (LLMs incluidos) sin permiso expreso de Manu. Todo formulario público pasa por
> `guardPublicWrite` (`src/lib/guard.ts`) y los límites viven en `src/lib/limits.ts`.
> Ver `docs/ecosistema.md` §13. Web pública en `src/app/(site)/[locale]` (estática, textos en
> `src/i18n/dictionaries`); plataforma privada en `src/app/(platform)`.

## Qué es

Plataforma para que un entrenador personal gestione clientes: rutinas, dietas,
check-ins con fotos, chat 1:1 y (Fase 3) comunidad. Roles `trainer` / `client`.

## Stack y decisiones fijas

- **Next.js 16** (App Router, TypeScript, Tailwind v4). Ojo: Next 16 tiene
  breaking changes — el antiguo `middleware` aquí es **`src/proxy.ts`**
  (`export function proxy`). Consulta `node_modules/next/dist/docs/` antes de
  tocar APIs de Next.
- **Supabase** para todo el backend: Postgres + Auth + Storage + Realtime.
- **La seguridad vive en RLS**, no en la capa de API. Cada tabla de datos de
  cliente lleva policies. Nada de endpoints que "confíen" en el cliente.
- Auth: **Google OAuth + email/contraseña**. El primer usuario registrado se
  crea como `trainer` (trigger `handle_new_user`).
- Vídeos = URLs embebidas (YouTube/Vimeo). Solo las **fotos de progreso** van a
  Supabase Storage (bucket privado `check-in-photos`).

## Convenciones de código

- Cliente Supabase:
  - navegador → `import { createClient } from '@/lib/supabase/client'`
  - servidor → `import { createClient } from '@/lib/supabase/server'` (es `async`)
- Sesión/perfil en servidor → `@/lib/auth` (`getSessionProfile`, `requireProfile`).
- Rutas privadas cuelgan de `src/app/(platform)/(app)/` (su layout hace de guard).
- Migraciones: un archivo por área en `supabase/migrations/`, prefijo timestamp
  `AAAAMMDDHHMMSS_nombre.sql`. Nunca editar una migración ya aplicada: añadir otra.
- Tipos de BD en `src/types/database.ts` (regenerar con
  `npx supabase gen types typescript --linked` cuando cambie el esquema).
- Textos de UI en español. Paleta y tokens en `src/app/globals.css`
  (negro + dorado `--color-primary`, marca Kozaef Training).
  Animaciones sobrias; respetar `prefers-reduced-motion`.

## Roadmap (seguir en orden)

1. ✅ Next.js + Supabase + `profiles` + login + RLS básico.
2. ✅ Migraciones completas de todas las tablas + RLS.
3. ⬜ CRUD funcional de rutinas y dietas.
4. ⬜ Check-ins + subida de fotos.
5. ⬜ Chat 1:1 con Realtime.
6. ⬜ Frontend estético / identidad visual / vídeos onboarding.
7. ⬜ Fase 3: comunidad.
