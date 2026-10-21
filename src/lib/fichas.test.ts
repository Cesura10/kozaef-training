import { describe, expect, it } from 'vitest';
import { leerEdad, leerPeso, TOKEN_RE, validarRespuestas } from './fichas-validar';

const base = { nombre: 'Ana Pérez', email: 'ana@ejemplo.com', telefono: '600000000', edad: '41', peso: '68,5', estatura: '165', objetivo: 'Ganar fuerza' };

describe('formularios de ficha', () => {
  it('acepta un formulario inicial completo y descarta claves que no son preguntas', () => {
    const v = validarRespuestas('inicial', { ...base, inventada: 'x' });
    expect(v.ok).toBe(true);
    if (v.ok) expect(v.respuestas.inventada).toBeUndefined();
  });
  it('marca las obligatorias que faltan y un email mal escrito', () => {
    const v = validarRespuestas('inicial', { ...base, objetivo: '  ', email: 'ana@' });
    expect(v).toEqual({ ok: false, faltan: expect.arrayContaining(['objetivo', 'email']) });
  });
  it('rechaza una opción que no existe', () => {
    expect(validarRespuestas('inicial', { ...base, gimnasio: 'Quizás' }).ok).toBe(false);
  });
  it('la revisión solo exige el nombre', () => {
    expect(validarRespuestas('revision', { nombre: 'Ana' }).ok).toBe(true);
    expect(validarRespuestas('revision', {}).ok).toBe(false);
  });
  it('lee peso y edad con tolerancia', () => {
    expect(leerPeso('72,5 kg')).toBe(72.5);
    expect(leerPeso('mucho')).toBeNull();
    expect(leerPeso('5')).toBeNull();
    expect(leerEdad('41')).toBe(41);
    expect(leerEdad('3')).toBeNull();
  });
  it('los tokens tienen el formato esperado', () => {
    expect(TOKEN_RE.test('abcDEF123_-abcDEF123_-xy')).toBe(true);
    expect(TOKEN_RE.test('corto')).toBe(false);
    expect(TOKEN_RE.test("x' or 1=1 --aaaaaaaaaaaaa")).toBe(false);
  });
});
