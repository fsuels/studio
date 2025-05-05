// src/components/landing/HomepageTestimonialsFooter.tsx
"use client";

import React from 'react';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import TrustStrip from '@/components/landing/TrustStrip'; // Import TrustStrip
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';

export default function HomepageTestimonialsFooter() {
  return (
    <div className="w-full mt-16"> {/* Add margin-top */}
      <TestimonialCarousel />
      <TrustStrip /> {/* Use TrustStrip component */}
      <GuaranteeBadge />
    </div>
  );
}
