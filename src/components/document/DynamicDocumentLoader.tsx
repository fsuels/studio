/**
 * Example component showing dynamic document loading
 * This replaces static imports with on-demand loading
 */

'use client';

import { useDocument } from '@/hooks/useDocument';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DynamicDocumentLoaderProps {
  jurisdiction: 'us' | 'ca';
  documentType: string;
  onDocumentLoad?: (document: unknown) => void;
}

export function DynamicDocumentLoader({
  jurisdiction,
  documentType,
  onDocumentLoad
}: DynamicDocumentLoaderProps) {
  const { document, loading, error } = useDocument(jurisdiction, documentType);

  // Notify parent when document loads
  if (document && onDocumentLoad) {
    onDocumentLoad(document);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load document: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!document) {
    return (
      <Alert>
        <AlertDescription>
          Document type &apos;{documentType}&apos; not found
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{document.name}</h2>
        <p className="text-gray-600 mt-2">{document.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          <p className="text-sm text-gray-600">{document.category}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Jurisdiction</h3>
          <p className="text-sm text-gray-600">{jurisdiction.toUpperCase()}</p>
        </div>
        
        {document.averageCompletionTime && (
          <div>
            <h3 className="font-semibold mb-2">Est. Time</h3>
            <p className="text-sm text-gray-600">{document.averageCompletionTime}</p>
          </div>
        )}
        
        {document.complexity && (
          <div>
            <h3 className="font-semibold mb-2">Complexity</h3>
            <p className="text-sm text-gray-600 capitalize">{document.complexity}</p>
          </div>
        )}
      </div>

      {document.requirements && document.requirements.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Requirements</h3>
          <ul className="list-disc list-inside space-y-1">
            {document.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-600">{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example of how to replace static imports
// BEFORE:
// import { vehicleBillOfSale } from '@/lib/documents/us/vehicle-bill-of-sale';
// 
// AFTER:
// <DynamicDocumentLoader 
//   jurisdiction="us" 
//   documentType="vehicle-bill-of-sale"
//   onDocumentLoad={(doc) => setCurrentDocument(doc)}
// />