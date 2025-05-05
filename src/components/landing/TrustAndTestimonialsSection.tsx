// src/components/landing/TrustAndTestimonialsSection.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FileText, Lock, CheckCircle, ShieldCheck } from 'lucide-react'; // Use relevant icons
import Image from 'next/image'; // Import Image
import { Card, CardContent } from '@/components/ui/card'; // Import Card
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel
import { Button } from '@/components/ui/button'; // Import Button

// Define the structure for testimonial data from translations
interface TestimonialData {
  quote: string;
  name: string;
  title: string;
}


export default function TrustAndTestimonialsSection() {
  const { t, i18n } = useTranslation()
  const [docCount, setDocCount] = useState(4200)
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Optional: Simulate dynamic number increase for visual flair
    const interval = setInterval(() => {
      setDocCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const placeholderText = '...';
  const formattedCount = isHydrated ? docCount.toLocaleString(i18n.language) : placeholderText;

  // Placeholder avatars and hints
  const avatars = [
      { src: '/avatars/sarah.jpg', dataAiHint: "woman smiling" },
      { src: '/avatars/michael.jpg', dataAiHint: "man portrait professional" },
      { src: '/avatars/emily.jpg', dataAiHint: "woman glasses" },
  ];

  // Prepare testimonial data safely
  const testimonials = [1, 2, 3].map((_, i) => {
    const baseKey = `home.testimonials.t${i + 1}`;
    return {
      quote: isHydrated ? t(`${baseKey}.quote`) : placeholderText,
      name: isHydrated ? t(`${baseKey}.name`) : placeholderText,
      title: isHydrated ? t(`${baseKey}.title`) : placeholderText,
      avatar: avatars[i]?.src || `https://picsum.photos/seed/${i+20}/80/80`, // Fallback avatar
      dataAiHint: avatars[i]?.dataAiHint || "person portrait", // Fallback hint
    };
  });

  const scrollToWorkflow = () => {
    const workflowSection = document.getElementById('workflow-start');
    if (workflowSection) {
      workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       console.warn('Workflow section with id "workflow-start" not found.');
       // Optionally scroll to top or another fallback
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <section className="bg-muted/50 py-20 px-4 text-center"> {/* Adjusted background and padding */}

      {/* Trust Strip Section */}
       <h2 className="text-lg uppercase text-muted-foreground tracking-wide mb-8 font-semibold"> {/* Changed h2, font size, color, tracking */}
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm mb-16"> {/* Increased bottom margin */}
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> {/* Document icon */}
          <span>{isHydrated ? t('home.trustStrip.badge1', { count: formattedCount }) : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" /> {/* Lock icon */}
          <span>{isHydrated ? t('home.trustStrip.badge2') : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" /> {/* Verified icon */}
          <span>{isHydrated ? t('home.trustStrip.badge3') : placeholderText}</span>
        </div>
      </div>

      {/* Testimonials Section */}
      <h3 className="text-3xl font-bold text-foreground mb-10"> {/* Changed h3, font size, color */}
        {isHydrated ? t('home.testimonials.title') : placeholderText}
      </h3>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-12" // Added mb-12
        >
          <CarouselContent>
             {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-md rounded-lg border border-border bg-card">
                    <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                       {/* Use Picsum placeholder */}
                      <Image
                         src={`https://picsum.photos/seed/${index+20}/80/80`}
                         alt={`${testimonial.name}'s avatar`}
                         width={80}
                         height={80}
                         className="rounded-full mb-4 border-2 border-primary/50"
                         data-ai-hint={testimonial.dataAiHint}
                       />
                      <p className="text-base italic text-foreground/90 mb-4 flex-grow">
                         "{testimonial.quote}"
                      </p>
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

       {/* Guarantee and CTA */}
      <div className="mt-16 flex flex-col items-center space-y-6"> {/* Increased top margin and spacing */}
         <div className="inline-flex items-center gap-3 bg-secondary/80 border border-primary/30 rounded-full px-6 py-3 shadow-sm">
           <ShieldCheck className="h-6 w-6 text-primary" />
           <p className="text-sm font-medium text-secondary-foreground">
              {isHydrated ? t('home.satisfactionGuarantee') : placeholderText} {/* Used correct key */}
           </p>
         </div>
          <Button
              size="lg"
              className="text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={scrollToWorkflow}
           >
              {isHydrated ? t('home.callToAction') : placeholderText} {/* Used correct key */}
           </Button>
      </div>

    </section>
  )
}
