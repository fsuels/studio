export type AnyFn<Args extends unknown[] = unknown[]> = (
  ..._args: Args
) => void;

export interface DebouncedFunction<Args extends unknown[]> {
  (..._args: Args): void;
  cancel(): void;
}

export function debounce<Args extends unknown[]>(
  fn: (..._args: Args) => void,
  wait: number,
): DebouncedFunction<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Args) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  }) as DebouncedFunction<Args>;

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
  };

  return debounced;
}
