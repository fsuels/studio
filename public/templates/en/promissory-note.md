# Promissory Note (Unsecured / Secured Option)

**Date:** {{date}}
**Location:** {{city}}, {{county}}, {{state}}

---

## Definitions

* **“Borrower”**: {{borrowerName}}, of {{borrowerAddress}}.
* **“Lender”**: {{lenderName}}, of {{lenderAddress}}.
* **“Collateral”**: {{collateralDescription}}
* **“Note”**: this Promissory Note.
* **“State Statute”**: the maximum lawful interest-rate provision of the statutes of {{state}} (e.g., citation of usury statute).

---

## 1. Statute of Frauds & Promise to Pay

1. **Writing Requirement:** This Note constitutes a writing satisfying any Statute of Frauds requirement for loans exceeding one year’s duration.
2. **Promise:** For value received, Borrower unconditionally promises to pay Lender the principal sum of **\${{principalAmount}}**, plus interest, in accordance with this Note.

---

## 2. Interest Rate

1. **Rate:** The unpaid principal balance shall bear interest at an annual rate of **{{interestRate}}%**, provided that if this rate exceeds the maximum lawful rate under the State Statute, the rate shall automatically be reduced to the maximum permitted.
2. **Day-Count:** Interest shall be computed on a **{{dayCountBasis}}** year basis and on the actual number of days elapsed; if disallowed by law, interest shall be computed on the maximum basis permitted.

---

## 3. Payment Terms

1. **Time Is of the Essence:** Time is of the essence for all payment and notice deadlines.
2. **Schedule (based on {{paymentOption}}):**

   * **Installments:** Equal installments of **\${{installmentAmount}}** (for {{installmentCount}} installments), due on the {{paymentDayOfMonth}} of each month, beginning {{startDate}}, with the final installment due {{maturityDate}}.
   * **Lump Sum:** Entire principal and accrued interest due {{maturityDate}}.
3. **Late Fee (optional):** A late charge of **\${{lateFeeAmount}}** or **{{lateFeePercent}}%** of the overdue amount may be assessed if any payment is more than **{{lateAfterDays}}** days late, to the extent permitted by law.
4. **Prepayment:** Borrower may prepay in whole or in part at any time without penalty. Partial prepayments apply first to accrued interest, then to principal.

---

## 4. Default, Notice & Remedies

1. **Events of Default:**

   * Payment not made within **{{lateAfterDays}}** days after due date (if specified, otherwise immediately upon non-payment).
   * Borrower becomes insolvent, bankrupt, or makes an assignment for creditors.
   * Material breach of this Note not cured within **{{defaultCureDays}}** days after written notice.
2. **Notice & Cure:** Lender shall deliver written notice of default to Borrower’s address; Borrower has {{defaultCureDays}} days from receipt to cure.
3. **Acceleration:** Upon uncured default, Lender may declare all unpaid principal and accrued interest immediately due.
4. **Cumulative Remedies:** Remedies are cumulative, not exclusive, and in addition to rights at law or equity.
5. **Attorneys’ Fees:** Borrower shall pay Lender’s reasonable attorneys’ fees, court costs, and collection expenses incurred enforcing this Note.

---

## 5. Security Interest (Secured Note Only - requires {{collateralDescription}})

{{#if collateralDescription}}
1. **Grant of Security:** Borrower grants Lender a security interest in the Collateral: {{collateralDescription}}.
2. **Perfection:** Lender may file a UCC-1 Financing Statement in the appropriate jurisdiction or take any action required to perfect its interest.
3. **Borrower Representations:** Borrower warrants good title to Collateral, free of other liens, and authority to grant this security interest.
{{/if}}

---

## 6. Waivers

Borrower and any endorsers waive presentment, demand, protest, notice of dishonor, and all other notices, except those non-waivable under applicable law.

---

## 7. Governing Law, Venue & Service

1. **Law:** This Note is governed by the laws of {{state}}, without regard to conflict-of-law rules.
2. **Forum:** Parties submit to the exclusive jurisdiction of state and federal courts in {{county}}, {{state}}.
3. **Service of Process:** Borrower consents to service of process by certified mail or via registered agent in {{state}}.

---

## 8. Assignment

1. **Lender Assignment:** Lender may assign this Note; Lender will notify Borrower in writing within **{{assignmentNoticeDays}}** days of any assignment.
2. **Borrower Assignment:** Borrower may not assign obligations without Lender’s prior written consent; defenses may be asserted by any assignee.

---

## 9. Notices

Notices must be in writing and deemed given when:

* Delivered personally;
* Three days after deposit in U.S. mail, certified (return-receipt requested);
* One day after delivery to an overnight courier; or
* Upon confirmed email transmission, to the parties’ last known email addresses.

---

## 10. Integration & Amendment

This Note constitutes the entire agreement between the parties and may be amended only by a written instrument signed by both.

---

## 11. Severability & Reformation

If a court holds any provision invalid, the remainder shall remain in effect and the provision shall be reformed to the maximum extent permitted to carry out the parties’ intent.

---

## 12. Counterparts & Electronic Execution

This Note may be executed in counterparts and by electronic signature in compliance with the U.S. E-Sign Act and any applicable Uniform Electronic Transactions Act (UETA).

---

## 13. Arbitration {{#if arbitrationIncluded}}(Included){{else}}(Not Included){{/if}}

{{#if arbitrationIncluded}}
Any dispute arising from or relating to this Note shall be settled by binding arbitration administered by [Arbitration Provider Name, e.g., American Arbitration Association] in accordance with its Commercial Arbitration Rules, and judgment on the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof. The arbitration shall take place in {{county}}, {{state}}.
{{else}}
> Arbitration is not included in this agreement. Disputes will be resolved through court litigation as specified in Section 7.
{{/if}}

---

## 14. Notarization & Witnesses {{#if notaryIncluded}}(Included){{else}}(Not Included){{/if}}

{{#if notaryIncluded}}
This Note should be signed before a Notary Public.

> **Notary Acknowledgment**
> State of {{state}} )
> County of {{county}} )
> On this \_\_\_ day of \_\_\_\_\_\_\_***, 20***, before me, \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Notary Public), personally appeared {{borrowerName}} and {{lenderName}}, proved identity to my satisfaction, and acknowledged executing this Note.
>
> \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
> Notary Public Signature
> My Commission Expires: \_\_\_\_\_\_\_\_\_\_
{{else}}
This Note is enforceable without notarization or witnesses, unless required by specific circumstances or local law.
{{/if}}

---

**IN WITNESS WHEREOF**, the parties have executed this Note as of the Date first written above.

| **LENDER**                                                            | **BORROWER**                                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Signature: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | Signature: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| Name: {{lenderName}}                                                  | Name: {{borrowerName}}                                                |
| Title (if entity): \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_         |                                                                       |
| Date: \_\_\_\_\_\_\_\_\_\_                                            | Date: \_\_\_\_\_\_\_\_\_\_                                            |