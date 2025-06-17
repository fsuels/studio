# Promissory Note

**PROMISSORY NOTE**

---

## LOAN INFORMATION

**Principal Amount**: ${{principalAmount}} ({{principalAmountWords}} Dollars)
**Date of Note**: {{noteDate}}
**Maturity Date**: {{maturityDate}}
**Interest Rate**: {{interestRate}}% per annum ({{interestType}})

---

## PARTIES

**BORROWER/MAKER** (Person/Entity borrowing money):
- **Name**: {{borrowerName}}
- **Address**: {{borrowerAddress}}, {{borrowerCity}}, {{borrowerState}} {{borrowerZip}}
- **Phone**: {{borrowerPhone}}
- **Email**: {{borrowerEmail}}
- **SSN/EIN**: {{borrowerTaxId}}

**LENDER/PAYEE** (Person/Entity lending money):
- **Name**: {{lenderName}}
- **Address**: {{lenderAddress}}, {{lenderCity}}, {{lenderState}} {{lenderZip}}
- **Phone**: {{lenderPhone}}
- **Email**: {{lenderEmail}}

---

## PROMISE TO PAY

FOR VALUE RECEIVED, the Borrower promises to pay to the order of the Lender the principal sum of **${{principalAmount}}** ({{principalAmountWords}} Dollars), together with interest thereon at the rate of {{interestRate}}% per annum, according to the terms set forth below.

---

## LOAN TERMS

### 1. PRINCIPAL AMOUNT
- **Original Principal**: ${{principalAmount}}
- **Disbursement Date**: {{disbursementDate}}
- **Disbursement Method**: {{disbursementMethod}}

### 2. INTEREST PROVISIONS
- **Interest Rate**: {{interestRate}}% per annum
- **Interest Type**: {{interestType}}
  - [ ] Simple Interest
  - [ ] Compound Interest (compounded {{compoundingFrequency}})
- **Interest Calculation**: Interest calculated on a {{dayCountBasis}} basis
- **Accrual Start Date**: {{interestAccrualStartDate}}

### 3. PAYMENT TERMS
**Payment Schedule**: {{paymentSchedule}}
- [ ] Lump Sum Payment (due {{maturityDate}})
- [ ] Monthly Installments
- [ ] Quarterly Installments
- [ ] Annual Installments
- [ ] Interest Only with Balloon Payment
- [ ] Custom Schedule

**For Installment Payments:**
- **Payment Amount**: ${{installmentAmount}} per {{paymentFrequency}}
- **First Payment Due**: {{firstPaymentDate}}
- **Payment Due Date**: {{paymentDueDay}} of each {{paymentFrequency}}
- **Final Payment Due**: {{maturityDate}}
- **Payment Method**: {{paymentMethod}}
- **Payment Address**: {{paymentAddress}}

### 4. PAYMENT APPLICATION
Payments will be applied in the following order:
1. Late fees and charges
2. Accrued interest
3. Principal balance
4. Other charges and costs

---

## SECURITY AND COLLATERAL

### 5. SECURITY PROVISIONS
**Secured/Unsecured**: {{securityType}}
- [ ] UNSECURED NOTE (no collateral)
- [ ] SECURED NOTE (collateral required)

**If Secured, Collateral Description**:
{{collateralDescription}}

**Collateral Value**: ${{collateralValue}}
**Security Agreement**: {{securityAgreementRequired}}
**UCC Filing**: {{uccFilingRequired}}

---

## DEFAULT AND REMEDIES

### 6. EVENTS OF DEFAULT
The following shall constitute events of default under this Note:
- Failure to make any payment when due after {{gracePeriod}} days written notice
- Breach of any covenant or agreement in this Note
- Filing of bankruptcy by Borrower
- Assignment for benefit of creditors
- Material adverse change in Borrower's financial condition
- {{additionalDefaultEvents}}

### 7. LATE FEES AND CHARGES
- **Late Fee**: {{lateFeeAmount}} or {{lateFeePercentage}}% of overdue payment (whichever is {{lateFeeCalculation}})
- **Grace Period**: {{gracePeriod}} days after due date
- **Maximum Late Fee**: ${{maxLateFee}} (where required by law)

### 8. DEFAULT INTEREST RATE
Upon default, interest shall accrue at {{defaultInterestRate}}% per annum (not to exceed maximum allowed by law).

### 9. REMEDIES UPON DEFAULT
Upon default, Lender may:
- Declare entire unpaid balance immediately due and payable
- Exercise all rights and remedies available at law or equity
- Collect reasonable attorneys' fees and costs
- {{additionalRemedies}}

---

## ADDITIONAL PROVISIONS

### 10. PREPAYMENT
**Prepayment Allowed**: {{prepaymentAllowed}}
- [ ] Full or partial prepayment allowed without penalty
- [ ] Prepayment penalty: {{prepaymentPenalty}}
- [ ] No prepayment allowed

**Prepayment Application**: Prepayments applied to {{prepaymentApplication}}

### 11. ACCELERATION CLAUSE
Upon default, the entire unpaid balance of this Note shall become immediately due and payable without notice or demand.

### 12. COLLECTION COSTS
Borrower agrees to pay all costs of collection, including reasonable attorneys' fees, court costs, and collection agency fees incurred by Lender in enforcing this Note.

### 13. WAIVERS
Borrower waives presentment, demand, protest, and notice of dishonor.

### 14. MODIFICATION
This Note may only be modified by written agreement signed by both parties.

### 15. ASSIGNMENT
Lender may assign this Note without consent of Borrower. Borrower may not assign obligations under this Note without written consent of Lender.

---

## LEGAL PROVISIONS

### 16. GOVERNING LAW
This Note shall be governed by and construed in accordance with the laws of the State of {{governingLaw}}.

### 17. JURISDICTION
Any legal action relating to this Note shall be brought in the courts of {{jurisdiction}}.

### 18. USURY SAVINGS CLAUSE
If any interest charged exceeds the maximum rate allowed by law, such excess shall be applied to reduce the principal balance or returned to Borrower as required by law.

### 19. SEVERABILITY
If any provision of this Note is invalid or unenforceable, the remaining provisions shall remain in full force and effect.

### 20. JOINT AND SEVERAL LIABILITY
If more than one person signs as Borrower, their liability shall be joint and several.

---

## CO-SIGNER PROVISIONS (if applicable)

### 21. CO-SIGNER INFORMATION
**Co-Signer Name**: {{coSignerName}}
**Co-Signer Address**: {{coSignerAddress}}
**Relationship to Borrower**: {{coSignerRelationship}}

**Co-Signer Acknowledgment**: {{coSignerAcknowledgment}}

The Co-Signer unconditionally guarantees payment of all obligations under this Note and waives all rights to notice and demand.

---

## ADDITIONAL TERMS AND CONDITIONS

### 22. PURPOSE OF LOAN
**Loan Purpose**: {{loanPurpose}}

### 23. INSURANCE REQUIREMENTS (if applicable)
{{insuranceRequirements}}

### 24. REPORTING REQUIREMENTS
{{reportingRequirements}}

### 25. ADDITIONAL COVENANTS
{{additionalCovenants}}

### 26. SPECIAL CONDITIONS
{{specialConditions}}

---

## SIGNATURES AND EXECUTION

### BORROWER SIGNATURE(S)

**PRIMARY BORROWER:**
By signing below, I acknowledge that I have read and understand this Promissory Note and agree to be bound by its terms.

Signature: _________________________________________ Date: ___________
{{borrowerName}}
Print Name: {{borrowerPrintName}}
Title (if entity): {{borrowerTitle}}

{{additionalBorrowerSignatures}}

### CO-SIGNER SIGNATURE (if applicable)

By signing below, I unconditionally guarantee the payment of this Note and waive notice of default and demand for payment.

Co-Signer Signature: _________________________________________ Date: ___________
{{coSignerName}}
Print Name: {{coSignerPrintName}}

---

## NOTARIZATION (if required)

**State of {{notaryState}}**
**County of {{notaryCounty}}**

On {{notaryDate}}, before me personally appeared {{notaryAppearingParties}}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity, and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the State of {{notaryState}} that the foregoing paragraph is true and correct.

WITNESS my hand and official seal.

Notary Public Signature: _________________________________________
{{notaryName}}, Notary Public
My commission expires: {{notaryExpiration}}

[NOTARY SEAL]

---

## PAYMENT RECORD (Optional)

| Payment # | Due Date | Payment Date | Amount Paid | Principal | Interest | Balance |
|-----------|----------|--------------|-------------|-----------|----------|---------|
| {{paymentRecordTable}} |

---

## LENDER'S ACKNOWLEDGMENT

The Lender acknowledges receipt of this executed Promissory Note and agrees to the terms set forth herein.

**LENDER:**

Signature: _________________________________________ Date: ___________
{{lenderName}}
Print Name: {{lenderPrintName}}
Title (if entity): {{lenderTitle}}

---

## IMPORTANT DISCLOSURES

### TRUTH IN LENDING DISCLOSURES (if applicable)
{{truthInLendingDisclosures}}

### INTEREST RATE INFORMATION
- **Annual Percentage Rate (APR)**: {{apr}}%
- **Finance Charge**: ${{financeCharge}}
- **Amount Financed**: ${{amountFinanced}}
- **Total of Payments**: ${{totalPayments}}

### STATE-SPECIFIC DISCLOSURES
{{stateSpecificDisclosures}}

---

## LEGAL NOTICES

### NOTICE TO BORROWER
- You are borrowing ${{principalAmount}} at {{interestRate}}% annual interest
- Your payment schedule is described above
- Late payments may result in additional fees
- Default may result in acceleration of the entire balance
- You may prepay this loan {{prepaymentTerms}}

### RIGHT TO CANCEL (if applicable)
{{rightToCancelNotice}}

---

**LEGAL DISCLAIMER**: This Promissory Note template is provided for general informational purposes and may not comply with all state and federal lending laws. Lending laws vary significantly by state and type of transaction. Interest rate limits, disclosure requirements, and collection procedures are regulated by state and federal law. It is strongly recommended to consult with a qualified attorney before executing any promissory note, particularly for larger amounts or complex transactions. This template does not constitute legal advice.

**COMPLIANCE NOTICE**: Lenders should ensure compliance with:
- State usury laws and interest rate limits
- Truth in Lending Act (if applicable)
- Fair Debt Collection Practices Act
- State licensing requirements for lenders
- Consumer protection laws

---

**Generated by 123LegalDoc**  
*Professional Legal Documents Made Simple*