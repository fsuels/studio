// src/components/shared/AccessibleTaxonomyNav.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AccessibleTaxonomyNavProps {
  children: React.ReactNode;
  ariaLabel?: string;
  onEscape?: () => void;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

const AccessibleTaxonomyNav: React.FC<AccessibleTaxonomyNavProps> = ({
  children,
  ariaLabel,
  onEscape,
  trapFocus = false,
  restoreFocus = false,
  className
}) => {
  const { t } = useTranslation('common');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  // Store the previously focused element when component mounts
  React.useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    return () => {
      // Restore focus when component unmounts
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [restoreFocus]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;

      case 'Tab':
        if (trapFocus) {
          handleTabNavigation(event);
        }
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        navigateVertically(event.key === 'ArrowDown' ? 1 : -1);
        break;

      case 'ArrowRight':
      case 'ArrowLeft':
        event.preventDefault();
        navigateHorizontally(event.key === 'ArrowRight' ? 1 : -1);
        break;

      case 'Home':
        event.preventDefault();
        focusFirstElement();
        break;

      case 'End':
        event.preventDefault();
        focusLastElement();
        break;

      case 'Enter':
      case ' ':
        // Let the focused element handle activation
        break;
    }
  }, [onEscape, trapFocus]);

  // Trap focus within the component
  const handleTabNavigation = (event: React.KeyboardEvent) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  // Navigate to next/previous focusable element vertically
  const navigateVertically = (direction: number) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    if (currentIndex === -1) {
      focusableElements[0]?.focus();
      return;
    }

    const nextIndex = currentIndex + direction;
    const targetElement = focusableElements[nextIndex];
    
    if (targetElement) {
      targetElement.focus();
    } else if (direction > 0) {
      // Wrap to first element
      focusableElements[0]?.focus();
    } else {
      // Wrap to last element
      focusableElements[focusableElements.length - 1]?.focus();
    }
  };

  // Navigate between categories or sections horizontally
  const navigateHorizontally = (direction: number) => {
    if (!containerRef.current) return;

    // Find category headers or section containers
    const categories = containerRef.current.querySelectorAll('[data-category], [data-situation]');
    const currentCategory = (document.activeElement as HTMLElement)?.closest('[data-category], [data-situation]');
    
    if (!currentCategory) return;

    const currentIndex = Array.from(categories).indexOf(currentCategory as Element);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + direction;
    const targetCategory = categories[nextIndex];
    
    if (targetCategory) {
      const firstFocusable = getFocusableElements(targetCategory as HTMLElement)[0];
      firstFocusable?.focus();
    }
  };

  const focusFirstElement = () => {
    if (!containerRef.current) return;
    const firstElement = getFocusableElements(containerRef.current)[0];
    firstElement?.focus();
  };

  const focusLastElement = () => {
    if (!containerRef.current) return;
    const focusableElements = getFocusableElements(containerRef.current);
    const lastElement = focusableElements[focusableElements.length - 1];
    lastElement?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("taxonomy-nav", className)}
      role="navigation"
      aria-label={ariaLabel || t('accessibility.documentNavigation', { defaultValue: 'Document navigation' })}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

// Utility function to get all focusable elements
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[role="button"]:not([disabled])',
    '[role="link"]:not([disabled])'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors))
    .filter(element => {
      const htmlElement = element as HTMLElement;
      return htmlElement.offsetParent !== null && // Element is visible
             !htmlElement.hasAttribute('aria-hidden') &&
             htmlElement.getAttribute('aria-disabled') !== 'true';
    }) as HTMLElement[];
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key combination string
      const combo = [
        event.ctrlKey && 'ctrl',
        event.metaKey && 'cmd',
        event.altKey && 'alt',
        event.shiftKey && 'shift',
        event.key.toLowerCase()
      ].filter(Boolean).join('+');

      const handler = shortcuts[combo];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Screen reader announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Skip link component for better navigation
export const SkipToContent: React.FC<{ targetId: string }> = ({ targetId }) => {
  const { t } = useTranslation('common');
  
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {t('accessibility.skipToContent', { defaultValue: 'Skip to main content' })}
    </a>
  );
};

export default AccessibleTaxonomyNav;