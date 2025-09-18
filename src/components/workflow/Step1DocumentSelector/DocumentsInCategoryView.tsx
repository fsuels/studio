import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DocumentCard from './DocumentCard';
import { ViewComponentProps } from './types';

interface DocumentsInCategoryViewProps extends ViewComponentProps {
  docSearch: string;
  onDocSearchChange: (value: string) => void;
  placeholderSearchDocuments: string;
}

const DocumentsInCategoryView: React.FC<DocumentsInCategoryViewProps> = ({
  isReadOnly,
  isHydrated,
  t,
  i18nLanguage,
  documentsToDisplay,
  globalSelectedState,
  placeholderNoDescription,
  placeholderRequiresNotarization,
  placeholderCanBeRecorded,
  placeholderNoResults,
  onDocumentSelect,
  docSearch,
  onDocSearchChange,
  placeholderSearchDocuments,
}) => {
  const handleDocumentSelect = (
    doc: ViewComponentProps['documentsToDisplay'][number],
  ) => {
    onDocumentSelect(doc);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholderSearchDocuments}
          value={docSearch}
          onChange={(e) => onDocSearchChange(e.target.value)}
          className="w-full pl-10 h-10 text-sm"
          aria-label={placeholderSearchDocuments}
          disabled={isReadOnly || !isHydrated}
        />
      </div>
      {globalSelectedState ? (
        <>
          {documentsToDisplay.length > 0 ? (
            <div className="document-grid pt-4 animate-fade-in">
              {documentsToDisplay.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onSelect={() => handleDocumentSelect(doc)}
                  disabled={isReadOnly || !isHydrated}
                  t={t}
                  i18nLanguage={i18nLanguage}
                  placeholderNoDescription={placeholderNoDescription}
                  placeholderRequiresNotarization={
                    placeholderRequiresNotarization
                  }
                  placeholderCanBeRecorded={placeholderCanBeRecorded}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-center py-6">
              {placeholderNoResults}
            </p>
          )}
        </>
      ) : (
        <p className="text-muted-foreground italic text-center py-6">
          {isHydrated
            ? t(
                'Please select a state from the filter bar above to see documents.',
              )
            : 'Loading...'}
        </p>
      )}
    </div>
  );
};

export default DocumentsInCategoryView;
