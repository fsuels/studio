// src/components/landing/FeaturedInSection.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { CheckCircle, Lock, Briefcase } from 'lucide-react'; // Use more relevant icons

export default function FeaturedInSection() {
  const { t } = useTranslation()
  const [docCount, setDocCount] = useState(4200) // Keep dynamic count if desired
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

  return (
    <section className="w-full py-12 bg-muted/50 text-center"> {/* Updated background */}
      <p className="uppercase text-muted-foreground tracking-wide mb-6 text-sm font-semibold">
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm">
        <div className="flex items-center gap-2">
          {/* Use CheckCircle icon - represents usage/verification */}
          <CheckCircle className="h-5 w-5 text-green-600" />
          {/* Use the count in the translation if desired, otherwise use the static key */}
          <span>{isHydrated ? t('home.trustStrip.badge1') : placeholderText}</span>
          {/* Example with count: <span>{isHydrated ? t('home.trustStrip.badge1', { count: docCount.toLocaleString() }) : placeholderText}</span> */}
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" /> {/* Use Lock icon */}
          <span>{isHydrated ? t('home.trustStrip.badge2') : placeholderText}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" /> {/* Use Briefcase icon - represents professional/legal */}
          <span>{isHydrated ? t('home.trustStrip.badge3') : placeholderText}</span>
        </div>
      </div>
    </section>
  )
}
