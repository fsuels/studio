import { Star } from 'lucide-react';

export default function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex justify-center mb-2">
      {Array.from({ length: rounded }).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400 star-gradient" />
      ))}
    </div>
  );
}
