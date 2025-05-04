// src/components/HeroFeatureSection.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Rocket, Lock, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { HeroSection } from '@/components/landing/HeroSection' // Import HeroSection
import { FeatureTeaser } from '@/components/landing/FeatureTeaser' // Import FeatureTeaser

export default function HeroFeatureSection() {
  const { t } = useTranslation()

  // Features remain the same as defined in FeatureTeaser
  // Hero content remains the same as defined in HeroSection

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Strip */}
      <FeatureTeaser />
    </>
  )
}

    