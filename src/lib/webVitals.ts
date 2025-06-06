'use client';

import type { Metric } from 'web-vitals';
import { getTTFB, getFID, getCLS, getLCP, getFCP, getTBT } from 'web-vitals';
import { track } from './analytics';

export function initWebVitals() {
  const sendToAnalytics = (metric: Metric) => {
    track(`web_vital_${metric.name}`, { value: metric.value });
    if (process.env.NODE_ENV === 'development') {
      console.info(metric.name, metric.value);
    }
    const history = JSON.parse(
      localStorage.getItem('webVitalsHistory') || '[]'
    ) as Array<{ name: string; value: number; time: number }>;
    history.push({ name: metric.name, value: metric.value, time: Date.now() });
    localStorage.setItem('webVitalsHistory', JSON.stringify(history));
  };

  getTTFB(sendToAnalytics);
  getFID(sendToAnalytics);
  getCLS(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTBT(sendToAnalytics);
}
