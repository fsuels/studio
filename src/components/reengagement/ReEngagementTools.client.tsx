'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  docId?: string;
  totalQuestions?: number;
  locale: 'en' | 'es';
}

export default function ReEngagementTools({
  docId,
  totalQuestions = 0,
  locale,
}: Props) {
  const [showCTA, setShowCTA] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem('promoCTADismissed');
    if (dismissed) return;
    const storedExpiry = localStorage.getItem('promoCTAExpiry');
    const expiry = storedExpiry
      ? parseInt(storedExpiry, 10)
      : Date.now() + 10 * 60 * 1000;
    if (!storedExpiry)
      localStorage.setItem('promoCTAExpiry', expiry.toString());
    setShowCTA(true);
    setTimeLeft(expiry - Date.now());
    const interval = setInterval(() => {
      const diff = expiry - Date.now();
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
        setShowCTA(false);
      }
    }, 1000);
    const hide = setTimeout(() => setShowCTA(false), expiry - Date.now());
    return () => {
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, []);

  const handleDismissCTA = () => {
    setShowCTA(false);
    localStorage.setItem('promoCTADismissed', 'true');
  };

  useEffect(() => {
    if (!docId || totalQuestions === 0) return;
    try {
      const draft = JSON.parse(
        localStorage.getItem(`draft-${docId}-${locale}`) || '{}',
      );
      const filled = Object.keys(draft).filter((k) => draft[k]).length;
      setProgress(Math.min(100, (filled / totalQuestions) * 100));
    } catch {
      setProgress(0);
    }
  }, [docId, totalQuestions, locale]);

  const minutes = Math.max(0, Math.ceil(timeLeft / 60000));

  return (
    <>
      {showCTA && minutes > 0 && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground',
            'md:bottom-4 md:left-4 md:right-auto md:rounded shadow-lg',
          )}
        >
          <span className="text-sm">Your $10 off expires in {minutes}m</span>
          <button
            onClick={handleDismissCTA}
            aria-label="Dismiss"
            className="ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {progress > 0 && progress < 100 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-40 bg-background border border-border p-3 rounded shadow">
          <p className="text-xs mb-2">
            You’ve completed {Math.round(progress)}% of your document
          </p>
          <Progress value={progress} className="w-48 h-2" />
        </div>
      )}
      <Link
        href={`/${locale}/faq`}
        className="fixed bottom-4 right-4 z-40 bg-primary text-primary-foreground rounded-full p-3 shadow"
        aria-label="Need help choosing a form?"
      >
        <HelpCircle className="w-5 h-5" />
      </Link>
    </>
  );
}
