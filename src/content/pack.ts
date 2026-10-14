/** Packs de /programas. Deben coincidir con los descuentos automáticos de Shopify sobre la
 * colección Guías: "Pack elige 3: 25 % menos" (3 o más) y "Pack completo: 40 % menos" (5 o más).
 * Shopify aplica el mayor de los dos. */
export const PACK_SIZE = 3;
export const PACK_DISCOUNT = 0.25;
export const PACK_ALL_MIN = 5;
export const PACK_ALL_DISCOUNT = 0.4;

/**
 * Producto de la barra de compra fija. Cuando haya ventas, poner primero el más vendido.
 * Sin ventas todavía: el de más potencial (más búsquedas). Se usa el primero que esté publicado
 * y se pueda comprar.
 */
export const PRODUCTO_ESTRELLA = ['pierde-grasa-sin-pasar-hambre', 'fuerte-en-la-menopausia'];
