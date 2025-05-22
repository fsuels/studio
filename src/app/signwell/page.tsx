import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function SignWellLanding() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-brand-slate text-white h-14 flex items-center">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Logo svgClassName="h-8 w-auto" wrapperClassName="flex items-center" />
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="#" className="hover:text-brand-green">Products</Link>
            <Link href="#" className="hover:text-brand-green">Pricing</Link>
            <Link href="#" className="hover:text-brand-green">Resources</Link>
            <Link href="#" className="hover:text-brand-green">Blog</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-brand-slate">Log in</Button>
            <Button size="sm" className="bg-brand-green hover:bg-brand-green/90 text-white">Create free account</Button>
          </div>
        </div>
      </header>

      <section className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-brand-sky to-white py-16">
        <div className="container max-w-content mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-slate">Send & Sign Legal Docs Online—Powered by SignWell</h1>
            <p className="text-brand-slate/80 max-w-md">Upload any contract, add parties, and get legally-binding signatures in minutes—not days.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
              <Button data-test-id="hero-cta-start" className="bg-brand-green hover:bg-brand-green/90 text-white">Start Signing Free</Button>
              <Link href="#" className="self-center text-brand-blue underline">Watch 2-min demo</Link>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.148 4.665 24 6 15.596 0 9.748l8.332-1.73z"/></svg>
              <span className="text-sm">4.8/5 rating</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center relative">
            <div className="h-64 w-64 bg-brand-sky rounded-full" />
            <span className="absolute bottom-2 right-2 bg-white text-xs px-2 py-0.5 rounded-full">ESIGN • UETA compliant</span>
          </div>
        </div>
      </section>

      <section className="border-y py-6">
        <div className="container max-w-content mx-auto flex flex-col md:flex-row justify-center text-center gap-6 text-sm">
          <div>Pay per document—no monthly lock-in</div>
          <div>Unlimited signers, multi-device</div>
          <div>Bank-level AES-256 encryption</div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl mx-auto bg-white/70 backdrop-blur rounded-2xl shadow-xl p-8 text-center space-y-6">
          <p className="uppercase text-sm tracking-wide text-brand-slate">Step 1 • Add your document</p>
          <div className="border-2 border-dashed border-brand-blue rounded-lg py-16" data-test-id="upload-dropzone">
            <p>Drag and drop or click to browse</p>
          </div>
          <p className="text-sm text-brand-slate/70">We’ll convert your file for SignWell automatically.</p>
          <div className="flex justify-center gap-4">
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Add My Doc</Button>
            <Button variant="outline">Try sample file</Button>
          </div>
          <div className="flex justify-center gap-2 text-sm text-brand-slate/80">
            <span>Upload</span> → <span>Prepare</span> → <span>Sign</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16">
        <h2 className="text-center text-3xl font-bold mb-10">How Signing Works in 3 Steps</h2>
        <div className="container max-w-content mx-auto grid gap-10 md:grid-cols-3 px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
              <span className="text-brand-blue">1</span>
            </div>
            <p>Upload contract</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
              <span className="text-brand-blue">2</span>
            </div>
            <p>Add signers & fields</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
              <span className="text-brand-blue">3</span>
            </div>
            <p>Send & track signatures</p>
          </div>
        </div>
        <div className="mt-10 container max-w-content mx-auto px-4">
          <pre className="bg-brand-sky p-4 rounded-md text-xs overflow-x-auto">Audit log sample…</pre>
        </div>
      </section>

      <section className="bg-brand-sky/40 py-16">
        <div className="container max-w-content mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          <ul className="flex-1 space-y-2 list-disc list-inside text-brand-slate">
            <li>ESIGN & UETA compliant</li>
            <li>Tamper-proof audit trail</li>
            <li>SOC 2 Type II data centers</li>
            <li>Signer ID verification</li>
          </ul>
          <div className="flex-1 flex justify-center">
            <div className="h-32 w-32 bg-brand-blue/20 rounded-full" />
          </div>
        </div>
        <div className="text-center mt-6">
          <Link href="#" className="underline text-brand-blue">Download security white-paper →</Link>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="container max-w-content mx-auto px-4">
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            <AccordionItem value="hipaa" data-test-id="faq-item-hipaa">
              <AccordionTrigger>Is SignWell HIPAA compliant?</AccordionTrigger>
              <AccordionContent>Yes. SignWell offers HIPAA-compliant eSignatures for covered entities.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
