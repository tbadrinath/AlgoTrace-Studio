import { test, expect } from '@playwright/test';

test.describe('AlgoFlow Visualizer E2E', () => {
  test('homepage loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AlgoFlow Visualizer');
  });

  test('homepage has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Launch Visualizer/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open Playground/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse Examples/i })).toBeVisible();
  });

  test('navigate to /playground page loads editor', async ({ page }) => {
    await page.goto('/playground');
    await expect(page.locator('h1')).toContainText('Code Playground');
  });

  test('navigate to /visualizer page renders layout', async ({ page }) => {
    await page.goto('/visualizer');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('AlgoFlow Visualizer')).toBeVisible();
  });

  test('navigate to /examples page shows examples', async ({ page }) => {
    await page.goto('/examples');
    await expect(page.locator('h1')).toContainText('Examples');
    await expect(page.getByText('Bubble Sort')).toBeVisible();
    await expect(page.getByText('Binary Search')).toBeVisible();
  });

  test('TimelineControls buttons are visible on visualizer page', async ({ page }) => {
    await page.goto('/visualizer');
    await expect(page.getByRole('button', { name: /Play|Pause/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Restart/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Step forward/i })).toBeVisible();
  });
});
