import { test, expect } from '@playwright/test';

const SAMPLE_TRACE = encodeURIComponent(JSON.stringify([
  { t: 0.0, type: 'line', line: 1 },
  { t: 0.5, type: 'variable_update', name: 'x', value: 5 },
]));

const SAMPLE_CODE = encodeURIComponent('x = 5\nprint(x)');

test('visualizer page loads', async ({ page }) => {
  await page.goto(`/visualizer?trace=${SAMPLE_TRACE}&code=${SAMPLE_CODE}`);
  await expect(page.getByRole('heading', { name: /visualizer/i })).toBeVisible();
});

test('timeline controls are visible', async ({ page }) => {
  await page.goto(`/visualizer?trace=${SAMPLE_TRACE}&code=${SAMPLE_CODE}`);
  const toolbar = page.getByRole('toolbar', { name: /timeline controls/i });
  await expect(toolbar).toBeVisible();
});

test('play button is visible', async ({ page }) => {
  await page.goto(`/visualizer?trace=${SAMPLE_TRACE}&code=${SAMPLE_CODE}`);
  const playBtn = page.getByRole('button', { name: /play/i });
  await expect(playBtn).toBeVisible();
});
