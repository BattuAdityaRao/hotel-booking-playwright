import { test, expect } from '@playwright/test';
test.describe('Regression Suite', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hotel-logoUrl')).toBeVisible();
  });
  test('should display rooms', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.room')).toBeVisible();
  });
  test('should submit contact form', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="ContactName"]').fill('Test User');
    await page.locator('[data-testid="ContactEmail"]').fill('test@example.com');
    await page.locator('[data-testid="ContactPhone"]').fill('1234567890');
    await page.locator('[data-testid="ContactSubject"]').fill('Query');
    await page.locator('[data-testid="ContactDescription"]').fill('Test message');
    await page.locator('#submitContact').click();
    await expect(page.locator('.contact h2')).toContainText('Thanks for getting in touch');
  });
  test('should check room availability', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="checkin"]').fill('2026-12-01');
    await page.locator('input[name="checkout"]').fill('2026-12-05');
    await page.locator('.openBooking').first().click();
    await expect(page.locator('.book-room')).toBeVisible();
  });
});