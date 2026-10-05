import { defineConfig, devices } from '@playwright/test';

// Pruebas de humo de la web publicada (monitor) o local: BASE_URL=https://... npx playwright test
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1, // un fallo puntual de red no debe despertar a nadie
  reporter: [['list'], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3005',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
});
