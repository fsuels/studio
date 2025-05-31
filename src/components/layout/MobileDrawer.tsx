'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

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
  onClose: () => void;
}

export default function MobileDrawer({ open, children, onClose }: MobileDrawerProps) {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const { t } = useTranslation();

  const firstHeadingRef = React.useRef<HTMLElement>(null);
  const bind = useDrag(
    ({ last, movement: [, my] }) => {
      if (last && my > 50) {
        onClose();
      }
    },
    { axis: 'y' }
  );

  React.useEffect(() => {
    if (open) {
      firstHeadingRef.current?.focus();
    }
  }, [open]);

  const enhancedChildren = React.useMemo(() => {
    const array = React.Children.toArray(children);
    if (array.length > 0 && React.isValidElement(array[0])) {
      array[0] = React.cloneElement(array[0] as React.ReactElement, {
        ref: firstHeadingRef,
        tabIndex: -1,
      });
    }
    return array;
  }, [children]);

  if (isDesktop) {
    return open ? (
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('Document menu')}
        className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto"
      >
        {enhancedChildren}
      </aside>
    ) : null;
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-label={t('Close menu')}
          />
          <motion.aside
            {...bind()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.12 } }}
            exit={{ y: 60, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('Document menu')}
            className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          >
            {enhancedChildren}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
