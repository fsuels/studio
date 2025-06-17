# LLC Operating Agreement

---

**LIMITED LIABILITY COMPANY OPERATING AGREEMENT**

**{{company_name}}**

This Operating Agreement ("Agreement") is made effective as of **{{agreement_date}}**, among the Members of {{company_name}}, a Limited Liability Company organized under the laws of the State of {{state_of_organization}}.

---

## ARTICLE I: COMPANY FORMATION AND PURPOSE

### Section 1.1 Formation
{{company_name}} (the "Company") was formed as a Limited Liability Company under the laws of {{state_of_organization}} by filing Articles of Organization with the {{state_filing_office}} on {{formation_date}}.

### Section 1.2 Name
The name of the Company is {{company_name}}.

### Section 1.3 Principal Office
The principal office of the Company is located at:
{{company_address}}
{{company_city}}, {{company_state}} {{company_zip}}

### Section 1.4 Purpose
The purpose of the Company is to engage in {{business_purpose}} and any other lawful business activity permitted under {{state_of_organization}} law.

### Section 1.5 Term
The Company shall continue in existence until dissolved in accordance with this Agreement or as required by law.

---

## ARTICLE II: MEMBERSHIP INTERESTS AND CAPITAL CONTRIBUTIONS

### Section 2.1 Members and Ownership Percentages
The Company shall have the following Members with the corresponding ownership interests:

{{#each members}}
**{{name}}**
- **Address:** {{address}}
- **Phone:** {{phone}}
- **Email:** {{email}}
- **Ownership Percentage:** {{ownership_percentage}}%
- **Membership Units:** {{membership_units}}
{{/each}}

### Section 2.2 Initial Capital Contributions
Each Member has made or shall make the following initial capital contributions:

{{#each members}}
**{{name}}:** ${{capital_contribution}}
{{#if contribution_type}}
**Type:** {{contribution_type}} (Cash/Property/Services)
{{#if property_description}}
**Property Description:** {{property_description}}
**Agreed Value:** ${{property_value}}
{{/if}}
{{/if}}
{{/each}}

**Total Initial Capital:** ${{total_initial_capital}}

### Section 2.3 Additional Capital Contributions
{{#if additional_contributions_allowed}}
Additional capital contributions may be required by {{contribution_decision_process}}. Members shall contribute additional capital in proportion to their ownership percentages unless otherwise agreed.
{{else}}
No Member shall be required to make additional capital contributions.
{{/if}}

### Section 2.4 Return of Capital Contributions
No Member has the right to demand or receive the return of their capital contribution except upon dissolution of the Company or as otherwise provided in this Agreement.

---

## ARTICLE III: PROFITS, LOSSES, AND DISTRIBUTIONS

### Section 3.1 Allocation of Profits and Losses
Profits and losses shall be allocated among the Members in proportion to their ownership percentages.

### Section 3.2 Distributions
{{#if distribution_policy}}
**Distribution Policy:** {{distribution_policy}}
**Distribution Frequency:** {{distribution_frequency}}
**Distribution Decision Authority:** {{distribution_authority}}
{{else}}
Distributions shall be made to Members pro rata in accordance with their ownership percentages when and if determined by the Members.
{{/if}}

### Section 3.3 Tax Allocations
For federal income tax purposes, the Company elects to be treated as {{tax_election}} (Partnership/Corporation/Disregarded Entity).

---

## ARTICLE IV: MANAGEMENT STRUCTURE

### Section 4.1 Management Type
The Company shall be managed by {{management_type}} (Member-Managed/Manager-Managed).

{{#if member_managed}}
### Section 4.2 Member Management
All Members shall participate in the management of the Company. Decisions shall be made by {{member_decision_process}} (Majority Vote/Unanimous Consent/Other).

**Voting Power:** Each Member's voting power shall be proportional to their ownership percentage.
{{/if}}

{{#if manager_managed}}
### Section 4.2 Manager Management
The Company shall be managed by the following Manager(s):

{{#each managers}}
**Manager:** {{name}}
**Address:** {{address}}
**Phone:** {{phone}}
**Email:** {{email}}
**Term:** {{term}}
**Authority:** {{authority}}
{{/each}}

### Section 4.3 Manager Authority
Managers have full authority to manage the Company's affairs, including but not limited to:
- Conducting day-to-day business operations
- Entering into contracts on behalf of the Company
- Hiring and firing employees
- Making management decisions
- {{additional_manager_authority}}

### Section 4.4 Manager Duties
Managers owe fiduciary duties of care and loyalty to the Company and its Members.
{{/if}}

### Section 4.5 Major Decisions
The following decisions require {{major_decision_threshold}} (Unanimous/Majority/Supermajority) approval:
- Admission of new Members
- Sale of substantial Company assets
- Merger or dissolution of the Company
- Amendment of this Operating Agreement
- Incurring debt exceeding ${{debt_threshold}}
- {{additional_major_decisions}}

---

## ARTICLE V: MEETINGS AND VOTING

### Section 5.1 Regular Meetings
{{#if regular_meetings}}
Regular meetings shall be held {{meeting_frequency}} at {{meeting_location}}.
{{else}}
No regular meetings are required unless called by Members.
{{/if}}

### Section 5.2 Special Meetings
Special meetings may be called by {{meeting_call_authority}}.

### Section 5.3 Notice
Notice of meetings shall be given {{notice_period}} days in advance by {{notice_method}}.

### Section 5.4 Quorum
A quorum consists of Members holding {{quorum_percentage}}% of the ownership interests.

### Section 5.5 Voting
{{voting_procedures}}

---

## ARTICLE VI: TRANSFER OF MEMBERSHIP INTERESTS

### Section 6.1 Transfer Restrictions
No Member may transfer all or any part of their membership interest without {{transfer_approval_requirement}} (Unanimous Consent/Majority Approval/Manager Approval).

### Section 6.2 Right of First Refusal
{{#if right_of_first_refusal}}
Before any Member may transfer their interest to a third party, the Company and other Members shall have a right of first refusal to purchase the interest under the same terms and conditions.
{{/if}}

### Section 6.3 Permitted Transfers
The following transfers are permitted without restriction:
{{permitted_transfers}}

### Section 6.4 Buy-Sell Provisions
{{buy_sell_provisions}}

---

## ARTICLE VII: MEMBER WITHDRAWAL AND DISSOLUTION EVENTS

### Section 7.1 Voluntary Withdrawal
{{#if voluntary_withdrawal_allowed}}
A Member may voluntarily withdraw from the Company by giving {{withdrawal_notice_period}} days written notice.
{{else}}
Members may not voluntarily withdraw from the Company except upon dissolution.
{{/if}}

### Section 7.2 Involuntary Withdrawal
A Member may be involuntarily removed for:
- Material breach of this Agreement
- Bankruptcy or insolvency
- Death or incapacity (for individual Members)
- {{additional_removal_events}}

### Section 7.3 Buyout Upon Withdrawal
{{buyout_provisions}}

---

## ARTICLE VIII: DISSOLUTION AND LIQUIDATION

### Section 8.1 Dissolution Events
The Company shall be dissolved upon:
- Unanimous consent of all Members
- Expiration of the Company term (if applicable)
- Entry of a decree of judicial dissolution
- {{additional_dissolution_events}}

### Section 8.2 Liquidation Process
Upon dissolution, the Company's assets shall be liquidated and distributed in the following order:
1. Payment of Company debts and liabilities
2. Payment of loans from Members
3. Return of capital contributions to Members
4. Distribution of remaining assets to Members pro rata

### Section 8.3 Liquidator
{{liquidator_designation}}

---

## ARTICLE IX: INDEMNIFICATION

### Section 9.1 Indemnification of Members and Managers
The Company shall indemnify and hold harmless all Members and Managers from any liability arising from their service to the Company, except for acts of gross negligence or willful misconduct.

### Section 9.2 Insurance
{{#if insurance_required}}
The Company shall maintain appropriate liability insurance in the amount of ${{insurance_amount}}.
{{/if}}

---

## ARTICLE X: RECORDS AND ACCOUNTING

### Section 10.1 Books and Records
The Company shall maintain complete books and records of its business at its principal office.

### Section 10.2 Accounting Method
The Company shall use the {{accounting_method}} (Cash/Accrual) method of accounting.

### Section 10.3 Fiscal Year
The Company's fiscal year shall end on {{fiscal_year_end}}.

### Section 10.4 Annual Reports
{{annual_reporting_requirements}}

---

## ARTICLE XI: EMPLOYMENT AND COMPENSATION

### Section 11.1 Member Employment
{{#if member_employment}}
The following Members shall be employed by the Company:

{{#each employed_members}}
**Member:** {{name}}
**Position:** {{position}}
**Salary:** ${{salary}}
**Benefits:** {{benefits}}
{{/each}}
{{/if}}

### Section 11.2 Non-Competition
{{#if non_compete_clause}}
{{non_compete_terms}}
{{/if}}

---

## ARTICLE XII: DISPUTE RESOLUTION

### Section 12.1 Mediation
Any disputes arising under this Agreement shall first be submitted to mediation.

### Section 12.2 Arbitration
{{#if arbitration_required}}
If mediation fails, disputes shall be resolved through binding arbitration under {{arbitration_rules}}.
{{else}}
If mediation fails, disputes may be resolved in the courts of {{jurisdiction}}.
{{/if}}

---

## ARTICLE XIII: GENERAL PROVISIONS

### Section 13.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### Section 13.2 Entire Agreement
This Agreement constitutes the entire agreement among the Members and supersedes all prior agreements.

### Section 13.3 Amendment
This Agreement may be amended only by {{amendment_process}} (Unanimous Consent/Majority Vote/Written Agreement).

### Section 13.4 Severability
If any provision is held invalid, the remainder of the Agreement shall remain in effect.

### Section 13.5 Binding Effect
This Agreement binds the Members, their heirs, successors, and assigns.

### Section 13.6 Counterparts
This Agreement may be executed in counterparts, each of which constitutes an original.

---

## ARTICLE XIV: SIGNATURES

IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of the date first written above.

{{#each members}}
**MEMBER:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{../agreement_date}} |
| {{name}} | |
| Print Name: {{name}} | |

{{/each}}

{{#if manager_managed}}
{{#each managers}}
**MANAGER:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{../agreement_date}} |
| {{name}} | |
| Print Name: {{name}} | |

{{/each}}
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This LLC Operating Agreement should be reviewed by qualified business law attorneys to ensure compliance with state LLC laws and regulations. LLC requirements vary significantly by state, and this agreement should be customized to meet specific business needs and state requirements.

*Template generated by 123LegalDoc - Professional Legal Document Platform*