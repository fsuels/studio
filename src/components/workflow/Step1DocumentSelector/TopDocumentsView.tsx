import React from 'react';
import { Button } from '@/components/ui/button';
import TopDocChip from './TopDocChip';
import { ViewComponentProps, SelectableDocument } from './types';

interface TopDocumentsViewProps
  extends Omit<ViewComponentProps, 'documentsToDisplay'> {
  documents: SelectableDocument[];
  onExploreAllCategories: () => void;
}

const TopDocumentsView: React.FC<TopDocumentsViewProps> = ({
  isReadOnly,
  isHydrated,
  t,
  i18nLanguage,
  onDocumentSelect,
  documents,
  onExploreAllCategories,
}) => {
  const handleDocumentSelect = (doc: any) => {
    onDocumentSelect(doc);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <TopDocChip
            key={doc.id}
            doc={doc}
            onSelect={() => handleDocumentSelect(doc)}
            disabled={isReadOnly || !isHydrated}
            t={t}
            i18nLanguage={i18nLanguage}
          />
        ))}
      </div>
      <Button
        variant="link"
        onClick={onExploreAllCategories}
        className="w-full justify-center text-primary"
      >
        {t(
          'stepOne.exploreAllCategoriesButton',
          'Explore All Document Categories',
        )}{' '}
        →
      </Button>
    </div>
  );
};

export default TopDocumentsView;
