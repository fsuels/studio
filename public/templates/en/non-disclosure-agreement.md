# Non-Disclosure Agreement (NDA)

**NON-DISCLOSURE AGREEMENT**

---

**Disclosing Party:** {{disclosing_party_name}}  
**Receiving Party:** {{receiving_party_name}}  
**Agreement Type:** {{#if mutual_nda}}Mutual NDA{{else}}Unilateral NDA{{/if}}  
**Effective Date:** {{effective_date}}

---

## 1. Parties to Agreement

### 1.1 Disclosing Party

**Name:** {{disclosing_party_name}}  
**Type:** {{disclosing_party_type}}  
**Address:** {{disclosing_party_address}}  
**Contact:** {{disclosing_party_contact}}

### 1.2 Receiving Party

**Name:** {{receiving_party_name}}  
**Type:** {{receiving_party_type}}  
**Address:** {{receiving_party_address}}  
**Contact:** {{receiving_party_contact}}

---

## 2. Purpose and Scope

### 2.1 Purpose of Disclosure

The purpose of this Agreement is to facilitate discussions regarding:

{{disclosure_purpose}}

### 2.2 Evaluation Period

{{#if evaluation_period}}
**Evaluation Period:** {{evaluation_period_duration}}  
**Decision Timeline:** {{decision_timeline}}
{{/if}}

---

## 3. Definition of Confidential Information

### 3.1 Confidential Information Includes

For purposes of this Agreement, "Confidential Information" includes all information, whether written, oral, visual, electronic, or in any other form, that is:

- {{confidential_information_types}}
- Technical data, trade secrets, and proprietary methods
- Financial information, business plans, and strategies
- Customer lists, supplier information, and business relationships
- Software, algorithms, designs, and technical specifications
- Marketing plans, pricing information, and competitive analysis
- Research and development data
- Any information marked as "Confidential" or reasonably understood to be confidential

### 3.2 Exclusions from Confidential Information

Confidential Information does not include information that:

- Is or becomes publicly available through no breach of this Agreement
- Was rightfully known by Receiving Party prior to disclosure
- Is rightfully received from a third party without confidentiality restrictions
- Is independently developed without use of Confidential Information
- Is required to be disclosed by law or court order

---

## 4. Obligations of Receiving Party

### 4.1 Non-Disclosure Obligations

Receiving Party agrees to:

- Maintain strict confidentiality of all Confidential Information
- Not disclose Confidential Information to any third parties
- Use Confidential Information solely for the Purpose stated above
- Take reasonable security measures to protect Confidential Information
- {{additional_obligations}}

### 4.2 Standard of Care

Receiving Party shall protect Confidential Information with the same degree of care used to protect its own confidential information, but in no event less than reasonable care.

### 4.3 Permitted Disclosures

Receiving Party may disclose Confidential Information only to:

{{#if authorized_recipients}}
- {{authorized_recipients}}
{{/if}}
- Employees and advisors who have a legitimate need to know
- Individuals who have signed confidentiality agreements

### 4.4 Employee and Advisor Obligations

Receiving Party shall ensure that all employees and advisors who receive Confidential Information are bound by confidentiality obligations at least as restrictive as those in this Agreement.

---

## 5. Mutual Obligations (If Applicable)

{{#if mutual_nda}}
### 5.1 Reciprocal Confidentiality

This Agreement creates mutual obligations. Each party may be both a Disclosing Party and Receiving Party, and the obligations set forth above apply equally to both parties.

### 5.2 Separate Confidential Information

Each party's Confidential Information remains separate and distinct. No license or rights are granted except as expressly stated.
{{/if}}

---

## 6. Use Restrictions

### 6.1 Limited Use Authorization

Receiving Party may use Confidential Information solely for evaluating the potential business relationship described in Section 2.1.

### 6.2 Prohibited Uses

Receiving Party shall not:

- Use Confidential Information for any purpose other than the stated Purpose
- Reverse engineer, disassemble, or attempt to derive technical information
- Create derivative works based on Confidential Information
- {{prohibited_use_restrictions}}

### 6.3 No License Granted

No license or rights to Confidential Information are granted except the limited right to review for the stated Purpose.

---

## 7. Return or Destruction of Information

### 7.1 Return Upon Request

Upon written request from Disclosing Party, Receiving Party shall promptly:

- Return all documents and materials containing Confidential Information
- Destroy all copies, notes, and derivative materials
- Provide written certification of destruction/return

### 7.2 Electronic Information

Receiving Party shall make reasonable efforts to delete electronic copies of Confidential Information from computer systems and backup storage.

---

## 8. Term and Termination

### 8.1 Agreement Duration

{{#if agreement_duration}}
**Term:** This Agreement shall remain in effect for {{agreement_duration}} from the Effective Date.
{{else}}
**Term:** This Agreement shall remain in effect indefinitely until terminated.
{{/if}}

### 8.2 Survival of Obligations

Confidentiality obligations shall survive termination of this Agreement for a period of {{confidentiality_survival_period}}.

### 8.3 Termination Rights

Either party may terminate this Agreement with {{termination_notice_period}} written notice.

---

## 9. Remedies and Enforcement

### 9.1 Irreparable Harm

Receiving Party acknowledges that breach of this Agreement would cause irreparable harm for which monetary damages would be inadequate.

### 9.2 Equitable Relief

Disclosing Party shall be entitled to seek:

- Immediate injunctive relief
- Specific performance
- Other equitable remedies
- Attorney's fees and costs

### 9.3 Monetary Damages

{{#if liquidated_damages}}
**Liquidated Damages:** In addition to equitable relief, breach shall result in liquidated damages of {{liquidated_damages_amount}}.
{{/if}}

---

## 10. Additional Provisions

### 10.1 No Obligation to Disclose

Nothing in this Agreement obligates either party to disclose any information.

### 10.2 No Obligation to Proceed

This Agreement does not create any obligation to enter into a business relationship.

### 10.3 Independent Contractors

The parties remain independent contractors. No partnership, joint venture, or agency relationship is created.

---

## 11. Legal Provisions

### 11.1 Governing Law

This Agreement shall be governed by the laws of {{governing_state}} without regard to conflict of law principles.

### 11.2 Jurisdiction

Any disputes shall be resolved in the courts of {{jurisdiction}}.

### 11.3 Severability

If any provision is held invalid, the remainder of this Agreement shall remain in full force and effect.

### 11.4 Entire Agreement

This Agreement constitutes the entire agreement regarding confidentiality and supersedes all prior discussions.

### 11.5 Amendments

This Agreement may only be modified by written agreement signed by both parties.

### 11.6 Assignment

This Agreement may not be assigned without prior written consent of the other party.

---

## 12. Additional Terms

{{additional_terms}}

---

## 13. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Non-Disclosure Agreement as of {{effective_date}}.

**DISCLOSING PARTY:**

| Signature                                  | Date             |
| ------------------------------------------ | ---------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{disclosing_party_name}}                  |                  |
| Print Name: {{disclosing_party_representative}} |                  |
| Title: {{disclosing_party_title}}          |                  |

**RECEIVING PARTY:**

| Signature                                  | Date             |
| ------------------------------------------ | ---------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{receiving_party_name}}                   |                  |
| Print Name: {{receiving_party_representative}} |                  |
| Title: {{receiving_party_title}}           |                  |

{{#if mutual_nda}}
**Note:** In a mutual NDA, both parties are simultaneously disclosing and receiving parties.
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This Non-Disclosure Agreement should be reviewed by a qualified business attorney to ensure adequate protection of confidential information and compliance with applicable laws. NDAs should be tailored to specific business needs and the nature of information being shared.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
