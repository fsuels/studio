# Accessibility Guidelines for 123legaldoc

## Overview

This document outlines the accessibility standards and practices for 123legaldoc to ensure WCAG 2.2 AA compliance and provide an inclusive experience for all users, including those with disabilities.

## Why Accessibility Matters

- **Legal Compliance**: ADA and Section 508 requirements for public-facing websites
- **Risk Mitigation**: Reduces legal liability and potential lawsuits
- **Inclusive Design**: Ensures all users can access legal document services
- **Professional Credibility**: Demonstrates commitment to accessibility standards
- **SEO Benefits**: Improved semantic structure benefits search engines

## WCAG 2.2 AA Standards

Our platform adheres to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards, which are built on four main principles:

### 1. Perceivable
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Alt Text**: All images have descriptive alternative text
- **Text Scaling**: Content remains readable when scaled up to 200%
- **Audio/Video**: Captions and transcripts provided when applicable

### 2. Operable
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Focus Management**: Visible focus indicators on all interactive elements
- **No Seizure Triggers**: No flashing content that could trigger seizures
- **Sufficient Time**: Users have adequate time to read and interact with content

### 3. Understandable
- **Clear Language**: Plain language principles applied throughout
- **Consistent Navigation**: Predictable navigation patterns
- **Error Prevention**: Form validation with clear error messages
- **Help Text**: Context-sensitive help available

### 4. Robust
- **Semantic HTML**: Proper use of HTML elements and ARIA attributes
- **Cross-Platform**: Compatible with assistive technologies
- **Future-Proof**: Code that works with evolving web standards

## Implementation Standards

### HTML and Semantic Structure

#### Headings
```html
<!-- ✅ Correct: Logical heading hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
  <h2>Another Section</h2>

<!-- ❌ Incorrect: Skipping heading levels -->
<h1>Main Title</h1>
  <h4>Subsection Title</h4>
```

#### Landmarks
```html
<!-- ✅ Use semantic landmarks -->
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

#### Lists
```html
<!-- ✅ Use proper list markup -->
<ul>
  <li>Legal document templates</li>
  <li>Electronic signatures</li>
  <li>Notary services</li>
</ul>
```

### Forms and Input Accessibility

#### Labels and Descriptions
```html
<!-- ✅ Proper labeling -->
<label for="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  aria-describedby="email-help"
  required 
/>
<div id="email-help">We'll never share your email address</div>
```

#### Error States
```html
<!-- ✅ Accessible error handling -->
<label for="password">Password</label>
<input 
  id="password" 
  type="password" 
  aria-invalid="true"
  aria-describedby="password-error"
  required 
/>
<div id="password-error" role="alert">
  Password must be at least 8 characters long
</div>
```

#### Required Fields
```html
<!-- ✅ Clear required field indication -->
<label for="name">
  Full Name 
  <abbr title="required" aria-label="required">*</abbr>
</label>
<input id="name" type="text" required aria-required="true" />
```

### Interactive Elements

#### Buttons
```html
<!-- ✅ Descriptive button text -->
<button type="button" aria-label="Close dialog">
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</button>

<!-- ✅ Toggle buttons -->
<button 
  aria-pressed="false" 
  aria-label="Toggle dark mode"
  onClick={toggleTheme}
>
  Theme Toggle
</button>
```

#### Links
```html
<!-- ✅ Descriptive link text -->
<a href="/documents/bill-of-sale">
  Create a Bill of Sale document
</a>

<!-- ❌ Avoid generic link text -->
<a href="/documents/bill-of-sale">Click here</a>
```

#### Dropdowns and Menus
```html
<!-- ✅ Proper dropdown implementation -->
<button 
  aria-expanded="false" 
  aria-haspopup="true"
  aria-controls="menu-items"
>
  Document Types
</button>
<ul id="menu-items" role="menu">
  <li role="menuitem">
    <a href="/documents/bill-of-sale">Bill of Sale</a>
  </li>
</ul>
```

### Focus Management

#### Focus Indicators
```css
/* ✅ Visible focus indicators */
.focus-visible:focus {
  outline: 2px solid var(--electric-400);
  outline-offset: 2px;
}

button:focus-visible {
  ring: 2px solid var(--electric-400);
}
```

#### Skip Links
```html
<!-- ✅ Skip to main content -->
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content">
  <!-- Main content -->
</main>
```

### ARIA Patterns

#### Live Regions
```html
<!-- ✅ Status updates -->
<div aria-live="polite" id="status">
  Document saved successfully
</div>

<!-- ✅ Error announcements -->
<div aria-live="assertive" role="alert">
  Please correct the errors below
</div>
```

#### Modal Dialogs
```html
<!-- ✅ Accessible modal -->
<div 
  role="dialog" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Confirm Document Deletion</h2>
  <p id="modal-description">
    This action cannot be undone. Are you sure?
  </p>
  <button type="button">Cancel</button>
  <button type="button">Delete</button>
</div>
```

## Dark Mode Accessibility

### Theme Implementation
```tsx
// ✅ Accessible theme toggle
export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
```

### Color Contrast in Dark Mode
- Ensure 4.5:1 contrast ratio for text in both light and dark themes
- Test all interactive elements in both modes
- Provide high contrast mode support when possible

## Testing and Validation

### Automated Testing Tools

#### 1. axe-core (Playwright)
```bash
npm run accessibility:e2e
```

#### 2. jest-axe (Component Testing)
```bash
npm run accessibility:test
```

#### 3. pa11y (CLI Auditing)
```bash
npm run accessibility:audit
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Use arrow keys for menus and dropdowns
- [ ] Press Escape to close modals/menus
- [ ] Use Enter/Space to activate buttons
- [ ] Navigate forms with Tab and Shift+Tab

#### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Verify all content is announced
- [ ] Check heading navigation
- [ ] Test form field labels and descriptions
- [ ] Verify button and link purposes are clear

#### Visual Testing
- [ ] Zoom to 200% and verify readability
- [ ] Test in high contrast mode
- [ ] Verify focus indicators are visible
- [ ] Check color contrast ratios
- [ ] Test with color blindness simulation

## Developer Guidelines

### Component Development

#### 1. Start with Semantic HTML
```tsx
// ✅ Semantic foundation
function DocumentCard({ document }) {
  return (
    <article>
      <h3>{document.title}</h3>
      <p>{document.description}</p>
      <a href={document.url}>Create document</a>
    </article>
  )
}
```

#### 2. Add ARIA When Needed
```tsx
// ✅ Enhanced with ARIA
function DocumentCard({ document, onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <article>
      <h3>{document.title}</h3>
      <p>{document.description}</p>
      <button
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        ★
      </button>
      <a href={document.url}>Create document</a>
    </article>
  )
}
```

#### 3. Test Early and Often
```tsx
// ✅ Include accessibility tests
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

test('DocumentCard should be accessible', async () => {
  const { container } = render(<DocumentCard document={mockDocument} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Form Development

#### 1. Always Use Labels
```tsx
function ContactForm() {
  return (
    <form>
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" required />
      
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" required />
      
      <button type="submit">Send Message</button>
    </form>
  )
}
```

#### 2. Provide Clear Error Messages
```tsx
function FormField({ label, error, ...props }) {
  const fieldId = props.id || `field-${Math.random()}`
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div>
      <label htmlFor={fieldId}>{label}</label>
      <input
        {...props}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={errorId}
      />
      {error && (
        <div id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
```

## Common Accessibility Issues and Solutions

### Issue 1: Missing Form Labels
```html
<!-- ❌ Problem -->
<input type="email" placeholder="Email" />

<!-- ✅ Solution -->
<label for="email">Email Address</label>
<input id="email" type="email" placeholder="your@email.com" />
```

### Issue 2: Poor Color Contrast
```css
/* ❌ Problem: Insufficient contrast */
.text-light-gray {
  color: #999; /* 2.8:1 ratio - fails WCAG AA */
}

/* ✅ Solution: Sufficient contrast */
.text-dark-gray {
  color: #666; /* 4.5:1 ratio - passes WCAG AA */
}
```

### Issue 3: Keyboard Traps
```tsx
// ❌ Problem: Focus gets stuck
function Modal() {
  return (
    <div role="dialog">
      <input type="text" />
      <button>Close</button>
    </div>
  )
}

// ✅ Solution: Proper focus management
function Modal({ onClose }) {
  const firstElementRef = useRef()
  const lastElementRef = useRef()

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElementRef.current) {
        e.preventDefault()
        lastElementRef.current.focus()
      } else if (!e.shiftKey && document.activeElement === lastElementRef.current) {
        e.preventDefault()
        firstElementRef.current.focus()
      }
    }
  }

  return (
    <div role="dialog" onKeyDown={handleKeyDown}>
      <input ref={firstElementRef} type="text" />
      <button ref={lastElementRef} onClick={onClose}>Close</button>
    </div>
  )
}
```

## Resources and Tools

### Testing Tools
- **axe DevTools**: Browser extension for manual testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in Chrome accessibility audit
- **Color Contrast Analyzers**: Various browser extensions

### Screen Readers
- **NVDA** (Windows): Free, widely used
- **VoiceOver** (Mac): Built into macOS
- **JAWS** (Windows): Professional screen reader

### Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Compliance Checklist

### Before Each Release
- [ ] Run automated accessibility tests (`npm run accessibility:full`)
- [ ] Test keyboard navigation on new features
- [ ] Verify color contrast ratios
- [ ] Test with screen reader
- [ ] Check focus management in interactive components
- [ ] Validate form accessibility
- [ ] Test at 200% zoom level
- [ ] Verify semantic HTML structure

### Ongoing Monitoring
- [ ] Monthly accessibility audits using pa11y
- [ ] Quarterly manual testing with assistive technologies
- [ ] Annual accessibility review with external audit
- [ ] Continuous integration with accessibility testing

## Contact and Support

For accessibility questions or to report accessibility issues:
- **Developer Team**: Include accessibility tests in all PRs
- **QA Team**: Include accessibility in testing protocols
- **Legal/Compliance**: Regular accessibility compliance reviews

Remember: Accessibility is not a one-time task but an ongoing commitment to inclusive design.