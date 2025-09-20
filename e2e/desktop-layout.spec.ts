import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/en' },
  { name: 'templates', path: '/en/templates' },
  { name: 'pricing', path: '/en/pricing' },
];

for (const { name, path } of pages) {
  test(`${name} renders desktop layout`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    // Header: mobile actions should be hidden on desktop (md:hidden)
    const mobileActions = page.locator('header .md\\:hidden');
    await expect(mobileActions.first()).toBeHidden();

    // Header: desktop search (hidden md:flex) should be visible on desktop
    const desktopSearch = page.locator('header .md\\:flex.max-w-md');
    await expect(desktopSearch.first()).toBeVisible();

    // Header: direct category nav (hidden md:flex) should be visible
    const directNav = page.locator('header .md\\:flex.justify-center');
    await expect(directNav.first()).toBeVisible();
  });
}

test('homepage hero uses desktop grid at lg', async ({ page }) => {
  await page.goto('/en', { waitUntil: 'networkidle' });

  // Hero container has lg:grid lg:grid-cols-2
  const heroGrid = page.locator('section.bg-white .lg\\:grid.lg\\:grid-cols-2').first();
  await expect(heroGrid).toBeVisible();

  // Ensure computed display is grid at desktop viewport
  const display = await heroGrid.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('grid');
});

