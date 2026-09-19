import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  await expect(loginPage.usernameInput).toBeVisible();

  await loginPage.login(
      process.env.ADMIN_USERNAME || 'admin',
      process.env.ADMIN_PASSWORD || 'password'
  );

  // Confirm that login actually opened the admin page
  await expect(page).toHaveURL(/\/admin/);

  await page.context().storageState({ path: authFile });
});