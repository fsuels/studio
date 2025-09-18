'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AIFeatureTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);

  useEffect(() => {
    // Check if user has seen the tooltip before
    const seen = localStorage.getItem('ai-feature-tooltip-seen');
    if (!seen) {
      // Show tooltip after 3 seconds on first visit
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setHasSeenTooltip(true);
  }, []);

  const handleClose = () => {
    setShowTooltip(false);
    localStorage.setItem('ai-feature-tooltip-seen', 'true');
    setHasSeenTooltip(true);
  };

  if (hasSeenTooltip || !showTooltip) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-right-5 duration-500">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="pr-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-semibold text-sm">New AI Document Finder!</h3>
        </div>
        <p className="text-xs text-blue-100 mb-3">
          Just describe what you need in plain English and let our AI find the perfect legal document for you!
        </p>
        <p className="text-xs text-yellow-200 font-medium">
          💡 Look for the &quot;AI Finder&quot; button in the header
        </p>
      </div>
    </div>
  );
}