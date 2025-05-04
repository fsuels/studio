// src/components/HeroFeatureSection.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Rocket, Lock, DollarSign } from 'lucide-react'
// Assuming react-i18next is installed and configured elsewhere
// If not, this will cause an error.
// import { useTranslation } from 'react-i18next';

// Placeholder t function if react-i18next is not set up
const t = (key: string) => key;

export default function HeroFeatureSection() {
  // const { t } = useTranslation(); // Uncomment if react-i18next is configured

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />, // Using primary color from theme
      title: t('Blazing-Fast Workflow'),
      description: t('AI guides you step by step with lightning speed.'),
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />, // Using primary color from theme
      title: t('Secure & Compliant'),
      description: t('Encrypted PDFs and time-locked share links keep you safe.'),
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />, // Using primary color from theme
      title: t('Cost-Effective'),
      description: t('Only $10 per document vs. $200+ at a law firm.'), // Updated price as per prompt
    },
  ]

  return (
    <>
      {/* Hero Section */}
       {/* Note: Using inline styles for gradient, but prefer Tailwind classes if possible */}
      <section className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-primary-foreground py-24" style={{
          // Fallback gradient using theme colors - ideally define in Tailwind config
          background: 'linear-gradient(to right, hsl(var(--accent)), hsl(var(--secondary)))'
      }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            {t('Legal Docs at Your Fingertips')}
          </h1>
          <p className="text-lg sm:text-xl mb-8 opacity-90"> {/* Use opacity for subhead contrast */}
            {t('Create, sign & share professional contracts in minutes—no lawyer required.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             {/* Using default button styles which leverage theme */}
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              {t('Get Started - It’s Free')}
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {t('See Demo')}
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-16 bg-background"> {/* Use theme background */}
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow border border-border bg-card text-card-foreground">
              <CardContent className="space-y-4 text-center">
                <div className="flex justify-center mb-4"> {/* Added margin bottom */}
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground"> {/* Use muted foreground */}
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
