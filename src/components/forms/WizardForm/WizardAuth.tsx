// src/components/forms/WizardForm/WizardAuth.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/shared/AuthModal'));

interface WizardAuthProps {
  showAuthModal: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function WizardAuth({
  showAuthModal,
  onClose,
  onAuthSuccess,
}: WizardAuthProps) {
  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={onClose}
      onAuthSuccess={onAuthSuccess}
    />
  );
}