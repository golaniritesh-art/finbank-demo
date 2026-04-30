# FinBank API/Network Summary

Source: Playwright network monitoring against `https://finbank-qa.lovable.app/` on 2026-04-30.

## Flow Monitored

1. Open `/login`
2. Login with demo credentials:
   - Username: `demo.user`
   - Password: `Password123!`
3. Land on `/dashboard`
4. Click authenticated navigation links:
   - Dashboard
   - Accounts
   - Transfer
   - Transactions
   - Bill Pay
   - Statements
   - Investments
   - QA Lab
5. Directly open authenticated URLs:
   - `/accounts`
   - `/transfer`
   - `/transactions`
   - `/bill-pay`
   - `/statements`
   - `/investments`
   - `/qa-lab`

## API Calls Observed During Authenticated Navigation

No XHR, fetch, `/api`, or `/~api` responses were observed while navigating authenticated pages after login.

The pages appear to be rendered from client-side/static demo data for the monitored flows. Account balances, transactions, transfer UI, bill pay UI, statements UI, investments UI, and QA Lab navigation did not trigger observable API calls in the Playwright network capture.

## Route Behavior Observed

| Action | Result |
| --- | --- |
| Login | `/login` -> `/dashboard` |
| Click Dashboard | Stayed on `/dashboard` |
| Click Accounts | Routed to `/accounts` |
| Click Transfer | Routed to `/transfer` |
| Click Transactions | Routed to `/transactions` |
| Click Bill Pay | Routed to `/bill-pay` |
| Click Statements | Routed to `/statements` |
| Click Investments | Routed to `/investments` |
| Click QA Lab | Routed to `/qa-lab` |
| Direct `/accounts` | Redirected to `/dashboard` |
| Direct `/transfer` | Redirected to `/dashboard` |
| Direct `/transactions` | Redirected to `/dashboard` |
| Direct `/bill-pay` | Redirected to `/dashboard` |
| Direct `/statements` | Redirected to `/dashboard` |
| Direct `/investments` | Redirected to `/dashboard` |
| Direct `/qa-lab` | Redirected to `/dashboard` |

## Testing Implications

- Current FinBank E2E tests should not expect real business API calls for dashboard, accounts, transfer, transactions, bill pay, statements, investments, or QA Lab navigation.
- API tests remain aspirational until endpoint documentation or backend source is available.
- E2E tests can still monitor network health by failing on unexpected `4xx` or `5xx` responses.
- Since clicked navigation works but direct authenticated URLs redirect to `/dashboard`, route behavior should be captured explicitly in E2E tests.
- Business data assertions are likely against static client-side demo data, so exact-value assertions are acceptable only if the demo fixture is intentionally stable.

## Recommended Playwright Network Guard

```js
const failedResponses = [];

page.on('response', response => {
  const url = response.url();
  const isAppRequest = url.includes('finbank-qa.lovable.app');

  if (isAppRequest && response.status() >= 400) {
    failedResponses.push({
      method: response.request().method(),
      url,
      status: response.status(),
    });
  }
});

// After the flow:
expect(failedResponses).toEqual([]);
```
