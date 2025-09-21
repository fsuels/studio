'use client';

import { useEffect, useState } from 'react';
import Carousel from './Carousel';
import { Spinner } from '@/components/ui/Spinner';
import type { Review } from '@/types';

const reviewLoaders: Record<string, () => Promise<{ reviews: Review[] | undefined }>> = {
  'bill-of-sale-vehicle': () => import('@/data/reviews/bill-of-sale-vehicle'),
};

export default function TestimonialsCarousel({
  templateId,
}: {
  templateId: string;
}) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    setReviews(null);

    const loader = reviewLoaders[templateId];
    if (!loader) {
      console.info(
        [TestimonialsCarousel] No testimonial data registered for template ; skipping carousel.,
      );
      setReviews([]);
      return;
    }

    loader()
      .then((mod) => {
        if (cancelled) return;
        setReviews(mod.reviews ?? []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error([TestimonialsCarousel] Failed to load reviews for :, error);
        setReviews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  if (reviews === null) return <Spinner className="my-12" />;
  if (reviews.length === 0) return null;
  return <Carousel reviews={reviews} />;
}
