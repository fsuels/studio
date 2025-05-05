// src/components/landing/HomepageTestimonialsFooter.tsx
"use client";

import React from 'react';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { FeaturedLogos } from '@/components/landing/FeaturedLogos'; // Updated import path
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';

export default function HomepageTestimonialsFooter() {
  return (
    <div className="w-full mt-16"> {/* Add margin-top */}
      <TestimonialCarousel />
      <FeaturedLogos /> {/* Render the featured logos section */}
      <GuaranteeBadge />
    </div>
  );
}
