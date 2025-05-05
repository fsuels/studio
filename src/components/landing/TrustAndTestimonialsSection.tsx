// TrustAndTestimonialsSection.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState, useRef } from 'react' // Import useRef
import { Button } from '@/components/ui/button'; // Keep Button import if used elsewhere or for future use
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import { ChevronLeft, ChevronRight, FileText, Lock, CheckCircle, ShieldCheck } from 'lucide-react'; // Import icons
import Image from 'next/image'; // Import Image if needed for avatars later

export default function TrustAndTestimonialsSection() {
  const { t, i18n } = useTranslation()
  const [docCount, setDocCount] = useState(4200)
  const [isHydrated, setIsHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null) // Ref for the scrollable div

  useEffect(() => {
    setIsHydrated(true);
    const interval = setInterval(() => {
      setDocCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const placeholderText = '...';
  const formattedCount = isHydrated ? docCount.toLocaleString(i18n.language) : placeholderText;

  // Get the actual number of defined testimonials (currently 3)
  const testimonialCount = Object.keys(t('home.testimonials', { returnObjects: true })).filter(key => key.startsWith('t')).length;

  // Scroll function for buttons
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    // Calculate scroll amount (e.g., width of one card + gap)
    // Assuming card width is 320px (w-80) + gap 24px (space-x-6)
    const scrollAmount = 320 + 24;
    scrollRef.current.scrollBy({ left: dir === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
  }

   const scrollToWorkflow = () => {
    const workflowSection = document.getElementById('workflow-start');
    if (workflowSection) {
      workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       console.warn('Workflow section with id "workflow-start" not found.');
    }
  };

  return (
    // Using theme colors and styles
    <section className="bg-secondary/30 py-20 px-4 text-center">
      {/* Trust Strip */}
      <h2 className="text-sm uppercase text-muted-foreground tracking-wide mb-4 font-medium">
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm mb-16">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>{isHydrated ? t('home.trustStrip.badge1', { count: formattedCount }) : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <span>{isHydrated ? t('home.trustStrip.badge2') : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>{isHydrated ? t('home.trustStrip.badge3') : placeholderText}</span>
        </div>
      </div>

      {/* Testimonials Title */}
      <h3 className="text-3xl font-bold text-foreground mb-10">
        {isHydrated ? t('home.testimonials.title') : placeholderText}
      </h3>

      {/* Testimonials Carousel */}
      <div className="relative max-w-6xl mx-auto">
        {/* Left Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[-10px] md:left-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 scrollbar-hide px-4 py-4" // Added padding for cards near edges
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* Loop through the defined testimonials */}
          {Array.from({ length: testimonialCount }).map((_, i) => (
             <div
               key={i}
               className="bg-card p-6 rounded-2xl shadow-lg w-72 md:w-80 text-left shrink-0 flex flex-col border border-border transition hover:shadow-xl" // Use theme colors
               style={{ scrollSnapAlign: 'start' }}
             >
               {/* Placeholder for Avatar - Add Image component here if needed */}
                <Image
                   src={`https://picsum.photos/seed/${i+30}/60/60`} // Placeholder image
                   alt={isHydrated ? t(`home.testimonials.t${i + 1}.name`, 'Testimonial Avatar') : 'Loading...'}
                   width={60}
                   height={60}
                   className="rounded-full mb-4 border-2 border-primary/30 mx-auto"
                   data-ai-hint="person portrait professional" // Added AI hint
                 />
               <p className="italic text-foreground/90 mb-4 leading-relaxed flex-grow">
                 "{isHydrated ? t(`home.testimonials.t${i + 1}.quote`) : placeholderText}"
               </p>
               <div className="mt-auto text-center"> {/* Centered name/title */}
                 <p className="font-semibold text-sm text-foreground">
                   {isHydrated ? t(`home.testimonials.t${i + 1}.name`) : placeholderText}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {isHydrated ? t(`home.testimonials.t${i + 1}.title`) : placeholderText}
                 </p>
               </div>
             </div>
          ))}
           {/* Optional: Add empty divs for spacing/visual effect if needed */}
        </div>

        {/* Right Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-[-10px] md:right-[-20px] top-1/2 z-10 -translate-y-1/2 bg-card hover:bg-muted rounded-full shadow-md"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>


       {/* Guarantee and CTA */}
      <div className="mt-20 flex flex-col items-center space-y-6">
         {/* Guarantee Badge */}
         <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <span className="font-medium text-foreground/90">{isHydrated ? t('home.moneyBackGuarantee') : placeholderText}</span>
         </div>
          {/* Call to Action Button */}
          <Button
              size="lg"
              className="mt-6 px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground transition rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={scrollToWorkflow} // Added onClick handler
           >
              {isHydrated ? t('home.callToAction') : placeholderText}
           </Button>
      </div>

    </section>
  )
}

// Helper CSS for scrollbar-hide if not using a plugin
// Add this to your global CSS file (e.g., src/app/globals.css)
/*
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none; // IE and Edge
    scrollbar-width: none; // Firefox
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; // Safari and Chrome
  }
}
*/
