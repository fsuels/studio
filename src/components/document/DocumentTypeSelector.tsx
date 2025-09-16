// src/components/DocumentTypeSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/usStates';
import documentLibrary, {
  findMatchingDocuments,
  findMatchingDocumentsSync,
  getDocumentsByCountry,
} from '@/lib/document-library';

interface Props {
  onSelect: (_documentId: string) => void; // Now accepts the document ID
  selectedDocument?: string; // Optional prop for pre-selecting a document
}

export default function DocumentTypeSelector({
  onSelect,
  selectedDocument,
}: Props) {
  const { t, i18n } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
  );

  const deriveCategories = React.useCallback((docs: LegalDocument[]) => {
    return [...new Set(docs.map((d) => d.category))];
  }, []);

  const [categories, setCategories] = useState<string[]>(
    deriveCategories(documentLibrary),
  );
  const [filteredDocuments, setFilteredDocuments] = useState<LegalDocument[]>(
    documentLibrary,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hydratedDocs = await getDocumentsByCountry('us');
        if (!cancelled && hydratedDocs.length) {
          setCategories(deriveCategories(hydratedDocs));
          if (!searchQuery) {
            setFilteredDocuments(hydratedDocs);
          }
        }
      } catch (_) {
        if (!cancelled) {
          setCategories(deriveCategories(documentLibrary));
          if (!searchQuery) {
            setFilteredDocuments(documentLibrary);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deriveCategories, searchQuery]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await findMatchingDocuments(
          searchQuery,
          i18n.language as 'en' | 'es',
          selectedState,
        );
        if (!cancelled) {
          setFilteredDocuments(results);
        }
      } catch (_) {
        if (!cancelled) {
          const fallback = findMatchingDocumentsSync(
            searchQuery,
            i18n.language as 'en' | 'es',
            selectedState,
          );
          setFilteredDocuments(fallback);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedState, i18n.language]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('docTypeSelector.title')}</CardTitle>
        <CardDescription>{t('docTypeSelector.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder={t('docTypeSelector.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select onValueChange={setSelectedState}>
            <SelectTrigger
              aria-label={t('docTypeSelector.selectState', 'Select State')}
            >
              <SelectValue placeholder={t('docTypeSelector.selectState')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('docTypeSelector.statesLabel')}</SelectLabel>
                {usStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue={categories[0]} className="mt-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments
                  .filter((doc) => doc.category === category)
                  .map((doc) => (
                    <Card
                      key={doc.id}
                      tabIndex={0}
                      role="button"
                      aria-label={t(doc.name ?? '', doc.name ?? '')}
                      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${selectedDocument === doc.id ? 'border-2 border-primary' : ''}`}
                      onClick={() => onSelect(doc.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(doc.id);
                        }
                      }}
                    >
                      <CardHeader>
                        <CardTitle>{doc.name}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
