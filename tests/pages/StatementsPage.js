export class StatementsPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('statements-title');
    this.table = page.getByTestId('statements-table');
  }

  async waitForLoaded() {
    await this.table.waitFor({ state: 'visible' });
    await this.page.getByTestId('download-statement-stm-2026-04').waitFor({ state: 'visible' });
  }

  statementRow(accountName, period) {
    return this.table.locator('tbody tr').filter({ hasText: accountName }).filter({ hasText: period });
  }

  downloadButton(statementId) {
    return this.page.getByTestId(`download-statement-${statementId}`);
  }
}
