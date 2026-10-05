import { expect, test, type Page } from '@playwright/test';

/**
 * Pruebas de humo de la web publicada. NO envían formularios reales (no ensucian los datos):
 * comprueban que todo carga, que las calculadoras calculan y que las validaciones responden.
 */

async function noErrors(page: Page, path: string) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Content.Security.Policy|favicon|net::ERR_BLOCKED/i.test(m.text())) errors.push(m.text());
  });
  const res = await page.goto(path, { waitUntil: 'networkidle' });
  expect(res?.status(), `${path} responde`).toBe(200);
  return errors;
}

test('salud: web y base de datos', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  expect((await res.json()).db).toBe('ok');
});

test('portada en español: carga, calculadora funciona y sin errores', async ({ page }) => {
  const errors = await noErrors(page, '/es');
  await expect(page.locator('h1')).toContainText('Entrena con criterio');
  const calc = page.locator('#calculadora');
  const before = await calc.innerText();
  await page.getByRole('button', { name: 'Perder grasa' }).click();
  await expect.poll(async () => calc.innerText()).not.toBe(before);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('portada en inglés', async ({ page }) => {
  await noErrors(page, '/en');
  await expect(page.locator('h1')).toContainText('Train with intent');
});

test('calculadora de calorías calcula', async ({ page }) => {
  const errors = await noErrors(page, '/es/herramientas/calculadora-calorias');
  await page.getByRole('button', { name: 'Perder grasa' }).click();
  await expect(page.locator('[aria-live=polite]')).toContainText('kcal al día');
  await expect(page.getByText('Ejemplo resuelto')).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});

test('calculadora de grasa corporal calcula', async ({ page }) => {
  await noErrors(page, '/es/herramientas/calculadora-grasa-corporal');
  await expect(page.locator('[aria-live=polite]')).toContainText('%');
});

test('solicitud: el formulario valida sin enviar', async ({ page }) => {
  await noErrors(page, '/es/solicitar');
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Responde todas las preguntas' })).toBeVisible();
});

test('newsletter: valida el email sin enviar', async ({ page }) => {
  await noErrors(page, '/es');
  const form = page.locator('#lista form');
  await form.locator('input[type=email]').fill('no-es-un-email');
  await form.getByRole('button', { name: 'Suscribirme' }).click();
  await expect(form.getByRole('status')).toContainText('Revisa el email');
});

for (const path of ['/es/aprende', '/es/programas', '/es/coaching', '/es/legal/privacidad', '/es/herramientas']) {
  test(`página ${path}`, async ({ page }) => {
    await noErrors(page, path);
  });
}

test('SEO: robots.txt y sitemap.xml', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap:');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>');
});

test('seguridad: cabeceras presentes', async ({ request }) => {
  const res = await request.get('/es');
  const h = res.headers();
  expect(h['strict-transport-security']).toBeTruthy();
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['content-security-policy'] ?? h['content-security-policy-report-only']).toContain("frame-ancestors 'none'");
});

test('zona privada protegida', async ({ page }) => {
  await page.goto('/analitica');
  await expect(page).toHaveURL(/\/login/);
});
