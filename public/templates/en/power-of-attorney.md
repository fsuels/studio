# General Power of Attorney

**GENERAL POWER OF ATTORNEY**

---

**Principal:** {{principal_name}}  
**Agent (Attorney-in-Fact):** {{agent_name}}  
**Effective Date:** {{effective_date}}  
**Document Type:** {{poa_type}}

---

## 1. Appointment of Agent

### 1.1 Principal Information

**Full Name:** {{principal_name}}  
**Address:** {{principal_address}}  
**City, State, ZIP:** {{principal_city}}, {{principal_state}} {{principal_zip}}  
**Phone:** {{principal_phone}}  
**Date of Birth:** {{principal_dob}}  
**Social Security Number:** XXX-XX-{{principal_ssn_last_four}}

### 1.2 Agent Information

**Full Name:** {{agent_name}}  
**Address:** {{agent_address}}  
**City, State, ZIP:** {{agent_city}}, {{agent_state}} {{agent_zip}}  
**Phone:** {{agent_phone}}  
**Relationship to Principal:** {{relationship_to_principal}}

### 1.3 Successor Agent

{{#if successor_agent}}
**Successor Agent:** {{successor_agent_name}}  
**Address:** {{successor_agent_address}}  
**Phone:** {{successor_agent_phone}}  
**Relationship:** {{successor_relationship}}
{{else}}
No successor agent designated.
{{/if}}

---

## 2. Grant of Authority

### 2.1 General Authority

I, {{principal_name}}, hereby appoint {{agent_name}} as my attorney-in-fact (agent) to act on my behalf in any lawful way with respect to the powers delegated below.

### 2.2 Scope of Powers

{{#if general_powers}}
**GENERAL POWERS:** This is a General Power of Attorney granting broad authority to act on my behalf in financial and legal matters.
{{/if}}

{{#if limited_powers}}
**LIMITED POWERS:** This Power of Attorney grants only the specific powers listed below.
{{/if}}

---

## 3. Specific Powers Granted

My agent is authorized to act on my behalf with respect to the following:

### 3.1 Financial and Banking Powers

{{#if banking_powers}}
☑ **Banking Transactions**
- Open, close, and manage bank accounts
- Make deposits and withdrawals
- Write checks and transfer funds
- Access safe deposit boxes
- {{additional_banking_powers}}
{{else}}
☐ Banking Transactions (Not Authorized)
{{/if}}

### 3.2 Real Estate Powers

{{#if real_estate_powers}}
☑ **Real Estate Transactions**
- Buy, sell, lease, or rent real property
- Sign deeds, mortgages, and contracts
- Manage rental properties
- Pay property taxes and insurance
- {{additional_real_estate_powers}}
{{else}}
☐ Real Estate Transactions (Not Authorized)
{{/if}}

### 3.3 Investment Powers

{{#if investment_powers}}
☑ **Investment Management**
- Buy, sell, and manage stocks and bonds
- Trade securities and commodities
- Manage investment accounts
- Make investment decisions
- {{additional_investment_powers}}
{{else}}
☐ Investment Management (Not Authorized)
{{/if}}

### 3.4 Business Operations

{{#if business_powers}}
☑ **Business Operations**
- Operate my business
- Sign contracts and agreements
- Hire and fire employees
- Make business decisions
- {{additional_business_powers}}
{{else}}
☐ Business Operations (Not Authorized)
{{/if}}

### 3.5 Insurance Matters

{{#if insurance_powers}}
☑ **Insurance Transactions**
- Purchase, modify, or cancel insurance policies
- File and settle insurance claims
- Change beneficiaries
- {{additional_insurance_powers}}
{{else}}
☐ Insurance Transactions (Not Authorized)
{{/if}}

### 3.6 Tax and Legal Matters

{{#if tax_powers}}
☑ **Tax and Legal Affairs**
- Prepare and file tax returns
- Represent me before tax authorities
- Hire attorneys and accountants
- Sign legal documents
- {{additional_tax_powers}}
{{else}}
☐ Tax and Legal Affairs (Not Authorized)
{{/if}}

### 3.7 Government Benefits

{{#if benefits_powers}}
☑ **Government Benefits**
- Apply for Social Security benefits
- Manage Medicare/Medicaid matters
- Handle veteran's benefits
- {{additional_benefits_powers}}
{{else}}
☐ Government Benefits (Not Authorized)
{{/if}}

### 3.8 Personal and Family Matters

{{#if personal_powers}}
☑ **Personal Affairs**
- Make gifts to family members (up to ${{gift_limit}} annually)
- Handle personal contracts
- Manage personal property
- {{additional_personal_powers}}
{{else}}
☐ Personal Affairs (Not Authorized)
{{/if}}

---

## 4. Effective Period

### 4.1 When Powers Begin

{{#if immediate_effective}}
**Immediate:** This Power of Attorney is effective immediately upon signing.
{{/if}}

{{#if springing_poa}}
**Springing:** This Power of Attorney becomes effective only when {{springing_condition}}.
{{/if}}

### 4.2 Duration

{{#if durable_poa}}
**Durable:** This Power of Attorney remains in effect even if I become incapacitated.
{{else}}
**Non-Durable:** This Power of Attorney terminates if I become incapacitated.
{{/if}}

### 4.3 Expiration

{{#if expiration_date}}
**Expires:** This Power of Attorney expires on {{expiration_date}}.
{{else}}
**No Expiration:** This Power of Attorney continues until revoked or my death.
{{/if}}

---

## 5. Agent Duties and Limitations

### 5.1 Fiduciary Duty

My agent shall:
- Act in my best interests
- Keep accurate records of all transactions
- Keep my property separate from agent's property
- Exercise reasonable care and prudence
- {{additional_agent_duties}}

### 5.2 Limitations on Agent

My agent may NOT:
- Make decisions about my healthcare (unless specifically authorized)
- Change my will or trust documents
- Make gifts exceeding ${{gift_limit}} annually
- {{agent_limitations}}

### 5.3 Compensation

{{#if agent_compensation}}
**Agent Compensation:** My agent shall receive {{compensation_terms}} for services rendered.
{{else}}
**No Compensation:** My agent shall serve without compensation.
{{/if}}

### 5.4 Record Keeping

My agent shall maintain detailed records of all actions taken on my behalf and provide accounting as requested.

---

## 6. Third Party Reliance

### 6.1 Authority to Act

Any person dealing with my agent may rely upon this Power of Attorney and the agent's authority to act.

### 6.2 Protection for Third Parties

Third parties who rely on this Power of Attorney in good faith are protected from liability.

### 6.3 Copies

Copies of this Power of Attorney shall have the same effect as the original.

---

## 7. Revocation

### 7.1 Right to Revoke

I reserve the right to revoke this Power of Attorney at any time while I am competent.

### 7.2 Method of Revocation

Revocation must be in writing and delivered to my agent and any third parties who have relied on this Power of Attorney.

### 7.3 Automatic Termination

This Power of Attorney automatically terminates upon:
- My death
- {{#if non_durable}}My incapacity (if non-durable){{/if}}
- {{#if expiration_date}}{{expiration_date}} (expiration date){{/if}}
- My revocation

---

## 8. Healthcare Decisions

{{#if healthcare_powers}}
### 8.1 Healthcare Authority

This Power of Attorney INCLUDES authority to make healthcare decisions as specified:
{{healthcare_decision_authority}}

### 8.2 Healthcare Limitations

Healthcare decisions are limited to: {{healthcare_limitations}}
{{else}}
### 8.1 No Healthcare Authority

This Power of Attorney does NOT grant authority to make healthcare decisions. A separate Healthcare Power of Attorney may be required.
{{/if}}

---

## 9. Governing Law

This Power of Attorney is governed by the laws of {{governing_state}}.

---

## 10. Acknowledgments

### 10.1 Principal's Acknowledgment

I understand the significance of this document and the broad powers I am granting to my agent. I am of sound mind and under no duress or undue influence.

### 10.2 Agent's Acceptance

{{#if agent_acceptance}}
**Agent Acceptance:** I, {{agent_name}}, accept the appointment as attorney-in-fact and agree to act in the principal's best interests.

**Agent Signature:** ___________________________ **Date:** {{effective_date}}
{{/if}}

---

## 11. Witnesses and Notarization

{{#if witnesses_required}}
### 11.1 Witnesses

**Witness 1:**  
**Name:** {{witness1_name}}  
**Address:** {{witness1_address}}  
**Signature:** ___________________________ **Date:** {{effective_date}}

**Witness 2:**  
**Name:** {{witness2_name}}  
**Address:** {{witness2_address}}  
**Signature:** ___________________________ **Date:** {{effective_date}}
{{/if}}

### 11.2 Notarization

**State of {{notary_state}}**  
**County of {{notary_county}}**

On {{notary_date}}, before me personally appeared {{principal_name}}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity as Principal.

**Notary Public:** ______________________________  
**My Commission Expires:** {{notary_commission_expires}}  
**Notary Seal:** [SEAL]

---

## 12. Principal's Signature

**IN WITNESS WHEREOF**, I have executed this General Power of Attorney on {{effective_date}}.

**PRINCIPAL:**

| Signature                                  | Date             |
| ------------------------------------------ | ---------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{principal_name}}                         |                  |
| Print Name: {{principal_name}}             |                  |

---

**IMPORTANT LEGAL NOTICE:** This Power of Attorney grants significant authority to your agent. Ensure you trust your agent completely and understand all powers being granted. Consider consulting with an attorney to ensure this document meets your specific needs and state requirements.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
