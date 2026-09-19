export class LoginPage {
  constructor(page) {
    this.page = page;

    this.adminLink = page.getByText('Admin', { exact: true });

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
  }

  async navigate() {
    await this.page.goto('/admin');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}