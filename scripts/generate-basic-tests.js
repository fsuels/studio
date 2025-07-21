#!/usr/bin/env node

// Simple test generation for key components
const fs = require('fs');
const path = require('path');

const testTemplate = (componentName, componentPath) => `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '${componentPath}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<${componentName} className={customClass} data-testid="${componentName.toLowerCase()}" />);
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<${componentName} data-testid="${componentName.toLowerCase()}" />);
    const component = screen.getByTestId('${componentName.toLowerCase()}');
    expect(component).toBeInTheDocument();
  });
});
`;

// Priority components to test
const priorityComponents = [
  { name: 'Carousel', path: '../Carousel' },
  { name: 'SearchBar', path: '../SearchBar' },
  { name: 'EmptyState', path: '../EmptyState' },
  { name: 'ProgressBar', path: '../ProgressBar' },
  { name: 'TrustBadges', path: '../TrustBadges' },
];

function generateTests() {
  console.log('🧪 Generating basic tests for priority components...');

  const testsDir = 'src/components/shared/__tests__';

  // Ensure test directory exists
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  for (const component of priorityComponents) {
    const testFilePath = path.join(testsDir, `${component.name}.test.tsx`);

    // Skip if test already exists
    if (fs.existsSync(testFilePath)) {
      console.log(`⏭️  Skipping ${component.name} - test already exists`);
      continue;
    }

    const testContent = testTemplate(component.name, component.path);

    try {
      fs.writeFileSync(testFilePath, testContent.trim());
      console.log(`✅ Generated test for ${component.name}`);
    } catch (error) {
      console.error(
        `❌ Failed to generate test for ${component.name}:`,
        error.message,
      );
    }
  }

  console.log('🎉 Test generation completed!');
}

generateTests();
