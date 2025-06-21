'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import AccessibilitySettingsPanel from './AccessibilitySettingsPanel';
import {
  Accessibility,
  Type,
  Contrast,
  FileText,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AccessibilityToolbarProps {
  className?: string;
}

export function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const {
    preferences,
    togglePlainLanguageMode,
    updatePreferences,
    isAccessibilityModeActive,
  } = useAccessibility();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const quickActions = [
    {
      id: 'plainLanguage',
      icon: FileText,
      label: 'Plain Language',
      shortcut: 'Alt+P',
      isActive: preferences.plainLanguageMode,
      action: togglePlainLanguageMode,
    },
    {
      id: 'dyslexiaFont',
      icon: Type,
      label: 'Dyslexia Font',
      shortcut: 'Alt+D',
      isActive: preferences.dyslexiaFriendlyFont,
      action: () =>
        updatePreferences({
          dyslexiaFriendlyFont: !preferences.dyslexiaFriendlyFont,
        }),
    },
    {
      id: 'highContrast',
      icon: Contrast,
      label: 'High Contrast',
      shortcut: 'Alt+C',
      isActive: preferences.highContrast,
      action: () =>
        updatePreferences({ highContrast: !preferences.highContrast }),
    },
    {
      id: 'autoExplain',
      icon: Lightbulb,
      label: 'Auto Explain',
      shortcut: 'Alt+E',
      isActive: preferences.autoExplainClauses,
      action: () =>
        updatePreferences({
          autoExplainClauses: !preferences.autoExplainClauses,
        }),
    },
  ];

  // Don't render if no accessibility features are being used and it's not enabled
  if (!isAccessibilityModeActive && !preferences.keyboardShortcutsEnabled) {
    return null;
  }

  const ToolbarButton = ({
    action,
    isActive,
    icon: Icon,
    label,
    shortcut,
  }: (typeof quickActions)[0]) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? 'default' : 'secondary'}
            size="icon"
            onClick={action}
            className={`
              relative transition-all duration-200
              ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-secondary/80'}
              ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}
            `}
            aria-label={`${isActive ? 'Disable' : 'Enable'} ${label}`}
            aria-pressed={isActive}
          >
            <Icon className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5'}`} />
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="flex flex-col items-start">
          <span className="font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{shortcut}</span>
          <span className="text-xs">
            {isActive ? 'Click to disable' : 'Click to enable'}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className={`accessibility-toolbar ${className || ''}`}>
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
        <div
          className={`
          bg-white dark:bg-gray-900 
          border border-gray-200 dark:border-gray-700 
          rounded-xl shadow-lg 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'p-2' : 'p-3'}
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Accessibility</span>
                {isAccessibilityModeActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0"
              aria-label={
                isCollapsed
                  ? 'Expand accessibility toolbar'
                  : 'Collapse accessibility toolbar'
              }
            >
              {isCollapsed ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Quick Action Buttons */}
          {!isCollapsed && (
            <div className="flex flex-col gap-2 mb-3">
              {quickActions.map((action) => (
                <ToolbarButton key={action.id} {...action} />
              ))}
            </div>
          )}

          {/* Settings Button */}
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size={isCollapsed ? 'icon' : 'sm'}
                      className={`w-full ${isCollapsed ? 'h-10' : 'h-9'}`}
                      aria-label="Open accessibility settings"
                    >
                      <Settings
                        className={`${isCollapsed ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`}
                      />
                      {!isCollapsed && (
                        <span className="text-xs">Settings</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <span>Accessibility Settings</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[400px] sm:w-[500px] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Accessibility Settings
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6">
                <AccessibilitySettingsPanel />
              </div>
            </SheetContent>
          </Sheet>

          {/* Status Indicator */}
          {isCollapsed && isAccessibilityModeActive && (
            <div className="mt-2 flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Screen Reader Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {/* This will announce changes to screen readers */}
        </div>
      </div>
    </div>
  );
}

export default AccessibilityToolbar;
