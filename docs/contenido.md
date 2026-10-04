# Cómo añadir contenido

Todo el contenido vive en archivos del proyecto. Tras cualquier cambio: `npm run cf:deploy`
(o pídeselo a Claude). Si un dato está mal, el build falla y te dice qué arreglar: nunca se
publica nada roto.

## Añadir un artículo

1. Copia `content/articulos/es/cuanta-proteina-para-ganar-musculo.md` con un nombre nuevo.
   **El nombre del archivo es la URL**: `como-romper-un-estancamiento.md` → `/es/aprende/<categoria>/como-romper-un-estancamiento`.
2. Rellena la cabecera (entre los `---`):

| Campo | Qué poner |
|---|---|
| `titulo` | La pregunta real que hace la gente (10-110 caracteres) |
| `descripcion` | Resumen para Google (50-170 caracteres) |
| `respuestaRapida` | La respuesta en 2-3 líneas |
| `categoria` | Una de: `perder-grasa`, `ganar-musculo`, `fuerza-tecnica`, `nutricion`, `recuperacion` |
| `perfiles` | Uno o varios: `principiantes`, `mujeres-45`, `sobrepeso`, `cuesta-ganar-peso`, `entreno-casa` |
| `nivel` | `basico`, `intermedio` o `avanzado` |
| `fechaPublicacion` / `fechaRevision` | `AAAA-MM-DD`. Actualiza la de revisión cada vez que lo revises |
| `herramientaRelacionada` | `calories`, `protein`, `bodyfat` o `null` |
| `productoRelacionado` | `id` de un producto (p. ej. `revision-tecnica`) o `null` |
| `fuentes` | Al menos una, con `titulo` y `url` |
| `faq` | Preguntas con `pregunta` y `respuesta` (opcional) |
| `borrador` | `true` mientras lo escribes (solo se ve en tu ordenador); `false` para publicar |

3. Escribe el cuerpo con estas secciones (`## ` es un título de sección):
   `## Qué dice la evidencia`, `## Cómo lo aplico yo`, `## Errores comunes`.
   El aviso de herramienta, las preguntas frecuentes, las fuentes, tu caja de autor, el producto y el
   coaching se añaden solos.
4. Tablas: usa tablas de Markdown (`| a | b |`). Cada cifra con su fuente enlazada al lado.
5. Para verlo en local: `npm run dev` y abre la URL. Para publicar: `borrador: false` y despliega.

Categorías y perfiles se cambian en `src/content/taxonomy.ts` (si renombras una URL ya publicada,
añade una redirección en `next.config.ts`).

## Añadir un producto (infoproducto o servicio)

En `src/content/products.ts`, añade un objeto a `PRODUCTS`:

- `id`: identificador interno (sin espacios). `slug`: URL en español e inglés.
- `tipo`: `infoproducto` o `servicio`.
- `nombre`, `paraQuien`, `incluye`: textos en `es` y `en`.
- `precio` (número) y `lanzamiento: true` si es precio de lanzamiento.
- `categoria` y `perfiles`: para que aparezca en los artículos y herramientas adecuados.
- `enlacePago`: **el enlace de compra de Shopify**. Mientras sea `null`, se muestra como lista de espera.
- `demo`: el contenido gratuito de muestra (títulos y párrafos). El contenido de pago lo entrega Shopify.
- `publicado`: `false` para prepararlo sin que se vea.
- `capacidadSemanal`: solo servicios manuales (al llenarse, lista de espera).

En Shopify: crea el producto, activa la app **Digital Downloads** para adjuntar el archivo y pon como
página de retorno tras la compra `https://<tu-dominio>/es/gracias`.

## Otros datos en configuración

| Qué | Archivo |
|---|---|
| Tus datos de autor (nombre, titulación, ciudad, foto, redes) | `src/content/author.ts` |
| Vídeos de correcciones de técnica (ID de YouTube "no listado") | `src/content/technique-examples.ts` |
| Aprobar el diagnóstico gratis (y revisar sus textos) | `src/content/diagnosis.ts` → `DIAGNOSIS_APPROVED = true` |
| Oferta de coaching en la página de gracias | `src/content/offers.ts` |
| Textos legales y de desistimiento | `src/lib/legal.ts`, `src/content/legal.ts`, `src/content/products.ts` |
| Límites de uso y costes | `src/lib/limits.ts` |
