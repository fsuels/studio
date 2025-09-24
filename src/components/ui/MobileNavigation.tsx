'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  slideDirection?: 'left' | 'right' | 'top' | 'bottom';
}

export function MobileNavigation({
  isOpen,
  onClose,
  children,
  className,
  overlay = true,
  slideDirection = 'right',
}: MobileNavigationProps) {
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<Element | null>(null);
  const touchStartX = React.useRef<number | null>(null);
  const touchDeltaX = React.useRef<number>(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      panelRef.current?.focus();
    } else if (
      previouslyFocusedElement.current instanceof HTMLElement
    ) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const currentX = event.touches[0]?.clientX ?? touchStartX.current;
    touchDeltaX.current = currentX - touchStartX.current;
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    if (touchStartX.current !== null && touchDeltaX.current > 60) {
      onClose();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }, [onClose]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const getSlideClasses = () => {
    const baseClasses =
      'transform transition-transform duration-300 ease-in-out';

    switch (slideDirection) {
      case 'left':
        return {
          base: `${baseClasses} fixed left-0 top-0 h-full`,
          open: 'translate-x-0',
          closed: '-translate-x-full',
        };
      case 'right':
        return {
          base: `${baseClasses} fixed right-0 top-0 h-full`,
          open: 'translate-x-0',
          closed: 'translate-x-full',
        };
      case 'top':
        return {
          base: `${baseClasses} fixed top-0 left-0 w-full`,
          open: 'translate-y-0',
          closed: '-translate-y-full',
        };
      case 'bottom':
        return {
          base: `${baseClasses} fixed bottom-0 left-0 w-full`,
          open: 'translate-y-0',
          closed: 'translate-y-full',
        };
      default:
        return {
          base: `${baseClasses} fixed right-0 top-0 h-full`,
          open: 'translate-x-0',
          closed: 'translate-x-full',
        };
    }
  };

  const slideClasses = getSlideClasses();

  if (!isOpen && !overlay) return null;

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      {/* Backdrop overlay */}
      {overlay && (
        <div
          className={cn(
            'fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[80]',
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation panel */}
      <div
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
        data-state={isOpen ? 'open' : 'closed'}
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          slideClasses.base,
          isOpen ? slideClasses.open : slideClasses.closed,
          'bg-background border-border shadow-2xl z-[90] w-full max-w-[100vw] sm:max-w-[420px] focus:outline-none',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
          slideDirection === 'left' && 'border-r',
          slideDirection === 'right' && 'border-l',
          slideDirection === 'top' && 'border-b',
          slideDirection === 'bottom' && 'border-t',
          className,
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

// Bottom tab navigation for mobile
interface BottomTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
}

interface BottomTabNavigationProps {
  items: BottomTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function BottomTabNavigation({
  items,
  activeTab,
  onTabChange,
  className,
}: BottomTabNavigationProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40',
        'grid auto-cols-fr grid-flow-col',
        'safe-area-padding-bottom', // For devices with notches
        className,
      )}
      aria-label="Bottom navigation"
    >
      <div role="tablist" aria-label="Bottom navigation">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-1 min-h-[60px]',
              'transition-colors duration-200 relative',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset',
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
            onClick={() => {
              item.onClick?.();
              onTabChange?.(item.id);
            }}
          >
            <div className="relative">
              <IconComponent
                className={cn('h-5 w-5 mb-1', isActive && 'scale-110')}
              />
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium truncate max-w-full',
                isActive && 'font-semibold',
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
      </div>
    </nav>
  );
}

// Swipe gesture component for mobile
interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function SwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className,
}: SwipeGestureProps) {
  const [startPos, setStartPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startPos) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine primary direction and execute callback if threshold is met
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    setStartPos(null);
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  threshold = 80,
  children,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [startY, setStartY] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow pull down when at top of page
    if (window.scrollY === 0 && diff > 0) {
      setPullDistance(Math.min(diff, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div
          className="fixed top-0 left-0 right-0 bg-primary/10 flex items-center justify-center transition-all duration-200 z-50"
          style={{ height: `${Math.min(pullDistance, threshold)}px` }}
        >
          <div
            className={cn(
              'w-6 h-6 border-2 border-primary border-t-transparent rounded-full transition-transform duration-200',
              pullProgress >= 1 || isRefreshing ? 'animate-spin' : '',
            )}
            style={{ transform: `rotate(${pullProgress * 360}deg)` }}
          />
        </div>
      )}

      <div
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Mobile navigation skeleton
export function MobileNavigationSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center space-x-3 pb-3 border-b">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
