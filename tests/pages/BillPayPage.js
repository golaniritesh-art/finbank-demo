export class BillPayPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('billpay-title');
    this.savedPayeesHeading = page.getByText('Saved Payees', { exact: true });
    this.payeesList = page.getByTestId('payees-list');
    this.form = page.getByTestId('billpay-form');
    this.payeeSelect = page.getByTestId('payee-select');
    this.fromAccountSelect = page.getByTestId('billpay-from-account');
    this.amountInput = page.getByTestId('billpay-amount');
    this.submitButton = page.getByTestId('billpay-submit');
    this.paymentStatus = this.form.getByText('Payment scheduled');
    this.toastStatus = page
      .getByRole('region', { name: 'Notifications (F8)' })
      .getByRole('status')
      .filter({ hasText: 'Payment scheduled' });
  }

  async selectPayee(payeeName) {
    await this.payeeSelect.click();
    await this.page.getByRole('option', { name: payeeName }).click();
  }

  async selectFromAccount(accountName) {
    await this.fromAccountSelect.click();
    await this.page.getByRole('option', { name: new RegExp(accountName) }).click();
  }

  async schedulePayment(amount) {
    await this.amountInput.fill(amount);
    await this.submitButton.click();
  }
}
