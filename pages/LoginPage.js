export class LoginPage {
  constructor(page) {
    this.page = page;

    this.adminLink = page.getByText('Admin', { exact: true });

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
    this.errorMessage = page.locator('.alert.alert-danger');
    this.logoutButton = page.locator('button.btn-outline-danger', { hasText: 'Logout' });
    this.navBrand = page.locator('.navbar-brand');
    this.roomsHeader = page.getByRole('link', { name: 'Rooms' });
  }

  async navigate() {
    await this.page.goto('/admin');
  }

  async login(username, password) {
    if (username !== undefined && username !== null && username !== '') {
      await this.usernameInput.fill(username);
    } else {
      await this.usernameInput.clear();
    }

    if (password !== undefined && password !== null && password !== '') {
      await this.passwordInput.fill(password);
    } else {
      await this.passwordInput.clear();
    }

    await this.loginButton.click();
  }

  async logout() {
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }
}