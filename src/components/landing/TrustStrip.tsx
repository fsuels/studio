// src/components/landing/TrustStrip.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FileText, Lock, CheckCircle } from 'lucide-react'; // Use relevant icons

export default function TrustStrip() {
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

  return (
    <section className="w-full py-12 bg-muted/50 text-center"> {/* Use theme background */}
      <p className="uppercase text-muted-foreground tracking-wide mb-6 text-sm font-semibold">
        {isHydrated ? t('home.trustStrip.title') : placeholderText}
      </p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center max-w-4xl mx-auto text-foreground/80 text-sm">
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
    </section>
  )
}
