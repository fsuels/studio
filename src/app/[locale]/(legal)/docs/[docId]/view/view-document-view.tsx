// src/app/[locale]/docs/[docId]/view/view-document-view.tsx
'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/shared/EmptyState';
import { renderMarkdown } from '@/lib/markdown-renderer';
import { serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentDetail from '@/components/document/DocumentDetail';
import { useAuth } from '@/hooks/useAuth';
import { getSignWellUrl } from '@/services/signwell';
import { Button } from '@/components/ui/button';
import { Loader2, Share2 } from 'lucide-react';
import { getDb } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { hasUserPaidForDocument } from '@/lib/firestore/paymentActions';
import { auditService } from '@/services/firebase-audit-service';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';
import { TooltipProvider } from '@/components/ui/tooltip';
import { stateCodeToSlug, stateNameToCode } from '@/lib/state-utils';
import { getStateFormPath, getFormPathWithFallback } from '@/lib/pdf/state-form-manager';
import FilledPDFViewer from '@/components/document/FilledPDFViewer';

interface ViewDocumentViewProps {
  locale: 'en' | 'es';
  docId: string;
  actualDocId?: string;
}

export default function ViewDocumentView({ locale, docId, actualDocId }: ViewDocumentViewProps) {
  const searchParams = useSearchParams();
  /* Dashboard passes ?docId=abc123, but direct navigation (or refresh)
     gives you only the route param.  */
  const savedDocId = actualDocId || searchParams.get('docId') || docId;
  const { isLoggedIn, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  // Debug logging to understand the component initialization
  console.log('🔍 ViewDocumentView initialized with:', {
    locale,
    docId,
    savedDocId,
    searchParams: Object.fromEntries(searchParams.entries()),
    isLoggedIn,
    authLoading,
    userId: user?.uid
  });

  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>(null);
  const [documentState, setDocumentState] = useState<string | null>(null);
  const [effectiveDocType, setEffectiveDocType] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function fetchContent() {
      setIsLoadingContent(true);
      const timeoutMs = 15000;
      try {
        const uid = user?.uid;
        const id = savedDocId;
        if (!uid || !id) {
          setLoadError('Missing user or document identifier.');
          setIsLoadingContent(false);
          return;
        }
        const db = await getDb();
        const docRef = doc(db, 'users', uid, 'documents', id);
        const snap = await Promise.race([
          getDoc(docRef),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeoutMs),
          ),
        ]);
        if (!snap.exists()) {
          setLoadError('Document not found.');
          return;
        }
        const data = snap.data() as Record<string, any>;
        console.log('🔍 Document data from Firestore:', data);
        
        let markdown = data.contentMarkdown as string | undefined;
        const docFormData = data.formData ?? data.data;
        const docType = data.docType || data.originalDocId || docId;
        
        // Extract state from form data - the wizard saves it as 'state' field
        const savedState = docFormData?.state;
        const docState = data.state || savedState || 'florida'; // default to florida for demo
        
        // Convert state to state code if needed (FL, CA, etc.)
        let docStateCode = data.stateCode || docFormData?.stateCode;
        
        // If we have a state name/value, convert it to state code
        if (!docStateCode && savedState) {
          docStateCode = stateNameToCode(savedState) || 'FL';
        }
        
        if (!docStateCode) {
          docStateCode = 'FL'; // Default fallback
        }
        
        console.log('📋 Extracted form data:', {
          docFormData,
          docType,
          docState,
          docStateCode,
          hasFormData: !!docFormData,
          formDataKeys: docFormData ? Object.keys(docFormData) : []
        });
        
        // Store the form data and state for PDF rendering
        setFormData(docFormData);
        setDocumentState(docStateCode); // Use state code (FL) not state name (florida)
        setEffectiveDocType(docType);

        // Check for other sources (legacy or alternative storage)
        if (typeof data.markdown === 'string' && !markdown) {
          markdown = data.markdown; // legacy markdown field
        } else if (data.storagePath) {
          const storage = getStorage();
          const url = await getDownloadURL(
            storageRef(storage, data.storagePath),
          );
          const res = await fetch(url);
          markdown = await res.text();
        } else if (data.url) {
          // Direct URL storage (less common now)
          const res = await fetch(data.url); // Assuming data.url is a publicly accessible URL
          markdown = await res.text();
        }

        // ---------- Fallback: generate from formData on‑the‑fly ----------
        if (!markdown && docFormData) {
          markdown = await renderMarkdown(
            docType,
            docFormData,
            docState,
          );

          /*  Optional but highly recommended: write it back so subsequent
              visits are instant. Fail‑safe — ignore any permission errors.  */
          try {
            await setDoc(
              docRef,
              { contentMarkdown: markdown, updatedAt: serverTimestamp() },
              { merge: true },
            );
          } catch (error) {
            // read‑only environments (preview channels) can skip this
            console.warn('Could not cache markdown content:', error);
          }
        }

        setMarkdownContent(markdown || null);
        setLoadError(null);

        // Log document view event (skip audit to avoid permission issues)
        if (markdown) {
          try {
            await auditService.logDocumentEvent(
              'view',
              savedDocId,
              docType,
              {
                userId: uid,
                locale,
                hasContent: !!markdown,
                contentSource: data.contentMarkdown ? 'cached' : 'generated',
                documentLength: markdown.length,
              },
            );
          } catch (auditError) {
            console.warn('⚠️ Could not log audit event (permissions issue):', auditError);
            // Don't fail the document view because of audit logging issues
          }
        }

        const paid = await hasUserPaidForDocument(uid, savedDocId);
        setHasPaid(paid);
      } catch (err: any) {
        console.error('[view page] failed to load saved content', err);
        const msg =
          err?.message === 'timeout'
            ? 'Request timed out. Please try again.'
            : 'Failed to load document.';
        setLoadError(msg);
      } finally {
        if (!cancelled) setIsLoadingContent(false);
      }
    }
    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [savedDocId, user, docId, locale]);

  const [isSigning, setIsSigning] = useState(false);

  // Navigate back to the start‐wizard, preserving any saved data
  const handleEdit = () => {
    // For state-specific documents, pass the saved document ID to continue editing
    const isStateSpecificForm = effectiveDocType === 'vehicle-bill-of-sale' && documentState;
    if (isStateSpecificForm) {
      // documentState is now the state code (FL), need to convert to state name for URL
      const stateNameForUrl = stateCodeToSlug(documentState) ?? documentState.toLowerCase();
      router.push(`/${locale}/docs/${effectiveDocType}/start?resumeId=${savedDocId}&state=${stateNameForUrl}`);
    } else {
      router.push(`/${locale}/docs/${docId}/start`);
    }
  };

  // Opens SignWell flow in a new tab
  const handleSign = async () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
      return;
    }
    if (!hasPaid) {
      router.push(`/${locale}/checkout?docId=${docId}`);
      return;
    }
    setIsSigning(true);
    try {
      const url = await getSignWellUrl(docId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error fetching SignWell URL', err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleShare = async () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
      return;
    }
    if (!hasPaid) {
      router.push(`/${locale}/checkout?docId=${docId}`);
      return;
    }
    const shareData = {
      title: 'Document',
      text: 'View my document',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (err) {
      console.error('Error sharing document', err);
    }
  };

  const handleDownload = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
    } else if (!hasPaid) {
      router.push(`/${locale}/checkout?docId=${docId}`);
    } else {
      router.push(`/${locale}/api/generate-pdf?docId=${docId}`);
    }
  };

  const handleDownloadDocx = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
    } else if (!hasPaid) {
      router.push(`/${locale}/checkout?docId=${docId}`);
    } else {
      router.push(`/${locale}/api/generate-docx?docId=${docId}`);
    }
  };

  if (authLoading || isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error handling - if we don't have a user or saved document ID, show error
  if (!authLoading && !user) {
    console.error('❌ ViewDocumentView: No user found');
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to view this document.</p>
          <Button onClick={() => router.push(`/${locale}/signin`)}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!savedDocId) {
    console.error('❌ ViewDocumentView: No document ID found');
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-gray-600 mb-4">No document ID was provided.</p>
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  try {
    return (
      <TooltipProvider>
        <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h1 className="text-2xl font-bold">
            {/* Ideally replace docId with a friendly title lookup */}
            {docId.replace(/-/g, ' ')}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleEdit}>Edit</Button>

          <Button onClick={handleSign} disabled={isSigning}>
            {isSigning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            E-sign
          </Button>

          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button variant="secondary" onClick={handleDownload}>
            Download PDF
          </Button>
          <Button variant="secondary" onClick={handleDownloadDocx}>
            Download DOCX
          </Button>
        </div>
      </div>

      {/* Document preview */}
      <div className="border rounded-lg overflow-hidden">
        {loadError ? (
          <EmptyState
            title={loadError}
            description="Edit the draft to finish generating your document."
          />
        ) : (() => {
          // Check if this is a state-specific document that should show PDF
          const isStateSpecificForm = !!documentState && !!formData &&
            (effectiveDocType === 'vehicle-bill-of-sale' || effectiveDocType === 'bill-of-sale-vehicle');
          
          // Debug state-specific form detection
          console.log('🔍 View page state detection:', {
            docConfig: 'omitted',
            documentState,
            formData: !!formData,
            formDataKeys: formData ? Object.keys(formData) : 'none',
            effectiveDocType,
            isStateSpecificForm,
            savedDocId,
            docId
          });
          
          if (isStateSpecificForm) {
            // Use getFormPathWithFallback to get the correct PDF (official or generic)
            const stateSlug = stateCodeToSlug(documentState) ?? documentState.toLowerCase();
            
            // Get the appropriate PDF path (official state form or generic fallback)
            const pdfPath = getFormPathWithFallback(documentState);
            
            console.log('📄 PDF Path Debug:', {
              documentState,
              stateSlug,
              pdfPath,
              hasOfficialForm: !!getStateFormPath(documentState)
            });
            
            return (
              <div className="p-4">
                <div className="border rounded-lg bg-gray-50 p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Official state form with your information. Download to complete the transaction.
                  </p>
                  
                  {/* Use FilledPDFViewer to show form with user data */}
                  <FilledPDFViewer 
                    pdfPath={pdfPath}
                    formData={formData}
                    state={documentState}
                    title={`${documentState} Vehicle Bill of Sale`}
                  />
                  
                  <div className="mt-4">
                    <button 
                      onClick={() => handleEdit()}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Edit Document
                    </button>
                  </div>
                </div>
                
                {/* Show form data for reference */}
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Your Information:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {formData?.seller_name && (
                      <div><strong>Seller:</strong> {formData.seller_name}</div>
                    )}
                    {formData?.buyer_name && (
                      <div><strong>Buyer:</strong> {formData.buyer_name}</div>
                    )}
                    {formData?.year && formData?.make && formData?.model && (
                      <div><strong>Vehicle:</strong> {formData.year} {formData.make} {formData.model}</div>
                    )}
                    {formData?.vin && (
                      <div><strong>VIN:</strong> {formData.vin}</div>
                    )}
                    {formData?.price && (
                      <div><strong>Price:</strong> ${formData.price}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <DocumentDetail
                docId={docId}
                locale={locale}
                markdownContent={markdownContent || undefined}
              />
            );
          }
        })()}
      </div>
    </div>
    </TooltipProvider>
  );
  } catch (error) {
    console.error('❌ ViewDocumentView: Runtime error:', error);
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Document</h1>
          <p className="text-gray-600 mb-4">An error occurred while loading the document.</p>
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
}
