// src/app/[locale]/signwell/signwell-client-content.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  UploadCloud,
  ShieldCheck,
  CheckCircle,
  Zap,
  Users,
  Home,
  Briefcase,
  FileText,
  Lock,
  Award,
  ChevronRight,
  Star,
  Edit3,
  FileUp,
  UserCheck,
  Send,
  X,
  FileIcon,
  Loader2,
  BookUser,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { createSignWellDocument } from '@/services/signwell';

interface SignWellClientContentProps {
  params: { locale: 'en' | 'es' };
}

// Placeholder for Dropzone Component - Enhanced for selected file state
const DropzonePlaceholder = ({
  onFiles,
  inputRef,
  selectedFile,
  onClearFile,
  isHydrated,
  tGeneral,
  tEsign,
  onClick, // Add onClick prop
}: {
  onFiles: (files: File[]) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
  onClearFile: () => void;
  isHydrated: boolean;
  tGeneral: (key: string, opts?: any) => string;
  tEsign: (key: string, opts?: any) => string;
  onClick?: () => void; // Make onClick optional or required based on usage
}) => {
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };

  if (!isHydrated) {
    return <div className="h-48 bg-muted rounded-xl animate-pulse"></div>;
  }

  if (selectedFile) {
    return (
      <div
        data-test-id="file-selected-indicator"
        className={cn(
          'border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-200',
          'border-brand-green bg-brand-green/10',
        )}
      >
        <FileIcon className="h-12 w-12 text-brand-green mx-auto mb-4" />
        <p
          className="font-semibold text-foreground mb-1 text-lg truncate"
          title={selectedFile.name}
        >
          {selectedFile.name}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          ({(selectedFile.size / 1024).toFixed(1)} KB) -{' '}
          {tEsign('uploadCard.fileSelectedDesc', {
            fileName: selectedFile.name,
            defaultValue: `Ready to prepare!`,
          })}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFile}
          className="text-xs text-destructive hover:bg-destructive/10"
        >
          <X className="mr-1 h-3 w-3" />{' '}
          {tGeneral('Clear file', { defaultValue: 'Clear file' })}
        </Button>
      </div>
    );
  }

  return (
    <div
      data-test-id="upload-dropzone"
      className={cn(
        'border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 bg-background hover:bg-muted/50',
        isDragging
          ? 'border-brand-blue bg-brand-blue/10'
          : 'border-border hover:border-brand-blue/60',
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onClick} // Use the passed onClick handler
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
        onChange={handleFileChange}
        multiple={false}
      />
      <UploadCloud className="h-12 w-12 text-brand-blue mx-auto mb-4" />
      <p className="font-semibold text-foreground mb-1 text-lg">
        {tEsign('hero.dropzoneTitle')}
      </p>
      <p className="text-sm text-muted-foreground">
        {tEsign('hero.dropzoneSubtitle')}
      </p>
    </div>
  );
};

export default function SignWellClientContent({
  params,
}: SignWellClientContentProps) {
  const { t, i18n } = useTranslation(['electronic-signature', 'common']);
  const [isHydrated, setIsHydrated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFlowStep, setCurrentFlowStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Prepare, 3: Sign
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authActionPending, setAuthActionPending] = useState<
    'upload' | 'fetch_from_account' | null
  >(null);
  const [signingUrl, setSigningUrl] = useState<string | null>(null);
  const [isPreparingDoc, setIsPreparingDoc] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language !== params.locale) {
      i18n.changeLanguage(params.locale);
    }
  }, [params.locale, i18n]);

  const handleFileUpload = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        setCurrentFlowStep(1);
        setUploadProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress <= 100) {
            setUploadProgress(progress);
          } else {
            clearInterval(interval);
            setCurrentFlowStep(2); // Move to "Prepare" step
            toast({
              title: t('uploadCard.fileSelectedTitle', {
                ns: 'electronic-signature',
              }),
              description: t('uploadCard.fileSelectedDesc', {
                ns: 'electronic-signature',
                fileName: file.name,
              }),
            });
          }
        }, 150);
      }
    },
    [t, toast],
  );

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
    setCurrentFlowStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handlePrepareDocument = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: t('common:Error'),
        description: t('uploadCard.noFileToPrepare', {
          ns: 'electronic-signature',
        }),
        variant: 'destructive',
      });
      return;
    }

    setIsPreparingDoc(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        try {
          const doc = await createSignWellDocument(base64, selectedFile.name);
          setSigningUrl(doc.signingUrl || null);
          setCurrentFlowStep(3);
          toast({
            title: t('uploadCard.docPreparedTitle', {
              ns: 'electronic-signature',
            }),
            description: t('uploadCard.docPreparedDesc', {
              ns: 'electronic-signature',
            }),
          });
        } catch (err: unknown) {
          console.error('createSignWellDocument failed', err);
          toast({
            title: t('uploadCard.docPrepareErrorTitle', {
              ns: 'electronic-signature',
              defaultValue: 'Error Preparing Document',
            }),
            description: t('uploadCard.docPrepareErrorDesc', {
              ns: 'electronic-signature',
              defaultValue:
                'There was a problem preparing your document. Please try again.',
            }),
            variant: 'destructive',
          });
        } finally {
          setIsPreparingDoc(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: unknown) {
      console.error('File reading failed', err);
      toast({
        title: t('uploadCard.docPrepareErrorTitle', {
          ns: 'electronic-signature',
          defaultValue: 'Error Preparing Document',
        }),
        description: t('uploadCard.docPrepareErrorDesc', {
          ns: 'electronic-signature',
          defaultValue:
            'There was a problem preparing your document. Please try again.',
        }),
        variant: 'destructive',
      });
      setIsPreparingDoc(false);
    }
  }, [selectedFile, t, toast]);

  const handleHeroUploadAttempt = () => {
    if (!isLoggedIn) {
      setAuthActionPending('upload');
      setShowAuthModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAddFrom123LegalDoc = () => {
    if (!isLoggedIn) {
      setAuthActionPending('fetch_from_account');
      setShowAuthModal(true);
    } else {
      toast({
        title: t('common:featureComingSoonTitle', {
          defaultValue: 'Feature Coming Soon!',
        }),
        description: t('common:featureComingSoonDescDocs', {
          defaultValue:
            'Accessing your saved 123LegalDoc documents will be available shortly.',
        }),
      });
      // TODO: Implement actual logic to fetch user's documents
    }
  };

  const onAuthSuccessModal = (mode: 'signin' | 'signup') => {
    setShowAuthModal(false);
    toast({
      title: t('common:authModal.successTitle', {
        context: mode,
        defaultValue:
          mode === 'signin' ? 'Sign In Successful!' : 'Account Created!',
      }),
      description: t('common:authModal.successDescription', {
        defaultValue: 'You can now proceed.',
      }),
    });
    if (authActionPending === 'upload') {
      fileInputRef.current?.click();
    } else if (authActionPending === 'fetch_from_account') {
      // This is where you'd trigger the "fetch documents" logic if it were ready
      toast({
        title: t('common:featureComingSoonTitle', {
          defaultValue: 'Feature Coming Soon!',
        }),
        description: t('common:featureComingSoonDescDocs', {
          defaultValue:
            'Accessing your saved 123LegalDoc documents will be available shortly.',
        }),
      });
    }
    setAuthActionPending(null);
  };

  const howItWorksSteps = [
    {
      icon: FileUp,
      titleKey: 'howItWorks.step1Title',
      descKey: 'howItWorks.step1Desc',
    },
    {
      icon: UserCheck,
      titleKey: 'howItWorks.step2Title',
      descKey: 'howItWorks.step2Desc',
    },
    {
      icon: Send,
      titleKey: 'howItWorks.step3Title',
      descKey: 'howItWorks.step3Desc',
    },
  ];

  const complianceItems = [
    { textKey: 'security.compliance.esignUeta' },
    { textKey: 'security.compliance.auditTrail' },
    { textKey: 'security.compliance.soc2' },
    { textKey: 'security.compliance.idVerification' },
  ];

  const useCaseItems = [
    {
      icon: FileText,
      titleKey: 'useCases.freelance.title',
      descKey: 'useCases.freelance.desc',
    },
    {
      icon: Briefcase,
      titleKey: 'useCases.consulting.title',
      descKey: 'useCases.consulting.desc',
    },
    {
      icon: Home,
      titleKey: 'useCases.realEstate.title',
      descKey: 'useCases.realEstate.desc',
    },
    {
      icon: Lock,
      titleKey: 'useCases.nda.title',
      descKey: 'useCases.nda.desc',
    },
    {
      icon: Users,
      titleKey: 'useCases.poa.title',
      descKey: 'useCases.poa.desc',
    },
    {
      icon: BookUser,
      titleKey: 'useCases.billOfSale.title',
      descKey: 'useCases.billOfSale.desc',
    },
  ];

  const whyUsBullets = [
    { icon: Zap, textKey: 'whyUs.bullet1' },
    { icon: Edit3, textKey: 'whyUs.bullet2' },
    { icon: ShieldCheck, textKey: 'whyUs.bullet3' },
    { icon: Award, textKey: 'whyUs.bullet4' },
  ];

  const pricingPlans = {
    free: {
      titleKey: 'pricing.free.title',
      featuresKey: 'pricing.free.features',
    },
    payPerDoc: {
      titleKey: 'pricing.payPerDoc.title',
      priceKey: 'pricing.payPerDoc.price',
      featuresKey: 'pricing.payPerDoc.features',
    },
    volume: {
      titleKey: 'pricing.volume.title',
      featuresKey: 'pricing.volume.features',
    },
  };

  const faqItems = [
    { id: 'faq1', questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer' },
    { id: 'faq2', questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer' },
    { id: 'faq3', questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer' },
    { id: 'faq4', questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer' },
    { id: 'faq5', questionKey: 'faq.q5.question', answerKey: 'faq.q5.answer' },
    {
      id: 'faq6',
      questionKey: 'faq.q6.question',
      answerKey: 'faq.q6.answer',
      testId: 'faq-item-hipaa',
    },
  ];

  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <p className="ml-2">
            {t('common:Loading...', {
              defaultValue: 'Loading Electronic Signature Page...',
            })}
          </p>
        </div>
      </div>
    );
  }

  const mainButtonAction = () => {
    if (currentFlowStep === 1 && !selectedFile)
      handleHeroUploadAttempt(); // Check auth before file dialog
    else if (currentFlowStep === 2 && selectedFile) handlePrepareDocument();
    else if (currentFlowStep === 3 && signingUrl) {
      window.open(signingUrl, '_blank');
    }
  };

  const mainButtonTextKey =
    currentFlowStep === 3
      ? 'uploadCard.ctaViewDocument'
      : currentFlowStep === 2
        ? 'uploadCard.ctaPrepareDocument'
        : 'uploadCard.ctaAddDoc';

  return (
    <div className="flex flex-col min-h-screen bg-background text-brand-slate">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-sky/60 via-brand-sky/20 to-transparent py-16 md:py-20">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-slate mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-bold text-foreground/90">
                {t('hero.trustpilot')}
              </span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span>{t('hero.trustpilotRating')}</span>
              <span className="mx-1 hidden sm:inline">|</span>
              <Badge
                variant="secondary"
                className="bg-brand-blue/10 text-brand-blue border-brand-blue/30 text-xs"
              >
                {t('hero.complianceBadge')}
              </Badge>
            </div>
          </div>

          {/* Smart Upload Card (Hero Version) */}
          <Card className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-8 text-center border-border mb-8">
            <DropzonePlaceholder
              onFiles={handleFileUpload}
              inputRef={fileInputRef}
              selectedFile={selectedFile}
              onClearFile={handleClearFile}
              isHydrated={isHydrated}
              tGeneral={(key, opts) =>
                t(key, { ...(opts ?? {}), ns: 'common' }) as string
              }
              tEsign={(key, opts) =>
                t(key, {
                  ...(opts ?? {}),
                  ns: 'electronic-signature',
                }) as string
              }
              onClick={handleHeroUploadAttempt} // Gated file input trigger
            />
            {!selectedFile && (
              <p className="text-xs text-muted-foreground mt-4 mb-6">
                {t('hero.supportedFiles')}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green/90 text-white flex-1"
                onClick={mainButtonAction}
                data-test-id="hero-cta-upload"
                disabled={
                  (currentFlowStep === 1 &&
                    selectedFile != null &&
                    uploadProgress < 100) ||
                  isPreparingDoc
                }
              >
                {(currentFlowStep === 1 &&
                  selectedFile != null &&
                  uploadProgress > 0 &&
                  uploadProgress < 100) ||
                isPreparingDoc ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : selectedFile && currentFlowStep === 1 ? null : (
                  <UploadCloud className="mr-2 h-5 w-5" />
                )}
                {t(mainButtonTextKey)}
              </Button>

              {currentFlowStep === 1 && !selectedFile && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 flex-1"
                  onClick={handleAddFrom123LegalDoc}
                >
                  {t('hero.ctaAddFrom123LegalDoc')}
                </Button>
              )}
            </div>

            {(selectedFile || uploadProgress > 0) && (
              <div className="mt-8">
                <Progress
                  value={
                    currentFlowStep === 1
                      ? uploadProgress
                      : (currentFlowStep -
                          1 +
                          (selectedFile && uploadProgress === 100 ? 1 : 0)) *
                        50
                  }
                  className="h-2 bg-muted"
                  aria-label={t('uploadCard.progressLabel')}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span
                    className={cn(
                      currentFlowStep >= 1 && 'text-brand-blue font-semibold',
                    )}
                  >
                    {t('uploadCard.progress.upload')}
                  </span>
                  <span
                    className={cn(
                      currentFlowStep >= 2 && 'text-brand-blue font-semibold',
                    )}
                  >
                    {t('uploadCard.progress.prepare')}
                  </span>
                  <span
                    className={cn(
                      currentFlowStep >= 3 && 'text-brand-blue font-semibold',
                    )}
                  >
                    {t('uploadCard.progress.sign')}
                  </span>
                </div>
                {currentFlowStep === 3 && signingUrl && (
                  <p className="text-sm mt-4">
                    <Link
                      href={signingUrl}
                      target="_blank"
                      className="underline text-brand-blue"
                    >
                      {t('uploadCard.ctaViewDocument')}
                    </Link>
                  </p>
                )}
              </div>
            )}
          </Card>
          <p className="text-sm text-muted-foreground">
            {t('hero.noAccountNeeded')}
          </p>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-slate mb-12">
            {t('howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <div className="bg-brand-blue/10 text-brand-blue rounded-full p-4 mb-4 inline-flex ring-4 ring-brand-blue/20">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
          <Card className="mt-12 p-4 bg-muted rounded-lg text-left max-w-2xl mx-auto shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">
                {t('howItWorks.auditLogSampleTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                {t('howItWorks.auditLogSample')}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-16 md:py-20 bg-brand-sky/40">
        <div className="container max-w-content mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-6">
              {t('security.title')}
            </h2>
            <ul className="space-y-3">
              {complianceItems.map((item) => (
                <li key={item.textKey} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                  <span className="text-foreground">{t(item.textKey)}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="link"
              className="text-brand-blue mt-6 px-0 hover:underline"
            >
              {t('security.whitePaperLink')}{' '}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/400x300/0f172a/e0f2fe.png"
              alt={t('security.imageAlt')}
              width={400}
              height={300}
              className="rounded-lg shadow-xl"
              data-ai-hint="security shield padlock"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-12 text-center">
            {t('useCases.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCaseItems.map((item) => (
              <Card
                key={item.titleKey}
                className="bg-card text-card-foreground shadow-sm p-6 group hover:shadow-lg transition-shadow text-left relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg inline-flex">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-md text-foreground mb-1">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why 123LegalDoc + SignWell Section */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container max-w-content mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-8">
              {t('whyUs.title')}
            </h2>
            <ul className="space-y-4">
              {whyUsBullets.map((bullet) => (
                <li key={bullet.textKey} className="flex items-start gap-3">
                  <div className="p-2 bg-brand-green/15 text-brand-green rounded-full inline-flex">
                    <bullet.icon className="h-5 w-5" />
                  </div>
                  <span className="text-foreground pt-1">
                    {t(bullet.textKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg shadow-xl p-6 h-72 flex items-center justify-center">
            <p className="text-muted-foreground italic">
              {t('whyUs.testimonialSliderPlaceholder')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-brand-blue to-indigo-600 text-white">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('pricing.preview.title')}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t('pricing.preview.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20">
              <CardHeader>
                <CardTitle>{t(pricingPlans.free.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t(pricingPlans.free.featuresKey)}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-sm text-white border-white/30 ring-2 ring-brand-green shadow-2xl">
              <CardHeader>
                <CardTitle>{t(pricingPlans.payPerDoc.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">
                  {t(pricingPlans.payPerDoc.priceKey)}
                </p>
                <p className="text-sm">
                  {t(pricingPlans.payPerDoc.featuresKey)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20">
              <CardHeader>
                <CardTitle>{t(pricingPlans.volume.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t(pricingPlans.volume.featuresKey)}</p>
              </CardContent>
            </Card>
          </div>
          <Button
            variant="outline"
            asChild
            className="mt-10 bg-white text-brand-blue hover:bg-gray-100 border-transparent"
          >
            <Link href={`/${params.locale}/pricing`}>
              {t('pricing.preview.cta')}
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-background">
        <div className="container max-w-content mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-slate mb-10 text-center">
            {t('faq.title')}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto space-y-3"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-border rounded-lg bg-card shadow-sm"
                data-test-id={item.testId}
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-base">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground text-sm">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: t(item.answerKey).replace(/\n/g, '<br />'),
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 bg-muted/40 border-t border-border">
        <div className="container max-w-content mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-slate mb-4">
            {t('finalCta.title')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t('finalCta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-brand-green hover:bg-brand-green/90 text-white"
              onClick={handleHeroUploadAttempt}
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              {t('finalCta.ctaUpload')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue/10"
            >
              {t('finalCta.ctaScheduleDemo')}
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={onAuthSuccessModal}
      />
    </div>
  );
}
