export class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('transactions-title');
    this.searchInput = page.getByTestId('transactions-search');
    this.typeFilter = page.getByTestId('filter-type');
    this.statusFilter = page.getByTestId('filter-status');
    this.categoryFilter = page.getByTestId('filter-category');
    this.table = page.getByTestId('transactions-table');
    this.count = page.getByTestId('transactions-count');
  }

  async selectFilter(filter, optionName) {
    await filter.click();
    await this.page.getByRole('option', { name: optionName }).click();
  }

  async search(query) {
    await this.searchInput.fill(query);
  }
}
