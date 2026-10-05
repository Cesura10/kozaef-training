/**
 * Escapa los comodines de LIKE/ILIKE (`%`, `_` y la barra invertida) para buscar un valor
 * literal. Sin esto, `ilike('email', 'ana_p@x.com')` también encuentra `anaXp@x.com`:
 * el `_` es "cualquier carácter" y se podían leer o modificar filas de otra persona.
 */
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);
