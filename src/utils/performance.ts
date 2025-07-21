export function mark(name: string) {
  if (
    typeof window !== 'undefined' &&
    'performance' in window &&
    typeof performance.mark === 'function'
  ) {
    try {
      performance.mark(name);
    } catch {
      // ignore
    }
  }
}

export function measure(name: string, startMark: string, endMark: string) {
  if (
    typeof window !== 'undefined' &&
    'performance' in window &&
    typeof performance.measure === 'function'
  ) {
    try {
      performance.measure(name, startMark, endMark);
    } catch {
      // ignore
    }
  }
}
