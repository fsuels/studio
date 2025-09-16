// __tests__/search.e2e.ts
// End-to-end regression tests for search functionality with Playwright

import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Test configuration
const TEST_TIMEOUT = 30000; // 30 seconds
const SEARCH_TIMEOUT = 10000; // 10 seconds for search results
const FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Test data for multilingual search scenarios
const SEARCH_TEST_CASES = [
  {
    locale: 'en',
    query: 'buying a used car',
    expectedTitle: 'Vehicle Bill of Sale',
    description: 'English query for vehicle purchase documents',
  },
  {
    locale: 'es',
    query: 'comprar un coche usado',
    expectedTitle: 'Contrato de Compraventa de Vehículo',
    description: 'Spanish query for vehicle purchase documents',
  },
  {
    locale: 'en',
    query: 'selling vessel',
    expectedTitle: 'Boat Bill of Sale',
    description: 'English query for boat/vessel sale documents',
  },
] as const;

// Helper functions for test setup and utilities
class SearchTestHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to the application with proper locale
   */
  async navigateToApp(locale: 'en' | 'es' = 'en'): Promise<void> {
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    await this.page.goto(`${baseUrl}/${locale}`, { waitUntil: 'networkidle' });
    
    // Wait for app to be fully loaded
    await this.page.waitForSelector('[data-testid="app-loaded"]', { 
      timeout: TEST_TIMEOUT,
      state: 'attached'
    });
  }

  /**
   * Open the document discovery modal
   */
  async openDiscoveryModal(): Promise<void> {
    // Look for search trigger button (could be different selectors)
    const searchTriggers = [
      '[data-testid="open-search-modal"]',
      '[data-testid="document-discovery-trigger"]',
      'button:has-text("Smart Document Finder")',
      'button:has-text("Find Documents")',
      'input[placeholder*="search"]',
      '[aria-label*="search"]'
    ];

    let modalOpened = false;
    
    for (const selector of searchTriggers) {
      try {
        const element = await this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click();
          
          // Wait for modal to appear
          await this.page.waitForSelector('[role="dialog"]', { 
            timeout: 5000,
            state: 'visible'
          });
          
          modalOpened = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }

    if (!modalOpened) {
      // Try keyboard shortcut as fallback
      await this.page.keyboard.press('Control+K');
      
      try {
        await this.page.waitForSelector('[role="dialog"]', { 
          timeout: 3000,
          state: 'visible'
        });
        modalOpened = true;
      } catch (error) {
        throw new Error('Could not open discovery modal with any method');
      }
    }

    // Verify modal is properly loaded
    await this.page.waitForSelector('[data-testid="search-input"], input[type="text"]', {
      timeout: 5000,
      state: 'visible'
    });
  }

  /**
   * Perform a search query
   */
  async performSearch(query: string): Promise<void> {
    // Find search input
    const searchInputSelectors = [
      '[data-testid="search-input"]',
      'input[placeholder*="search"]',
      'input[type="text"]',
      '[role="searchbox"]'
    ];

    let searchInput: any = null;
    for (const selector of searchInputSelectors) {
      try {
        searchInput = this.page.locator(selector).first();
        if (await searchInput.isVisible({ timeout: 2000 })) {
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!searchInput) {
      throw new Error('Could not find search input field');
    }

    // Clear any existing text and type the query
    await searchInput.fill('');
    await searchInput.type(query, { delay: 50 });
    
    // Trigger search (Enter key or search button)
    await searchInput.press('Enter');
    
    // Wait for search to complete - look for loading states to disappear
    await this.page.waitForFunction(
      () => {
        // Check if loading indicators are gone
        const loadingElements = document.querySelectorAll('[data-testid="loading"], [data-testid="skeleton"], .loading, .spinner');
        return loadingElements.length === 0;
      },
      { timeout: SEARCH_TIMEOUT }
    );

    // Additional wait for results to stabilize
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get search results
   */
  async getSearchResults(): Promise<Array<{ title: string; description: string }>> {
    // Wait for results container
    const resultsSelectors = [
      '[data-testid="search-results"]',
      '[data-testid="results-grid"]',
      '.results-grid',
      '[role="main"] a[href*="/docs/"]'
    ];

    let resultsContainer: any = null;
    for (const selector of resultsSelectors) {
      try {
        resultsContainer = this.page.locator(selector).first();
        if (await resultsContainer.isVisible({ timeout: 3000 })) {
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!resultsContainer) {
      // Check for "no results" state
      const noResultsSelectors = [
        '[data-testid="no-results"]',
        'text="No results found"',
        'text="No matching documents"'
      ];

      for (const selector of noResultsSelectors) {
        try {
          if (await this.page.locator(selector).isVisible({ timeout: 2000 })) {
            return [];
          }
        } catch (error) {
          continue;
        }
      }
      
      throw new Error('Could not find search results container or no-results indicator');
    }

    // Extract result cards
    const resultCards = await this.page.locator('a[href*="/docs/"], [data-testid="result-card"]').all();
    
    const results = [];
    for (const card of resultCards) {
      try {
        // Extract title - try multiple selectors
        const titleSelectors = ['h4', 'h3', '.title', '[data-testid="result-title"]'];
        let title = '';
        
        for (const titleSelector of titleSelectors) {
          try {
            const titleElement = card.locator(titleSelector).first();
            if (await titleElement.isVisible({ timeout: 1000 })) {
              title = await titleElement.textContent() || '';
              break;
            }
          } catch (error) {
            continue;
          }
        }

        // Extract description - try multiple selectors
        const descriptionSelectors = ['p', '.description', '[data-testid="result-description"]'];
        let description = '';
        
        for (const descSelector of descriptionSelectors) {
          try {
            const descElement = card.locator(descSelector).first();
            if (await descElement.isVisible({ timeout: 1000 })) {
              description = await descElement.textContent() || '';
              break;
            }
          } catch (error) {
            continue;
          }
        }

        if (title) {
          results.push({ title: title.trim(), description: description.trim() });
        }
      } catch (error) {
        console.warn('Failed to extract result card data:', error);
        continue;
      }
    }

    return results;
  }

  /**
   * Close the discovery modal
   */
  async closeDiscoveryModal(): Promise<void> {
    // Try different methods to close modal
    const closeMethods = [
      () => this.page.locator('[data-testid="close-modal"]').click(),
      () => this.page.locator('button[aria-label="Close"]').click(),
      () => this.page.locator('[aria-label="Close modal"]').click(),
      () => this.page.keyboard.press('Escape'),
      () => this.page.locator('[role="dialog"]').press('Escape')
    ];

    for (const closeMethod of closeMethods) {
      try {
        await closeMethod();
        
        // Wait for modal to disappear
        await this.page.waitForSelector('[role="dialog"]', { 
          state: 'detached',
          timeout: 3000
        });
        return;
      } catch (error) {
        continue;
      }
    }

    throw new Error('Could not close discovery modal');
  }

  /**
   * Wait for Firestore emulator to be ready
   */
  async waitForFirestoreEmulator(): Promise<void> {
    // Check if emulator is responding
    try {
      const response = await fetch(`http://${FIRESTORE_EMULATOR_HOST}`);
      if (!response.ok) {
        throw new Error('Firestore emulator not responding');
      }
    } catch (error) {
      throw new Error(`Firestore emulator not available at ${FIRESTORE_EMULATOR_HOST}. Please run: firebase emulators:start --only firestore --import=./seed`);
    }
  }
}

// Test suite setup
test.describe('Document Search E2E Tests', () => {
  let helper: SearchTestHelper;

  test.beforeAll(async () => {
    // Verify emulator is running before tests
    const helper = new SearchTestHelper({} as Page);
    await helper.waitForFirestoreEmulator();
  });

  test.beforeEach(async ({ page }) => {
    helper = new SearchTestHelper(page);
    
    // Set emulator environment
    await page.addInitScript(() => {
      window.localStorage.setItem('firebase_emulator_enabled', 'true');
    });

    // Mock any external services that might interfere
    await page.route('**/api/vector-search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Set longer timeout for this test suite
    test.setTimeout(TEST_TIMEOUT);
  });

  // Test each search scenario
  for (const testCase of SEARCH_TEST_CASES) {
    test(`Search: "${testCase.query}" (${testCase.locale})`, async ({ page }) => {
      test.info().annotations.push({
        type: 'test-case',
        description: testCase.description
      });

      // Navigate to the app with correct locale
      await helper.navigateToApp(testCase.locale);

      // Open search modal
      await helper.openDiscoveryModal();

      // Perform search
      await helper.performSearch(testCase.query);

      // Get results
      const results = await helper.getSearchResults();

      // Assertions
      expect(results.length).toBeGreaterThan(0, `No search results found for query: "${testCase.query}"`);

      const firstResult = results[0];
      expect(firstResult.title).toBeTruthy('First result should have a title');

      // Check if expected title is found in any of the top 3 results
      const topResults = results.slice(0, 3);
      const foundExpectedResult = topResults.some(result => 
        result.title.toLowerCase().includes(testCase.expectedTitle.toLowerCase()) ||
        testCase.expectedTitle.toLowerCase().includes(result.title.toLowerCase())
      );

      expect(foundExpectedResult).toBe(true, 
        `Expected title "${testCase.expectedTitle}" not found in top 3 results. Found: ${topResults.map(r => r.title).join(', ')}`
      );

      // Verify result quality
      expect(firstResult.description).toBeTruthy('First result should have a description');

      // Log results for debugging
      console.log(`Search results for "${testCase.query}" (${testCase.locale}):`, 
        results.slice(0, 3).map(r => ({ title: r.title, description: r.description.substring(0, 100) + '...' }))
      );

      // Close modal
      await helper.closeDiscoveryModal();
    });
  }

  test('Search responsiveness and performance', async ({ page }) => {
    await helper.navigateToApp('en');
    
    // Measure search performance
    const performanceData = [];
    
    for (const query of ['employment contract', 'lease agreement', 'bill of sale']) {
      await helper.openDiscoveryModal();
      
      const startTime = Date.now();
      await helper.performSearch(query);
      const searchTime = Date.now() - startTime;
      
      const results = await helper.getSearchResults();
      
      performanceData.push({
        query,
        searchTime,
        resultCount: results.length
      });
      
      // Search should complete within reasonable time
      expect(searchTime).toBeLessThan(SEARCH_TIMEOUT, `Search for "${query}" took too long: ${searchTime}ms`);
      
      await helper.closeDiscoveryModal();
    }
    
    console.log('Search performance data:', performanceData);
    
    // Average search time should be reasonable
    const avgSearchTime = performanceData.reduce((sum, data) => sum + data.searchTime, 0) / performanceData.length;
    expect(avgSearchTime).toBeLessThan(5000, `Average search time too high: ${avgSearchTime}ms`);
  });

  test('Search edge cases and error handling', async ({ page }) => {
    await helper.navigateToApp('en');
    await helper.openDiscoveryModal();

    // Test empty search
    await helper.performSearch('');
    let results = await helper.getSearchResults();
    // Empty search should either show no results or show popular/featured documents
    expect(Array.isArray(results)).toBe(true);

    // Test very long search query
    const longQuery = 'very '.repeat(50) + 'long search query that should be handled gracefully';
    await helper.performSearch(longQuery);
    results = await helper.getSearchResults();
    expect(Array.isArray(results)).toBe(true);

    // Test special characters
    await helper.performSearch('test@#$%^&*()');
    results = await helper.getSearchResults();
    expect(Array.isArray(results)).toBe(true);

    // Test non-existent document type
    await helper.performSearch('alien spaceship registration form');
    results = await helper.getSearchResults();
    // Should handle gracefully (may return empty results)
    expect(Array.isArray(results)).toBe(true);

    await helper.closeDiscoveryModal();
  });

  test('Multilingual search behavior', async ({ page }) => {
    // Test that Spanish queries work on English site and vice versa
    await helper.navigateToApp('en');
    await helper.openDiscoveryModal();

    // Spanish query on English site
    await helper.performSearch('contrato de trabajo');
    let results = await helper.getSearchResults();
    expect(results.length).toBeGreaterThan(0, 'Spanish query should work on English site');

    await helper.closeDiscoveryModal();

    // Navigate to Spanish site
    await helper.navigateToApp('es');
    await helper.openDiscoveryModal();

    // English query on Spanish site
    await helper.performSearch('employment contract');
    results = await helper.getSearchResults();
    expect(results.length).toBeGreaterThan(0, 'English query should work on Spanish site');

    await helper.closeDiscoveryModal();
  });

  test('Search modal accessibility', async ({ page }) => {
    await helper.navigateToApp('en');
    
    // Test keyboard navigation
    await page.keyboard.press('Control+K'); // Should open search modal
    
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Check ARIA attributes
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeFocused(); // Should auto-focus search input
    
    // Test escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});

// Additional test configuration
test.describe.configure({ 
  mode: 'parallel',
  retries: 2, // Retry flaky tests
  timeout: TEST_TIMEOUT 
});

export default test;