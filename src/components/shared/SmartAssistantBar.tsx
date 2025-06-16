'use client';

import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, SendHorizontal } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function SmartAssistantBar() {
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as { locale?: string };
  const locale = (params.locale as 'en' | 'es') || 'en';
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/${locale}/generate?search=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 max-w-md">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., I want to hire a freelancer"
        aria-label="What legal help do you need?"
        className="flex-1"
      />
      <Button type="button" variant="ghost" size="icon" aria-label="Voice input (coming soon)">
        <Mic className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button type="submit" size="icon" aria-label="Submit query">
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
}
