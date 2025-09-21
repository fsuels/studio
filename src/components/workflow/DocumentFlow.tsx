// src/components/DocumentFlow.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { StepOneInput } from './StepOneInput';
import SlideFade from '@/components/motion/SlideFade';
import { StepTwoInput } from './StepTwoInput';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';

// ✅ Correct dynamic import for default export to support preload
const StepThreeInput = dynamic(() => import('./StepThreeInput'), {
  ssr: false,
});

// ✅ Safe preload after dynamic import
if (typeof window !== 'undefined' && StepThreeInput?.preload) {
  void StepThreeInput.preload();
}

interface DocumentFlowProps {
  initialDocId?: string;
}

export default function DocumentFlow({ initialDocId }: DocumentFlowProps = {}) {
  useTranslation('common');

  const [templateId, setTemplateId] = useState<string>(initialDocId ?? '');
  const [step, setStep] = useState(initialDocId ? 2 : 1);
  const [category, setCategory] = useState<string>('');
  const [workflowModule, setWorkflowModule] = useState<typeof import('@/lib/workflow/document-workflow') | null>(null);

  useEffect(() => {
    if (workflowModule) {
      return;
    }

    let cancelled = false;
    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        setWorkflowModule(module);
      })
      .catch((error) => {
        if (!cancelled && process.env.NODE_ENV !== 'production') {
          console.error('Failed to load workflow module for DocumentFlow', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workflowModule]);

  useEffect(() => {
    if (!initialDocId || !workflowModule) return;
    const doc = workflowModule.getWorkflowDocumentById(initialDocId);
    setCategory(doc?.category ?? '');
  }, [initialDocId, workflowModule]);

  useEffect(() => {
    if (!initialDocId || !workflowModule) {
      if (!initialDocId) setCategory('');
      return;
    }
    const doc = workflowModule.getWorkflowDocumentById(initialDocId);
    setCategory(doc?.category ?? '');
  }, [initialDocId, workflowModule]);

  const advanceTo = (next: number) => {
    setStep(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-x-hidden">
      <progress
        value={step}
        max={3}
        className="fixed top-0 left-0 h-1 w-full bg-teal-200 z-30"
      />

      <SlideFade key={step}>
        {step === 1 && !initialDocId && (
          <StepOneInput
            onSelectCategory={(cat) => {
              setCategory(cat);
              advanceTo(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwoInput
            category={category || ''}
            onStateChange={() => {}}
            onSelectTemplate={(id) => {
              setTemplateId(id);
              advanceTo(3);
            }}
          />
        )}

        {step === 3 && <StepThreeInput templateId={templateId} />}
      </SlideFade>
    </div>
  );
}
