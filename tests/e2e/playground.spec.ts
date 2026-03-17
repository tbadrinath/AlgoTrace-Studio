import { test, expect } from '@playwright/test';

test('playground page loads', async ({ page }) => {
  await page.goto('/playground');
  await expect(page.getByRole('heading', { name: /playground/i })).toBeVisible();
});

test('playground has visualize button', async ({ page }) => {
  await page.goto('/playground');
  const button = page.getByRole('button', { name: /visualize/i });
  await expect(button).toBeVisible();
});
