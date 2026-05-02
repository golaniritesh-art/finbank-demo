import { expect, test } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage.js';
import { LoginPage } from './pages/LoginPage.js';

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'Password123!';

test.describe('FinBank route guards @regression', () => {
  test('blocks anonymous access to authenticated pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const protectedRoutes = ['/dashboard', '/transfer', '/bill-pay'];

    for (const route of protectedRoutes) {
      // -- Step 1: Open a protected route without logging in --
      await page.goto(route);

      // -- Step 2: Verify the user is kept in unauthenticated state --
      await expect(loginPage.title).toHaveText('Sign in to your account');
      await expect(loginPage.form).toBeVisible();
      await expect(page.getByTestId('logout-button')).toHaveCount(0);
    }
  });

  test('prevents browser back access after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // -- Step 1: Log in and verify authenticated dashboard --
    await loginPage.goto();
    await loginPage.login(DEMO_USERNAME, DEMO_PASSWORD);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(dashboardPage.title).toHaveText('Welcome back, Jordan');

    // -- Step 2: Log out --
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.form).toBeVisible();

    // -- Step 3: Browser back should not restore authenticated content --
    await page.goBack();
    await expect(loginPage.form).toBeVisible();
    await expect(dashboardPage.title).toHaveCount(0);
    await expect(page.getByTestId('logout-button')).toHaveCount(0);
  });
});
