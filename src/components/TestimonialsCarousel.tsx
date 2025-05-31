import { useEffect, useState } from 'react';
import Carousel from './Carousel';
import { Spinner } from '@/components/ui/Spinner';
import type { Review } from '@/types';

export default function TestimonialsCarousel({
  templateId,
}: {
  templateId: string;
}) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    import(`@/data/reviews/${templateId}.ts`)
      .then((mod) => {
        setReviews(mod.reviews as Review[]);
      })
      .catch((error) => {
        console.error('Error loading reviews:', error);
        setReviews([]);
      });
  }, [templateId]);

  if (reviews === null) return <Spinner className="my-12" />;
  if (reviews.length === 0) return null;
  return <Carousel reviews={reviews} />;
}
