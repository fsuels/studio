
// TrustAndTestimonialsSection.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function TrustAndTestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [docCount, setDocCount] = useState(4200);
  const [isHydrated, setIsHydrated] = useState(false);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
    const interval = setInterval(() => {
      setDocCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const testimonialsObject = t('home.testimonials', { returnObjects: true, ns: 'translation' });
      if (typeof testimonialsObject === 'object' && testimonialsObject !== null && !Array.isArray(testimonialsObject)) {
        const count = Object.keys(testimonialsObject).filter(key => key.startsWith('t') && typeof testimonialsObject[key] === 'object').length;
        setTestimonialCount(count > 0 ? count : 3); 
      } else {
        setTestimonialCount(3); 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, t, i18n.language]); 

  const placeholderText = '...';
  
  // Ensure formattedCount is only calculated after hydration
  const formattedCount = isHydrated ? docCount.toLocaleString(i18n.language) : placeholderText;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320 + 24; 
    scrollRef.current.scrollBy({ left: dir === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

   const scrollToWorkflow = () => {
    const workflowSection = document.getElementById('workflow-start');
    if (workflowSection) {
      workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       console.warn('Workflow section with id "workflow-start" not found.');
    }
  };

  return (
    <section className="bg-secondary/30 py-20 px-4 text-center">
      <h2 className="text-sm uppercase text-muted-foreground tracking-wide mb-4 font-medium">
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm mb-16">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {/* Use pre-calculated formattedCount */}
          <span>{isHydrated ? t('home.trustStrip.badge1', { count: formattedCount }) : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <span>{isHydrated ? t('home.trustStrip.badge2') : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> {/* Updated Icon */}
          <span>{isHydrated ? t('home.trustStrip.badge3') : placeholderText}</span>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-foreground mb-10">
        {isHydrated ? t('home.testimonials.title') : placeholderText}
      </h3>

      <div className="relative max-w-6xl mx-auto">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[-10px] md:left-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          disabled={!isHydrated}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 scrollbar-hide px-4 py-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {!isHydrated || testimonialCount === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 shrink-0 flex flex-col border border-border animate-pulse"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="h-16 w-16 rounded-full bg-muted mb-4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                <div className="mt-auto text-center">
                  <div className="h-4 bg-muted rounded w-1/2 mb-1 mx-auto"></div>
                  <div className="h-3 bg-muted rounded w-1/3 mx-auto"></div>
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: testimonialCount }).map((_, i) => (
             <div
               key={i}
               className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 text-left shrink-0 flex flex-col border border-border transition hover:shadow-xl"
               style={{ scrollSnapAlign: 'start' }}
             >
                <Image
                   src={`https://picsum.photos/seed/${i+30}/60/60`}
                   alt={isHydrated ? t(`home.testimonials.t${i + 1}.name`, { defaultValue: 'Testimonial Avatar'}) : 'Loading...'}
                   width={60}
                   height={60}
                   className="rounded-full mb-4 border-2 border-primary/30 mx-auto"
                   data-ai-hint="person portrait professional"
                 />
               <p className="italic text-foreground/90 mb-4 leading-relaxed flex-grow">
                 {isHydrated ? t(`home.testimonials.t${i + 1}.quote`, { defaultValue: 'Loading quote...'}) : placeholderText}
               </p>
               <div className="mt-auto text-center">
                 <p className="font-semibold text-sm text-foreground">
                   {isHydrated ? t(`home.testimonials.t${i + 1}.name`, { defaultValue: 'Loading name...'}) : placeholderText}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {isHydrated ? t(`home.testimonials.t${i + 1}.title`, { defaultValue: 'Loading title...'}) : placeholderText}
                 </p>
               </div>
             </div>
            ))
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-[-10px] md:right-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={!isHydrated}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-20 flex flex-col items-center space-y-6">
         <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <span className="font-medium text-foreground/90">{isHydrated ? t('home.moneyBackGuarantee') : placeholderText}</span>
         </div>
          <Button
              size="lg"
              className="mt-6 px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground transition rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={scrollToWorkflow}
              disabled={!isHydrated}
           >
              {isHydrated ? t('home.callToAction') : placeholderText}
           </Button>
      </div>
    </section>
  );
}
