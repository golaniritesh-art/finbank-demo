# FinBank Test Strategy

Source inputs:
- `docs/test-scenarios.md`
- `docs/api-summary.md`
- `.codex/skills/finbank-domain/SKILL.md`
- `.codex/skills/finbank-domain/user-flows.md`
- `.codex/skills/finbank-domain/ui-locators.md`
- `.codex/skills/playwright-best-practices/SKILL.md`
- `tests/login-logout-flow.spec.js`
- `tests/bill-pay-flow.spec.js`
- `tests/transactions-flow.spec.js`
- `tests/pages/*.js`

Scope note: this workspace is currently a Playwright test suite against the hosted app at `https://finbank-qa.lovable.app/`. It does not include `backend/src/services`, `backend/src/controllers`, `frontend/app`, `frontend/components`, `finbank-domain/business-rules.md`, or `finbank-domain/api-reference.md`.

Network evidence from `docs/api-summary.md` and `finbank-domain/SKILL.md` shows no observable business API calls for login, dashboard, accounts, transfers, transactions, bill pay, statements, or investments. Current behavior appears to use client-side/static demo data. API, unit, and component layers below are therefore target architecture recommendations for when source modules or real endpoints become available; current executable coverage should remain E2E-focused with network health guards.

## Distribution

| Layer | Current Count | Target Count | Focus | Target Runtime |
| --- | ---: | ---: | --- | --- |
| Unit | 0 | 6 | Amount parsing, balance integrity, same-account prevention, transaction filters, statement availability, payment reference formatting | < 1s |
| API/Integration | 0 | 8 | Auth/session contract, account eligibility, transfers, bill pay, statements, transaction search/filtering, route/session protection | 10-30s |
| Component | 0 | 8 | Login form, dashboard summary, transactions table/filter states, bill pay form, route guard UI, loading/empty states | 10-20s |
| E2E | 3 specs | 6-8 specs | Critical hosted-app journeys, route behavior, browser session behavior, smoke checks across major banking workflows | 2-5m |

Current shape is necessarily top-heavy because only the deployed UI is available. As app source or endpoints are added, push validation, filtering, and business-rule coverage down to create a healthier pyramid.

## Current E2E Coverage

| Spec | Covered Scenarios | Source References | Notes |
| --- | --- | --- | --- |
| `tests/login-logout-flow.spec.js` | TC-001, TC-002, TC-009 | `LoginPage.js`, `DashboardPage.js`, `ui-locators.md` | Verifies demo login, dashboard financial overview, recent transactions, and logout to login. |
| `tests/bill-pay-flow.spec.js` | TC-006, TC-102 | `BillPayPage.js`, `ui-locators.md` | Verifies saved payees, account selection, payment scheduling, toast/status confirmation, and generated `BP` reference. |
| `tests/transactions-flow.spec.js` | TC-005, TC-304, TC-402 | `TransactionsPage.js`, `ui-locators.md` | Verifies search, no-results state, type/status/category filters, and visible count changes. |

Recommended next executable E2E tests:
- TC-200, TC-201, TC-202: route/session guard behavior, including direct authenticated URLs redirecting to `/dashboard` as observed in `docs/api-summary.md`.
- TC-100: dashboard quick-action and top-nav routing across Transfer, Bill Pay, Statements, Transactions, Accounts, Investments, and QA Lab.
- TC-004: one transfer happy path if stable form locators and deterministic balance behavior are confirmed.
- TC-007: statement download wiring if browser download behavior is stable.

## Layer Assignments

| ID | Scenario | Recommended Layer | Current Executable Layer | Source References | Rationale |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Login With Demo Credentials | E2E now; API later if auth endpoint exists | E2E | `LoginPage.js`, `login-logout-flow.spec.js`, `ui-locators.md` | Login gates every flow and is currently only observable through browser state. No auth API was observed. |
| TC-002 | View Dashboard After Login | E2E now; Component later | E2E | `DashboardPage.js`, `login-logout-flow.spec.js` | Primary landing smoke belongs in E2E; detailed card rendering can move to component tests when frontend source exists. |
| TC-003 | View Account Details And Transaction History | E2E smoke now; API/Component later | Not covered | `docs/test-scenarios.md`, `docs/api-summary.md` | Data correctness should be lower-layer when source/endpoints exist; current hosted app can only be verified through route/render behavior. |
| TC-004 | Transfer Funds From Checking To Savings | E2E smoke now; Unit/API later | Not covered | `user-flows.md`, `docs/test-scenarios.md` | Critical money movement needs defense-in-depth: browser happy path plus future unit/API checks for amount and balance rules. |
| TC-005 | Search And Filter Transactions | E2E now; Unit/Component later | E2E | `transactions-flow.spec.js`, `TransactionsPage.js` | Existing E2E is appropriate for hosted app behavior; filter predicate and rendering state should move down when source exists. |
| TC-006 | Pay A Saved Payee | E2E now; API later | E2E | `bill-pay-flow.spec.js`, `BillPayPage.js` | Payment scheduling is a critical user journey. Current confirmation is UI-only; future API should own payment contract. |
| TC-007 | Download Monthly Statement | E2E now; API later | Not covered | `docs/test-scenarios.md` | Browser download must be E2E; statement availability/download authorization should be API-backed when available. |
| TC-008 | View Investments And Market News | E2E smoke now; API/Component later | Not covered | `finbank-domain/SKILL.md` | Current app likely renders static/client data; later split portfolio/news contracts from rendering. |
| TC-009 | Logout From FinBank | E2E now; API later if session endpoint exists | E2E | `login-logout-flow.spec.js`, `DashboardPage.js` | Browser session/navigation behavior is the main observable contract today. |
| TC-100 | Dashboard Quick Links Route To Correct Features | E2E + Component later | Not covered | `ui-locators.md`, `docs/api-summary.md` | Routing is user-visible and route behavior has changed between observations, so executable E2E coverage is valuable. |
| TC-101 | Transfer Is Limited To FinBank Accounts | Component now if possible; API later | Not covered | `docs/test-scenarios.md` | UI can verify option list today; real enforcement belongs server-side when an endpoint exists. |
| TC-102 | Bill Pay Uses Saved Payees | E2E now; Component/API later | E2E | `bill-pay-flow.spec.js`, `BillPayPage.js` | Current coverage verifies saved payees in the hosted UI; future API should enforce payee eligibility. |
| TC-103 | Statement Download Requires Account And Month Selection | Component now if possible; API later | Not covered | `docs/test-scenarios.md` | Required-field behavior is better at component/API layers than full E2E matrix. |
| TC-200 | Anonymous User Cannot Access Dashboard | E2E now; API later | Not covered | `docs/api-summary.md`, `ui-locators.md` | Route guard behavior is browser-observable; server enforcement cannot be tested without an API/backend. |
| TC-201 | Anonymous User Cannot Access Money Movement Pages | E2E now; API later | Not covered | `docs/api-summary.md` | Money movement access control is critical; current test should assert observed redirects for direct URLs. |
| TC-202 | Logged Out User Cannot Return To Authenticated Pages With Browser Back | E2E | Not covered | `docs/test-scenarios.md` | Browser history and session state are inherently end-to-end. |
| TC-300 | Login Fails With Invalid Credentials | E2E smoke now; API/Component later | Not covered | `LoginPage.js` | One hosted-app smoke is enough today; broad invalid credential cases should move to auth API/component tests later. |
| TC-301 | Transfer Cannot Be Submitted With Missing Required Fields | Component now if possible; API later | Not covered | `docs/test-scenarios.md` | Required field validation should not be expanded as an E2E matrix unless no lower layer exists. |
| TC-302 | Transfer Cannot Be Submitted With Invalid Amount | Unit/API/Component later; minimal E2E smoke now | Not covered | `docs/test-scenarios.md` | Amount validation is business logic plus UI messaging; use E2E only for one deployed-app smoke. |
| TC-303 | Bill Pay Cannot Be Submitted With Missing Payee Or Amount | Component/API later; minimal E2E smoke now | Not covered | `BillPayPage.js`, `docs/test-scenarios.md` | Existing bill-pay happy path is enough E2E for now; negative cases belong lower once source exists. |
| TC-304 | Transactions Search Shows No Results For Unmatched Query | E2E now; Component/API later | E2E | `transactions-flow.spec.js`, `TransactionsPage.js` | Covered through deployed UI; lower layers should own empty response and empty-state rendering when available. |
| TC-400 | Transfer Handles Same Source And Destination Account | Unit/API/Component later | Not covered | `docs/test-scenarios.md` | Same-account prevention is rule logic and should be enforced below UI. |
| TC-401 | Transfer Handles Amount Greater Than Available Balance | Unit/API later; optional E2E smoke | Not covered | `docs/test-scenarios.md` | Balance integrity is a core business rule; E2E needs deterministic reset data before it is safe to automate. |
| TC-402 | Transactions Filters Can Be Cleared | E2E now; Unit/Component later | Partial E2E | `transactions-flow.spec.js`, `TransactionsPage.js` | Current test clears search before filtering; add explicit clear-all if the UI exposes it. Filter state reset belongs lower later. |
| TC-403 | Statements Handles Month With No Available Statement | API/Component later; optional E2E smoke | Not covered | `docs/test-scenarios.md` | Availability is data-contract behavior; UI empty/unavailable state can be component-tested. |
| TC-500 | Login Page Displays Demo Credential Guidance | Component later; E2E smoke through TC-001 now | Partial E2E | `LoginPage.js`, `ui-locators.md` | Login form is checked in E2E, but static guidance is best as component or lightweight UI smoke. |
| TC-501 | Dashboard Shows Loading Then Financial Overview | Component later; optional E2E smoke | Partial E2E | `DashboardPage.js` | Current E2E verifies final state; controlled loading belongs in component tests. |
| TC-502 | Account Page Handles Empty Transaction History | Component/API later | Not covered | `docs/test-scenarios.md` | Empty data response and empty state should be separated once lower layers exist. |
| TC-503 | Investments Page Handles Market News Loading Or Empty State | Component/API later | Not covered | `docs/test-scenarios.md` | Loading/unavailable news states are best controlled in component/integration tests. |

## Contested Assignments

TC-003 account details was originally suggested as E2E, but account and transaction correctness should move to API/integration tests once there is a real account/transaction contract. Until then, only route/render smoke coverage is practical.

TC-300 through TC-303 are negative validation scenarios. They are useful, but expanding them as browser tests would overfit the suite to form-state permutations. Keep at most one deployed-app smoke per high-risk area and move the matrix to component/API tests when source exists.

TC-401 insufficient funds is P0, but it should not primarily be E2E. Balance integrity needs deterministic state and server/business-rule enforcement. Add E2E only if the hosted demo exposes stable reset data or non-mutating validation.

API-layer assignments are aspirational for this workspace. `docs/api-summary.md` observed no XHR/fetch/business API traffic during authenticated navigation, so generated tests should not create API specs until endpoint documentation or backend source is added.

## Anti-Patterns Found

Existing test suite:
- No severe Playwright anti-patterns found in the three current specs.
- The specs use `data-testid` locators, page objects, role-based dropdown options, and auto-waiting assertions.
- Exact-value assertions such as `$33,135.79`, `12`, `Whole Foods Market`, and named payees are acceptable for a static demo fixture, but should be softened if the hosted data becomes dynamic.
- `transactions-flow.spec.js` covers several filter behaviors in one test. That is fine for a compact hosted-app smoke, but split it if failures become hard to diagnose.

Scenario backlog:
- Most generated scenarios were marked `Suggested Layer: E2E`. Implementing that literally would create an ice-cream-cone suite.
- Input validation, boundary values, and filtering permutations should move down as soon as source or API contracts are available.
- API error behavior should not be validated mainly through browser flows.

## Implementation Order

1. Keep the three current E2E specs as the hosted-app smoke suite.
2. Add route/session guard E2E coverage for TC-200, TC-201, and TC-202.
3. Add navigation/quick-action E2E coverage for TC-100, using observed routes from `docs/api-summary.md`.
4. Add one transfer happy-path E2E for TC-004 after stable locators and deterministic balance behavior are verified.
5. Add statement download E2E for TC-007 if the browser download is reliable and non-destructive.
6. When source/endpoints are available, add unit tests for amount, balance, filter, and statement-availability rules.
7. When source/endpoints are available, add API/integration tests for auth, accounts, transfers, bill pay, statements, transactions, and route/session protection.
8. When frontend source is available, add component tests for form validation, empty/loading states, and static rendering.
