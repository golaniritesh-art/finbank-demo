export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('dashboard-title');
    this.userName = page.getByTestId('user-name');
    this.totalAssets = page.getByTestId('total-balance-amount');
    this.accountsSummary = page.getByTestId('accounts-summary');
    this.checkingAccountCard = page.getByTestId('account-card-checking');
    this.savingsAccountCard = page.getByTestId('account-card-savings');
    this.creditCardAccountCard = page.getByTestId('account-card-credit-card');
    this.recentTransactions = page.getByTestId('recent-transactions');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async logout() {
    await this.logoutButton.click();
  }
}
