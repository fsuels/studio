import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';
import { ThemeToggleButton } from '../theme-toggle';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next-themes for testing
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Component Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Test Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations with different variants', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ThemeToggleButton Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<ThemeToggleButton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Elements Accessibility', () => {
    it('should not have accessibility violations for form with proper labels', async () => {
      const { container } = render(
        <form>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            aria-describedby="email-help"
            required
          />
          <div id="email-help">Please enter a valid email address</div>

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            aria-describedby="password-help"
            required
          />
          <div id="password-help">Password must be at least 8 characters</div>

          <Button type="submit">Submit Form</Button>
        </form>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations for form with error states', async () => {
      const { container } = render(
        <form>
          <label htmlFor="email-error">Email Address</label>
          <input
            id="email-error"
            type="email"
            aria-invalid="true"
            aria-describedby="email-error-message"
            required
          />
          <div id="email-error-message" role="alert">
            Please enter a valid email address
          </div>

          <Button type="submit">Submit Form</Button>
        </form>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation and Interactive Elements', () => {
    it('should not have accessibility violations for navigation structure', async () => {
      const { container } = render(
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <a href="/" aria-current="page">
                Home
              </a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations for modal dialog', async () => {
      const { container } = render(
        <div>
          <Button>Open Modal</Button>
          <div
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            aria-modal="true"
          >
            <h2 id="modal-title">Modal Title</h2>
            <p id="modal-description">This is a modal dialog description.</p>
            <Button>Close</Button>
          </div>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Content Structure', () => {
    it('should not have accessibility violations for proper heading hierarchy', async () => {
      const { container } = render(
        <div>
          <h1>Main Page Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
          <p>Some content here.</p>
          <h2>Another Section</h2>
          <h3>Another Subsection</h3>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations for lists', async () => {
      const { container } = render(
        <div>
          <h2>Unordered List</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>

          <h2>Ordered List</h2>
          <ol>
            <li>First step</li>
            <li>Second step</li>
            <li>Third step</li>
          </ol>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Images and Media', () => {
    it('should not have accessibility violations for images with alt text', async () => {
      const { container } = render(
        <div>
          <img
            src="/test-image.jpg"
            alt="Description of the test image"
            width="200"
            height="150"
          />
          <img
            src="/decorative-image.jpg"
            alt=""
            role="presentation"
            width="50"
            height="50"
          />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
