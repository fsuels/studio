// src/components/landing/FeaturedLogos.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { AutoImage } from '@/components/shared';
import React, { useState, useEffect } from 'react';

const logos = [
  {
    src: '/images/logos/forbes-logo.svg',
    alt: 'Forbes',
    dataAiHint: 'Forbes logo',
  },
  {
    src: '/images/logos/nyt-logo.svg',
    alt: 'New York Times',
    dataAiHint: 'New York Times logo',
  },
  {
    src: '/images/logos/techcrunch-logo.svg',
    alt: 'TechCrunch',
    dataAiHint: 'TechCrunch logo',
  },
  {
    src: '/images/logos/univision-logo.svg',
    alt: 'Univision',
    dataAiHint: 'Univision logo',
  },
  {
    src: '/images/logos/bloomberg-logo.svg',
    alt: 'Bloomberg',
    dataAiHint: 'Bloomberg logo',
  },
];

const FeaturedLogos = React.memo(function FeaturedLogos() {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = 'Loading...';

  return (
    <section className="bg-secondary/30 py-12 md:py-16 text-center">
      <div className="container mx-auto px-4">
        <p className="uppercase text-muted-foreground tracking-wider mb-8 text-sm font-semibold">
          {isHydrated
            ? t('home.featuredIn', { defaultValue: 'FEATURED IN' })
            : placeholderText}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-75">
          {logos.map((logo, index) => (
            <div key={index} className="h-6 md:h-7 lg:h-8">
              <AutoImage
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={32}
                className="grayscale object-contain h-full w-auto"
                loading="lazy"
                data-ai-hint={logo.dataAiHint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
export default FeaturedLogos;
