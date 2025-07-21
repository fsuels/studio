'use client';

import React from 'react';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';

interface BrowseTemplatesButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function BrowseTemplatesButton({ children, className }: BrowseTemplatesButtonProps) {
  const { setShowDiscoveryModal } = useDiscoveryModal();

  return (
    <button
      onClick={() => setShowDiscoveryModal(true)}
      className={className}
    >
      {children}
    </button>
  );
}