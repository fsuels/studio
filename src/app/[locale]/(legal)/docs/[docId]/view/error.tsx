'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('🚨 View page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-600">Error: {error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}