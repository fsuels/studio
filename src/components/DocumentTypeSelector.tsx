// src/components/DocumentTypeSelector.tsx
'use client'

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
import { documentLibrary, usStates, LegalDocument, findMatchingDocuments } from '@/lib/document-library/index';


interface Props {
  onSelect: (docType: string) => void; // Now accepts the document ID
  selectedDocument?: string; // Optional prop for pre-selecting a document
}

export default function DocumentTypeSelector({ onSelect, selectedDocument }: Props) {
  const { t, i18n } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);


  useEffect(() => {
    // Set hydrated state on client
  }, []);

  const categories = useMemo(() => {
    return [...new Set(documentLibrary.map((doc) => doc.category))];
  }, []);

  const filteredDocuments = useMemo(() => {
    return findMatchingDocuments(searchQuery, i18n.language as 'en' | 'es', selectedState);
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
            <SelectTrigger aria-label={t('docTypeSelector.selectState', 'Select State')}>
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
                      aria-label={t(doc.name, doc.name)}
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


