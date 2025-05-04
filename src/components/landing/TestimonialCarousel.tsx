// src/components/landing/TestimonialCarousel.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Assuming ShadCN Carousel is installed and configured

// Placeholder testimonials
const testimonials = [
  {
    quote: "123LegalDoc saved me $500 on my lease agreement. Super easy to use!",
    name: "Sarah Chen",
    title: "Small Business Owner",
    avatar: "/avatars/sarah.jpg", // Replace with actual paths or use Picsum
    dataAiHint: "woman smiling",
  },
  {
    quote: "Generating a partnership agreement took minutes instead of days. Highly recommended.",
    name: "Michael B.",
    title: "Freelancer",
    avatar: "/avatars/michael.jpg",
    dataAiHint: "man portrait professional",
  },
  {
    quote: "The AI inference was spot on, and the questionnaire was straightforward. Great service!",
    name: "Emily White",
    title: "Startup Founder",
    avatar: "/avatars/emily.jpg",
    dataAiHint: "woman glasses",
  },
];

export function TestimonialCarousel() {
  return (
    <section className="w-full py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-10 text-foreground">What Our Users Say</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-md rounded-lg border border-border bg-card">
                    <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                      <Image
                        src={`https://picsum.photos/seed/${index+10}/80/80`} // Using Picsum placeholder
                        alt={`${testimonial.name}'s avatar`}
                        width={80}
                        height={80}
                        className="rounded-full mb-4 border-2 border-primary/50"
                        data-ai-hint={testimonial.dataAiHint}
                      />
                      <p className="text-base italic text-foreground/90 mb-4 flex-grow">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
