import { expect, test } from '@playwright/test';

const APP_ORIGIN = 'https://finbank-qa.lovable.app';
const SUPABASE_ORIGIN_PATTERN = /https:\/\/[a-z0-9]+\.supabase\.co/;
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

async function discoverApiConfig(request) {
  const appResponse = await request.get(`${APP_ORIGIN}/api-docs`);
  expect(appResponse.ok()).toBeTruthy();

  const html = await appResponse.text();
  const scriptPath = html.match(/src="([^"]*\/assets\/index-[^"]+\.js)"/)?.[1];
  expect(scriptPath, 'SPA bundle path should be present in app HTML').toBeTruthy();

  const scriptUrl = new URL(scriptPath, APP_ORIGIN).toString();
  const scriptResponse = await request.get(scriptUrl);
  expect(scriptResponse.ok()).toBeTruthy();

  const script = await scriptResponse.text();
  const supabaseOrigin = script.match(SUPABASE_ORIGIN_PATTERN)?.[0];
  const anonKey = script.match(JWT_PATTERN)?.[0];

  expect(supabaseOrigin, 'Supabase project URL should be present in app bundle').toBeTruthy();
  expect(anonKey, 'Supabase anon key should be present in app bundle').toBeTruthy();

  return {
    baseUrl: `${supabaseOrigin}/functions/v1`,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  };
}

test.describe('FinBank API contract', () => {
  test('lists accounts with expected banking fields', async ({ request }) => {
    const api = await discoverApiConfig(request);

    // -- Step 1: Request account list --
    const response = await request.get(`${api.baseUrl}/accounts`, {
      headers: api.headers,
    });

    // -- Step 2: Verify response contract --
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.accounts).toHaveLength(3);
    expect(body.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'acc-chk-001',
          name: 'Everyday Checking',
          type: 'Checking',
          currency: 'USD',
          status: 'ACTIVE',
        }),
        expect.objectContaining({
          id: 'acc-sav-002',
          name: 'High-Yield Savings',
          type: 'Savings',
          currency: 'USD',
          status: 'ACTIVE',
        }),
      ]),
    );
  });

  test('lists and filters transaction history', async ({ request }) => {
    const api = await discoverApiConfig(request);

    // -- Step 1: Request full transaction history --
    const fullResponse = await request.get(`${api.baseUrl}/transactions`, {
      headers: api.headers,
    });

    expect(fullResponse.status()).toBe(200);
    const fullBody = await fullResponse.json();
    expect(fullBody.transactions.length).toBeGreaterThanOrEqual(12);
    expect(fullBody.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          transactionId: 'tx-1001',
          description: 'Whole Foods Market',
          type: 'debit',
          status: 'Posted',
          category: 'Groceries',
        }),
      ]),
    );

    // -- Step 2: Request filtered transaction history --
    const filteredResponse = await request.get(
      `${api.baseUrl}/transactions?accountId=acc-chk-001&limit=2`,
      { headers: api.headers },
    );

    expect(filteredResponse.status()).toBe(200);
    const filteredBody = await filteredResponse.json();
    expect(filteredBody.transactions).toHaveLength(2);
    expect(filteredBody.transactions.every((transaction) => transaction.accountId === 'acc-chk-001')).toBe(true);
  });

  test('lists monthly statements and supports account filtering', async ({ request }) => {
    const api = await discoverApiConfig(request);

    // -- Step 1: Request all statements --
    const response = await request.get(`${api.baseUrl}/statements`, {
      headers: api.headers,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.statements).toHaveLength(6);
    expect(body.statements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accountId: 'acc-chk-001',
          fileName: expect.stringMatching(/\.pdf$/),
          status: 'AVAILABLE',
        }),
      ]),
    );

    // -- Step 2: Request statements for one account --
    const filteredResponse = await request.get(`${api.baseUrl}/statements?accountId=acc-chk-001`, {
      headers: api.headers,
    });

    expect(filteredResponse.status()).toBe(200);
    const filteredBody = await filteredResponse.json();
    expect(filteredBody.statements.length).toBeGreaterThan(0);
    expect(filteredBody.statements.every((statement) => statement.accountId === 'acc-chk-001')).toBe(true);
  });

  test('creates a transfer and rejects invalid transfer requests', async ({ request }) => {
    const api = await discoverApiConfig(request);

    // -- Step 1: Submit a valid transfer --
    const validResponse = await request.post(`${api.baseUrl}/transfers`, {
      headers: api.headers,
      data: {
        fromAccountId: 'acc-chk-001',
        toAccountId: 'acc-sav-002',
        amount: 1,
        note: 'Playwright API contract check',
      },
    });

    expect(validResponse.status()).toBe(200);
    const validBody = await validResponse.json();
    expect(validBody).toEqual(
      expect.objectContaining({
        transactionId: expect.stringMatching(/^TX\d+$/),
        status: 'POSTED',
        message: 'Transfer completed successfully',
      }),
    );
    expect(typeof validBody.fromBalance).toBe('number');
    expect(typeof validBody.toBalance).toBe('number');

    // -- Step 2: Verify invalid amount validation --
    const invalidAmountResponse = await request.post(`${api.baseUrl}/transfers`, {
      headers: api.headers,
      data: {
        fromAccountId: 'acc-chk-001',
        toAccountId: 'acc-sav-002',
        amount: 0,
      },
    });

    expect(invalidAmountResponse.status()).toBe(400);
    const invalidAmountBody = await invalidAmountResponse.json();
    expect(invalidAmountBody).toEqual(
      expect.objectContaining({
        error: 'validation_failed',
      }),
    );

    // -- Step 3: Verify same-account transfers are rejected --
    const sameAccountResponse = await request.post(`${api.baseUrl}/transfers`, {
      headers: api.headers,
      data: {
        fromAccountId: 'acc-chk-001',
        toAccountId: 'acc-chk-001',
        amount: 10,
      },
    });

    expect(sameAccountResponse.status()).toBe(400);
    const sameAccountBody = await sameAccountResponse.json();
    expect(sameAccountBody).toEqual(
      expect.objectContaining({
        error: 'validation_failed',
        details: expect.objectContaining({
          toAccountId: expect.arrayContaining(['From and To accounts must be different']),
        }),
      }),
    );
  });

  test('creates a bill payment and rejects an unknown payee', async ({ request }) => {
    const api = await discoverApiConfig(request);

    // -- Step 1: Schedule a valid bill payment --
    const validResponse = await request.post(`${api.baseUrl}/billpayments`, {
      headers: api.headers,
      data: {
        payeeId: 'pay-1',
        fromAccountId: 'acc-chk-001',
        amount: 1,
        paymentDate: '2026-05-10',
      },
    });

    expect(validResponse.status()).toBe(200);
    const validBody = await validResponse.json();
    expect(validBody).toEqual(
      expect.objectContaining({
        paymentId: expect.stringMatching(/^BP\d+$/),
        status: 'SCHEDULED',
        confirmationNumber: expect.stringMatching(/^CONF-[A-Z0-9]+$/),
      }),
    );

    // -- Step 2: Verify unknown payee validation --
    const unknownPayeeResponse = await request.post(`${api.baseUrl}/billpayments`, {
      headers: api.headers,
      data: {
        payeeId: 'missing-payee',
        fromAccountId: 'acc-chk-001',
        amount: 1,
        paymentDate: '2026-05-10',
      },
    });

    expect(unknownPayeeResponse.status()).toBe(404);
    const unknownPayeeBody = await unknownPayeeResponse.json();
    expect(unknownPayeeBody).toEqual({
      error: 'payee_not_found',
    });
  });
});
