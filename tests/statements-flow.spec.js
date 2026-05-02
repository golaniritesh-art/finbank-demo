import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { StatementsPage } from './pages/StatementsPage.js';

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'Password123!';

async function loginAndOpenStatements(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO_USERNAME, DEMO_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByTestId('nav-statements').click();
  await expect(page).toHaveURL(/\/statements$/);

  const statementsPage = new StatementsPage(page);
  await statementsPage.waitForLoaded();
  return statementsPage;
}

test.describe('FinBank statements flow @regression', () => {
  test('shows available monthly statements with download actions', async ({ page }) => {
    const statementsPage = await loginAndOpenStatements(page);

    // -- Step 1: Verify Statements page and table structure --
    await expect(statementsPage.title).toHaveText('Statements');
    await expect(statementsPage.table).toContainText('Period');
    await expect(statementsPage.table).toContainText('Account');
    await expect(statementsPage.table).toContainText('Issued');
    await expect(statementsPage.table).toContainText('Size');
    await expect(statementsPage.table).toContainText('Action');

    // -- Step 2: Verify representative statement metadata --
    const checkingAprilStatement = statementsPage.statementRow('Everyday Checking', 'April 2026');
    await expect(checkingAprilStatement).toContainText('2026-05-01');
    await expect(checkingAprilStatement).toContainText('182 KB');

    const savingsMarchStatement = statementsPage.statementRow('High-Yield Savings', 'March 2026');
    await expect(savingsMarchStatement).toContainText('2026-04-01');
    await expect(savingsMarchStatement).toContainText('92 KB');

    // -- Step 3: Verify each available statement exposes a download action --
    await expect(statementsPage.table.getByRole('button', { name: 'Download' })).toHaveCount(6);
    await expect(statementsPage.downloadButton('stm-2026-04')).toBeEnabled();
  });

  test('keeps user on statements page after selecting a download action', async ({ page }) => {
    const statementsPage = await loginAndOpenStatements(page);

    // -- Step 1: Select a statement download action --
    await statementsPage.downloadButton('stm-2026-04').click();

    // -- Step 2: Verify the user remains on the Statements page without an error state --
    await expect(page).toHaveURL(/\/statements$/);
    await expect(statementsPage.title).toHaveText('Statements');
    await expect(statementsPage.table).toContainText('Everyday Checking');
    await expect(page.getByText(/error|failed/i)).toHaveCount(0);
  });
});
