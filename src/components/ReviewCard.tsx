import { Review } from '@/types';
import Stars from './Stars';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col items-center rounded-lg border bg-white px-6 py-8 text-center shadow-sm">
      <Stars rating={review.rating} />
      <p className="my-4 italic leading-relaxed text-gray-800">
        “{review.quote}”
      </p>
      <p className="font-semibold">{review.name}</p>
      {review.location && (
        <p className="mt-1 text-sm text-gray-500">{review.location}</p>
      )}
    </article>
  );
}
