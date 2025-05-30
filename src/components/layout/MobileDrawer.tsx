'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

interface MobileDrawerProps {
  open: boolean;
  children: React.ReactNode;
}

export default function MobileDrawer({ open, children }: MobileDrawerProps) {
  const isDesktop = useMediaQuery('(min-width:768px)');

  if (isDesktop) {
    return open ? (
      <aside className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        {children}
      </aside>
    ) : null;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.12 } }}
          exit={{ y: 60, opacity: 0 }}
          className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto"
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
