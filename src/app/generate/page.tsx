// src/app/generate/page.tsx
import React from 'react';
import GenerateClient from '@/components/GenerateClient';
import { Button } from '@/components/ui/button';

export default function GeneratePage() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-8">Generate Document</h1>

      <div className="max-w-3xl mx-auto">
        <GenerateClient />
        <div className="mt-8">
          <Button className="bg-gradient-to-r from-electric-500 to-electric-700 hover:to-electric-600 text-white shadow-glass">
            Continue
          </Button>
        </div>
      </div>
    </main>
  );
}
