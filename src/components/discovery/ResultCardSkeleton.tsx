'use client';

import React from 'react';

export function ResultCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-40"></div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
        </div>
      </div>
    </div>
  );
}
