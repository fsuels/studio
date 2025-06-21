'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import {
  Keyboard,
  FileText,
  Type,
  Contrast,
  Lightbulb,
  Search,
  Navigation,
  Accessibility,
  X,
} from 'lucide-react';

interface KeyboardShortcut {
  category: string;
  shortcuts: {
    keys: string[];
    description: string;
    icon?: React.ComponentType<any>;
    available?: boolean;
  }[];
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const { preferences } = useAccessibility();
  const [platform, setPlatform] = useState<'mac' | 'windows'>('windows');

  useEffect(() => {
    // Detect platform
    if (typeof window !== 'undefined') {
      setPlatform(
        navigator.platform.toLowerCase().includes('mac') ? 'mac' : 'windows',
      );
    }
  }, []);

  const getModKey = () => (platform === 'mac' ? '⌘' : 'Ctrl');
  const getAltKey = () => (platform === 'mac' ? '⌥' : 'Alt');

  const keyboardShortcuts: KeyboardShortcut[] = [
    {
      category: 'Accessibility Features',
      shortcuts: [
        {
          keys: [getAltKey(), 'P'],
          description: 'Toggle Plain Language Mode',
          icon: FileText,
          available: preferences.keyboardShortcutsEnabled,
        },
        {
          keys: [getAltKey(), 'D'],
          description: 'Toggle Dyslexia-Friendly Font',
          icon: Type,
          available: preferences.keyboardShortcutsEnabled,
        },
        {
          keys: [getAltKey(), 'C'],
          description: 'Toggle High Contrast Mode',
          icon: Contrast,
          available: preferences.keyboardShortcutsEnabled,
        },
        {
          keys: [getAltKey(), 'E'],
          description: 'Toggle Auto-Explain Clauses',
          icon: Lightbulb,
          available: preferences.keyboardShortcutsEnabled,
        },
        {
          keys: [getAltKey(), '+'],
          description: 'Increase Font Size',
          available: preferences.keyboardShortcutsEnabled,
        },
        {
          keys: [getAltKey(), '-'],
          description: 'Decrease Font Size',
          available: preferences.keyboardShortcutsEnabled,
        },
      ],
    },
    {
      category: 'Navigation',
      shortcuts: [
        {
          keys: [getModKey(), 'K'],
          description: 'Open Command Palette',
          icon: Search,
        },
        {
          keys: [getModKey(), '/'],
          description: 'Show Keyboard Shortcuts',
          icon: Keyboard,
        },
        {
          keys: ['Tab'],
          description: 'Navigate between elements',
          icon: Navigation,
        },
        {
          keys: ['Shift', 'Tab'],
          description: 'Navigate backwards',
          icon: Navigation,
        },
        {
          keys: ['Enter', 'Space'],
          description: 'Activate buttons and links',
        },
        {
          keys: ['Escape'],
          description: 'Close modals and menus',
        },
      ],
    },
    {
      category: 'Form Navigation',
      shortcuts: [
        {
          keys: ['Tab'],
          description: 'Move to next field',
        },
        {
          keys: ['Shift', 'Tab'],
          description: 'Move to previous field',
        },
        {
          keys: ['Arrow Keys'],
          description: 'Navigate radio buttons and dropdowns',
        },
        {
          keys: ['Space'],
          description: 'Toggle checkboxes',
        },
        {
          keys: ['Enter'],
          description: 'Submit forms',
        },
      ],
    },
    {
      category: 'Document Navigation',
      shortcuts: [
        {
          keys: ['H'],
          description: 'Navigate by headings (screen readers)',
        },
        {
          keys: ['L'],
          description: 'Navigate by links (screen readers)',
        },
        {
          keys: ['B'],
          description: 'Navigate by buttons (screen readers)',
        },
        {
          keys: ['F'],
          description: 'Navigate by form controls (screen readers)',
        },
        {
          keys: [getModKey(), 'F'],
          description: 'Find text on page',
        },
      ],
    },
  ];

  const KeyBadge = ({ keyCombo }: { keyCombo: string[] }) => (
    <div className="flex items-center gap-1">
      {keyCombo.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
          <Badge variant="secondary" className="px-2 py-1 text-xs font-mono">
            {key}
          </Badge>
        </React.Fragment>
      ))}
    </div>
  );

  const ShortcutRow = ({
    shortcut,
    isAvailable = true,
  }: {
    shortcut: KeyboardShortcut['shortcuts'][0];
    isAvailable?: boolean;
  }) => {
    const Icon = shortcut.icon;
    const available =
      shortcut.available !== undefined ? shortcut.available : isAvailable;

    return (
      <div
        className={`flex items-center justify-between py-2 ${!available ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm">{shortcut.description}</span>
          {!available && (
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          )}
        </div>
        <KeyBadge keyCombo={shortcut.keys} />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate and control the application using your keyboard.
            {!preferences.keyboardShortcutsEnabled && (
              <span className="text-orange-600 dark:text-orange-400">
                {' '}
                Some accessibility shortcuts are currently disabled.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Platform indicator */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Shortcuts for {platform === 'mac' ? 'macOS' : 'Windows/Linux'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Shortcut categories */}
          {keyboardShortcuts.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="font-medium text-base mb-3 flex items-center gap-2">
                {category.category === 'Accessibility Features' && (
                  <Accessibility className="h-4 w-4" />
                )}
                {category.category}
              </h3>

              <div className="space-y-1">
                {category.shortcuts.map((shortcut, shortcutIndex) => (
                  <ShortcutRow key={shortcutIndex} shortcut={shortcut} />
                ))}
              </div>

              {categoryIndex < keyboardShortcuts.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}

          {/* Additional information */}
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hold keys simultaneously to activate shortcuts</li>
              <li>
                • Screen reader shortcuts work with NVDA, JAWS, and VoiceOver
              </li>
              <li>
                • Enable accessibility features in Settings for more shortcuts
              </li>
              <li>
                • Press Tab to navigate through any interface systematically
              </li>
            </ul>
          </div>

          {/* Enable shortcuts prompt */}
          {!preferences.keyboardShortcutsEnabled && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900 dark:text-orange-100">
                  Keyboard Shortcuts Disabled
                </span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-200 mb-3">
                Enable keyboard shortcuts in the accessibility settings to use
                Alt+ shortcuts.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  // This would open the accessibility settings
                  onClose();
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Open Accessibility Settings
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Global keyboard shortcut listener hook
export function useGlobalKeyboardShortcuts() {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd/Ctrl + / to open shortcuts modal
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        setIsShortcutsModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
  };
}

export default KeyboardShortcutsModal;
