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
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';
import { auditService } from '@/services/firebase-audit-service';
import { TooltipProvider } from '@/components/ui/tooltip';
import { documentLibrary } from '@/lib/document-library';

interface ViewDocumentViewProps {
  locale: 'en' | 'es';
  docId: string;
}

export default function ViewDocumentView({ locale, docId }: ViewDocumentViewProps) {
  const searchParams = useSearchParams();
  /* Dashboard passes ?docId=abc123, but direct navigation (or refresh)
     gives you only the route param.  */
  const savedDocId = searchParams.get('docId') || docId;
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
    const uid = user?.uid;
    if (!uid || !savedDocId) return;
    let cancelled = false;
    async function fetchContent() {
      setIsLoadingContent(true);
      const timeoutMs = 15000;
      try {
        const db = await getDb();
        const docRef = doc(db, 'users', uid, 'documents', savedDocId);
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
        let markdown = data.contentMarkdown as string | undefined;
        const docFormData = data.formData ?? data.data;
        const docType = data.docType || data.originalDocId || docId;
        const docState = data.state || docFormData?.state || 'florida'; // default to florida for demo
        const docStateCode = data.stateCode || docFormData?.stateCode || 'FL'; // State code for PDF preview
        
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
          } catch (_) {} // read‑only environments (preview channels) can skip this
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
  }, [savedDocId, user]);

  const [isSigning, setIsSigning] = useState(false);

  // Navigate back to the start‐wizard, preserving any saved data
  const handleEdit = () => {
    // For state-specific documents, pass the saved document ID to continue editing
    const isStateSpecificForm = effectiveDocType === 'vehicle-bill-of-sale' && documentState;
    if (isStateSpecificForm) {
      // documentState is now the state code (FL), need to convert to state name for URL
      const stateNameForUrl = documentState.toLowerCase() === 'fl' ? 'florida' : 
                               documentState.toLowerCase() === 'al' ? 'alabama' :
                               documentState.toLowerCase() === 'co' ? 'colorado' :
                               documentState.toLowerCase() === 'ga' ? 'georgia' :
                               documentState.toLowerCase() === 'id' ? 'idaho' :
                               documentState.toLowerCase() === 'ks' ? 'kansas' :
                               documentState.toLowerCase() === 'md' ? 'maryland' :
                               documentState.toLowerCase() === 'mt' ? 'montana' :
                               documentState.toLowerCase() === 'nd' ? 'north-dakota' :
                               documentState.toLowerCase() === 'wv' ? 'west-virginia' :
                               documentState.toLowerCase();
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
          const docConfig = documentLibrary.find(doc => doc.id === effectiveDocType);
          const isStateSpecificForm = docConfig && documentState && formData && 
            (effectiveDocType === 'vehicle-bill-of-sale' || 
             effectiveDocType === 'bill-of-sale-vehicle');
          
          // Debug state-specific form detection
          console.log('🔍 View page state detection:', {
            docConfig: !!docConfig,
            documentState,
            formData: !!formData,
            formDataKeys: formData ? Object.keys(formData) : 'none',
            effectiveDocType,
            isStateSpecificForm,
            savedDocId,
            docId
          });
          
          if (isStateSpecificForm) {
            // TEMPORARY: Use simple iframe to bypass CSP issues with PDF.js
            const pdfPath = `/forms/vehicle-bill-of-sale/${documentState.toLowerCase()}/HSMV-82050.pdf`;
            
            return (
              <div className="p-4">
                <div className="border rounded-lg bg-gray-50 p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {documentState} Vehicle Bill of Sale
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Official state form with your information. Download to complete the transaction.
                  </p>
                  
                  {/* Simple iframe approach - bypasses CSP eval issues */}
                  <div className="w-full h-96 border rounded">
                    <iframe 
                      src={pdfPath}
                      width="100%" 
                      height="100%"
                      style={{ border: 'none' }}
                      title="Vehicle Bill of Sale PDF"
                    />
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <a 
                      href={pdfPath}
                      download
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download PDF
                    </a>
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
                    {formData?.vehicle_year && formData?.vehicle_make && formData?.vehicle_model && (
                      <div><strong>Vehicle:</strong> {formData.vehicle_year} {formData.vehicle_make} {formData.vehicle_model}</div>
                    )}
                    {formData?.vin && (
                      <div><strong>VIN:</strong> {formData.vin}</div>
                    )}
                    {formData?.sale_price && (
                      <div><strong>Price:</strong> ${formData.sale_price}</div>
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
