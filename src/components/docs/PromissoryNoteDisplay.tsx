// src/components/docs/PromissoryNoteDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCart } from "@/contexts/CartProvider";
import { track } from "@/lib/analytics";

interface PromissoryNoteDisplayProps {
  locale: "en" | "es";
}

export default function PromissoryNoteDisplay({ locale }: PromissoryNoteDisplayProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleStartProcess = () => {
    if (!isHydrated) return;
    const itemName = "Promissory Note";
    const priceCents = 500;
    track("add_to_cart", { item_id: "promissory-note", item_name: itemName, value: priceCents / 100, currency: "USD" });
    addItem({ id: "promissory-note", type: "doc", name: itemName, price: priceCents });
    router.push(`/${locale}/#workflow-start?docId=promissory-note`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Promissory Note Guide</h1>
        <p className="text-lg text-muted-foreground">Everything you need to craft an enforceable loan agreement.</p>
      </header>

      <Accordion type="single" collapsible className="w-full space-y-4 mb-10">
        <AccordionItem value="what" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            1. What Is a Promissory Note?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>A promissory note is a written promise by one party (the borrower) to repay a specific sum to another (the lender) under agreed terms. It:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Establishes principal, interest, and repayment schedule</li>
              <li>Creates a legally binding debt that can be enforced in court</li>
              <li>Documents collateral (if any) and default remedies</li>
              <li>Satisfies banker and auditor proof-of-loan requirements</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="when" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            2. When You Must Use One
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <Table className="min-w-full text-sm mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground bg-muted/50">Scenario</TableHead>
                  <TableHead className="text-foreground bg-muted/50">Why a Note Is Critical</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Personal loan to family or friends</TableCell>
                  <TableCell>Prevents misunderstandings and preserves relationships</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business owner lending to their own LLC</TableCell>
                  <TableCell>Maintains corporate veil &amp; clean bookkeeping</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Seller-financed real-estate deal</TableCell>
                  <TableCell>Shows evidence of debt for title insurers and tax authorities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Equipment or vehicle sold on installments</TableCell>
                  <TableCell>Lets seller reclaim asset on default</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>High-value payday advances to employees</TableCell>
                  <TableCell>Satisfies payroll auditors</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            3. Promissory Note Varieties
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <ul className="list-disc pl-5">
              <li>Simple (Unsecured) – no collateral; relies on borrower’s creditworthiness</li>
              <li>Secured – identifies collateral (e.g., car, equipment) lender may seize if unpaid</li>
              <li>Demand – payable any time lender calls the balance due</li>
              <li>Installment with Balloon – periodic interest payments plus lump-sum principal at the end</li>
              <li>Interest-Only – borrower pays interest during term, principal at maturity</li>
              <li>Master Note / Line of Credit – revolving balance with maximum credit limit</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="components" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            4. Essential Clauses &amp; Data Points
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <Table className="min-w-full text-sm mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground bg-muted/50">Clause</TableHead>
                  <TableHead className="text-foreground bg-muted/50">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Principal Amount</TableCell>
                  <TableCell>Captures exact dollars loaned, avoiding future disputes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interest Rate &amp; Calculation Method</TableCell>
                  <TableCell>APR, daily simple interest, 30/360—whichever applies</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Repayment Schedule</TableCell>
                  <TableCell>Dates, frequency, and format (equal payments, balloon, etc.)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Late-Fee Formula</TableCell>
                  <TableCell>Flat dollar or percentage triggers after grace period</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Prepayment Policy</TableCell>
                  <TableCell>Allows or prohibits early payoff without penalty</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Collateral Description (secured notes)</TableCell>
                  <TableCell>VIN, serial number, or legal description of asset</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Default &amp; Remedies</TableCell>
                  <TableCell>Acceleration, repossession, attorney-fee clause</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Governing Law &amp; Venue</TableCell>
                  <TableCell>Specifies state law and court jurisdiction</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signatures &amp; Notary Block</TableCell>
                  <TableCell>Makes the contract enforceable—some states require notarization</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            5. How to Complete the 123LegalDoc Template in 8 Steps
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Choose Your State – auto-loads usury limits &amp; notary rules.</li>
              <li>Enter Borrower &amp; Lender Details – names populate throughout.</li>
              <li>Set Principal &amp; Interest – calculator projects total cost.</li>
              <li>Pick Repayment Method – equal installments, balloon, or demand.</li>
              <li>Add Collateral (Optional) – drop-down list with VIN/serial validation.</li>
              <li>Define Late Fees &amp; Prepayment Terms – AI suggests standard ranges.</li>
              <li>Review Default Remedies – toggle acceleration and attorney-fees.</li>
              <li>E-Sign with SignWell – audit trail plus optional remote notarization.</li>
            </ol>
            <p className="text-sm mt-2">Total time: ≈ 4 minutes.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="state-rules" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            6. State-Specific Rules &amp; Usury Caps
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>Interest-rate ceilings vary widely (e.g., 10% in New York, up to 30% for certain loans in Texas). Our template blocks rates that exceed your state’s civil or criminal usury limit and flags mandatory notary states.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="checklist" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            7. Lender &amp; Borrower Checklist
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>✓ Verify government-issued IDs</li>
              <li>✓ Attach collateral photos &amp; serial numbers</li>
              <li>✓ Record repayments (our dashboard auto-logs)</li>
              <li>✓ File UCC-1 financing statement for secured personal-property loans</li>
              <li>✓ Provide IRS Form 1099-INT if annual interest ≥ $10 (lender)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="supporting" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            8. Supporting Documents
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Security Agreement (for collateral)</li>
              <li>UCC-1 (public notice of lien)</li>
              <li>Personal Guaranty (if borrower is an entity)</li>
              <li>Payment Ledger (auto-generated)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why-us" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            9. Why Choose 123LegalDoc + SignWell
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Attorney-Drafted &amp; State-Compliant – reviewed every quarter.</li>
              <li>Smart Usury Guardrails – prevents illegal interest rates.</li>
              <li>Instant E-Signature &amp; Audit Log – enforceability without the paper chase.</li>
              <li>Amendment &amp; Renewal Module – extend terms in one click.</li>
              <li>Bilingual Templates (EN/ES) – tap into broader markets.</li>
              <li>30-Day Money-Back Promise – risk-free.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq1" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            Is an e-signed promissory note valid in court?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>Yes. Under the U.S. E-SIGN Act, electronic signatures carry the same legal weight as ink signatures.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq2" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            Do I need a witness or notary?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>Most states do not require notarization, but it adds enforcement strength—our checkout offers remote notarization.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq3" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            What happens if the borrower defaults?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>The default clause accelerates the full balance; lenders may sue, garnish wages, or seize listed collateral, subject to state law.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq4" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            Can I change the terms later?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>Use our Promissory Note Amendment add-on to adjust interest rates, payment dates, or principal without drafting a new note.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq5" className="border border-border rounded-lg bg-card shadow-md">
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
            Is interest taxable?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            <p>Yes. Lenders must report interest income; borrowers may deduct qualified business-loan interest.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section className="text-center py-8 bg-secondary/30 rounded-lg border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Ready to Protect Your Loan?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Click “Create My Promissory Note” and lock in professional-grade protection in minutes.</p>
        <Button onClick={handleStartProcess} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Create My Promissory Note
        </Button>
      </section>
    </div>
  );
}

