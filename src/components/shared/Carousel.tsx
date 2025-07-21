import React from 'react';
import { Star } from 'lucide-react';
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Review } from '@/types';

export default function Carousel({ reviews }: { reviews: Review[] }) {
  return (
    <section className="max-w-4xl mx-auto">
      <BaseCarousel className="relative" opts={{ loop: true }}>
        <CarouselContent>
          {reviews.map((r, idx) => (
            <CarouselItem
              key={idx}
              className="basis-3/4 sm:basis-1/2 md:basis-1/3"
            >
              <div className="p-4 bg-card border border-border rounded-lg shadow-sm h-full flex flex-col text-center">
                <div className="flex justify-center mb-2">
                  {Array.from({ length: Math.round(r.rating) }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400 star-gradient"
                    />
                  ))}
                </div>
                <p className="text-sm italic mb-2">&ldquo;{r.quote}&rdquo;</p>
                <p className="text-sm font-semibold">{r.name}</p>
                {r.location && (
                  <p className="mt-1 text-sm text-gray-500">{r.location}</p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8" />
        <CarouselNext className="-right-8" />
      </BaseCarousel>
    </section>
  );
}
