import React from 'react';
import { Star } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Review {
  templateId: string;
  name: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
}

interface Props {
  templateId: string;
}

export default function TestimonialsCarousel({ templateId }: Props) {
  const { data: reviews } = useSuspenseQuery(['reviews', templateId], async () => {
    const db = await getDb();
    const q = query(collection(db, 'reviews'), where('templateId', '==', templateId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Review);
  });

  if (!reviews.length) return null;

  return (
    <section className="max-w-4xl mx-auto">
      <Carousel className="relative">
        <CarouselContent>
          {reviews.map((r, idx) => (
            <CarouselItem key={idx} className="basis-3/4 sm:basis-1/2 md:basis-1/3">
              <div className="p-4 bg-card border border-border rounded-lg shadow-sm h-full flex flex-col text-center">
                {r.avatarUrl && (
                  <img src={r.avatarUrl} alt={r.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" loading="lazy" />
                )}
                <div className="flex justify-center mb-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm italic mb-2">&ldquo;{r.quote}&rdquo;</p>
                <p className="text-sm font-semibold">{r.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8" />
        <CarouselNext className="-right-8" />
      </Carousel>
    </section>
  );
}
