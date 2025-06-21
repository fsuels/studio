import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Clean up test data, close connections, etc.
  console.log('Global teardown completed');
}

export default globalTeardown;
