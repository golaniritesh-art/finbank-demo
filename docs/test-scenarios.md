# FinBank End-to-End Flow Test Scenarios

### TC-001: Login With Demo Credentials
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is on the FinBank login page and demo credentials are visible on the page.
**Steps**:
1. Open `https://finbank-qa.lovable.app/`.
2. Enter the demo email shown on the login page.
3. Enter the demo password shown on the login page.
4. Select the Sign In button.
**Expected Results**: User is authenticated and redirected to the dashboard.
**Business Rule**: Demo credentials are provided on the login page for testing purposes.
**Suggested Layer**: E2E

### TC-002: View Dashboard After Login
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is logged in successfully.
**Steps**:
1. Complete login with valid demo credentials.
2. Wait for the dashboard to load.
3. Review the displayed account balances.
4. Review recent transactions.
5. Review quick links for transfer, bill pay, investments, and statements.
**Expected Results**: Dashboard shows financial overview, recent transactions, and quick links to common actions.
**Business Rule**: After successful login, users are directed to the dashboard with account balances, recent transactions, and quick links.
**Suggested Layer**: E2E

### TC-003: View Account Details And Transaction History
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is logged in and at least one account exists.
**Steps**:
1. Navigate to the Accounts page.
2. Select an account.
3. Review account balance.
4. Review transaction history for the selected account.
**Expected Results**: Account details display balance and transaction history for the selected account.
**Business Rule**: Users can view detailed account information, including balance and transaction history.
**Suggested Layer**: E2E

### TC-004: Transfer Funds From Checking To Savings
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is logged in and has checking and savings accounts with sufficient checking balance.
**Steps**:
1. Navigate to the Transfer page.
2. Select checking as the source account.
3. Select savings as the destination account.
4. Enter a valid transfer amount.
5. Submit the transfer.
6. Confirm the transfer if a confirmation step is shown.
7. Return to account or dashboard balances.
**Expected Results**: Transfer completes successfully and balances reflect the movement from checking to savings.
**Business Rule**: Users can move money between their FinBank accounts instantly.
**Suggested Layer**: E2E

### TC-005: Search And Filter Transactions
**Category**: Happy Path
**Priority**: P1
**Preconditions**: User is logged in and transaction history exists.
**Steps**:
1. Navigate to the Transactions page.
2. Enter a search term matching an existing transaction.
3. Apply an available filter.
4. Review the filtered transaction list.
**Expected Results**: Transaction list updates to show only matching account activity.
**Business Rule**: Users can search and filter account activity.
**Suggested Layer**: E2E

### TC-006: Pay A Saved Payee
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is logged in and has at least one saved payee.
**Steps**:
1. Navigate to Bill Pay.
2. Select a saved payee.
3. Enter a valid payment amount.
4. Submit the bill payment.
5. Confirm the payment if a confirmation step is shown.
**Expected Results**: Bill payment completes for the selected saved payee.
**Business Rule**: Users can pay saved payees in seconds.
**Suggested Layer**: E2E

### TC-007: Download Monthly Statement
**Category**: Happy Path
**Priority**: P1
**Preconditions**: User is logged in and monthly statements are available for an account.
**Steps**:
1. Navigate to Statements.
2. Select an account.
3. Select an available month.
4. Download the statement.
**Expected Results**: Monthly statement download starts for the selected account and month.
**Business Rule**: Users can download monthly statements for any of their accounts.
**Suggested Layer**: E2E

### TC-008: View Investments And Market News
**Category**: Happy Path
**Priority**: P1
**Preconditions**: User is logged in.
**Steps**:
1. Navigate to Finance & Investments.
2. Review portfolio performance.
3. Review holdings.
4. Open or review latest market news.
**Expected Results**: Portfolio performance, holdings, and latest market news are visible.
**Business Rule**: Finance & Investments shows portfolio performance, holdings, and latest market news.
**Suggested Layer**: E2E

### TC-009: Logout From FinBank
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is logged in.
**Steps**:
1. Select the logout control.
2. Wait for the session to end.
3. Observe the resulting page.
**Expected Results**: User is logged out and returned to a non-authenticated page such as login.
**Business Rule**: User journey ends with logout.
**Suggested Layer**: E2E

### TC-100: Dashboard Quick Links Route To Correct Features
**Category**: Business Rule
**Priority**: P1
**Preconditions**: User is logged in and on the dashboard.
**Steps**:
1. Select the transfer quick link.
2. Verify the Transfer page loads.
3. Return to the dashboard.
4. Select the bill pay quick link.
5. Verify Bill Pay loads.
6. Repeat for investments and statements quick links.
**Expected Results**: Each dashboard quick link routes to its documented feature.
**Business Rule**: Dashboard provides quick links to common actions like transferring funds, paying bills, investments, and statements.
**Suggested Layer**: E2E

### TC-101: Transfer Is Limited To FinBank Accounts
**Category**: Business Rule
**Priority**: P0
**Preconditions**: User is logged in and on the Transfer page.
**Steps**:
1. Open the source account selector.
2. Open the destination account selector.
3. Review the listed account options.
**Expected Results**: Source and destination choices only include the user's FinBank accounts.
**Business Rule**: Transfer page moves money between your FinBank accounts.
**Suggested Layer**: E2E

### TC-102: Bill Pay Uses Saved Payees
**Category**: Business Rule
**Priority**: P0
**Preconditions**: User is logged in and on Bill Pay.
**Steps**:
1. Open the payee selection control.
2. Review available payees.
3. Select a saved payee.
4. Continue to payment entry.
**Expected Results**: Bill Pay allows payment only through available saved payees.
**Business Rule**: Users can pay saved payees in seconds.
**Suggested Layer**: E2E

### TC-103: Statement Download Requires Account And Month Selection
**Category**: Business Rule
**Priority**: P1
**Preconditions**: User is logged in and on Statements.
**Steps**:
1. Attempt to download without selecting an account.
2. Select an account but do not select a statement month.
3. Select both account and month.
4. Download the statement.
**Expected Results**: Download is blocked until required account and month selections are made; download succeeds once both are selected.
**Business Rule**: Users can download monthly statements for any of their accounts.
**Suggested Layer**: E2E

### TC-200: Anonymous User Cannot Access Dashboard
**Category**: Security
**Priority**: P0
**Preconditions**: User is not logged in.
**Steps**:
1. Open the dashboard URL directly.
2. Observe routing and page state.
**Expected Results**: User is blocked from dashboard access and redirected to login or shown an authentication requirement.
**Business Rule**: Dashboard is available after successful login.
**Suggested Layer**: E2E

### TC-201: Anonymous User Cannot Access Money Movement Pages
**Category**: Security
**Priority**: P0
**Preconditions**: User is not logged in.
**Steps**:
1. Open the Transfer page URL directly.
2. Observe routing and page state.
3. Open the Bill Pay page URL directly.
4. Observe routing and page state.
**Expected Results**: User cannot access transfer or bill payment capabilities without authentication.
**Business Rule**: User journey starts with login before account, transfer, and bill pay actions.
**Suggested Layer**: E2E

### TC-202: Logged Out User Cannot Return To Authenticated Pages With Browser Back
**Category**: Security
**Priority**: P0
**Preconditions**: User is logged in and has visited dashboard.
**Steps**:
1. Log out.
2. Use browser back navigation.
3. Attempt to interact with any authenticated page content.
**Expected Results**: Authenticated content is not usable after logout; user remains logged out or is returned to login.
**Business Rule**: User journey ends with logout.
**Suggested Layer**: E2E

### TC-300: Login Fails With Invalid Credentials
**Category**: Negative
**Priority**: P0
**Preconditions**: User is on the login page.
**Steps**:
1. Enter an invalid email.
2. Enter an invalid password.
3. Select Sign In.
**Expected Results**: User remains unauthenticated and an error state is shown.
**Business Rule**: Only successful login redirects users to the dashboard.
**Suggested Layer**: E2E

### TC-301: Transfer Cannot Be Submitted With Missing Required Fields
**Category**: Negative
**Priority**: P0
**Preconditions**: User is logged in and on the Transfer page.
**Steps**:
1. Leave source account empty and attempt submit.
2. Select source account but leave destination account empty and attempt submit.
3. Select both accounts but leave amount empty and attempt submit.
**Expected Results**: Transfer is not submitted and required field validation is shown.
**Business Rule**: Transfer requires moving money between selected FinBank accounts.
**Suggested Layer**: E2E

### TC-302: Transfer Cannot Be Submitted With Invalid Amount
**Category**: Negative
**Priority**: P0
**Preconditions**: User is logged in and on the Transfer page.
**Steps**:
1. Select checking as source.
2. Select savings as destination.
3. Enter zero, negative, or non-numeric transfer amount.
4. Attempt to submit.
**Expected Results**: Transfer is rejected and validation explains that the amount is invalid.
**Business Rule**: Transfer moves money instantly between accounts and therefore requires a valid amount.
**Suggested Layer**: E2E

### TC-303: Bill Pay Cannot Be Submitted With Missing Payee Or Amount
**Category**: Negative
**Priority**: P0
**Preconditions**: User is logged in and on Bill Pay.
**Steps**:
1. Attempt payment without selecting a payee.
2. Select a payee but leave amount empty.
3. Attempt payment with zero, negative, or non-numeric amount.
**Expected Results**: Payment is not submitted and validation is shown for missing or invalid fields.
**Business Rule**: Bill Pay pays saved payees and requires payment details.
**Suggested Layer**: E2E

### TC-304: Transactions Search Shows No Results For Unmatched Query
**Category**: Negative
**Priority**: P2
**Preconditions**: User is logged in and on Transactions.
**Steps**:
1. Enter a search term that should not match any transaction.
2. Apply the search.
**Expected Results**: Transaction results are empty and a clear no-results state is shown.
**Business Rule**: Users can search and filter account activity.
**Suggested Layer**: E2E

### TC-400: Transfer Handles Same Source And Destination Account
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User is logged in and on the Transfer page.
**Steps**:
1. Select the same account as source and destination if the UI allows it.
2. Enter a valid amount.
3. Attempt to submit.
**Expected Results**: Transfer is blocked or the same-account option is prevented.
**Business Rule**: Transfer moves money between FinBank accounts.
**Suggested Layer**: E2E

### TC-401: Transfer Handles Amount Greater Than Available Balance
**Category**: Edge Case
**Priority**: P0
**Preconditions**: User is logged in and source account balance is visible or knowable.
**Steps**:
1. Navigate to Transfer.
2. Select checking as source and savings as destination.
3. Enter an amount greater than the source balance.
4. Attempt to submit.
**Expected Results**: Transfer is rejected and account balances remain unchanged.
**Business Rule**: Transfer moves money from one account to another and must preserve account balance integrity.
**Suggested Layer**: E2E

### TC-402: Transactions Filters Can Be Cleared
**Category**: Edge Case
**Priority**: P2
**Preconditions**: User is logged in and on Transactions.
**Steps**:
1. Apply a transaction search term.
2. Apply an available filter.
3. Clear the search and filters.
**Expected Results**: Full transaction activity is restored after filters are cleared.
**Business Rule**: Users can search and filter account activity.
**Suggested Layer**: E2E

### TC-403: Statements Handles Month With No Available Statement
**Category**: Edge Case
**Priority**: P2
**Preconditions**: User is logged in and on Statements.
**Steps**:
1. Select an account.
2. Select or attempt to access a month with no available statement.
3. Attempt to download.
**Expected Results**: Download is unavailable or a clear unavailable statement state is shown.
**Business Rule**: Statements are monthly and account-specific.
**Suggested Layer**: E2E

### TC-500: Login Page Displays Demo Credential Guidance
**Category**: UI State
**Priority**: P1
**Preconditions**: User is not logged in.
**Steps**:
1. Open the login page.
2. Review the email and password input fields.
3. Review the Sign In button.
4. Review the demo credential information on the page.
**Expected Results**: Login form and demo credentials are visible and usable.
**Business Rule**: Login page provides a typical sign-in form and demo credentials.
**Suggested Layer**: E2E

### TC-501: Dashboard Shows Loading Then Financial Overview
**Category**: UI State
**Priority**: P2
**Preconditions**: User has valid demo credentials.
**Steps**:
1. Sign in.
2. Observe dashboard while it loads.
3. Wait for loading to complete.
**Expected Results**: Any loading state resolves into the dashboard financial overview without broken or overlapping UI.
**Business Rule**: Dashboard displays an overview of the user's financial information.
**Suggested Layer**: E2E

### TC-502: Account Page Handles Empty Transaction History
**Category**: UI State
**Priority**: P2
**Preconditions**: User is logged in and an account with no visible transaction history is available, or filters can create an empty history view.
**Steps**:
1. Navigate to Accounts.
2. Select the account or filtered view with no transactions.
3. Review the transaction history area.
**Expected Results**: Page displays account details and a clear empty state for transaction history.
**Business Rule**: Account page shows balance and transaction history.
**Suggested Layer**: E2E

### TC-503: Investments Page Handles Market News Loading Or Empty State
**Category**: UI State
**Priority**: P2
**Preconditions**: User is logged in.
**Steps**:
1. Navigate to Finance & Investments.
2. Observe market news while content loads.
3. Review final news state.
**Expected Results**: Market news either loads successfully or displays a clear empty/unavailable state.
**Business Rule**: Finance & Investments includes latest market news.
**Suggested Layer**: E2E
