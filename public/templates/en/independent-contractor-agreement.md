# Independent Contractor Agreement

---

**INDEPENDENT CONTRACTOR AGREEMENT**

This Independent Contractor Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between:

- **Company:** {{company_name}}, a {{company_entity_type}} organized under the laws of {{company_state}}, with its principal place of business at {{company_address}}

- **Contractor:** {{contractor_name}}, {{#if contractor_entity_type}}a {{contractor_entity_type}} organized under the laws of {{contractor_state}}{{else}}an individual{{/if}}, with address at {{contractor_address}}

Collectively referred to herein as the "Parties."

---

## 1. Services to be Provided

### 1.1 Scope of Work
The Contractor agrees to provide the following services ("Services") as an independent contractor:

**Primary Services:**
{{service_description}}

**Specific Deliverables:**
{{deliverables}}

### 1.2 Performance Standards
- **Quality Standards:** {{quality_standards}}
- **Performance Metrics:** {{performance_metrics}}
- **Completion Criteria:** {{completion_criteria}}

---

## 2. Term and Schedule

### 2.1 Agreement Term
**Start Date:** {{start_date}}  
**End Date:** {{end_date}}  
**Total Duration:** {{project_duration}}

### 2.2 Work Schedule
**Work Schedule:** {{work_schedule}}  
**Estimated Hours:** {{estimated_hours}} hours {{time_period}}  
**Deadline Requirements:** {{deadline_requirements}}

### 2.3 Location of Work
**Primary Work Location:** {{work_location}}  
**Remote Work:** {{#if remote_allowed}}Permitted{{else}}Not permitted{{/if}}

---

## 3. Compensation and Payment

### 3.1 Payment Structure
**Compensation Type:** {{compensation_type}}

{{#if hourly_rate}}
- **Hourly Rate:** ${{hourly_rate}} per hour
- **Maximum Hours:** {{max_hours}} hours per {{billing_period}}
{{/if}}

{{#if project_fee}}
- **Total Project Fee:** ${{project_fee}}
- **Payment Schedule:** {{payment_schedule}}
{{/if}}

{{#if monthly_retainer}}
- **Monthly Retainer:** ${{retainer_amount}} per month
{{/if}}

### 3.2 Payment Terms
- **Invoice Frequency:** {{invoice_frequency}}
- **Payment Due:** {{payment_terms}} days after invoice receipt
- **Payment Method:** {{payment_method}}

### 3.3 Expenses
{{#if expenses_reimbursed}}
**Reimbursable Expenses:** Company will reimburse pre-approved expenses: {{expense_categories}}
{{else}}
**Expenses:** All expenses are the responsibility of Contractor unless specifically agreed otherwise in writing.
{{/if}}

### 3.4 Late Payment
Invoices not paid within {{payment_terms}} days may incur a late fee of {{late_fee_rate}}% per month.

---

## 4. Independent Contractor Relationship

### 4.1 Independent Contractor Status
Contractor is an independent contractor and not an employee, partner, or agent of Company. This relationship does not create:
- An employer-employee relationship
- A partnership or joint venture
- Authority to bind Company to any obligation

### 4.2 Control and Supervision
- Contractor has the right to control the manner and means of performing the Services
- Company's role is limited to specifying the desired results
- Contractor may use their own methods, procedures, and techniques

### 4.3 Business Operations
Contractor:
- Maintains their own business operations and workspace
- Provides their own tools and equipment (unless specified otherwise)
- May work for other clients during the term of this Agreement
- Is responsible for their own business expenses

---

## 5. Taxes and Benefits

### 5.1 Tax Responsibilities
- Contractor is responsible for all federal, state, and local taxes
- Company will not withhold taxes from payments
- Company will issue Form 1099-NEC if total payments exceed $600
- Contractor must provide accurate tax identification information

### 5.2 No Employee Benefits
Contractor is not entitled to:
- Health insurance, retirement plans, or other employee benefits
- Workers' compensation coverage
- Unemployment insurance benefits
- Paid time off or sick leave

### 5.3 Business License and Insurance
Contractor warrants they maintain:
- All necessary business licenses and permits
- Professional liability insurance (if applicable): ${{insurance_minimum}}
- General liability insurance: ${{general_liability_minimum}}

---

## 6. Intellectual Property

### 6.1 Work Product Ownership
{{#if company_owns_work_product}}
All work products, deliverables, and intellectual property created under this Agreement shall be deemed "work made for hire" and owned by Company.
{{else}}
Contractor retains ownership of work products, with Company receiving the following license: {{license_terms}}
{{/if}}

### 6.2 Pre-Existing Intellectual Property
Each Party retains ownership of their respective pre-existing intellectual property.

### 6.3 Third-Party Materials
Contractor warrants that all work will not infringe upon third-party intellectual property rights.

---

## 7. Confidentiality

### 7.1 Confidential Information
Contractor acknowledges access to Company's confidential information and agrees to:
- Maintain strict confidentiality of all proprietary information
- Use confidential information solely for performing Services
- Not disclose confidential information to third parties

### 7.2 Return of Information
Upon termination, Contractor will return or destroy all confidential information and work products.

### 7.3 Duration
Confidentiality obligations survive termination for {{confidentiality_duration}} years.

---

## 8. Non-Compete and Non-Solicitation

### 8.1 Non-Compete Restrictions
{{#if non_compete_clause}}
During the term and for {{non_compete_duration}} after termination, Contractor agrees not to engage in competing business activities: {{non_compete_restrictions}}
{{else}}
No non-compete restrictions apply to this Agreement.
{{/if}}

### 8.2 Non-Solicitation
{{#if non_solicitation_clause}}
Contractor agrees not to solicit Company's employees or customers for {{non_solicitation_duration}} after termination.
{{/if}}

---

## 9. Warranties and Representations

### 9.1 Contractor Warranties
Contractor warrants:
- Authority to enter into this Agreement
- Services will be performed with professional skill and care
- Work will be original and will not infringe third-party rights
- Compliance with all applicable laws and regulations

### 9.2 Company Warranties
Company warrants:
- Authority to enter into this Agreement
- Will provide necessary information and cooperation
- Will make timely payments as agreed

---

## 10. Limitation of Liability

### 10.1 Liability Cap
EXCEPT FOR BREACHES OF CONFIDENTIALITY, EACH PARTY'S TOTAL LIABILITY SHALL NOT EXCEED THE TOTAL AMOUNT PAID UNDER THIS AGREEMENT.

### 10.2 Consequential Damages
NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.

---

## 11. Indemnification

### 11.1 Contractor Indemnification
Contractor shall indemnify Company against claims arising from:
- Contractor's negligence or willful misconduct
- Violation of third-party rights
- Failure to pay taxes or comply with employment laws

### 11.2 Company Indemnification
Company shall indemnify Contractor against claims arising from:
- Use of Company-provided materials
- Company's breach of this Agreement

---

## 12. Termination

### 12.1 Termination for Convenience
Either Party may terminate this Agreement with {{termination_notice}} days written notice.

### 12.2 Termination for Cause
Either Party may terminate immediately for:
- Material breach uncured after {{cure_period}} days notice
- Insolvency or bankruptcy
- Violation of confidentiality or non-compete provisions

### 12.3 Effect of Termination
Upon termination:
- Company shall pay for Services performed through termination date
- Contractor shall deliver all work products and confidential information
- Survival provisions shall remain in effect

---

## 13. General Provisions

### 13.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### 13.2 Dispute Resolution
{{#if arbitration_clause}}
Disputes shall be resolved through binding arbitration in {{arbitration_location}}.
{{else}}
Disputes shall be resolved in the courts of {{jurisdiction}}.
{{/if}}

### 13.3 Entire Agreement
This Agreement constitutes the entire agreement and supersedes all prior negotiations.

### 13.4 Amendment
This Agreement may only be amended by written agreement signed by both Parties.

### 13.5 Severability
If any provision is held invalid, the remainder shall remain in full force and effect.

### 13.6 Assignment
This Agreement may not be assigned without the other Party's written consent.

---

## 14. Additional Terms

{{additional_terms}}

---

## 15. Signatures

**IN WITNESS WHEREOF**, the Parties have executed this Agreement as of the date first written above.

**COMPANY:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{company_name}} | |
| By: {{company_signatory}} | |
| Title: {{company_title}} | |

**CONTRACTOR:**

{{#if contractor_entity_type}}
| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{contractor_name}} | |
| By: {{contractor_signatory}} | |
| Title: {{contractor_title}} | |
{{else}}
| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{contractor_name}} | |
| Social Security #: {{contractor_ssn}} | |
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This independent contractor agreement should be reviewed by legal counsel to ensure compliance with federal, state, and local employment and tax laws. Proper classification of workers as independent contractors is crucial for legal and tax compliance.

*Template generated by 123LegalDoc - Professional Legal Document Platform*
---
© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
