import { test } from '@playwright/test';

const mobilePages = [
  { slug: 'pricing', path: '/en/pricing' },
  { slug: 'templates', path: '/en/templates' },
];

for (const { slug, path } of mobilePages) {
  test(mobile layout smoke - , async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const screenshotPath = testInfo.outputPath(${slug}-mobile.png);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach(${slug}-mobile, {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
}
