import { test, expect } from '@playwright/test';

test('homepage loads and shows AlgoTrace Studio', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AlgoTrace Studio/i);
  await expect(page.getByRole('heading', { name: /AlgoTrace Studio/i })).toBeVisible();
});

test('homepage has link to playground', async ({ page }) => {
  await page.goto('/');
  const playgroundLink = page.getByRole('link', { name: /playground/i });
  await expect(playgroundLink).toBeVisible();
});

test('homepage has link to examples', async ({ page }) => {
  await page.goto('/');
  const examplesLink = page.getByRole('link', { name: /examples/i });
  await expect(examplesLink).toBeVisible();
});
