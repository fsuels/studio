// TrustAndTestimonialsSection.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'; 
import { useTranslation } from 'react-i18next'; 
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Lock, ShieldCheck, Star } from 'lucide-react'; 
import Image from 'next/image'; 

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  outcome?: string; // New field for outcome
}

const MemoizedTestimonialCard = React.memo(function TestimonialCard({ testimonial, index, t, isHydrated, placeholderText }: { testimonial: Testimonial | null; index: number; t: (key: string, fallback?: string | object) => string; isHydrated: boolean; placeholderText: string; }) {
  const rating = 5; // Placeholder rating
  return (
    <div
      className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 text-left shrink-0 flex flex-col border border-border transition hover:shadow-xl"
      style={{ scrollSnapAlign: 'start' }}
    >
      {testimonial ? (
        <>
          <Image
            src={`https://picsum.photos/seed/${index + 30}/96/96`} // Updated size
            alt={isHydrated ? t(`home.testimonials.t${index + 1}.name`, { defaultValue: 'Testimonial Avatar'}) : 'Loading...'}
            width={96} // Updated size
            height={96} // Updated size
            loading="lazy"
            data-ai-hint="person portrait professional"
            className="rounded-full mb-4 border-2 border-primary/30 mx-auto"
          />
          <div className="flex justify-center mb-2">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
             {Array.from({ length: 5 - rating }).map((_, i) => (
              <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
          <p className="italic text-foreground/90 mb-4 leading-relaxed flex-grow">
            "{isHydrated ? testimonial.quote : placeholderText}"
          </p>
          {testimonial.outcome && (
            <p className="text-sm text-primary font-medium mb-3 text-center">
              {isHydrated ? testimonial.outcome : placeholderText}
            </p>
          )}
          <div className="mt-auto text-center">
            <p className="font-semibold text-sm text-foreground">
              {isHydrated ? testimonial.name : placeholderText}
            </p>
            <p className="text-xs text-muted-foreground">
              {isHydrated ? testimonial.title : placeholderText}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="h-24 w-24 rounded-full bg-muted mb-4 mx-auto animate-pulse"></div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_,i) => <div key={i} className="h-4 w-4 bg-muted rounded-sm mx-0.5 animate-pulse"></div>)}
          </div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-full mb-1 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-4 animate-pulse"></div>
           <div className="h-3 bg-muted rounded w-1/2 mb-3 mx-auto animate-pulse"></div>
          <div className="mt-auto text-center">
            <div className="h-4 bg-muted rounded w-1/2 mb-1 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        </>
      )}
    </div>
  );
});

const TrustAndTestimonialsSection = React.memo(function TrustAndTestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [docCount, setDocCount] = useState(4200);
  const [isHydrated, setIsHydrated] = useState(false);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
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
      const rawTestimonials = t('home.testimonials', { returnObjects: true, ns: 'translation' }) as any;
      if (typeof rawTestimonials === 'object' && rawTestimonials !== null && !Array.isArray(rawTestimonials)) {
        const loadedTestimonials: Testimonial[] = [];
        for (let i = 1; i <= 25; i++) { 
          if (rawTestimonials[`t${i}`] && typeof rawTestimonials[`t${i}`] === 'object') {
            loadedTestimonials.push({
              quote: rawTestimonials[`t${i}`].quote || 'Loading quote...',
              name: rawTestimonials[`t${i}`].name || 'Loading name...',
              title: rawTestimonials[`t${i}`].title || 'Loading title...',
              outcome: rawTestimonials[`t${i}`].outcome || undefined,
            });
          }
        }
        setTestimonialsData(loadedTestimonials);
        setTestimonialCount(loadedTestimonials.length > 0 ? loadedTestimonials.length : 3);
      } else {
        setTestimonialCount(3); 
        setTestimonialsData([]);
      }
    }
  }, [isHydrated, t, i18n.language]);

  const placeholderText = '...';
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
    <section className="bg-secondary/30 py-16 md:py-20 px-4 text-center">
      {/* Trust Strip - Modified */}
      <div className="container mx-auto px-4 mb-12 md:mb-16">
        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-3 font-medium">
          {isHydrated ? t('home.trustStrip.title', {defaultValue: "Trusted By Professionals"}) : placeholderText}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-6 gap-y-3 text-foreground/90 text-sm font-medium">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>{isHydrated ? t('home.trustStrip.badge1', { count: formattedCount, defaultValue: `Over ${formattedCount} documents generated` }) : placeholderText}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>{t('trustBadges.secure', { defaultValue: "SSL Secure Checkout" })}</span>
          </div>
           <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> 
            <span>{t('trustBadges.attorneyReviewed', { defaultValue: "Attorney-Reviewed Templates" })}</span>
          </div>
        </div>
      </div>


      <h3 className="text-3xl font-bold text-foreground mb-10">
        {isHydrated ? t('home.testimonials.title', {defaultValue: "What Our Users Say"}) : placeholderText}
      </h3>

      <div className="relative max-w-6xl mx-auto">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[-10px] md:left-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md border-border"
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
          {Array.from({ length: testimonialCount }).map((_, i) => (
            <MemoizedTestimonialCard
              key={i}
              testimonial={testimonialsData[i] || null}
              index={i}
              t={t}
              isHydrated={isHydrated}
              placeholderText={placeholderText}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-[-10px] md:right-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md border-border"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={!isHydrated}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col items-center space-y-6">
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
