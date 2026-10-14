// Optimiza las imágenes de la web: node scripts/optimize-images.mjs <carpeta-origen>
// Genera public/img/<nombre>-<ancho>.webp (480, 800, 1200, 1600) y, para los artículos,
// public/img/og/<nombre>.jpg (1200x630, la imagen al compartir en redes y WhatsApp).
// Para cambiar una imagen (p. ej. por una foto real de Manu): sustituye el archivo de origen y repite.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAP = {
  'Sentadilla goblet con entrenador.png': 'portada',
  'Plan de entrenamiento en el gimnasio.png': 'programas',
  'Entrenamiento en tonos dorados.png': 'coaching',
  'Sesión de entrenamiento virtual en casa.png': 'coaching-llamada',
  'Medición de cintura en el gimnasio.png': 'art-grasa-abdominal',
  'Reflejo de fuerza en el gimnasio.png': 'art-cuanto-tarda',
  'Ejercicio de bisagra de cadera en gimnasio.png': 'art-espalda',
  'Peso muerto con mancuernas en gimnasio 恒一.png': 'art-menopausia',
  'Bodegón cálido de proteínas frescas.png': 'art-proteina',
  'Suplemento y agua en banco de gimnasio.png': 'art-creatina',
  'Diario de entrenamiento junto a pesas.png': 'art-rutina',
};
const WIDTHS = [480, 800, 1200, 1600];
const src = process.argv[2];
if (!src) throw new Error('Uso: node scripts/optimize-images.mjs <carpeta-origen>');
mkdirSync('public/img/og', { recursive: true });
for (const [file, name] of Object.entries(MAP)) {
  const input = join(src, file);
  if (!existsSync(input)) {
    console.log('falta', file);
    continue;
  }
  for (const w of WIDTHS) {
    await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`public/img/${name}-${w}.webp`);
  }
  if (name.startsWith('art-')) {
    await sharp(input).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78, mozjpeg: true }).toFile(`public/img/og/${name}.jpg`);
  }
  console.log('ok', name);
}
