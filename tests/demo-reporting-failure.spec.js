import { expect, test } from '@playwright/test';

test.describe('FinBank demo reporting failure @regression', () => {
  test('shows a deliberate failure in Azure reporting', async () => {
    test.skip(
      process.env.DEMO_FAIL_ONE_TEST !== '1',
      'Set DEMO_FAIL_ONE_TEST=1 when a demo report needs one intentional failure.'
    );

    await expect('demo-report-status').toBe('passing-report-status');
  });
});
