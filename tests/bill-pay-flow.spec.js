import { expect, test } from '@playwright/test';
import { BillPayPage } from './pages/BillPayPage.js';
import { LoginPage } from './pages/LoginPage.js';

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'Password123!';

async function loginAndOpenBillPay(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(DEMO_USERNAME, DEMO_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByTestId('nav-billpay').click();
  await expect(page).toHaveURL(/\/bill-pay$/);

  return new BillPayPage(page);
}

test.describe('FinBank bill pay flow', () => {
  test('schedules a payment to a saved payee', async ({ page }) => {
    const billPayPage = await loginAndOpenBillPay(page);

    // -- Step 1: Verify saved payee bill pay page --
    await expect(billPayPage.title).toHaveText('Bill Pay');
    await expect(billPayPage.savedPayeesHeading).toBeVisible();
    await expect(billPayPage.payeesList).toContainText('ConEd Electric');
    await expect(billPayPage.payeesList).toContainText('City Water Dept.');
    await expect(billPayPage.payeesList).toContainText('Verizon Wireless');
    await expect(billPayPage.form).toContainText('Make a Payment');

    // -- Step 2: Select saved payee and funding account --
    await billPayPage.selectPayee('Verizon Wireless');
    await expect(billPayPage.payeeSelect).toContainText('Verizon Wireless');

    await billPayPage.selectFromAccount('High-Yield Savings');
    await expect(billPayPage.fromAccountSelect).toContainText('High-Yield Savings');

    // -- Step 3: Submit payment and verify confirmation --
    await billPayPage.schedulePayment('125.50');

    await expect(billPayPage.toastStatus).toContainText(/Confirmation BP\d+/);
    await expect(billPayPage.paymentStatus).toBeVisible();
    await expect(billPayPage.form).toContainText(/BP\d+/);
  });
});
