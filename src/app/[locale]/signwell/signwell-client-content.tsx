// src/app/[locale]/signwell/signwell-client-content.tsx
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  UploadCloud, ShieldCheck, CheckCircle, Zap, Users, Home, Briefcase,
  FileText, Lock, Award, MessageSquare, ChevronRight, Star, Mail, Clock, HelpCircle, LifeBuoy, Link as LinkIcon, Edit3, FileUp, UserCheck, Send, Tablet, Smartphone, Laptop
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SignWellClientContentProps {
  params: { locale: 'en' | 'es' };
}

// Placeholder for Dropzone Component
const DropzonePlaceholder = ({
  onFiles,
  inputRef // Accept the ref from the parent
}: {
  onFiles: (files: File[]) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const { t } = useTranslation("electronic-signature");
  const [isDragging, setIsDragging] = useState(false);
  // Removed local fileInputRef, using the one passed from parent

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
    inputRef.current?.click(); // Use the passed ref
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
        "border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 bg-background hover:bg-muted/50",
        isDragging ? "border-brand-blue bg-brand-blue/10" : "border-border hover:border-brand-blue/60"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileClick} // Makes the dropzone area clickable
    >
      <input
        type="file"
        ref={inputRef} // Assign the passed ref here
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.rtf,.odt" // Common document types
        onChange={handleFileChange}
        multiple={false} // Typically one document for e-signing flow initially
      />
      <UploadCloud className="h-12 w-12 text-brand-blue mx-auto mb-4" />
      <p className="font-semibold text-foreground mb-1 text-lg">{t('hero.dropzoneTitle')}</p>
      <p className="text-sm text-muted-foreground">{t('hero.dropzoneSubtitle')}</p>
    </div>
  );
};


export default function SignWellClientContent({ params }: SignWellClientContentProps) {
  const { t, i18n } = useTranslation('electronic-signature');
  const [isHydrated, setIsHydrated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language !== params.locale) {
      i18n.changeLanguage(params.locale);
    }
  }, [params.locale, i18n]);

  const handleFileUpload = useCallback((files: File[]) => {
    console.log("Files selected:", files);
    // TODO: Connect Dropzone → /api/signwell/upload (returns fileId)
    // For now, just provide feedback
    toast({
      title: t('uploadCard.filesReceivedTitle', { defaultValue: "Files Received" }),
      description: t('uploadCard.filesReceivedDesc', { count: files.length, defaultValue: `${files.length} file(s) ready for processing.` }),
    });
  },[t, toast]);

  const howItWorksSteps = [
    { icon: FileUp, titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc' },
    { icon: UserCheck, titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc' },
    { icon: Send, titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc' },
  ];

  const benefitsItems = [
    { icon: Zap, titleKey: 'benefits.fastTitle', descKey: 'benefits.fastDesc' },
    { icon: CheckCircle, titleKey: 'benefits.easyTitle', descKey: 'benefits.easyDesc' },
    { icon: ShieldCheck, titleKey: 'benefits.secureTitle', descKey: 'benefits.secureDesc' },
    { icon: FileText, titleKey: 'benefits.organizedTitle', descKey: 'benefits.organizedDesc' },
  ];
  
  const deviceItems = [
    { icon: Laptop, nameKey: 'devices.desktop' },
    { icon: Tablet, nameKey: 'devices.tablet' },
    { icon: Smartphone, nameKey: 'devices.mobile' },
  ];

  const faqItems = [
    { id: "faq1", questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer'},
    { id: "faq2", questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer'},
    { id: "faq3", questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer'},
    { id: "faq4", questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer'},
    { id: "faq5", questionKey: 'faq.q5.question', answerKey: 'faq.q5.answer'},
    { id: "faq6", questionKey: 'faq.q6.question', answerKey: 'faq.q6.answer hipaa', testId: "faq-item-hipaa" },
  ];

  const complianceItems = [
    { textKey: 'security.compliance.esignUeta' },
    { textKey: 'security.compliance.auditTrail' },
    { textKey: 'security.compliance.soc2' },
    { textKey: 'security.compliance.idVerification' },
  ];

  const useCaseItems = [
    { icon: FileText, titleKey: 'useCases.freelance.title', descKey: 'useCases.freelance.desc' },
    { icon: Briefcase, titleKey: 'useCases.consulting.title', descKey: 'useCases.consulting.desc' },
    { icon: Home, titleKey: 'useCases.realEstate.title', descKey: 'useCases.realEstate.desc' },
    { icon: Lock, titleKey: 'useCases.nda.title', descKey: 'useCases.nda.desc' },
    { icon: Users, titleKey: 'useCases.poa.title', descKey: 'useCases.poa.desc' },
    { icon: FileText, titleKey: 'useCases.billOfSale.title', descKey: 'useCases.billOfSale.desc' },
  ];

  const whyUsBullets = [
    { icon: Zap, textKey: 'whyUs.bullet1' },
    { icon: Edit3, textKey: 'whyUs.bullet2' },
    { icon: ShieldCheck, textKey: 'whyUs.bullet3' },
    { icon: Award, textKey: 'whyUs.bullet4' },
  ];

  const pricingPlans = {
    free: { titleKey: 'pricing.free.title', featuresKey: 'pricing.free.features' },
    payPerDoc: { titleKey: 'pricing.payPerDoc.title', priceKey: 'pricing.payPerDoc.price', featuresKey: 'pricing.payPerDoc.features' },
    volume: { titleKey: 'pricing.volume.title', featuresKey: 'pricing.volume.features' }
  };
  
  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <p>Loading Electronic Signature Page...</p> {/* Static text for pre-hydration */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-sky/50 to-background py-16 md:py-20">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-slate mb-4 leading-tight">{t('hero.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">{t('hero.subtitle')}</p>
          
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-bold text-foreground/90">Trustpilot</span>
              <div className="flex items-center">
                  {Array.from({length: 5}).map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <span className="text-xs">{t('hero.trustpilotRating', {defaultValue: "4.8/5 rating"})}</span>
              <span className="mx-1">|</span>
              <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30 text-xs">
                 {t('hero.complianceBadge', {defaultValue: "ESIGN & UETA Compliant"})}
              </Badge>
            </div>
          </div>

          <Card className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-8 text-center border-border mb-8">
            <DropzonePlaceholder onFiles={handleFileUpload} inputRef={fileInputRef} />
            <p className="text-xs text-muted-foreground mt-4 mb-6">{t('hero.supportedFiles')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green/90 text-white flex-1 sm:flex-none"
                data-test-id="hero-cta-upload"
                onClick={() => fileInputRef.current?.click()} // Triggers file input
              >
                <UploadCloud className="mr-2 h-5 w-5" /> {t('hero.ctaUpload')}
              </Button>
              <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 flex-1 sm:flex-none">
                {t('hero.ctaSignYourself')}
              </Button>
            </div>
          </Card>
          <p className="text-sm text-muted-foreground">{t('hero.noAccountNeeded')}</p>
        </div>
      </section>

       {/* Quick-Facts Ribbon */}
      <section className="py-6 border-y border-border bg-muted/30">
        <div className="container max-w-content mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-around items-center text-center text-sm text-muted-foreground">
            <p className="py-1.5">{t('quickFacts.fact1')}</p>
            <p className="py-1.5 hidden sm:block">|</p>
            <p className="py-1.5">{t('quickFacts.fact2')}</p>
            <p className="py-1.5 hidden sm:block">|</p>
            <p className="py-1.5">{t('quickFacts.fact3')}</p>
          </div>
        </div>
      </section>

      {/* Smart Upload Card (Concept merged into Hero, progress tracker can be separate if needed) */}
      {/*
      <section className="py-16 relative" style={{ backgroundImage: "url('https://placehold.co/1200x600/e0f2fe/a5f3fc?text=Subtle+Mesh+BG')" }}>
        <div className="absolute inset-0 bg-background/30 backdrop-blur-md z-0"></div>
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <Card className="bg-card/90 shadow-2xl rounded-2xl p-6 md:p-10 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span className="font-semibold text-primary">{t('uploadCard.stepLabel')}</span> • {t('uploadCard.addDocumentLabel')}
            </div>
            <DropzonePlaceholder onFiles={handleFileUpload} inputRef={fileInputRef} />
            <p className="text-xs text-muted-foreground mt-3 text-center">{t('uploadCard.convertHelpText')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button 
                size="lg" 
                className="bg-brand-green hover:bg-brand-green/90 text-white" 
                data-test-id="upload-card-cta-add-doc"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mr-2 h-5 w-5" /> {t('uploadCard.ctaAddDoc')}
              </Button>
              <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                {t('uploadCard.ctaTrySample')}
              </Button>
            </div>
            <div className="mt-8">
              <Progress value={33} className="h-2" aria-label={t('uploadCard.progressLabel')} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>{t('uploadCard.progress.upload')}</span>
                <span>{t('uploadCard.progress.prepare')}</span>
                <span>{t('uploadCard.progress.sign')}</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
      */}


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-slate mb-12">{t('howItWorks.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <div className="bg-brand-blue/10 text-brand-blue rounded-full p-4 mb-4 inline-flex ring-4 ring-brand-blue/20">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
          {/* Placeholder for audit log sample */}
          <div className="mt-12 p-4 bg-muted rounded-lg text-left max-w-2xl mx-auto">
            <p className="text-xs font-mono text-muted-foreground">{t('howItWorks.auditLogSample')}</p>
          </div>
        </div>
      </section>

       {/* Security & Compliance Section */}
      <section className="py-16 md:py-20 bg-brand-sky/40">
        <div className="container max-w-content mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-6">{t('security.title')}</h2>
            <ul className="space-y-3">
              {complianceItems.map(item => (
                <li key={item.textKey} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                  <span className="text-foreground">{t(item.textKey)}</span>
                </li>
              ))}
            </ul>
            <Button variant="link" className="text-brand-blue mt-6 px-0 hover:underline">
              {t('security.whitePaperLink')} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex justify-center">
            <Image src="https://placehold.co/400x300/0f172a/e0f2fe?text=Secure+Shield" alt={t('security.imageAlt')} width={400} height={300} className="rounded-lg shadow-xl" data-ai-hint="security shield padlock"/>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-12 text-center">{t('useCases.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCaseItems.map(item => (
              <Card key={item.titleKey} className="bg-card text-card-foreground shadow-sm p-6 group hover:shadow-lg transition-shadow text-left relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg inline-flex">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-md text-foreground mb-1">{t(item.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground">{t(item.descKey)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-brand-blue hover:bg-brand-blue/10">
                  {t('useCases.generateWithAiPill')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why 123LegalDoc + SignWell Section */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container max-w-content mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-8">{t('whyUs.title')}</h2>
            <ul className="space-y-4">
              {whyUsBullets.map(bullet => (
                <li key={bullet.textKey} className="flex items-start gap-3">
                  <div className="p-2 bg-brand-green/15 text-brand-green rounded-full inline-flex">
                    <bullet.icon className="h-5 w-5" />
                  </div>
                  <span className="text-foreground pt-1">{t(bullet.textKey)}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Testimonial Slider Placeholder */}
          <div className="bg-card rounded-lg shadow-xl p-6 h-72 flex items-center justify-center">
            <p className="text-muted-foreground italic">{t('whyUs.testimonialSliderPlaceholder')}</p>
          </div>
        </div>
      </section>

       {/* Pricing Preview Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-brand-blue to-indigo-600 text-white">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('pricing.preview.title')}</h2>
          <p className="text-lg opacity-90 mb-8">{t('pricing.preview.subtitle')}</p>
          
          {/* Simplified pricing table representation */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20">
              <CardHeader><CardTitle>{t(pricingPlans.free.titleKey)}</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{t(pricingPlans.free.featuresKey)}</p></CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-sm text-white border-white/30 ring-2 ring-brand-green shadow-2xl">
              <CardHeader><CardTitle>{t(pricingPlans.payPerDoc.titleKey)}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{t(pricingPlans.payPerDoc.priceKey)}</p>
                <p className="text-sm">{t(pricingPlans.payPerDoc.featuresKey)}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20">
              <CardHeader><CardTitle>{t(pricingPlans.volume.titleKey)}</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{t(pricingPlans.volume.featuresKey)}</p></CardContent>
            </Card>
          </div>
          <Button variant="outline" asChild className="mt-10 bg-white text-brand-blue hover:bg-gray-100 border-transparent">
            <Link href={`/${params.locale}/pricing`}>{t('pricing.preview.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-10 text-center">{t('faq.title')}</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-3">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg bg-card shadow-sm" data-test-id={item.testId}>
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-base">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground text-sm">
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t(item.answerKey).replace(/\n/g, '<br />') }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Strip (Sticky on Desktop - handled by parent layout, simple CTA here) */}
      <section className="py-12 bg-muted/40 border-t border-border">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-slate mb-4">{t('finalCta.title')}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t('finalCta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white">
              {t('finalCta.ctaUpload')}
            </Button>
            <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
              {t('finalCta.ctaScheduleDemo')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
