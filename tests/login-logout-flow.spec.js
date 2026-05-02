import { expect, test } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage.js';
import { LoginPage } from './pages/LoginPage.js';

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'Password123!';

test.describe('FinBank login to logout flow @regression', () => {
  test('authenticates demo user, displays dashboard, and logs out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // -- Step 1: Log in with documented demo credentials --
    await loginPage.goto();
    await expect(loginPage.title).toHaveText('Sign in to your account');
    await expect(loginPage.form).toBeVisible();

    await loginPage.login(DEMO_USERNAME, DEMO_PASSWORD);

    // -- Step 2: Verify authenticated dashboard financial overview --
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(dashboardPage.title).toHaveText('Welcome back, Jordan');
    await expect(dashboardPage.userName).toHaveText('Jordan Reyes');
    await expect(dashboardPage.totalAssets).toHaveText(/\$[\d,]+\.\d{2}/);
    await expect(dashboardPage.accountsSummary).toContainText('Your Accounts');
    await expect(dashboardPage.checkingAccountCard).toContainText('Everyday Checking');
    await expect(dashboardPage.savingsAccountCard).toContainText('High-Yield Savings');
    await expect(dashboardPage.creditCardAccountCard).toContainText('Platinum Rewards Card');
    await expect(dashboardPage.recentTransactions).toBeVisible();
    await expect(dashboardPage.recentTransactions).toContainText('DateDescriptionCategoryAmount');

    // -- Step 3: Log out and verify unauthenticated login state --
    await dashboardPage.logout();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.title).toHaveText('Sign in to your account');
    await expect(loginPage.form).toBeVisible();
    await expect(dashboardPage.title).toHaveCount(0);
  });
});
