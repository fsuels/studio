// src/components/landing/TrustAndTestimonialsSection.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Star } from 'lucide-react';
import CarouselNavArrow from '@/components/CarouselNavArrow';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quoteKey: string;
  nameKey: string;
  titleKey: string;
  outcomeKey?: string;
  avatarSeed: number;
  avatarUrl?: string;
  defaultQuote: string;
  defaultName: string;
  defaultTitle: string;
  defaultOutcome?: string;
}

// Expanded and more varied placeholder data arrays
const placeholderQuotes = [
  'The AI document generation is incredibly intuitive and saved me hours of work. This platform is a game-changer for small businesses!',
  'I needed a solid lease agreement quickly, and this platform delivered exactly what I needed. Professional, easy to understand, and legally sound.',
  'As a freelancer, getting contracts right is key. 123LegalDoc made it simple, affordable, and gave me peace of mind for all my client engagements.',
  "The sheer variety of documents available is impressive. It's become my go-to legal resource for almost everything, from NDAs to partnership agreements.",
  'Navigating legal needs as an immigrant can be daunting. This tool provided clarity, support, and the correct documents I needed, all in one place.',
  'I was skeptical about AI for legal docs, but the quality and customization options here are outstanding. Saved a ton on lawyer fees.',
  'Customer support was surprisingly helpful when I had a question about a specific clause. Great service overall!',
];
const placeholderNames = [
  'Alex P.',
  'Maria G.',
  'Samuel K.',
  'Jessica L.',
  'David R.',
  'Chen W.',
  'Aisha B.',
  'Kenji T.',
];
const placeholderTitles = [
  'Entrepreneur',
  'Small Business Owner',
  'Freelance Developer',
  'Landlord',
  'Startup Founder',
  'Consultant',
  'E-commerce Seller',
  'Non-profit Organizer',
];
const placeholderOutcomes = [
  'Secured a major contract!',
  'Launched my business smoothly!',
  'Protected my intellectual property effectively!',
  'Resolved a tenant issue quickly and fairly!',
  'Simplified my estate planning process considerably!',
  'Streamlined our hiring process with clear contracts!',
  'Felt confident and prepared for legal eventualities.',
];

const MemoizedTestimonialCard = React.memo(function TestimonialCard({
  testimonial,
  index,
  t,
  isHydrated,
}: {
  testimonial: Testimonial | null;
  index: number;
  t: (_key: string, _fallback?: string | object) => string;
  isHydrated: boolean;
}) {
  const rating = 5;
  const currentTestimonial = testimonial || {
    quoteKey: `fallback.quote.${index}`,
    nameKey: `fallback.name.${index}`,
    titleKey: `fallback.title.${index}`,
    outcomeKey: `fallback.outcome.${index}`,
    avatarSeed: index * 17 + 60, // Varied seed
    avatarUrl: `https://picsum.photos/seed/${index * 17 + 60}/96/96`, // Use Picsum with varied seed
    defaultQuote: placeholderQuotes[index % placeholderQuotes.length],
    defaultName: placeholderNames[index % placeholderNames.length],
    defaultTitle: placeholderTitles[index % placeholderTitles.length],
    defaultOutcome: placeholderOutcomes[index % placeholderOutcomes.length],
  };

  const quoteText = isHydrated
    ? t(currentTestimonial.quoteKey, {
        defaultValue: currentTestimonial.defaultQuote,
      })
    : currentTestimonial.defaultQuote;
  const nameText = isHydrated
    ? t(currentTestimonial.nameKey, {
        defaultValue: currentTestimonial.defaultName,
      })
    : currentTestimonial.defaultName;
  const titleText = isHydrated
    ? t(currentTestimonial.titleKey, {
        defaultValue: currentTestimonial.defaultTitle,
      })
    : currentTestimonial.defaultTitle;
  const outcomeText =
    currentTestimonial.outcomeKey && currentTestimonial.defaultOutcome
      ? isHydrated
        ? t(currentTestimonial.outcomeKey, {
            defaultValue: currentTestimonial.defaultOutcome,
          })
        : currentTestimonial.defaultOutcome
      : undefined;

  // Use picsum.photos for more varied placeholders, avatarUrl from data will override this.
  const imageSrc =
    currentTestimonial.avatarUrl ||
    `https://picsum.photos/seed/${currentTestimonial.avatarSeed}/96/96`;

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 text-left shrink-0 flex flex-col border border-border transition-shadow hover:shadow-xl h-full">
      {isHydrated || testimonial ? (
        <>
          <Image
            src={imageSrc}
            alt={nameText}
            width={96}
            height={96}
            loading="lazy"
            data-ai-hint="person portrait" // Hint for AI image replacement
            className="rounded-full mb-4 border-2 border-primary/30 mx-auto shrink-0 object-cover" // Added object-cover
          />
          <div className="flex justify-center mb-3">
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 text-yellow-400 fill-yellow-400 star-gradient"
              />
            ))}
            {Array.from({ length: 5 - rating }).map((_, i) => (
              <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
          <p className="italic text-foreground/90 mb-4 leading-relaxed text-sm flex-grow">
            &ldquo;{quoteText}&rdquo;
          </p>
          {outcomeText && (
            <p className="text-xs text-primary font-semibold mb-3 text-center p-1 bg-primary/10 rounded">
              {outcomeText}
            </p>
          )}
          <div className="mt-auto text-center pt-3 border-t border-border/50">
            <p className="font-semibold text-sm text-foreground">{nameText}</p>
            <p className="text-xs text-muted-foreground">{titleText}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-muted mb-4 animate-pulse"></div>
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 bg-muted rounded-sm mx-0.5 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-full mb-1 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-4 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-1/2 mb-3 mx-auto animate-pulse"></div>
          <div className="mt-auto text-center pt-3 border-t border-border/50 w-full">
            <div className="h-4 bg-muted rounded w-1/2 mb-1 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
});

const TrustAndTestimonialsSection = React.memo(
  function TrustAndTestimonialsSection() {
    const { t, i18n, ready } = useTranslation('common');
    const tSimple = React.useCallback(
      (key: string, fallback?: string | object): string =>
        typeof fallback === 'string'
          ? (t(key, { defaultValue: fallback }) as string)
          : (t(key, fallback as Record<string, unknown>) as string),
      [t],
    );
    const [docCount, setDocCount] = useState(4200);
    const [isHydrated, setIsHydrated] = useState(false);
    const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

    const autoplayOptions = {
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop: true, align: 'start' },
      [Autoplay(autoplayOptions)],
    );

    const scrollPrev = useCallback(
      () => emblaApi && emblaApi.scrollPrev(),
      [emblaApi],
    );
    const scrollNext = useCallback(
      () => emblaApi && emblaApi.scrollNext(),
      [emblaApi],
    );

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    useEffect(() => {
      if (!isInView) return;
      const interval = setInterval(() => {
        setDocCount((prev) => prev + Math.floor(Math.random() * 3));
      }, 4000);
      return () => clearInterval(interval);
    }, [isInView]);

    useEffect(() => {
      if (isHydrated && ready) {
        const loadedTestimonials: Testimonial[] = [];

        for (let i = 1; i <= 5; i++) {
          const baseKey = `home.testimonials.t${i}`;
          const quote = t(`${baseKey}.quote`, {
            defaultValue: placeholderQuotes[(i - 1) % placeholderQuotes.length],
          });
          const name = t(`${baseKey}.name`, {
            defaultValue: placeholderNames[(i - 1) % placeholderNames.length],
          });
          const title = t(`${baseKey}.title`, {
            defaultValue: placeholderTitles[(i - 1) % placeholderTitles.length],
          });
          const outcome = t(`${baseKey}.outcome`, {
            defaultValue:
              placeholderOutcomes[(i - 1) % placeholderOutcomes.length],
          });
          const avatarUrl = t(`${baseKey}.avatarUrl`, {
            defaultValue: `https://picsum.photos/seed/${i * 20 + 10}/96/96`,
          });

          loadedTestimonials.push({
            quoteKey: `${baseKey}.quote`,
            nameKey: `${baseKey}.name`,
            titleKey: `${baseKey}.title`,
            outcomeKey: outcome ? `${baseKey}.outcome` : undefined,
            avatarSeed: i * 20 + 10,
            avatarUrl,
            defaultQuote: quote,
            defaultName: name,
            defaultTitle: title,
            defaultOutcome: outcome,
          });
        }

        setTestimonialsData(loadedTestimonials);
      }
    }, [isHydrated, ready, i18n.language, t]);

    const placeholderText = '...';
    const formattedCount = isHydrated
      ? docCount.toLocaleString(i18n.language)
      : placeholderText;

    const scrollToWorkflow = () => {
      const workflowSection = document.getElementById('workflow-start');
      if (workflowSection) {
        workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <section ref={sectionRef} className="bg-secondary/30 py-16 md:py-20 text-center">
        <div className="container mx-auto px-4 mb-12 md:mb-16">
          <p className="text-xs uppercase text-muted-foreground tracking-wider mb-3 font-medium">
            {isHydrated
              ? t('home.trustStrip.title', {
                  defaultValue: 'Trusted By Professionals',
                })
              : placeholderText}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-6 gap-y-3 text-foreground/90 text-sm font-medium">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>
                {isHydrated
                  ? tSimple('home.trustStrip.badge1', {
                      count: formattedCount,
                      defaultValue: `Over ${formattedCount} documents generated`,
                    })
                  : placeholderText}
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground/90">Trustpilot</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-green-500 fill-green-500 star-gradient"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.9/5)</span>
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-foreground mb-10 px-4">
          {isHydrated
            ? t('home.testimonials.title', {
                defaultValue: 'What Our Users Say',
              })
            : placeholderText}
        </h3>

        <div className="relative max-w-6xl mx-auto">
          <CarouselNavArrow
            direction="prev"
            onClick={scrollPrev}
            disabled={!isHydrated || !emblaApi}
            aria-label={t('Previous testimonial', {
              defaultValue: 'Previous testimonial',
            })}
            className="absolute left-[-10px] md:left-[-20px] top-1/2 z-20 -translate-y-1/2"
          />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {(testimonialsData.length > 0
                ? testimonialsData
                : Array(5).fill(null)
              ).map((testimonial, i) => (
                <div
                  key={
                    testimonial
                      ? `${testimonial.nameKey}-${testimonial.avatarSeed}`
                      : `placeholder-${i}`
                  }
                  className={cn(
                    'pl-4 flex-[0_0_90%] sm:flex-[0_0_45%] md:flex-[0_0_33.33%]',
                  )}
                >
                  <MemoizedTestimonialCard
                    testimonial={testimonial}
                    index={i}
                    t={tSimple}
                    isHydrated={isHydrated}
                  />
                </div>
              ))}
            </div>
          </div>

          <CarouselNavArrow
            direction="next"
            onClick={scrollNext}
            disabled={!isHydrated || !emblaApi}
            aria-label={t('Next testimonial', {
              defaultValue: 'Next testimonial',
            })}
            className="absolute right-[-10px] md:right-[-20px] top-1/2 z-20 -translate-y-1/2"
          />
        </div>

        <div className="mt-16 md:mt-20 flex flex-col items-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground/90">
              {isHydrated
                ? t('home.moneyBackGuarantee', {
                    defaultValue:
                      '100% Satisfaction Guarantee or Your Money Back',
                  })
                : placeholderText}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-6 px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground transition rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={scrollToWorkflow}
            disabled={!isHydrated}
          >
            {isHydrated
              ? t('home.callToAction', { defaultValue: 'Get Started Now' })
              : placeholderText}
          </Button>
        </div>
      </section>
    );
  },
);
export default TrustAndTestimonialsSection;
