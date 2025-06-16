import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DocumentCardProps } from './types';
import { getDocName, getDocDescription } from './constants';

const DocumentCard = React.memo(function DocumentCard({
  doc,
  onSelect,
  disabled,
  t,
  i18nLanguage,
  placeholderNoDescription,
  placeholderRequiresNotarization,
  placeholderCanBeRecorded,
}: DocumentCardProps) {
  return (
    <Card
      onClick={onSelect}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={t(getDocName(doc, i18nLanguage), {
        defaultValue: getDocName(doc, i18nLanguage),
      })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100',
        disabled ? 'pointer-events-none opacity-50' : '',
      )}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold text-card-foreground">
          {t(getDocName(doc, i18nLanguage), {
            defaultValue: getDocName(doc, i18nLanguage),
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground flex-grow px-4">
        {t(getDocDescription(doc, i18nLanguage), {
          defaultValue: getDocDescription(doc, i18nLanguage),
        }) || placeholderNoDescription}
      </CardContent>
      <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
        <span>💲{doc.basePrice}</span>
        <div className="flex gap-2">
          {doc.requiresNotarization && (
            <span title={placeholderRequiresNotarization}>📝</span>
          )}
          {doc.canBeRecorded && (
            <span title={placeholderCanBeRecorded}>🏛️</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
});

export default DocumentCard;