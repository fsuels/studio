// src/app/[locale]/signwell/signwell-client-content.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input'; // For potential future use
import { Progress } from '@/components/ui/progress';
import {
  UploadCloud, ShieldCheck, CheckCircle, Zap, Users, Home, Briefcase,
  FileText, Lock, Award, MessageSquare, ChevronRight, Star, Mail, Clock, HelpCircle, LifeBuoy, Link as LinkIcon, Edit3 // Added Edit3 here
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SignWellClientContentProps {
  params: { locale: 'en' | 'es' };
}

// Placeholder for Lottie Animation - replace with actual Lottie component
const LottieAnimationPlaceholder = ({ className }: { className?: string }) => (
  <div className={cn("bg-muted rounded-lg flex items-center justify-center aspect-square w-full max-w-md h-auto", className)} data-ai-hint="signature animation">
    <p className="text-muted-foreground">Lottie Animation Here</p>
  </div>
);

// Placeholder for Dropzone Component
const DropzonePlaceholder = ({ onFiles }: { onFiles: (files: File[]) => void }) => {
  const { t } = useTranslation("electronic-signature");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };


  return (
    <div
      data-test-id="upload-dropzone"
      className={cn(
        "border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200",
        isDragging ? "border-brand-blue bg-brand-blue/10" : "border-border hover:border-brand-blue/60"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileClick}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.odt" onChange={handleFileChange} multiple={false} />
      <UploadCloud className="h-12 w-12 text-brand-blue mx-auto mb-4" />
      <p className="font-semibold text-foreground mb-1">{t('uploadCard.dropzoneHint')}</p>
      <p className="text-xs text-muted-foreground">{t('uploadCard.dropzoneAccept')}</p>
    </div>
  );
};

// Testimonial Card Component (Simplified for this page)
interface TestimonialItem {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}
const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
  <Card className="bg-card text-card-foreground shadow-md p-6 rounded-lg h-full flex flex-col">
    <div className="flex items-center mb-4">
      <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full mr-3" data-ai-hint="person portrait" />
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
    <div className="flex mb-2">
      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
    </div>
    <p className="text-sm italic text-muted-foreground flex-grow">"{testimonial.quote}"</p>
  </Card>
);


export default function SignWellClientContent({ params }: SignWellClientContentProps) {
  const { t, i18n } = useTranslation('electronic-signature');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language !== params.locale) {
      i18n.changeLanguage(params.locale);
    }
  }, [params.locale, i18n]);

  const handleFileUpload = (files: File[]) => {
    // TODO: Implement file upload logic
    console.log("Files selected:", files);
    // Track GA4 event (example)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'doc_upload', {
        'event_category': 'engagement',
        'event_label': files[0]?.name || 'unknown_file',
        'value': files.length
      });
    }
    alert(t('File uploaded successfully! (Placeholder)'));
  };

  const howItWorksSteps = [
    { icon: UploadCloud, title: t('howItWorks.step1') },
    { icon: Users, title: t('howItWorks.step2') },
    { icon: CheckCircle, title: t('howItWorks.step3') },
  ];

  const securityItems = [
    t('securityCompliance.item1'),
    t('securityCompliance.item2'),
    t('securityCompliance.item3'),
    t('securityCompliance.item4'),
  ];

  const useCasesItems = [
    { icon: Briefcase, title: t('useCases.freelance.title'), desc: t('useCases.freelance.desc') },
    { icon: FileText, title: t('useCases.consulting.title'), desc: t('useCases.consulting.desc') },
    { icon: Home, title: t('useCases.realEstate.title'), desc: t('useCases.realEstate.desc') },
    { icon: Lock, title: t('useCases.nda.title'), desc: t('useCases.nda.desc') },
    { icon: Users, title: t('useCases.poa.title'), desc: t('useCases.poa.desc') },
    { icon: FileText, title: t('useCases.billOfSale.title'), desc: t('useCases.billOfSale.desc') },
  ];

  const whyUsBullets = [
    { icon: Zap, text: t('whyUs.bullet1') },
    { icon: Edit3, text: t('whyUs.bullet2') },
    { icon: ShieldCheck, text: t('whyUs.bullet3') },
    { icon: Award, text: t('whyUs.bullet4') },
  ];

  const faqItems = [
    { id: "faq1", question: t('faq.q1'), answer: t('faq.a1')},
    { id: "faq2", question: t('faq.q2'), answer: t('faq.a2')},
    { id: "faq3", question: t('faq.q3'), answer: t('faq.a3')},
    { id: "faq4", question: t('faq.q4'), answer: t('faq.a4')},
    { id: "faq5", question: t('faq.q5'), answer: t('faq.a5')},
    { id: "faq6", question: t('faq.q6'), answer: t('faq.a6')},
  ];
  
  const testimonials: TestimonialItem[] = [
    { avatar: 'https://placehold.co/48x48.png', name: 'Sarah M.', role: 'Business Owner', quote: t('whyUs.testimonial') },
    { avatar: 'https://placehold.co/48x48.png', name: 'David K.', role: 'Freelancer', quote: 'The easiest way to get NDAs signed. Period.' },
    { avatar: 'https://placehold.co/48x48.png', name: 'Lisa P.', role: 'Real Estate Agent', quote: 'My clients love how simple it is. Saves me so much time.' },
  ];


  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-14 bg-brand-slate animate-pulse"></div>
        <div className="flex-grow flex items-center justify-center">
          <p>Loading Electronic Signature Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Section 2: Hero Banner */}
      <section className="bg-gradient-to-b from-brand-sky to-background py-16 md:py-24 text-center md:text-left">
        <div className="container max-w-content mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-slate mb-6 leading-tight">{t('hero.title')}</h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8 mx-auto md:mx-0">{t('hero.subhead')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
              <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white" data-test-id="hero-cta-start">
                {t('hero.ctaPrimary')}
              </Button>
              <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                <PlayIcon className="mr-2 h-5 w-5" /> {t('hero.ctaSecondary')}
              </Button>
            </div>
            <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground">
              {/* Placeholder for Trustpilot SVG */}
              <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
              <span>{t('hero.trustpilot')}</span>
              <span className="mx-2">|</span>
              <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
                {t('hero.complianceBadge')}
              </Badge>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <LottieAnimationPlaceholder className="w-full max-w-sm md:max-w-md" />
          </div>
        </div>
      </section>

      {/* Section 3: Quick-Facts Ribbon */}
      <section className="border-y border-border">
        <div className="container max-w-content mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-center">
          {[t('quickFacts.fact1'), t('quickFacts.fact2'), t('quickFacts.fact3')].map((fact, i) => (
            <div key={i} className="text-sm text-muted-foreground font-medium">{fact}</div>
          ))}
        </div>
      </section>

      {/* Section 4: Smart Upload Card */}
      <section className="py-16 md:py-24 bg-muted/30" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png?text=Subtle+Background+Mesh')" }}>
        <div className="container max-w-content mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-10 text-center border-border">
            <p className="text-sm font-semibold text-brand-blue mb-2">{t('uploadCard.stepLabel')}</p>
            <DropzonePlaceholder onFiles={handleFileUpload} />
            <p className="text-xs text-muted-foreground mt-4 mb-6">{t('uploadCard.helpText')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">{t('uploadCard.ctaPrimary')}</Button>
              <Button variant="outline">{t('uploadCard.ctaSecondary')}</Button>
            </div>
            <Progress value={33} className="w-2/3 mx-auto h-2" aria-label={t('uploadCard.progressTracker')} />
            <p className="text-xs text-muted-foreground mt-2">{t('uploadCard.progressTracker')}</p>
          </Card>
        </div>
      </section>

      {/* Section 5: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-24 bg-background">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-slate mb-12">{t('howItWorks.title')}</h2>
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-brand-blue/10 text-brand-blue rounded-full p-4 mb-4 inline-flex">
                  <step.icon className="h-8 w-8" />
                </div>
                <p className="font-semibold text-foreground">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted p-6 rounded-lg text-left font-mono text-xs text-muted-foreground overflow-x-auto shadow-inner">
            <pre><code>{`Audit Trail for: Example_Contract.pdf
--------------------------------------
- Document Created: 2024-05-11 10:00:00 UTC by sender@example.com
- Viewed by: signer1@example.com on 2024-05-11 10:05:12 UTC from IP 192.168.1.10
- Signed by: signer1@example.com on 2024-05-11 10:07:30 UTC using method: Draw
- Viewed by: signer2@example.com on 2024-05-11 10:15:00 UTC from IP 203.0.113.25
- Signed by: signer2@example.com on 2024-05-11 10:18:45 UTC using method: Type
- Document Completed: 2024-05-11 10:18:45 UTC
--------------------------------------
Hash: SHA256-abc123xyz789...`}</code></pre>
          </div>
        </div>
      </section>

      {/* Section 6: SECURITY & COMPLIANCE */}
      <section className="py-16 md:py-24 bg-brand-sky/40">
        <div className="container max-w-content mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-6">{t('securityCompliance.title')}</h2>
            <ul className="space-y-3 mb-6">
              {securityItems.map((item, i) => (
                <li key={i} className="flex items-center text-foreground">
                  <CheckCircle className="h-5 w-5 text-brand-green mr-2" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="link" className="text-brand-blue p-0" asChild>
              <Link href="#">{t('securityCompliance.cta')}</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <ShieldCheck className="h-40 w-40 text-brand-blue opacity-30" data-ai-hint="security shield" />
          </div>
        </div>
      </section>

      {/* Section 7: USE CASES */}
      <section id="use-cases" className="py-16 md:py-24 bg-background">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-slate mb-12">{t('useCases.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCasesItems.map((item, i) => (
              <Card key={i} className="bg-card text-card-foreground shadow-sm p-6 group hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <item.icon className="h-6 w-6 text-brand-blue mr-3" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Button variant="ghost" size="sm" className="text-xs text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity p-0">
                  {t('useCases.generateWithAI')} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: WHY 123LEGALDOC + SIGNWELL */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container max-w-content mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-8">{t('whyUs.title')}</h2>
            <ul className="space-y-4">
              {whyUsBullets.map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="bg-brand-green/10 text-brand-green rounded-full p-2 mr-3 mt-0.5 shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Testimonial Slider Placeholder */}
          <div className="grid sm:grid-cols-1 gap-6">
             {testimonials.slice(0,1).map((testimonial, i) => ( // Show only one for simplicity now
                <TestimonialCard key={i} testimonial={testimonial} />
              ))}
          </div>
        </div>
      </section>

      {/* Section 9: PRICING PREVIEW */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-brand-blue to-indigo-600 text-white">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('pricingPreview.intro')}</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr>
                  <th className="p-3"></th>
                  <th className="p-3 font-semibold">{t('pricingPreview.planFree')}</th>
                  <th className="p-3 font-semibold border-2 border-white rounded-t-lg bg-white/10">{t('pricingPreview.planPayPerDoc')}</th>
                  <th className="p-3 font-semibold">{t('pricingPreview.planVolume')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: t('pricingPreview.featureSignatures'), free: '1/month', pay: 'Unlimited', volume: 'Unlimited' },
                  { feature: t('pricingPreview.featureAuditTrail'), free: '✓', pay: '✓', volume: '✓' },
                  { feature: t('pricingPreview.featureStorage'), free: '30 Days', pay: '1 Year', volume: 'Unlimited' },
                  { feature: t('pricingPreview.featureSupport'), free: 'Community', pay: 'Email', volume: 'Priority' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/20">
                    <td className="p-3">{row.feature}</td>
                    <td className="p-3">{row.free}</td>
                    <td className="p-3 bg-white/5">{row.pay}</td>
                    <td className="p-3">{row.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button size="lg" variant="outline" className="bg-white text-brand-blue hover:bg-gray-100">
            {t('pricingPreview.cta')}
          </Button>
        </div>
      </section>

      {/* Section 10: FAQ ACCORDION */}
      <section id="faq" className="py-16 md:py-24 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-10 text-center">{t('faq.title')}</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-3">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg bg-card shadow-sm" data-test-id={item.id === 'faq6' ? 'faq-item-hipaa' : undefined}>
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.answer.replace(/\n/g, '<br />') }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 11: CTA STRIP (Sticky Placeholder) */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-3 shadow-lg z-40 hidden md:block">
        <div className="container max-w-content mx-auto flex justify-center md:justify-end items-center gap-4">
          <Button variant="ghost" className="text-foreground">{t('ctaStrip.demo')}</Button>
          <Button className="bg-brand-green hover:bg-brand-green/90 text-white">{t('ctaStrip.upload')}</Button>
        </div>
      </div>
       {/* Mobile CTA (non-sticky, simple button) */}
      <div className="md:hidden p-4 text-center border-t border-border">
         <Button size="lg" className="w-full bg-brand-green hover:bg-brand-green/90 text-white">{t('ctaStrip.upload')}</Button>
      </div>


    </div>
  );
}

// Placeholder PlayIcon - replace with actual Lucide icon if needed or remove
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 19V5l14 7-14 7z" />
  </svg>
);
