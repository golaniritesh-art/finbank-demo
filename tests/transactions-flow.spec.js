import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { TransactionsPage } from './pages/TransactionsPage.js';

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'Password123!';

async function loginAndOpenTransactions(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO_USERNAME, DEMO_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByTestId('nav-transactions').click();
  await expect(page).toHaveURL(/\/transactions$/);

  return new TransactionsPage(page);
}

test.describe('FinBank transactions flow @regression', () => {
  test('searches and filters account activity', async ({ page }) => {
    const transactionsPage = await loginAndOpenTransactions(page);

    // -- Step 1: Verify initial transaction history --
    await expect(transactionsPage.title).toHaveText('Transactions');
    await expect(transactionsPage.searchInput).toBeVisible();
    await expect(transactionsPage.table).toContainText('Whole Foods Market');
    await expect(transactionsPage.count).toHaveText(/\d+/);
    expect(Number(await transactionsPage.count.textContent())).toBeGreaterThanOrEqual(12);

    // -- Step 2: Search by transaction description --
    await transactionsPage.search('Payroll');

    await expect(transactionsPage.count).toHaveText('1');
    await expect(transactionsPage.table).toContainText('Payroll Deposit');
    await expect(transactionsPage.table).toContainText('Income');
    await expect(transactionsPage.table).not.toContainText('Whole Foods Market');

    // -- Step 3: Verify no-results state for unmatched search --
    await transactionsPage.search('NoSuchTransactionXYZ');

    await expect(transactionsPage.count).toHaveText('0');
    await expect(transactionsPage.table).toContainText('No transactions match your filters.');

    // -- Step 4: Clear search and filter by type, status, and category --
    await transactionsPage.search('');
    await transactionsPage.selectFilter(transactionsPage.typeFilter, 'Credit');

    await expect(transactionsPage.typeFilter).toContainText('Credit');
    await expect(transactionsPage.table).toContainText('Payroll Deposit');
    await expect(transactionsPage.table).toContainText('Interest Earned');

    await transactionsPage.selectFilter(transactionsPage.statusFilter, 'Posted');

    await expect(transactionsPage.statusFilter).toContainText('Posted');
    await expect(transactionsPage.table).toContainText('Posted');

    await transactionsPage.selectFilter(transactionsPage.categoryFilter, 'Income');

    await expect(transactionsPage.categoryFilter).toContainText('Income');
    await expect(transactionsPage.count).toHaveText('1');
    await expect(transactionsPage.table).toContainText('Payroll Deposit');
  });
});
