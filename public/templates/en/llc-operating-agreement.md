# LLC Operating Agreement

---

**LIMITED LIABILITY COMPANY OPERATING AGREEMENT**

**Company Name:** {{company_name}}  
**State of Formation:** {{state_of_formation}}  
**Effective Date:** {{effective_date}}

---

## 1. Company Information

### 1.1 Formation and Name
**LLC Name:** {{company_name}}  
**State of Organization:** {{state_of_formation}}  
**Principal Office Address:** {{principal_office_address}}  
**Registered Agent:** {{registered_agent_name}} at {{registered_agent_address}}  
**EIN:** {{federal_ein}} (if obtained)

### 1.2 Articles of Organization
This Operating Agreement supplements the Articles of Organization filed with the {{state_of_formation}} Secretary of State on {{articles_filing_date}}.

### 1.3 Purpose and Business
**Business Purpose:** {{business_purpose}}

**Permitted Activities:** The Company may engage in any lawful business activity permitted by {{state_of_formation}} law.

---

## 2. Members and Membership Interests

### 2.1 Initial Members
The following are the initial Members of the Company:

| Member Name | Address | Capital Contribution | Ownership % | Membership Units |
|-------------|---------|---------------------|-------------|------------------|
| {{member_1_name}} | {{member_1_address}} | ${{member_1_contribution}} | {{member_1_percentage}}% | {{member_1_units}} |
| {{member_2_name}} | {{member_2_address}} | ${{member_2_contribution}} | {{member_2_percentage}}% | {{member_2_units}} |
| {{member_3_name}} | {{member_3_address}} | ${{member_3_contribution}} | {{member_3_percentage}}% | {{member_3_units}} |

**Total Membership Units:** {{total_units}}  
**Total Initial Capital:** ${{total_initial_capital}}

### 2.2 Additional Capital Contributions
{{#if additional_contributions_allowed}}
Additional capital contributions may be made with the consent of {{additional_contribution_approval}} of the Members.
{{else}}
No Member shall be required to make additional capital contributions without unanimous consent.
{{/if}}

### 2.3 Return of Capital
No Member has the right to demand return of capital contributions except upon liquidation of the Company.

---

## 3. Management Structure

### 3.1 Management Type
{{#if member_managed}}
**MEMBER-MANAGED LLC:** The Company shall be managed by its Members.

**Management Authority:** All Members have equal management rights regardless of ownership percentage, unless otherwise specified below.

**Decision Making:** Decisions requiring Member approval shall be made by {{decision_threshold}} vote of the Members.
{{/if}}

{{#if manager_managed}}
**MANAGER-MANAGED LLC:** The Company shall be managed by one or more Managers.

**Initial Manager(s):**
{{#each managers}}
- {{name}} of {{address}}
{{/each}}

**Manager Authority:** Managers have full authority to manage the day-to-day operations of the Company.

**Manager Appointment:** Managers are appointed by {{manager_appointment_process}} and serve until resignation, removal, or replacement.
{{/if}}

### 3.2 Authority and Limitations
**Ordinary Business Decisions:** {{ordinary_decision_authority}}

**Major Decisions Requiring {{major_decision_threshold}} Approval:**
- Amendment of this Operating Agreement
- Admission of new Members
- Sale of substantially all Company assets
- Merger or dissolution of the Company
- {{additional_major_decisions}}

### 3.3 Meetings
**Annual Meetings:** {{#if annual_meetings_required}}Required annually on {{annual_meeting_date}}{{else}}Not required unless called by Members{{/if}}

**Special Meetings:** May be called by {{special_meeting_authority}}

**Notice:** {{meeting_notice_days}} days written notice required for all meetings

**Quorum:** {{quorum_requirement}} constitute a quorum

---

## 4. Distributions and Allocations

### 4.1 Distributions
**Distribution Policy:** Distributions shall be made {{distribution_frequency}} based on {{distribution_criteria}}.

**Distribution Percentages:** Distributions shall be made to Members in proportion to their ownership percentages unless otherwise determined by {{distribution_decision_authority}}.

### 4.2 Tax Allocations
**Income and Loss Allocation:** Profits and losses shall be allocated to Members in accordance with their ownership percentages.

**Tax Elections:** The Company shall make the following tax elections:
{{tax_elections}}

### 4.3 Capital Accounts
Capital accounts shall be maintained for each Member in accordance with Treasury Regulations.

---

## 5. Transfer of Membership Interests

### 5.1 Transfer Restrictions
**General Rule:** No Member may transfer all or part of their membership interest without {{transfer_approval_requirement}}.

### 5.2 Right of First Refusal
{{#if right_of_first_refusal}}
Before any Member may transfer their interest to a third party, they must first offer it to the other Members under the following terms:

**Notice Period:** {{rofr_notice_days}} days written notice  
**Terms:** Same price and terms as third-party offer  
**Response Period:** {{rofr_response_days}} days to accept
{{/if}}

### 5.3 Buy-Sell Provisions
{{#if buy_sell_provisions}}
**Triggering Events:** {{buy_sell_triggers}}  
**Valuation Method:** {{valuation_method}}  
**Payment Terms:** {{buy_sell_payment_terms}}
{{/if}}

---

## 6. Member Rights and Obligations

### 6.1 Member Rights
Members have the right to:
- Receive distributions when declared
- Inspect Company books and records
- Receive annual financial statements
- Vote on matters requiring Member approval
- {{additional_member_rights}}

### 6.2 Member Obligations
Members shall:
- Act in good faith toward the Company
- Maintain confidentiality of Company information
- {{#if non_compete}}Comply with non-compete restrictions: {{non_compete_terms}}{{/if}}
- {{additional_member_obligations}}

### 6.3 Fiduciary Duties
{{fiduciary_duty_provisions}}

---

## 7. Financial Provisions

### 7.1 Banking and Records
**Bank Accounts:** Company funds shall be deposited in accounts designated by the {{banking_authority}}.

**Records:** The Company shall maintain accurate books and records at its principal office.

**Fiscal Year:** The Company's fiscal year shall be {{fiscal_year}}.

### 7.2 Financial Statements
Annual financial statements shall be prepared and provided to Members within {{financial_statement_deadline}} after year-end.

---

## 8. Dissolution and Liquidation

### 8.1 Dissolution Events
The Company shall dissolve upon:
- Unanimous vote of all Members
- {{dissolution_triggers}}
- As required by law

### 8.2 Liquidation Process
Upon dissolution:
1. **Wind-up:** Company affairs shall be wound up by {{liquidation_authority}}
2. **Asset Distribution Order:**
   - Payment of debts and obligations
   - Return of capital contributions (if any surplus)
   - Distribution of remaining assets to Members per ownership percentages

---

## 9. Dispute Resolution

### 9.1 Dispute Resolution Process
{{#if mediation_required}}
**Mediation:** Disputes shall first be submitted to mediation in {{mediation_location}}.
{{/if}}

{{#if arbitration_required}}
**Arbitration:** Unresolved disputes shall be submitted to binding arbitration in {{arbitration_location}} under {{arbitration_rules}}.
{{else}}
**Litigation:** Disputes shall be resolved in the courts of {{litigation_jurisdiction}}.
{{/if}}

---

## 10. Miscellaneous Provisions

### 10.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### 10.2 Amendment
This Agreement may be amended only by {{amendment_requirement}}.

### 10.3 Severability
If any provision is held invalid, the remainder shall remain in full force and effect.

### 10.4 Binding Effect
This Agreement binds Members, their heirs, successors, and assigns.

### 10.5 Counterparts
This Agreement may be executed in counterparts, each deemed an original.

---

## 11. Additional Provisions

{{additional_provisions}}

---

## 12. Member Signatures

**IN WITNESS WHEREOF**, the Members have executed this Operating Agreement as of {{effective_date}}.

**MEMBERS:**

**{{member_1_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{effective_date}} |
| {{member_1_name}} | |
| Print Name: {{member_1_name}} | |

**{{member_2_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{effective_date}} |
| {{member_2_name}} | |
| Print Name: {{member_2_name}} | |

{{#if member_3_name}}
**{{member_3_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{effective_date}} |
| {{member_3_name}} | |
| Print Name: {{member_3_name}} | |
{{/if}}

{{#if additional_members}}
{{additional_member_signatures}}
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This LLC Operating Agreement should be reviewed by a qualified business attorney to ensure compliance with state laws and specific business requirements. Operating agreements should be tailored to the unique needs of each business and its members.

*Template generated by 123LegalDoc - Professional Legal Document Platform*