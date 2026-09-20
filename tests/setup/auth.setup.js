import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Missing required environment variables: ADMIN_USERNAME and/or ADMIN_PASSWORD. Please set them in your .env file or environment.'
    );
  }

  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  await expect(loginPage.usernameInput).toBeVisible();

  await loginPage.login(username, password);

  // Confirm that login actually opened the admin page
  await expect(page).toHaveURL(/\/admin/);

  await page.context().storageState({ path: authFile });
});