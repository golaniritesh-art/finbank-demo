# Statements Download UX

Source: Live inspection of `https://finbank-qa.lovable.app/statements` on 2026-05-02.

## Entry Point

1. Open `https://finbank-qa.lovable.app/login`.
2. Sign in with the demo credentials:
   - Username: `demo.user`
   - Password: `Password123!`
3. Select **Statements** from the authenticated top navigation.
4. The browser routes to `/statements`.

## Page Layout

The page title is **Statements** with supporting copy:

```text
Download monthly statements for any of your accounts.
```

The main content is a statements table with columns:

| Column | Purpose |
| --- | --- |
| Period | Statement month and year, for example `April 2026` |
| Account | Account name, for example `Everyday Checking` |
| Issued | Statement issue date |
| Size | Displayed PDF size |
| Action | Row-level `Download` button |

## Current Statement Rows

The live table currently shows six available statements:

| Period | Account | Issued | Size | Download Test ID |
| --- | --- | --- | --- | --- |
| April 2026 | Platinum Rewards Card | 2026-05-02 | 210 KB | `download-statement-stm-2026-04-c` |
| April 2026 | Everyday Checking | 2026-05-01 | 182 KB | `download-statement-stm-2026-04` |
| April 2026 | High-Yield Savings | 2026-05-01 | 98 KB | `download-statement-stm-2026-04-s` |
| March 2026 | Everyday Checking | 2026-04-01 | 176 KB | `download-statement-stm-2026-03` |
| March 2026 | High-Yield Savings | 2026-04-01 | 92 KB | `download-statement-stm-2026-03-s` |
| February 2026 | Everyday Checking | 2026-03-01 | 164 KB | `download-statement-stm-2026-02` |

## Download Behavior

Each row has an enabled **Download** button. In headless Chromium verification, clicking the `Everyday Checking / April 2026` button did not emit a Playwright `download` event and did not navigate away from `/statements`.

Current E2E coverage should therefore verify:

- the Statements page loads after login,
- the table renders available monthly statements,
- each rendered statement exposes an enabled `Download` action,
- clicking a statement `Download` action keeps the user on the Statements page without an error state.

If the app later implements a real browser download, update the E2E test to wait for `page.waitForEvent('download')` and assert the suggested filename.
