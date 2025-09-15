'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/shared/AuthModal'), { ssr: false });

export default function SignwellCtaIsland({ locale }: { locale: 'en' | 'es' }) {
  const [open, setOpen] = useState(false);
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
      >
        {t('Start eSigning', 'Comenzar Firma')}
      </button>
      {/* Auth modal island (lazy) */}
      {open && (
        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onAuthSuccess={() => setOpen(false)}
        />
      )}
    </>
  );
}

