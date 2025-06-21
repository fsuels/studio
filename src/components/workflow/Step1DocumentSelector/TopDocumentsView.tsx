import React from 'react';
import { Button } from '@/components/ui/button';
import TopDocChip from './TopDocChip';
import { ViewComponentProps } from './types';
import { PLACEHOLDER_TOP_DOCS } from './constants';

interface TopDocumentsViewProps
  extends Omit<ViewComponentProps, 'documentsToDisplay'> {
  onExploreAllCategories: () => void;
}

const TopDocumentsView: React.FC<TopDocumentsViewProps> = ({
  isReadOnly,
  isHydrated,
  t,
  i18nLanguage,
  onDocumentSelect,
  onExploreAllCategories,
}) => {
  const handleDocumentSelect = (doc: any) => {
    onDocumentSelect(doc);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PLACEHOLDER_TOP_DOCS.map((doc) => (
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
