// Allow any argument types for debounced functions
export type AnyFn<Args extends any[] = any[]> = (
  ..._args: Args
) => void;

export interface DebouncedFunction<F extends AnyFn> {
  (..._args: Parameters<F>): void;
  cancel(): void;
}

export function debounce<F extends AnyFn>(
  fn: F,
  wait: number,
): DebouncedFunction<F> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<F>) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  }) as DebouncedFunction<F>;

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
  };

  return debounced;
}
