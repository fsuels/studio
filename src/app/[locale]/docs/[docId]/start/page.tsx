// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { z } from 'zod'; // Import z

// WizardLayout component defined directly or imported
// For simplicity, defining a basic structure here if it's not a separate component
const WizardLayout = ({ children, locale, docId, docName }: { children: React.ReactNode, locale: string, docId: string, docName: string }) => {
  const { t } = useTranslation();
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home', { ns: 'translation', defaultValue: "Home" }), href: `/${locale}` },
          { label: docName, href: `/${locale}/docs/${docId}` },
          { label: t('breadcrumb.start', { ns: 'translation', defaultValue: "Start" }) },
        ]}
      />
      {children}
    </main>
  );
};


export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter(); // useRouter is already imported

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (docIdFromPath && isHydrated) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      console.log(`[StartWizardPage Debug] Looking for docId: ${docIdFromPath}`);
      console.log(`[StartWizardPage Debug] Found doc in library:`, foundDoc ? { id: foundDoc.id, name: foundDoc.name, schemaExists: !!foundDoc.schema } : null);

      let isValidSchema = false;
      if (foundDoc && foundDoc.schema) {
        const schema = foundDoc.schema;
        console.log(`[StartWizardPage Debug] Schema constructor name:`, schema?.constructor?.name); 
        console.log(`[StartWizardPage Debug] Schema _def:`, schema?._def);
        console.log(`[StartWizardPage Debug] Schema _def.schema:`, schema?._def?.schema);
        console.log(`[StartWizardPage Debug] schema instanceof z.ZodObject:`, schema instanceof z.ZodObject);
        if (schema instanceof z.ZodObject) {
          console.log(`[StartWizardPage Debug] Schema is ZodObject. Shape:`, schema.shape);
          isValidSchema = (typeof schema.shape === 'object' && schema.shape !== null && Object.keys(schema.shape).length > 0);
        } else if (schema._def && schema._def.schema && schema._def.schema instanceof z.ZodObject) {
          console.log(`[StartWizardPage Debug] Schema is wrapped ZodObject. Inner schema constructor name:`, schema._def.schema?.constructor?.name);
          console.log(`[StartWizardPage Debug] Inner shape:`, schema._def.schema.shape);
          isValidSchema = (typeof schema._def.schema.shape === 'object' && schema._def.schema.shape !== null && Object.keys(schema._def.schema.shape).length > 0);
        } else {
            console.log(`[StartWizardPage Debug] Schema is neither ZodObject nor a directly wrapped ZodObject. TypeName: ${schema._def?.typeName}, Schema details:`, schema);
        }
      } else {
        console.log(`[StartWizardPage Debug] foundDoc or foundDoc.schema is missing. FoundDoc:`, foundDoc);
      }
      console.log(`[StartWizardPage Debug] isValidSchema result: ${isValidSchema}`);
      
      if (foundDoc && isValidSchema) {
        setDocConfig(foundDoc);
      } else {
        console.error(`[StartWizardPage] Document config not found or schema invalid for docId: ${docIdFromPath}. FoundDoc valid: ${!!foundDoc}, Schema valid: ${isValidSchema}.`);
        notFound(); 
      }
      setIsLoading(false);
    } else if (!docIdFromPath && isHydrated) {
      setIsLoading(false);
      notFound(); 
    }
  }, [docIdFromPath, isHydrated, notFound]);


  const handleWizardComplete = useCallback((checkoutUrl: string) => {
    toast({ title: t("Proceeding to Checkout", {ns: 'translation'}), description: t("Redirecting to secure payment...", {ns: 'translation'}) });
    router.push(checkoutUrl);
  }, [toast, t, router]);


  if (!isHydrated || isLoading || !docConfig) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading document wizard...', {ns: 'translation'})}</p>
      </div>
    );
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

  return (
    <WizardLayout locale={locale} docId={docIdFromPath} docName={documentDisplayName}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-0"> {/* Removed mt-6 from here as WizardLayout provides py-8 */}
            <div className="lg:col-span-1"> {/* Adjusted to span 1 for form on desktop to make it 50% */}
                <WizardForm
                locale={locale}
                doc={docConfig} 
                onComplete={handleWizardComplete}
                />
            </div>
            <div className="lg:col-span-1"> {/* Adjusted to span 1 for preview on desktop to make it 50% */}
                <div className="sticky top-24 h-screen max-h-[calc(100vh-6rem)] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">{t('Live Preview', {ns: 'translation'})}</h3>
                    <div className="flex-grow overflow-hidden">
                         <PreviewPane
                            docId={docIdFromPath}
                            locale={locale}
                          />
                    </div>
                </div>
            </div>
        </div>
    </WizardLayout>
  );
}

