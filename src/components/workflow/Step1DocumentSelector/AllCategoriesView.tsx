import React from 'react';
import CategoryCard from './CategoryCard';
import { ViewComponentProps, CategoryInfo } from './types';

interface AllCategoriesViewProps extends Omit<ViewComponentProps, 'documentsToDisplay'> {
  sortedCategories: CategoryInfo[];
  onCategoryClick: (key: string) => void;
  placeholderNoCategories: string;
}

const AllCategoriesView: React.FC<AllCategoriesViewProps> = ({
  isReadOnly,
  isHydrated,
  t,
  sortedCategories,
  onCategoryClick,
  placeholderNoCategories,
}) => {
  return (
    <div className="animate-fade-in space-y-4">
      {sortedCategories.length > 0 ? (
        <div className="category-grid pt-2">
          {sortedCategories.map((cat) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              onClick={() => onCategoryClick(cat.key)}
              disabled={isReadOnly || !isHydrated}
              t={t}
              i18nLanguage="" // Not needed for categories
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic text-center py-6">
          {placeholderNoCategories}
        </p>
      )}
    </div>
  );
};

export default AllCategoriesView;