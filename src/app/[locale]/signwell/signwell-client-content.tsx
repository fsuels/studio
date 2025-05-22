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

interface SignWellClientContentProps {
  params: { locale: 'en' | 'es' };
}

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
        "border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 bg-background hover:bg-muted/50",
        isDragging ? "border-brand-blue bg-brand-blue/10" : "border-border hover:border-brand-blue/60"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileClick}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt,.rtf,.odt" onChange={handleFileChange} multiple={false} />
      <UploadCloud className="h-12 w-12 text-brand-blue mx-auto mb-4" />
      <p className="font-semibold text-foreground mb-1 text-lg">{t('hero.dropzoneTitle')}</p>
      <p className="text-sm text-muted-foreground">{t('hero.dropzoneSubtitle')}</p>
    </div>
  );
};


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
    console.log("Files selected:", files);
    // TODO: Connect Dropzone → /api/signwell/upload (returns fileId)
    alert(t('File uploaded successfully! (Placeholder)'));
  };

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
  
  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <p>Loading Electronic Signature Page...</p>
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t('hero.subtitle')}</p>
          
          <Card className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-8 text-center border-border mb-8">
            <DropzonePlaceholder onFiles={handleFileUpload} />
             <p className="text-xs text-muted-foreground mt-4 mb-6">{t('hero.supportedFiles')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white flex-1 sm:flex-none" data-test-id="hero-cta-start">
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
        </div>
      </section>

      {/* Legally Binding Section */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container max-w-content mx-auto px-4 text-center">
          <ShieldCheck className="h-12 w-12 text-brand-green mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-brand-slate mb-4">{t('legallyBinding.title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">{t('legallyBinding.subtitle')}</p>
          <div className="flex justify-center items-center gap-6">
            {/* Placeholder for ESIGN/UETA logos - replace with actual images/SVGs */}
            <div className="h-10 w-24 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500" data-ai-hint="ESIGN Act logo">ESIGN</div>
            <div className="h-10 w-24 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500" data-ai-hint="UETA logo">UETA</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-12 text-center">{t('benefits.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefitsItems.map((item, i) => (
              <Card key={i} className="bg-card text-card-foreground shadow-sm p-6 group hover:shadow-lg transition-shadow text-center">
                <div className="mb-4 inline-flex p-3 bg-brand-sky/50 text-brand-blue rounded-full">
                    <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sign on Any Device Section */}
      <section className="py-16 md:py-20 bg-brand-slate text-white">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('devices.title')}</h2>
          <p className="text-brand-sky/80 max-w-lg mx-auto mb-10">{t('devices.subtitle')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {deviceItems.map(device => (
                 <div key={device.nameKey} className="flex flex-col items-center">
                    <device.icon className="h-16 w-16 mb-2 opacity-80" />
                    <span className="text-sm">{t(device.nameKey)}</span>
                 </div>
            ))}
          </div>
          <Image src="https://placehold.co/800x400.png" alt={t('devices.imageAlt')} width={800} height={400} className="mt-10 mx-auto rounded-lg shadow-xl" data-ai-hint="devices screen collage" />
        </div>
      </section>

      {/* Trusted By Section (Placeholder) */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container max-w-content mx-auto px-4 text-center">
          <p className="text-sm uppercase text-muted-foreground tracking-wider mb-8 font-semibold">{t('trustedBy.title')}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {[...Array(5)].map((_, i) => (
              <Image key={i} src={`https://placehold.co/120x40.png?text=Client+${i+1}`} alt={`Client ${i+1} Logo`} width={120} height={40} className="h-8 object-contain" data-ai-hint="company logo" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-muted/40">
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

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-brand-blue text-white">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('finalCta.title')}</h2>
          <p className="text-lg text-brand-sky/90 max-w-xl mx-auto mb-8">{t('finalCta.subtitle')}</p>
          <Button size="xl" className="bg-brand-green hover:bg-brand-green/90 text-white text-base px-10 py-4">
            {t('finalCta.cta')}
          </Button>
        </div>
      </section>
    </div>
  );
}
