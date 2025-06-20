// React hooks for funnel tracking and event analytics
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  funnelAnalytics, 
  createFunnelStep, 
  generateSessionId, 
  type FunnelStep 
} from '@/lib/funnel-analytics';

// Main funnel tracking hook
export function useFunnelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionIdRef = useRef<string | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const pageLoadTimeRef = useRef<number>(Date.now());
  const [currentStep, setCurrentStep] = useState<FunnelStep['step'] | null>(null);

  // Initialize session
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateSessionId();
    }
    pageLoadTimeRef.current = Date.now();
  }, []);

  // Track funnel step
  const trackStep = useCallback(async (
    step: FunnelStep['step'],
    metadata: Partial<FunnelStep['metadata']> = {}
  ) => {
    if (!sessionIdRef.current) return;

    const timeOnPreviousStep = stepTimerRef.current 
      ? Date.now() - stepTimerRef.current 
      : 0;

    const enhancedMetadata = {
      ...metadata,
      source: getTrafficSource(),
      campaign: searchParams?.get('utm_campaign') || undefined,
      referrer: document.referrer || undefined,
      pageLoadTime: Date.now() - pageLoadTimeRef.current,
      timeOnStep: timeOnPreviousStep > 0 ? timeOnPreviousStep / 1000 : undefined,
      userAgent: navigator.userAgent,
      ipAddress: await getClientIP(),
      device: getDeviceType(),
      browser: getBrowserInfo(),
      os: getOSInfo(),
      countryCode: await getCountryCode(),
      scrollDepth: getScrollDepth(),
      clickCount: getClickCount(),
      formInteractions: getFormInteractions()
    };

    const funnelStep = createFunnelStep(step, sessionIdRef.current, enhancedMetadata);
    
    await funnelAnalytics.trackStep(funnelStep);
    
    setCurrentStep(step);
    stepTimerRef.current = Date.now();
  }, [searchParams]);

  // Auto-track based on pathname
  useEffect(() => {
    const step = inferStepFromPath(pathname);
    if (step) {
      trackStep(step, {
        documentType: inferDocumentType(pathname),
        previousStep: currentStep || undefined
      });
    }
  }, [pathname, trackStep, currentStep]);

  return {
    trackStep,
    currentStep,
    sessionId: sessionIdRef.current
  };
}

// Hook for tracking specific events
export function useEventTracking() {
  const { trackStep, sessionId } = useFunnelTracking();

  const trackEvent = useCallback(async (
    eventName: string,
    properties: Record<string, any> = {}
  ) => {
    if (!sessionId) return;

    // Map events to funnel steps
    const stepMapping: Record<string, FunnelStep['step']> = {
      'page_view': 'visit',
      'document_selected': 'visit',
      'form_started': 'draft',
      'form_saved': 'draft',
      'checkout_initiated': 'checkout',
      'payment_started': 'checkout',
      'document_signed': 'signed',
      'order_completed': 'signed'
    };

    const step = stepMapping[eventName];
    if (step) {
      await trackStep(step, properties);
    }

    // Also send to analytics service
    await sendEventToAnalytics(eventName, properties, sessionId);
  }, [trackStep, sessionId]);

  const trackFormInteraction = useCallback((
    formName: string,
    fieldName: string,
    action: 'focus' | 'blur' | 'change' | 'error'
  ) => {
    trackEvent('form_interaction', {
      formName,
      fieldName,
      action,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackErrorEncounter = useCallback((
    errorType: string,
    errorMessage: string,
    context: Record<string, any> = {}
  ) => {
    trackEvent('error_encountered', {
      errorType,
      errorMessage,
      context,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackAbandonmentIntent = useCallback(() => {
    trackEvent('abandonment_intent', {
      trigger: 'exit_intent',
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackFormInteraction,
    trackErrorEncounter,
    trackAbandonmentIntent
  };
}

// Hook for real-time abandonment detection
export function useAbandonmentDetection() {
  const { sessionId } = useFunnelTracking();
  const { trackAbandonmentIntent } = useEventTracking();
  const [showRetentionOffer, setShowRetentionOffer] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mouseLeaveBoundaryRef = useRef(false);

  // Track user inactivity
  useEffect(() => {
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      inactivityTimerRef.current = setTimeout(() => {
        // User inactive for 5 minutes
        trackAbandonmentIntent();
        setShowRetentionOffer(true);
      }, 5 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [trackAbandonmentIntent]);

  // Track exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !mouseLeaveBoundaryRef.current) {
        mouseLeaveBoundaryRef.current = true;
        trackAbandonmentIntent();
        setShowRetentionOffer(true);
        
        // Reset after 10 seconds
        setTimeout(() => {
          mouseLeaveBoundaryRef.current = false;
        }, 10000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trackAbandonmentIntent]);

  const dismissRetentionOffer = useCallback(() => {
    setShowRetentionOffer(false);
  }, []);

  return {
    showRetentionOffer,
    dismissRetentionOffer
  };
}

// Hook for form tracking
export function useFormTracking(formName: string) {
  const { trackFormInteraction } = useEventTracking();
  const startTimeRef = useRef<number>(Date.now());
  const [formState, setFormState] = useState({
    started: false,
    completed: false,
    abandonmentRisk: 0
  });

  const trackFieldFocus = useCallback((fieldName: string) => {
    if (!formState.started) {
      setFormState(prev => ({ ...prev, started: true }));
    }
    trackFormInteraction(formName, fieldName, 'focus');
  }, [formName, trackFormInteraction, formState.started]);

  const trackFieldBlur = useCallback((fieldName: string, value: any) => {
    trackFormInteraction(formName, fieldName, 'blur');
    
    // Calculate abandonment risk based on time spent and completion
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
    const riskScore = calculateFormAbandonmentRisk(timeSpent, value);
    
    setFormState(prev => ({ ...prev, abandonmentRisk: riskScore }));
  }, [formName, trackFormInteraction]);

  const trackFieldChange = useCallback((fieldName: string, value: any) => {
    trackFormInteraction(formName, fieldName, 'change');
  }, [formName, trackFormInteraction]);

  const trackFieldError = useCallback((fieldName: string, error: string) => {
    trackFormInteraction(formName, fieldName, 'error');
  }, [formName, trackFormInteraction]);

  const trackFormCompletion = useCallback(() => {
    setFormState(prev => ({ ...prev, completed: true }));
    const timeToComplete = (Date.now() - startTimeRef.current) / 1000;
    
    trackFormInteraction(formName, 'form_complete', 'change');
  }, [formName, trackFormInteraction]);

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFieldChange,
    trackFieldError,
    trackFormCompletion,
    formState
  };
}

// Hook for performance tracking
export function usePerformanceTracking() {
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    // Track page load performance
    const trackPagePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          trackEvent('page_performance', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: getFirstPaint(),
            firstContentfulPaint: getFirstContentfulPaint(),
            largestContentfulPaint: getLargestContentfulPaint()
          });
        }
      }
    };

    // Track after page is fully loaded
    if (document.readyState === 'complete') {
      trackPagePerformance();
    } else {
      window.addEventListener('load', trackPagePerformance);
      return () => window.removeEventListener('load', trackPagePerformance);
    }
  }, [trackEvent]);

  // Track Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cumulative Layout Shift
      let clsScore = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
          }
        }
        
        trackEvent('core_web_vitals', {
          metric: 'CLS',
          value: clsScore
        });
      }).observe({ type: 'layout-shift', buffered: true });

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackEvent('core_web_vitals', {
            metric: 'FID',
            value: (entry as any).processingStart - entry.startTime
          });
        }
      }).observe({ type: 'first-input', buffered: true });
    }
  }, [trackEvent]);
}

// Utility functions
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem('funnel_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('funnel_session_id', sessionId);
  }
  return sessionId;
}

function inferStepFromPath(pathname: string): FunnelStep['step'] | null {
  if (pathname.includes('/docs/') && pathname.includes('/start')) return 'draft';
  if (pathname.includes('/checkout')) return 'checkout';
  if (pathname.includes('/complete') || pathname.includes('/success')) return 'signed';
  if (pathname.includes('/docs/')) return 'visit';
  return null;
}

function inferDocumentType(pathname: string): string | undefined {
  const matches = pathname.match(/\/docs\/([^\/]+)/);
  return matches ? matches[1] : undefined;
}

function getTrafficSource(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  try {
    const domain = new URL(referrer).hostname;
    
    if (domain.includes('google')) return 'google';
    if (domain.includes('facebook') || domain.includes('fb')) return 'facebook';
    if (domain.includes('twitter') || domain.includes('t.co')) return 'twitter';
    if (domain.includes('linkedin')) return 'linkedin';
    if (domain.includes('youtube')) return 'youtube';
    
    return 'referral';
  } catch {
    return 'unknown';
  }
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

async function getCountryCode(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code;
  } catch {
    return 'unknown';
  }
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  return 'unknown';
}

function getOSInfo(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'windows';
  if (userAgent.includes('Mac')) return 'macos';
  if (userAgent.includes('Linux')) return 'linux';
  if (userAgent.includes('Android')) return 'android';
  if (userAgent.includes('iOS')) return 'ios';
  return 'unknown';
}

function getScrollDepth(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  return documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
}

let clickCount = 0;
if (typeof window !== 'undefined') {
  document.addEventListener('click', () => clickCount++);
}

function getClickCount(): number {
  return clickCount;
}

let formInteractionCount = 0;
if (typeof window !== 'undefined') {
  document.addEventListener('focus', (e) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      formInteractionCount++;
    }
  }, true);
}

function getFormInteractions(): number {
  return formInteractionCount;
}

function calculateFormAbandonmentRisk(timeSpent: number, currentValue: any): number {
  let risk = 0;
  
  // Time-based risk
  if (timeSpent > 300) risk += 0.3; // 5+ minutes
  if (timeSpent > 600) risk += 0.2; // 10+ minutes
  
  // Completion-based risk
  if (!currentValue || (typeof currentValue === 'string' && currentValue.length < 3)) {
    risk += 0.4;
  }
  
  return Math.min(1, risk);
}

function getFirstPaint(): number | undefined {
  const paintEntries = performance.getEntriesByType('paint');
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
  return firstPaint?.startTime;
}

function getFirstContentfulPaint(): number | undefined {
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  return fcp?.startTime;
}

function getLargestContentfulPaint(): Promise<number | undefined> {
  return new Promise(resolve => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      resolve(lastEntry?.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

async function sendEventToAnalytics(
  eventName: string, 
  properties: Record<string, any>, 
  sessionId: string
): Promise<void> {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        properties,
        sessionId,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to send event to analytics:', error);
  }
}