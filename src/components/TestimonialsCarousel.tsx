import React from 'react';
import Carousel from './Carousel';
import { vehicleBillOfSaleReviews } from '@/data/reviews/vehicle-bill-of-sale';
import type { Review } from '@/types/reviews';

export default function TestimonialsCarousel({ templateId }: { templateId: string }) {
  const reviews: Review[] =
    templateId === 'vehicle-bill-of-sale' ? vehicleBillOfSaleReviews : [];

  if (reviews.length === 0) return null;
  return <Carousel reviews={reviews} />;
}
