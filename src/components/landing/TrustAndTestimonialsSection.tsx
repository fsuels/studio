// src/components/landing/TrustAndTestimonialsSection.tsx
'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Lock, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';


interface Testimonial {
  quote: string;
  name: string;
  title: string;
  outcome?: string;
  avatarSeed: number; // Ensure avatarSeed is always present and unique
}

// More varied placeholder data
const placeholderNames = ["Alex P.", "Jamie S.", "Chris L.", "Morgan B.", "Taylor K."];
const placeholderTitles = ["Startup Founder", "Freelance Designer", "E-commerce Seller", "Consultant", "Real Estate Agent"];
const placeholderQuotes = [
  "This platform is a game-changer for legal documents!",
  "Incredibly easy to use and very professional results.",
  "Saved me so much time and potential legal fees. Highly recommend!",
  "The best DIY legal tool I've come across. Five stars!",
  "Finally, a service that makes legal paperwork straightforward."
];
const placeholderOutcomes = [
  "Launched my business with confidence.",
  "Secured all my client contracts.",
  "Streamlined my sales agreements.",
  "Protected my intellectual property.",
  "Finalized my property lease quickly."
];


const MemoizedTestimonialCard = React.memo(function TestimonialCard({ testimonial, index, t, isHydrated, placeholderText }: { testimonial: Testimonial | null; index: number; t: (key: string, fallback?: string | object) => string; isHydrated: boolean; placeholderText: string; }) {
  const rating = 5;
  // Use a more robust seed for picsum, combining a base with the index and testimonial's own seed
  const imageSeed = testimonial ? testimonial.avatarSeed : (index * 17 + 30); // Ensure unique seed for placeholders

  return (
    <div
      className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 text-left shrink-0 flex flex-col border border-border transition-shadow hover:shadow-xl h-full"
    >
      {testimonial ? (
        <>
          <Image
            src={`https://picsum.photos/seed/${imageSeed}/96/96`}
            alt={isHydrated ? t(testimonial.name, { defaultValue: 'Testimonial Avatar'}) : 'Loading...'}
            width={96}
            height={96}
            loading="lazy"
            data-ai-hint="person portrait" // Keep this hint
            className="rounded-full mb-4 border-2 border-primary/30 mx-auto shrink-0"
          />
          <div className="flex justify-center mb-3">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
             {Array.from({ length: 5 - rating }).map((_, i) => (
              <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
          <p className="italic text-foreground/90 mb-4 leading-relaxed text-sm flex-grow">
            "{isHydrated ? testimonial.quote : placeholderText}"
          </p>
          {testimonial.outcome && (
            <p className="text-xs text-primary font-semibold mb-3 text-center p-1 bg-primary/10 rounded">
              {isHydrated ? testimonial.outcome : placeholderText}
            </p>
          )}
          <div className="mt-auto text-center pt-3 border-t border-border/50">
            <p className="font-semibold text-sm text-foreground">
              {isHydrated ? testimonial.name : placeholderText}
            </p>
            <p className="text-xs text-muted-foreground">
              {isHydrated ? testimonial.title : placeholderText}
            </p>
          </div>
        </>
      ) : (
        // Skeleton loader for testimonial card
        (<div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-muted mb-4 animate-pulse"></div>
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_,i) => <div key={i} className="h-4 w-4 bg-muted rounded-sm mx-0.5 animate-pulse"></div>)}
          </div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-full mb-1 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-4 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-1/2 mb-3 mx-auto animate-pulse"></div>
          <div className="mt-auto text-center pt-3 border-t border-border/50 w-full">
            <div className="h-4 bg-muted rounded w-1/2 mb-1 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        </div>)
      )}
    </div>
  );
});

const TrustAndTestimonialsSection = React.memo(function TrustAndTestimonialsSection() {
  const { t, i18n, ready } = useTranslation("common");
  const [docCount, setDocCount] = useState(4200);
  const [isHydrated, setIsHydrated] = useState(false);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);

  const autoplayOptions = { delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true };
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay(autoplayOptions)]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);


  useEffect(() => {
    setIsHydrated(true);
    const interval = setInterval(() => {
      setDocCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isHydrated && ready) {
      const rawTestimonials = t('home.testimonials', { returnObjects: true, ns: 'common' }) as any;
      let loadedTestimonials: Testimonial[] = [];

      if (typeof rawTestimonials === 'object' && rawTestimonials !== null && !Array.isArray(rawTestimonials) && Object.keys(rawTestimonials).length > 0) {
        for (let i = 1; i <= 5; i++) {
          if (rawTestimonials[`t${i}`] && typeof rawTestimonials[`t${i}`] === 'object' && rawTestimonials[`t${i}`].name) { // Check if name exists
            loadedTestimonials.push({
              quote: rawTestimonials[`t${i}`].quote || `Placeholder quote ${i}`,
              name: rawTestimonials[`t${i}`].name, // Assume name exists
              title: rawTestimonials[`t${i}`].title || `Placeholder title ${i}`,
              outcome: rawTestimonials[`t${i}`].outcome || undefined,
              avatarSeed: rawTestimonials[`t${i}`].avatarSeed || (i + 1) * 100, // Use provided seed or generate unique
            });
          }
        }
      }

      // If not enough testimonials loaded from translations, fill with varied placeholders
      if (loadedTestimonials.length < 5) {
        const numPlaceholdersNeeded = 5 - loadedTestimonials.length;
        const existingSeeds = new Set(loadedTestimonials.map(t => t.avatarSeed));
        for (let i = 0; i < numPlaceholdersNeeded; i++) {
          let seed = (loadedTestimonials.length + i + 1) * 111; // Start with a base seed
          while(existingSeeds.has(seed)) { // Ensure seed is unique
            seed += 7;
          }
          existingSeeds.add(seed);
          loadedTestimonials.push({
            quote: placeholderQuotes[i % placeholderQuotes.length],
            name: placeholderNames[i % placeholderNames.length],
            title: placeholderTitles[i % placeholderTitles.length],
            outcome: placeholderOutcomes[i % placeholderOutcomes.length],
            avatarSeed: seed,
          });
        }
      }
      setTestimonialsData(loadedTestimonials.slice(0, 5)); // Ensure only 5 testimonials
    }
  }, [isHydrated, ready, i18n.language, t]);

  const placeholderText = '...';
  const formattedCount = isHydrated ? docCount.toLocaleString(i18n.language) : placeholderText;

  const scrollToWorkflow = () => {
    const workflowSection = document.getElementById('workflow-start');
    if (workflowSection) {
      workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-secondary/30 py-16 md:py-20 text-center">
      <div className="container mx-auto px-4 mb-12 md:mb-16">
        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-3 font-medium">
          {isHydrated ? t('home.trustStrip.title', {defaultValue: "Trusted By Professionals"}) : placeholderText}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-6 gap-y-3 text-foreground/90 text-sm font-medium">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>{isHydrated ? t('home.trustStrip.badge1', { count: formattedCount, defaultValue: `Over ${formattedCount} documents generated` }) : placeholderText}</span>
          </div>
           {/* Trustpilot Widget Placeholder */}
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <Image src="/images/trustpilot-logo-words.svg" alt="Trustpilot" width={80} height={20} data-ai-hint="trustpilot logo" />
            <div className="flex items-center">
                {Array.from({length: 5}).map((_, i) => <Star key={i} className="h-4 w-4 text-green-500 fill-green-500" />)}
            </div>
             <span className="text-xs text-muted-foreground">(4.9/5)</span>
          </div>
        </div>
      </div>


      <h3 className="text-3xl font-bold text-foreground mb-10 px-4">
        {isHydrated ? t('home.testimonials.title', {defaultValue: "What Our Users Say"}) : placeholderText}
      </h3>

      <div className="relative max-w-6xl mx-auto">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[-10px] md:left-[-20px] top-1/2 z-20 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md border-border h-10 w-10"
          onClick={scrollPrev}
          aria-label={t('Previous testimonial', {defaultValue: 'Previous testimonial'})}
          disabled={!isHydrated || !emblaApi}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4"> {/* Embla-carousel-react uses negative margin for spacing */}
            {(isHydrated && testimonialsData.length > 0 ? testimonialsData : Array(5).fill(null)).map((testimonial, i) => (
              <div key={testimonial ? testimonial.avatarSeed : `skel-${i}`} className={cn("pl-4 flex-[0_0_90%] sm:flex-[0_0_45%] md:flex-[0_0_33.33%]")}> {/* Carousel item sizing */}
                <MemoizedTestimonialCard
                  testimonial={testimonial}
                  index={i}
                  t={t}
                  isHydrated={isHydrated}
                  placeholderText={placeholderText}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-[-10px] md:right-[-20px] top-1/2 z-20 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md border-border h-10 w-10"
          onClick={scrollNext}
          aria-label={t('Next testimonial', {defaultValue: 'Next testimonial'})}
          disabled={!isHydrated || !emblaApi}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col items-center space-y-6 px-4">
         <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <span className="font-medium text-foreground/90">{isHydrated ? t('home.moneyBackGuarantee', {defaultValue: "100% Satisfaction Guarantee or Your Money Back"}) : placeholderText}</span>
         </div>
          <Button
              size="lg"
              className="mt-6 px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground transition rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={scrollToWorkflow}
              disabled={!isHydrated}
           >
              {isHydrated ? t('home.callToAction', {defaultValue: "Get Started Now"}) : placeholderText}
           </Button>
      </div>
    </section>
  );
});
export default TrustAndTestimonialsSection;
