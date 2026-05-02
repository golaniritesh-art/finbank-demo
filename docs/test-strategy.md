# FinBank Test Strategy

Source inputs:
- `docs/test-scenarios.md`
- `docs/api-summary.md`
- `.codex/skills/finbank-domain/SKILL.md`
- `.codex/skills/playwright-best-practices/SKILL.md`
- `tests/api-contract.spec.js`
- `tests/login-logout-flow.spec.js`
- `tests/bill-pay-flow.spec.js`
- `tests/transactions-flow.spec.js`
- `tests/pages/*.js`

Scope note: this workspace is a Playwright test suite against the hosted app at `https://finbank-qa.lovable.app/`. It does not include backend or frontend source code, so unit and component tests are still not possible from this repo. API tests are now possible because the hosted app documents callable Supabase Edge Function endpoints.

## Distribution

| Layer | Current Count | Target Count | Focus | Target Runtime |
| --- | ---: | ---: | --- | --- |
| Unit | 0 | 6 | Amount parsing, balance integrity, same-account prevention, transaction filters, statement availability, payment reference formatting | < 1s |
| API/Integration | 7 tests | 8-10 tests | Accounts, transactions, statements, transfer validation, bill payment validation, auth/route protection if exposed | 10-30s |
| Component | 0 | 8 | Login form, dashboard summary, transactions table/filter states, bill pay form, route guard UI, loading/empty states | 10-20s |
| E2E | 7 tests | 6-8 tests | Critical hosted-app journeys, route behavior, browser session behavior, smoke checks across major banking workflows | 2-5m |

The suite has started to move from pure E2E into API coverage. Destructive tests are tagged separately from build regression, and route/session guard coverage has been added for the highest-risk access-control paths.

## Current API Coverage

| Spec | Covered Scenarios | Source References | Notes |
| --- | --- | --- | --- |
| `tests/api-contract.spec.js` | TC-003 partial, TC-004 API partial, TC-007 partial, TC-302, TC-400, bill payment validation | `docs/api-summary.md` | Regression tests verify read-only contracts and validation failures. Mutation tests verify transfer and bill-payment creation separately. |

## Current E2E Coverage

| Spec | Covered Scenarios | Source References | Notes |
| --- | --- | --- | --- |
| `tests/login-logout-flow.spec.js` | TC-001, TC-002, TC-009 | `LoginPage.js`, `DashboardPage.js` | Verifies demo login, dashboard shell, account cards, recent transaction table presence, and logout. Assertions are intentionally tolerant of mutable balances and recent transaction data. |
| `tests/bill-pay-flow.spec.js` | TC-006, TC-102 | `BillPayPage.js` | Verifies saved payees, account selection, the Make a Payment form, Pay action, toast/status confirmation, and generated payment/confirmation reference. Mutates demo data. |
| `tests/route-guards.spec.js` | TC-200, TC-201, TC-202 | `LoginPage.js`, `DashboardPage.js` | Verifies anonymous users cannot access dashboard, transfer, or bill pay, and browser back does not restore authenticated content after logout. |
| `tests/statements-flow.spec.js` | TC-007 | `StatementsPage.js`, `docs/statements-ux.md` | Verifies the live Statements table and row-level Download actions. The current app does not emit a browser download event in headless Chromium. |
| `tests/transactions-flow.spec.js` | TC-005, TC-304, TC-402 partial | `TransactionsPage.js` | Verifies search, no-results state, type/status/category filters, and visible count behavior. Initial total is tolerant because API-created records change history. |

## Recommended Regression Split

| Suite | Command | Include | Exclude |
| --- | --- | --- | --- |
| Build regression | `npm run test:regression` | Tests tagged `@regression`: login/logout smoke, route guards, transactions search/filter, read-only API checks, API validation failures | Tests tagged `@mutation` |
| API contract | `npm run test:api` | All API contract tests, including mutation tests | Browser-only E2E specs |
| Mutation smoke | `npm run test:mutation` | Tests tagged `@mutation`: API transfer creation, API bill-payment creation, UI bill-payment creation | Pull-request gating unless data isolation exists |

`test:regression` uses `--grep @regression --grep-invert @mutation`, so CI build regression does not create transfers or bill payments.

## Layer Assignments

| ID | Scenario | Recommended Layer | Current Executable Layer | Rationale |
| --- | --- | --- | --- | --- |
| TC-001 | Login With Demo Credentials | E2E | E2E | Login gates every user journey and is browser-observable. |
| TC-002 | View Dashboard After Login | E2E smoke + Component later | E2E | Keep as smoke; detailed rendering belongs in component tests when source exists. |
| TC-003 | View Account Details And Transaction History | API + E2E smoke | API partial | Account and transaction data contracts are now covered by `/accounts` and `/transactions`; UI accounts page smoke is still missing. |
| TC-004 | Transfer Funds From Checking To Savings | API + one E2E smoke | API partial | API verifies transfer creation shape and validation, but does not fully assert balance integrity. UI transfer happy path is still missing. |
| TC-005 | Search And Filter Transactions | E2E now; API/Component later | E2E + API partial | UI filtering is covered; API account/limit filtering is covered. |
| TC-006 | Pay A Saved Payee | E2E + API | E2E + API partial | UI and API happy paths are covered in the mutation suite. Unknown payee API rejection is covered in regression. |
| TC-007 | Download Monthly Statement | E2E + API | E2E partial + API partial | Statement listing/filtering is covered by API. E2E verifies available statement rows and enabled Download actions, but the current app does not emit a browser download event. |
| TC-008 | View Investments And Market News | E2E smoke; API/Component later | Not covered | Needs a lightweight rendered-page smoke unless market/news API is documented. |
| TC-009 | Logout From FinBank | E2E | E2E | Browser session/navigation behavior is the user-visible contract. |
| TC-100 | Dashboard Quick Links Route To Correct Features | E2E | Not covered | High-value low-cost navigation regression. |
| TC-101 | Transfer Is Limited To FinBank Accounts | API + Component/E2E smoke | API partial | Account existence validation is covered indirectly; UI option list still missing. |
| TC-102 | Bill Pay Uses Saved Payees | E2E + API | E2E + API partial | Saved payee UI is covered; unknown payee API rejection is covered. |
| TC-103 | Statement Download Requires Account And Month Selection | Component/API + one E2E smoke | Not covered | Required-field matrix should not be broad E2E. |
| TC-200 | Anonymous User Cannot Access Dashboard | E2E | E2E | Covered by `tests/route-guards.spec.js`. |
| TC-201 | Anonymous User Cannot Access Money Movement Pages | E2E | E2E | Transfer and Bill Pay anonymous access are covered by `tests/route-guards.spec.js`. |
| TC-202 | Logged Out User Cannot Return To Authenticated Pages With Browser Back | E2E | E2E | Browser back after logout is covered by `tests/route-guards.spec.js`. |
| TC-300 | Login Fails With Invalid Credentials | E2E smoke; API later if auth endpoint exists | Not covered | One invalid-login smoke is enough at this layer. |
| TC-301 | Transfer Cannot Be Submitted With Missing Required Fields | API/Component | Not covered | Required-field validation belongs below browser matrix. |
| TC-302 | Transfer Cannot Be Submitted With Invalid Amount | API + optional UI smoke | API | Invalid amount is covered by `/transfers`. |
| TC-303 | Bill Pay Cannot Be Submitted With Missing Payee Or Amount | API/Component | API partial | Unknown payee is covered; missing/invalid amount is still missing. |
| TC-304 | Transactions Search Shows No Results For Unmatched Query | E2E + Component later | E2E | Covered through the deployed UI. |
| TC-400 | Transfer Handles Same Source And Destination Account | API + Component later | API | Same-account rejection is covered by `/transfers`. |
| TC-401 | Transfer Handles Amount Greater Than Available Balance | API | Not covered | Balance integrity needs deterministic state or a non-mutating validation endpoint. |
| TC-402 | Transactions Filters Can Be Cleared | E2E + Component later | Partial E2E | Search clearing is covered; explicit clear-all control is not. |
| TC-403 | Statements Handles Month With No Available Statement | API/Component | Not covered | Needs controllable data or documented API behavior. |
| TC-500 | Login Page Displays Demo Credential Guidance | Component + UI smoke | Partial E2E | Form shell is checked; explicit demo credential guidance is not asserted. |
| TC-501 | Dashboard Shows Loading Then Financial Overview | Component + E2E smoke | Partial E2E | Final state is checked; controlled loading belongs in component tests. |
| TC-502 | Account Page Handles Empty Transaction History | API/Component | Not covered | Needs controllable empty data. |
| TC-503 | Investments Page Handles Market News Loading Or Empty State | API/Component | Not covered | Needs controllable news/loading data or lightweight page smoke. |

## Anti-Patterns And Risks

- Mutation tests still create transfer and bill-payment records in shared hosted data. Keep them out of pull-request gating unless resettable test data becomes available.
- API config discovery scrapes the SPA bundle. This avoids committing the anon key, but CI would be more stable with `FINBANK_API_BASE_URL` and `FINBANK_SUPABASE_ANON_KEY` secrets.
- UI data assertions are now intentionally weaker because shared data is mutable. Data correctness should be asserted at API level or with resettable fixtures.
- Most scenario backlog items were originally marked E2E. Implementing all of them as browser tests would create an ice-cream-cone suite.

## Implementation Order

1. Add navigation/quick-action E2E coverage for TC-100.
2. Add missing API validation for bill payment amount/date and insufficient funds if the API supports deterministic results.
3. Add read-only API checks for auth/session behavior if endpoints become documented.
4. Add read-only API checks for auth/session behavior if endpoints become documented.
5. Add transfer UI happy-path smoke only if data reset or low-impact test data is available.
6. Upgrade TC-007 to assert `page.waitForEvent('download')` if the app implements a real browser download.
7. Move API base URL and anon key discovery to CI secrets if the project can provide stable values.
8. When frontend/backend source is available, add unit and component tests for business rules, validation, loading states, and empty states.
