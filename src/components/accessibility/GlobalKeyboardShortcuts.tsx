'use client';

import React from 'react';
import KeyboardShortcutsModal, {
  useGlobalKeyboardShortcuts,
} from './KeyboardShortcutsModal';

export function GlobalKeyboardShortcuts() {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } =
    useGlobalKeyboardShortcuts();

  return (
    <KeyboardShortcutsModal
      isOpen={isShortcutsModalOpen}
      onClose={() => setIsShortcutsModalOpen(false)}
    />
  );
}

export default GlobalKeyboardShortcuts;
