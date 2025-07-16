# Testing Guide

## Overview

This project uses a comprehensive testing strategy with Jest for unit tests, Playwright for E2E tests, and automated coverage reporting.

## Test Coverage Standards

### Coverage Thresholds

- **Global Coverage**: 80% lines, 80% functions, 75% branches, 80% statements
- **Components**: 85% lines, 85% functions, 80% branches, 85% statements  
- **Utils**: 90% lines, 90% functions, 85% branches, 90% statements
- **Lib**: 75% lines, 75% functions, 70% branches, 75% statements

### Coverage Reports

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/lcov-report/index.html` - Visual coverage report
- **LCOV**: `coverage/lcov.info` - For CI/CD integration
- **JSON**: `coverage/coverage-final.json` - Machine-readable format
- **Text**: Console output for quick feedback

## Running Tests

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch, no interactive)
npm run test:coverage:ci
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui

# Run E2E test report
npm run e2e:report

# Run accessibility tests
npm run accessibility:test
```

## Coverage Commands

### Basic Coverage

```bash
# Generate and view basic coverage report
npm run coverage:report

# Generate detailed coverage report with file breakdown
npm run coverage:report:detailed

# Generate JSON coverage report (for automation)
npm run coverage:report:json

# Generate CI-friendly coverage report
npm run coverage:report:ci
```

### Coverage Visualization

```bash
# Open HTML coverage report in browser
npm run coverage:open

# Generate coverage badge data
npm run coverage:badge
```

## Test Structure

### Unit Tests Location

```
src/
├── components/
│   └── __tests__/           # Component tests
├── lib/
│   └── __tests__/           # Library function tests
├── utils/
│   └── __tests__/           # Utility function tests
└── hooks/
    └── __tests__/           # React hooks tests
```

### E2E Tests Location

```
e2e/
├── accessibility.spec.ts    # Accessibility tests
├── user-journeys.spec.ts    # Main user flows
└── visual-regression.spec.ts # Visual regression tests
```

## Coverage Exclusions

The following files are excluded from coverage:

- TypeScript declaration files (`*.d.ts`)
- Next.js layout files (`layout.tsx`, `loading.tsx`, etc.)
- Page components (`page.tsx`)
- Middleware (`middleware.ts`)
- Storybook stories (`*.stories.*`)
- Configuration files (`*.config.*`)
- Type definitions (`types.ts`)
- Constants files (`constants.ts`)
- Scripts and mocks

## CI/CD Integration

### GitHub Actions

Coverage is automatically checked on:
- Pull requests to `master`, `main`, or `develop`
- Pushes to `master`, `main`, or `develop`

The workflow:
1. Runs tests with coverage on Node.js 18.x and 20.x
2. Uploads coverage to Codecov and Coveralls
3. Comments coverage report on PRs
4. Enforces coverage thresholds
5. Generates coverage artifacts

### Coverage Services

- **Codecov**: Primary coverage tracking and visualization
- **Coveralls**: Secondary coverage tracking
- **GitHub Actions**: Automated coverage reporting and enforcement

## Writing Tests

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Utility Testing

```typescript
import { myUtility } from '../myUtility';

describe('myUtility', () => {
  it('should return expected result', () => {
    expect(myUtility('input')).toBe('expected output');
  });
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBe('expected value');
  });
});
```

## Best Practices

1. **Test Names**: Use descriptive test names that explain what is being tested
2. **Coverage Goals**: Aim for high coverage but prioritize meaningful tests
3. **Edge Cases**: Test edge cases and error conditions
4. **Async Testing**: Properly handle async operations in tests
5. **Mocking**: Mock external dependencies appropriately
6. **Accessibility**: Include accessibility testing in component tests

## Troubleshooting

### Common Issues

1. **Coverage not updating**: Delete `coverage/` folder and re-run tests
2. **Tests timing out**: Check for unresolved promises or infinite loops
3. **Coverage threshold errors**: Review which files are not meeting thresholds

### Debug Commands

```bash
# Run specific test file
npm test -- --testPathPattern=MyComponent

# Run tests with verbose output
npm test -- --verbose

# Run tests with debug information
npm test -- --detectOpenHandles
```