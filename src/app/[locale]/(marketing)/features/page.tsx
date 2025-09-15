// src/app/[locale]/features/page.tsx
import React from 'react';
import { Bot, ListChecks, Building, Languages, FileText, Share2, LayoutDashboard, ShieldCheck, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// generateStaticParams is a server-side function and can be exported from a Server Component page
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// This page.tsx is a Server Component – render static content to keep bundle lean
export default function FeaturesPage() {
  const Feature = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">Key Features</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Powerful tools to simplify your legal document workflow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Feature icon={<Bot className="h-8 w-8 text-primary" />} title="AI Document Inference" desc="Smart suggestions based on your needs." />
        <Feature icon={<ListChecks className="h-8 w-8 text-primary" />} title="Dynamic Questionnaires" desc="Guided questions tailored to your chosen document." />
        <Feature icon={<Building className="h-8 w-8 text-primary" />} title="State-Specific Clauses" desc="Documents adapted for U.S. state laws." />
        <Feature icon={<Languages className="h-8 w-8 text-primary" />} title="Bilingual Support (EN/ES)" desc="Full interface and support in English & Spanish." />
        <Feature icon={<FileText className="h-8 w-8 text-primary" />} title="Instant PDF Generation" desc="Preview and download professional PDFs." />
        <Feature icon={<Share2 className="h-8 w-8 text-primary" />} title="Secure Sharing" desc="Share documents with time-limited links (coming soon)." />
        <Feature icon={<LayoutDashboard className="h-8 w-8 text-primary" />} title="User Dashboard" desc="Manage your documents and settings easily." />
        <Feature icon={<ShieldCheck className="h-8 w-8 text-primary" />} title="Privacy & Security" desc="Encrypted data and compliant practices." />
      </div>

      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">Why Choose Us?</h2>
        <Card className="shadow-lg border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                <TableHead className="text-center text-primary font-semibold">123LegalDoc</TableHead>
                <TableHead className="text-center text-muted-foreground">LegalZoom</TableHead>
                <TableHead className="text-center text-muted-foreground">LawDepot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>AI-Powered Drafting</TableCell>
                <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Instant Document Download</TableCell>
                <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
                <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fully Bilingual Support</TableCell>
                <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>One-Time Payment Option</TableCell>
                <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
                <TableCell className="text-center"><X className="h-5 w-5 text-destructive mx-auto" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>
    </main>
  );
}
