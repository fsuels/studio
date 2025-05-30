'use client';

import React from 'react';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const bind = useDrag(({ last, movement: [, my] }) => {
    if (last && my > 50) onClose();
  });

  if (isDesktop) return <>{children}</>;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        {...bind()}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-background transition-transform',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {children}
      </div>
    </>
  );
}
