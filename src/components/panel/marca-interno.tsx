'use client';

import { useEffect } from 'react';

/**
 * Entrar al panel como entrenador marca ESTE navegador como interno (kz_interno=1): a partir de
 * ahí sus visitas a la web no cuentan en la analítica (src/lib/analytics/client.ts).
 * Mismo dominio, mismo localStorage. El navegador de Instagram o TikTok es otro: ahí hace falta
 * abrir una vez kozaeftraining.com/es?kz_interno=1.
 */
export function MarcaInterno() {
  useEffect(() => {
    try {
      localStorage.setItem('kz_interno', '1');
    } catch {
      // modo privado o almacenamiento bloqueado: nada que hacer
    }
  }, []);
  return null;
}
