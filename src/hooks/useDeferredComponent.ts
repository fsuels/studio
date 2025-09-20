import { useEffect, useRef, useState, type ComponentType } from 'react';

type IdleHandle = number;

type IdleCapableWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => IdleHandle;
  cancelIdleCallback?: (handle: IdleHandle) => void;
};

interface UseDeferredComponentOptions {
  trigger?: boolean;
  preload?: boolean;
  idleDelay?: number;
}

/**
 * Defers loading of a dynamically imported component until it is explicitly needed.
 * Useful for lightweight placeholders while heavy chunks hydrate.
 */
export function useDeferredComponent<T>(
  loader: () => Promise<{ default: ComponentType<T> }>,
  options: UseDeferredComponentOptions = {},
) {
  const { trigger = false, preload = false, idleDelay = 800 } = options;
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    if (Component) return;

    let cancelled = false;
    let timeoutId: number | undefined;
    let idleHandle: number | undefined;

    const importComponent = () => {
      if (cancelled) return;
      loaderRef.current().then((mod) => {
        if (!cancelled) {
          setComponent(() => mod.default);
        }
      });
    };

    const cancelIdleWork = () => {
      if (typeof window === 'undefined') return;
      const idleWindow = window as IdleCapableWindow;
      if (
        idleHandle !== undefined &&
        typeof idleWindow.cancelIdleCallback === 'function'
      ) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };

    if (trigger) {
      importComponent();
      return () => {
        cancelled = true;
        cancelIdleWork();
      };
    }

    if (preload && typeof window !== 'undefined') {
      const idleWindow = window as IdleCapableWindow;
      if (typeof idleWindow.requestIdleCallback === 'function') {
        idleHandle = idleWindow.requestIdleCallback(importComponent, {
          timeout: idleDelay,
        });
      } else {
        timeoutId = window.setTimeout(importComponent, idleDelay);
      }
    }

    return () => {
      cancelled = true;
      cancelIdleWork();
    };
  }, [Component, trigger, preload, idleDelay]);

  return Component;
}

