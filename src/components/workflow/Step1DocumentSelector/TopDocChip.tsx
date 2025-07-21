import React from 'react';
import { Button } from '@/components/ui/button';
import { TopDocChipProps } from './types';
import { getDocName } from './constants';

const TopDocChip = React.memo(function TopDocChip({
  doc,
  onSelect,
  disabled,
  t,
  i18nLanguage,
}: TopDocChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onSelect}
      disabled={disabled}
      className="category-card h-auto min-h-[60px] p-4 border-border shadow-sm hover:shadow-lg transition text-center flex items-center justify-center gap-2 bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100"
    >
      {doc.icon &&
        React.createElement(doc.icon, { className: 'h-5 w-5 text-primary/80' })}
      <span className="font-medium text-card-foreground text-sm">
        {t(getDocName(doc, i18nLanguage), {
          defaultValue: getDocName(doc, i18nLanguage),
        })}
      </span>
    </Button>
  );
});

export default TopDocChip;
