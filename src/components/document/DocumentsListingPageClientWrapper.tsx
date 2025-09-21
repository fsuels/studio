'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Shield, Sparkles } from 'lucide-react';
import {
  DOCUMENT_REGISTRY,
  getAllCategories,
  type DocumentInfo,
} from '@/lib/document-registry';

function formatRouteTitle(id: string): string {
  return id
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function DocumentCard({ doc }: { doc: DocumentInfo }) {
  return (
    <Card className="hover:shadow-lg transition-shadow" key={doc.id}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {doc.configType === 'json' ? (
              <Sparkles className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">
              {doc.title || formatRouteTitle(doc.id)}
            </CardTitle>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <Badge variant="outline">
              {doc.configType === 'json' ? 'JSON' : 'TypeScript'}
            </Badge>
            {doc.isNew && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                New
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {doc.description || 'State-compliant template available for immediate download.'}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {doc.category}
          </span>
          {doc.jurisdiction && (
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {doc.jurisdiction}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {doc.requiresNotary && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Notary Required
              </Badge>
            )}
            {doc.officialForm && (
              <Badge variant="outline" className="text-xs">
                Official Form
              </Badge>
            )}
          </div>
          <Button size="sm" asChild>
            <Link href={doc.route}>Create</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DocumentsListingPageClientWrapper() {
  const categories = useMemo(() => ['all', ...getAllCategories()], []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [config, setConfig] = useState<'all' | 'json' | 'typescript'>('all');

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return DOCUMENT_REGISTRY.filter((doc) => {
      if (category !== 'all' && doc.category !== category) {
        return false;
      }
      if (config !== 'all' && doc.configType !== config) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.id.toLowerCase().includes(query)
      );
    });
  }, [category, config, search]);

  return (
    <div className="container mx-auto px-4">
      <header className="max-w-4xl mx-auto text-center space-y-4 py-12">
        <Badge variant="outline">State compliant</Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Legal Document Templates
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse our professionally drafted, state-compliant templates. Generate a polished document in minutes with guided workflows.
        </p>
      </header>

      <section className="max-w-4xl mx-auto mb-10 grid gap-4 md:grid-cols-[1fr_180px_180px]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by document name or keyword"
          className="h-11"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={config} onValueChange={(value: 'all' | 'json' | 'typescript') => setConfig(value)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Config type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="json">JSON-driven</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </section>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No documents match your filter. Try adjusting your search or category.
        </div>
      )}
    </div>
  );
}
