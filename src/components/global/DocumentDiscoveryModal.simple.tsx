'use client';

import React from 'react';
import * as DialogComponents from '@/components/ui/dialog';
const { Dialog, DialogContent } = DialogComponents;
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';

export default function DocumentDiscoveryModal() {
  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
  } = useDiscoveryModal();

  return (
    <Dialog open={showDiscoveryModal} onOpenChange={setShowDiscoveryModal}>
      <DialogContent>
        <div>
          <h2>AI Document Finder</h2>
          <p>This is a minimal test version.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}