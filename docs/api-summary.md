# FinBank API/Network Summary

Source: Playwright inspection against `https://finbank-qa.lovable.app/` on 2026-05-02.

## Current API Status

FinBank now exposes documented Supabase Edge Function APIs from the authenticated `/api-docs` page.

Base URL observed:

```text
https://uatmbflddljtyqbyxzvc.supabase.co/functions/v1
```

The app bundle contains the public Supabase anon key used by the API docs. The automated API tests currently discover the base URL and anon key from the hosted app bundle instead of committing the key directly.

## Documented Endpoints

| Method | Endpoint | Purpose | Verified |
| --- | --- | --- | --- |
| GET | `/accounts` | Return checking, savings, and credit card accounts | Yes |
| GET | `/transactions` | Return transaction history; supports `accountId` and `limit` filters | Yes |
| POST | `/transfers` | Move money between accounts | Yes |
| GET | `/statements` | Return monthly statement metadata; supports `accountId` filter | Yes |
| POST | `/billpayments` | Create a bill payment to a saved payee | Yes |

## Verified Behavior

The executable API coverage lives in `tests/api-contract.spec.js`.

Verified responses:

- `GET /accounts` returns `200` with 3 accounts.
- `GET /transactions` returns `200` with transaction history.
- `GET /transactions?accountId=acc-chk-001&limit=2` returns `200` with 2 checking transactions.
- `GET /statements` returns `200` with 6 statements.
- `GET /statements?accountId=acc-chk-001` returns `200` with checking statements.
- `POST /transfers` returns `200` for a valid transfer.
- `POST /transfers` returns `400` for invalid amount.
- `POST /transfers` returns `400` for same source and destination account.
- `POST /billpayments` returns `200` for a valid bill payment.
- `POST /billpayments` returns `404` for an unknown payee.

## UI Network Behavior

Authenticated UI navigation still does not appear to rely on these business APIs for every rendered page. During browser navigation, the app continues to emit Lovable analytics traffic such as:

```text
POST https://finbank-qa.lovable.app/~api/analytics
```

The existence of callable business APIs should therefore be treated separately from whether each UI page fetches data live during navigation.

## Route Behavior Observed

| Action | Result |
| --- | --- |
| Login | `/login` -> `/dashboard` |
| Click Dashboard | Routed to `/dashboard` |
| Click Accounts | Routed to `/accounts` |
| Click Transfer | Routed to `/transfer` |
| Click Transactions | Routed to `/transactions` |
| Click Bill Pay | Routed to `/bill-pay` |
| Click Statements | Routed to `/statements` |
| Click Investments | Routed to `/investments` |
| Click API Docs | Routed to `/api-docs` |
| Click QA Lab | Routed to `/qa-lab` |

Direct authenticated URLs may redirect depending on current session state, so route guard behavior should be tested explicitly instead of inferred from navigation checks.

## Testing Implications

- API tests are no longer aspirational; `tests/api-contract.spec.js` is executable coverage.
- API write tests mutate shared demo state by creating transfers and bill payments. These should be isolated from build smoke tests if a deterministic reset mechanism is not available.
- UI assertions should avoid fixed balances, exact transaction totals, and fixed recent transaction rows because API-created records change visible data.
- CI regression should prefer non-destructive smoke coverage plus read-only API contract checks. Mutation tests can run manually, on schedule, or against resettable test data.
