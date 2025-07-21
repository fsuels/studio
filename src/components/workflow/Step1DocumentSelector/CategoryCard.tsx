import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { CategoryCardProps } from './types';

const CategoryCard = React.memo(function CategoryCard({
  category,
  onClick,
  disabled,
  t,
}: CategoryCardProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="category-card h-auto min-h-[110px] p-6 border-border shadow-sm hover:shadow-lg transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100 rounded-xl"
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        {React.createElement(category.icon || FileText, {
          className: 'h-6 w-6 text-primary',
        })}
      </span>
      <span className="font-medium text-card-foreground text-base">
        {t(category.labelKey, { defaultValue: category.key })}
      </span>
    </Button>
  );
});

export default CategoryCard;
