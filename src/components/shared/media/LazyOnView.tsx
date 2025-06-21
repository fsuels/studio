'use client';
import React, { useEffect, useRef, useState, type ComponentType } from 'react';

function lazyOnView<T>(
  loader: () => Promise<{ default: ComponentType<T> }>,
  options?: { placeholder?: React.ReactNode; rootMargin?: string },
) {
  return function LazyLoaded(props: T) {
    const [Comp, setComp] = useState<ComponentType<T> | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loader().then((mod) => setComp(() => mod.default));
              if (node) obs.unobserve(node);
            }
          });
        },
        { rootMargin: options?.rootMargin ?? '200px' },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref}>
        {Comp ? <Comp {...props} /> : (options?.placeholder ?? null)}
      </div>
    );
  };
}

export default lazyOnView;
