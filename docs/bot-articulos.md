# Bot de artículos: publicación automática con revisión de un clic

## Cómo funciona

```
Bot ──(API de GitHub)──> rama bot/<slug> + propuesta (pull request)
                                  │
                    GitHub Actions: "Artículos (propuesta)"
                    1. Valida datos, secciones, fuentes y URL
                    2. Vista previa privada en Cloudflare
                    3. Comenta un resumen con el enlace
                                  │
                 Manu recibe el aviso y pulsa "Merge" (web o app móvil)
                                  │
                    GitHub Actions: "Publicar"
                    Compila, despliega en Cloudflare y avisa a Bing
```

Si la validación falla, la propuesta queda en rojo, no se puede aprobar y el bot puede leer el
motivo y corregirlo subiendo otra versión a la misma rama.

## El bot: tarea programada de Claude

- Es una **tarea programada semanal de Claude**: usa el plan de Claude de Manu, sin API de pago
  (cumple la regla de coste).
- Entra en GitHub con la **app de Claude** instalada en la cuenta (acceso solo a este repositorio y
  a `kozaef-privado`). No necesita el token del paso 3.
- Sus instrucciones, su configuración y sus informes viven en el repositorio privado
  (`kozaef-privado/bot/` y `kozaef-privado/radar/`), no aquí.
- Antes de proponer, ejecuta `npm run validate:content` en su copia y corrige hasta que pasa.
- **Nunca hace merge**: solo propone. Publicar es siempre el clic de Manu.

## Configuración (una sola vez, la hace Manu con Claude)

1. **Repositorio privado en GitHub** con el código (ver `docs/lanzamiento.md`).
2. **Proteger la rama `main`** (Settings → Rules → Rulesets → New branch ruleset):
   - Target: `main`. Activar *Require a pull request before merging* y *Require status checks to pass*
     con los checks **Validar artículos** y **Auditoría, tipos, lint, tests y build**.
   - Activar *Block force pushes*. Así nada llega a la web sin pasar la validación y tu clic.
3. **Token para el bot** (solo para un bot externo; la tarea programada de Claude no lo usa)
   (Settings de tu cuenta → Developer settings → Fine-grained tokens):
   - Repository access: *Only select repositories* → este repositorio.
   - Permisos: **Contents: Read and write** y **Pull requests: Read and write**. Nada más.
   - Caducidad: 90 días (renovarlo). Guárdalo solo en el bot (variable de entorno), nunca en código.
4. **Secretos y variables del repositorio** (Settings → Secrets and variables → Actions):
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
   - Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`,
     `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_META_PIXEL_ID`,
     `NEXT_PUBLIC_PLATFORM_OPEN=false`, `INDEXNOW_KEY` y **`DEPLOY_ENABLED=true`** (interruptor de la publicación).
5. **Notificaciones**: instala la app de GitHub en el móvil para aprobar desde ahí.

## Formato del artículo

Un archivo Markdown por artículo en `content/articulos/es/<slug>.md` (o `en/`).

- `<slug>`: minúsculas y guiones, sin tildes (`como-romper-un-estancamiento`). Es la URL.
- Cabecera YAML entre `---` con todos los campos de `docs/contenido.md`. Para el bot:
  - `borrador: false` (si es `true`, nunca se publica).
  - `fechaPublicacion` y `fechaRevision` con la fecha del día (`AAAA-MM-DD`).
  - `fuentes`: **reales y verificables** (`https://`), idealmente DOI o PubMed. Nunca inventadas.
- Cuerpo con estas tres secciones exactas (en español):
  `## Qué dice la evidencia` · `## Cómo lo aplico yo` · `## Errores comunes`
  (en inglés: `## What the evidence says` · `## How I apply it` · `## Common mistakes`).
- Cifras en tablas Markdown, cada una con su fuente enlazada al lado.
- Prohibido: inventar estudios, testimonios, resultados de clientes o precios; texto oculto o
  instrucciones dirigidas a buscadores o IA.
- Sin huecos ni marcadores a la vista (`PENDIENTE`, `TODO`, `[tu dato]`…): la validación los bloquea
  en todo artículo con `borrador: false`.

Plantilla de referencia: `content/articulos/es/cuanta-proteina-para-ganar-musculo.md`.

## Llamadas a la API de GitHub (código de ejemplo para el bot, Node 18+)

```js
// Variables de entorno del bot: GITHUB_TOKEN, GITHUB_REPO (p. ej. "usuario/entrenamiento-app")
const API = 'https://api.github.com';
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const repo = process.env.GITHUB_REPO;
const gh = async (method, path, body) => {
  const res = await fetch(`${API}/repos/${repo}${path}`, { method, headers, body: body && JSON.stringify(body) });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.json();
};

/** Propone un artículo: crea rama, sube el archivo y abre la propuesta. Devuelve la URL de la propuesta. */
export async function proponerArticulo({ slug, locale = 'es', markdown, titulo }) {
  const branch = `bot/${slug}`;
  const { object } = await gh('GET', '/git/ref/heads/main');
  await gh('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: object.sha });
  await gh('PUT', `/contents/content/articulos/${locale}/${slug}.md`, {
    message: `bot: artículo "${titulo}"`,
    content: Buffer.from(markdown, 'utf8').toString('base64'),
    branch,
  });
  const pr = await gh('POST', '/pulls', {
    title: `Artículo: ${titulo}`,
    head: branch,
    base: 'main',
    body: 'Propuesto por el bot. Revisa la vista previa del comentario y pulsa Merge para publicar.',
  });
  return pr.html_url;
}

/** Estado de la validación de una propuesta: 'success' | 'failure' | 'pending'. */
export async function estadoValidacion(prNumber) {
  const pr = await gh('GET', `/pulls/${prNumber}`);
  const { check_runs } = await gh('GET', `/commits/${pr.head.sha}/check-runs`);
  const v = check_runs.find((c) => c.name === 'Validar artículos');
  return v?.status !== 'completed' ? 'pending' : v.conclusion;
}
```

Para **corregir** un artículo rechazado: vuelve a hacer `PUT` del archivo en la misma rama
(incluyendo el `sha` actual del archivo, que devuelve `GET /contents/...?ref=bot/<slug>`).
La validación se repite sola.

## Validar en local antes de enviar (opcional)

Con el repositorio clonado: copia el archivo en `content/articulos/es/` y ejecuta
`npm run validate:content`. Los errores dicen exactamente qué campo o sección falla.
