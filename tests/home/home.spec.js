import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page Tests', () => {
  test('should load home page successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
  });
});
