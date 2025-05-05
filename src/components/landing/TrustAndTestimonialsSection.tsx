// TrustAndTestimonialsSection.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'; // Import Button
import { Card, CardContent } from '@/components/ui/card'; // Import Card
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel
import { FileText, Lock, CheckCircle, ShieldCheck } from 'lucide-react'; // Use relevant icons
import Image from 'next/image'; // Import Image

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
    // Updated section styling: soft blue background, more padding
    <section className="bg-secondary/30 py-20 px-4 text-center">
      {/* Updated trust strip title styling */}
      <h2 className="text-sm uppercase text-muted-foreground tracking-wide mb-4 font-medium">
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </h2>
      {/* Updated trust strip badges styling */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm mb-16">
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

      {/* Updated testimonials title styling */}
      <h3 className="text-3xl font-bold text-foreground mb-6">
        {isHydrated ? t('home.testimonials.title') : placeholderText}
      </h3>
      {/* Using Carousel for testimonials with updated styling */}
       <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-12" // Consistent max-width
        >
          <CarouselContent>
             {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                {/* Updated testimonial card styling */}
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg rounded-2xl border border-border bg-card transition hover:shadow-xl">
                    <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                      <Image
                         src={`https://picsum.photos/seed/${index+20}/80/80`}
                         alt={`${testimonial.name}'s avatar`}
                         width={80}
                         height={80}
                         className="rounded-full mb-4 border-2 border-primary/50"
                         data-ai-hint={testimonial.dataAiHint}
                       />
                      {/* Updated quote styling */}
                      <p className="italic text-foreground/90 mb-4 leading-relaxed flex-grow">
                         "{testimonial.quote}"
                      </p>
                      {/* Updated name/title styling */}
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
           <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex bg-card hover:bg-muted" />
           <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex bg-card hover:bg-muted" />
        </Carousel>

       {/* Updated Guarantee and CTA styling */}
      <div className="mt-10 flex flex-col items-center space-y-6">
         {/* Guarantee Badge */}
         <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
           <ShieldCheck className="h-5 w-5 text-primary" /> {/* Using ShieldCheck */}
           <span className="font-medium text-foreground/90">{isHydrated ? t('home.moneyBackGuarantee') : placeholderText}</span>
         </div>
          {/* Call to Action Button */}
          <Button
              size="lg"
              // Updated Button styling: teal color, rounded-full, shadow
              className="mt-6 px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground transition rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={scrollToWorkflow}
           >
              {isHydrated ? t('home.callToAction') : placeholderText}
           </Button>
      </div>

    </section>
  )
}
