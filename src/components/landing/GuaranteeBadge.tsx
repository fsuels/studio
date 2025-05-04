// src/components/landing/GuaranteeBadge.tsx
import React from 'react';
import { ShieldCheck } from 'lucide-react'; // Using a relevant icon

export function GuaranteeBadge() {
  return (
    <section className="w-full py-8 bg-background">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-secondary/80 border border-primary/30 rounded-full px-6 py-3 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium text-secondary-foreground">
            100% Satisfaction Guarantee or Your Money Back
          </p>
        </div>
      </div>
    </section>
  );
}
