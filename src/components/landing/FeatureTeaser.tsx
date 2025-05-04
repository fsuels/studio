// src/components/landing/FeatureTeaser.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Lock, DollarSign } from 'lucide-react'; // Using relevant Lucide icons
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
    className="w-full"
  >
    <Card className="h-full transition-all duration-200 rounded-lg overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export function FeatureTeaser() {
  const features = [
    {
      icon: Zap,
      title: "Blazing-Fast Workflow",
      description: "AI guides you step-by-step, making document creation quick and intuitive.",
      delay: 0.1,
    },
    {
      icon: Lock,
      title: "Secure & Compliant",
      description: "Generate encrypted PDFs and utilize time-locked share links for enhanced security.",
      delay: 0.2,
    },
    {
      icon: DollarSign,
      title: "Cost-Effective",
      description: "Pay just $5 per document compared to $200+ typically charged by law firms.",
      delay: 0.3,
    },
  ];

  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
