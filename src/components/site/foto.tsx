/**
 * Imagen optimizada (public/img, generada con scripts/optimize-images.mjs).
 * Sin next/image: en Cloudflare la optimización al vuelo no es gratis, así que servimos WebP ya
 * preparados en varios anchos y el navegador elige el adecuado (el móvil baja el pequeño).
 */
const WIDTHS = [480, 800, 1200, 1600];

export function Foto({
  name,
  alt,
  sizes = '(min-width: 1280px) 1200px, 100vw',
  className = '',
  imgClassName = '',
  priority = false,
}: {
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** true solo si se ve nada más entrar (sin carga diferida). */
  priority?: boolean;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 bg-surface ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizados, ver comentario */}
      <img
        src={`/img/${name}-1200.webp`}
        srcSet={WIDTHS.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        width={1536}
        height={1024}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {/* Degradado inferior para que la imagen funda con el fondo oscuro de la web. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
    </figure>
  );
}
