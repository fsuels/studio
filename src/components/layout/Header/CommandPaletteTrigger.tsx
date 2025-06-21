'use client';

import React from 'react';
import { Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { cn } from '@/lib/utils';

interface CommandPaletteTriggerProps {
  className?: string;
  variant?: 'button' | 'search-hint';
}

export default function CommandPaletteTrigger({
  className,
  variant = 'button',
}: CommandPaletteTriggerProps) {
  const { open } = useCommandPalette();

  if (variant === 'search-hint') {
    return (
      <button
        onClick={open}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md border border-border/40 hover:bg-muted transition-colors',
          className,
        )}
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search everything...</span>
        <span className="sm:hidden">Search...</span>
        <div className="hidden sm:flex items-center gap-1 ml-auto">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ⌘K
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={open}
      className={cn(
        'relative flex items-center gap-2 text-muted-foreground hover:text-foreground',
        className,
      )}
      aria-label="Open command palette (⌘K)"
    >
      <Command className="h-4 w-4" />
      <span className="hidden sm:inline text-xs">⌘K</span>
    </Button>
  );
}
