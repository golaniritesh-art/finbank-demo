export class LoginPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('login-title');
    this.form = page.getByTestId('login-form');
    this.usernameInput = page.getByTestId('username-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-button');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
