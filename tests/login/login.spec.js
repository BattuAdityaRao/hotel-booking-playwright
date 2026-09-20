import { test, expect } from '../../fixtures/testFixtures';

// Run login tests unauthenticated without inheriting any storageState
test.use({ storageState: { cookies: [], origins: [] } });

const VALID_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const VALID_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

test.describe('Admin Login', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.loginButton).toBeVisible({ timeout: 10000 });
  });

  test('should log in successfully with valid admin credentials', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    // Assert successful login navigation and meaningful UI elements
    await expect(page).toHaveURL(/\/admin\/rooms/);
    await expect(loginPage.logoutButton).toBeVisible();
    await expect(loginPage.roomsHeader).toBeVisible();
    await expect(page.locator('[data-testid="roomlisting"]').first()).toBeVisible();
  });

  test('should display error message with invalid username', async ({ page, loginPage }) => {
    await loginPage.login('invalidUser123', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should display error message with invalid password', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USERNAME, 'wrongPassword123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should display error message when both credentials are invalid', async ({ page, loginPage }) => {
    await loginPage.login('invalidUser123', 'wrongPassword123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should display error message when username is empty', async ({ page, loginPage }) => {
    await loginPage.login('', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should display error message when password is empty', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USERNAME, '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should display error message when both fields are empty', async ({ page, loginPage }) => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should log out successfully and redirect to front page', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/\/admin\/rooms/, { timeout: 10000 });
    await expect(loginPage.logoutButton).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="roomlisting"]').first()).toBeVisible();

    await loginPage.logout();

    await expect(page).toHaveURL(/https?:\/\/[^\/]+\/?$/, { timeout: 15000 });
    await expect(loginPage.adminLink).toBeVisible({ timeout: 10000 });
  });

  test('should invalidate session after logout', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/\/admin\/rooms/, { timeout: 10000 });
    await expect(loginPage.logoutButton).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="roomlisting"]').first()).toBeVisible();

    await loginPage.logout();
    await expect(page).toHaveURL(/https?:\/\/[^\/]+\/?$/, { timeout: 15000 });

    // Attempt to access admin dashboard directly after logout
    await loginPage.navigate();
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.loginButton).toBeVisible({ timeout: 10000 });

    // Attempt to access /admin/rooms directly after logout
    await page.goto('/admin/rooms');
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 });
  });
});
