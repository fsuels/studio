import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Start browser for authentication setup if needed
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Pre-warm the application
  try {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.log('Pre-warming failed:', error);
  }

  // Setup test data or authentication state if needed
  // This is where you'd set up user sessions, test databases, etc.

  await browser.close();
}

export default globalSetup;
