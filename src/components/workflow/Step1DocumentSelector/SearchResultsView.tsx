import React from 'react';
import DocumentCard from './DocumentCard';
import { ViewComponentProps } from './types';

interface SearchResultsViewProps extends ViewComponentProps {
  // No additional props needed - all handled by base ViewComponentProps
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
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
}) => {
  const handleDocumentSelect = (doc: any) => {
    onDocumentSelect(doc);
  };

  return (
    <div className="animate-fade-in space-y-6">
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

export default SearchResultsView;
