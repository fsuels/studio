'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/performance-monitor';

export function WebVitals() {
  useEffect(() => {
    // Report Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      (window as any)['web-vital']?.((metric: unknown) => {
        reportWebVitals(metric as any);
      });
    }
  }, []);

  return null;
}
