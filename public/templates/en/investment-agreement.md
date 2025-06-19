# Investment Agreement

---

**INVESTMENT AGREEMENT**

This Investment Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between:

- **Company:** {{company_name}}, a {{company_entity_type}} organized under the laws of {{company_state}}, with its principal place of business at {{company_address}}

- **Investor:** {{investor_name}}, a {{investor_entity_type}} with address at {{investor_address}}

Collectively referred to herein as the "Parties."

---

## 1. Investment Overview

### 1.1 Investment Summary
**Investment Type:** {{investment_type}}
**Investment Amount:** ${{investment_amount}}
**Security Type:** {{security_type}}
**Number of Shares/Units:** {{number_of_securities}}
**Price Per Share/Unit:** ${{price_per_security}}

### 1.2 Company Information
- **Business Description:** {{business_description}}
- **Industry:** {{industry}}
- **Stage:** {{company_stage}}
- **Employees:** {{employee_count}}
- **Founded:** {{company_founded_date}}

### 1.3 Use of Proceeds
The investment funds shall be used for:
{{#each use_of_proceeds}}
- {{description}}: ${{amount}} ({{percentage}}%)
{{/each}}

### 1.4 Closing Conditions
This investment is subject to:
- Completion of due diligence
- Execution of definitive agreements
- Regulatory approvals (if required)
- {{additional_closing_conditions}}

---

## 2. Securities and Ownership

### 2.1 Securities Issued
The Company shall issue to Investor:
- **Security Type:** {{security_type}}
- **Number:** {{number_of_securities}}
- **Class:** {{security_class}}
- **Par Value:** ${{par_value}} per share

### 2.2 Ownership Percentage
Upon closing, Investor will own {{ownership_percentage}}% of the Company on a fully diluted basis.

### 2.3 Capitalization Table
| Shareholder/Class | Shares | Percentage | Rights |
|------------------|--------|------------|--------|
| {{existing_shareholders}} | {{existing_shares}} | {{existing_percentage}}% | {{existing_rights}} |
| {{investor_name}} | {{investor_shares}} | {{investor_percentage}}% | {{investor_rights}} |
| **Total Outstanding** | {{total_shares}} | 100% | |

### 2.4 Anti-Dilution Protection
{{#if anti_dilution}}
**Anti-Dilution Type:** {{anti_dilution_type}}
- **Weighted Average:** {{weighted_average_type}}
- **Exceptions:** {{anti_dilution_exceptions}}
- **Adjustment Formula:** {{adjustment_formula}}
{{/if}}

---

## 3. Investor Rights and Preferences

### 3.1 Liquidation Preference
{{#if liquidation_preference}}
**Preference Multiple:** {{liquidation_multiple}}x
**Participation:** {{participation_type}}
- Upon liquidation, Investor receives the greater of:
  - {{liquidation_multiple}}x investment amount, or
  - Pro rata distribution based on ownership percentage
{{/if}}

### 3.2 Dividend Rights
{{#if dividend_rights}}
**Dividend Rate:** {{dividend_rate}}% per annum
**Payment Terms:** {{dividend_payment_terms}}
**Cumulative:** {{cumulative_dividends}}
{{else}}
No dividend rights granted.
{{/if}}

### 3.3 Voting Rights
**Voting Power:** {{voting_rights}}
- **Board Designation:** {{board_designation_rights}}
- **Protective Provisions:** {{protective_provisions}}
- **Information Rights:** {{information_rights}}

### 3.4 Conversion Rights
{{#if conversion_rights}}
Securities are convertible to common stock:
- **Conversion Ratio:** {{conversion_ratio}} common shares per preferred share
- **Automatic Conversion:** {{automatic_conversion_triggers}}
- **Optional Conversion:** At holder's option at any time
{{/if}}

---

## 4. Board of Directors and Governance

### 4.1 Board Composition
**Board Size:** {{board_size}} directors
- **Investor Designees:** {{investor_board_seats}}
- **Company Designees:** {{company_board_seats}}
- **Independent Directors:** {{independent_board_seats}}

### 4.2 Board Meetings
- **Frequency:** {{board_meeting_frequency}}
- **Notice:** {{board_meeting_notice}} days
- **Quorum:** {{board_quorum_requirement}}
- **Observer Rights:** {{observer_rights}}

### 4.3 Investor Consent Rights
Investor consent required for:
- Issuance of additional securities
- Incurring debt over ${{debt_threshold}}
- Major contracts over ${{contract_threshold}}
- Changes to business plan or budget
- {{additional_consent_rights}}

### 4.4 Information Rights
Company shall provide Investor:
- **Monthly Reports:** {{monthly_reporting_requirements}}
- **Annual Budget:** {{annual_budget_timing}}
- **Financial Statements:** {{financial_statement_frequency}}
- **Inspection Rights:** {{inspection_rights_description}}

---

## 5. Representations and Warranties

### 5.1 Company Representations
The Company represents and warrants:

**Corporate Matters:**
- Proper incorporation and good standing
- Corporate authority to enter this Agreement
- No conflicts with existing agreements or obligations

**Financial Matters:**
- Financial statements are accurate and complete
- No material adverse changes since last statements
- Adequate capitalization for business operations

**Legal Matters:**
- Compliance with all applicable laws
- No pending or threatened litigation
- All necessary licenses and permits obtained

**Intellectual Property:**
- Ownership or valid license to all IP
- No infringement of third-party rights
- Adequate protection of trade secrets

### 5.2 Investor Representations
The Investor represents and warrants:
- Authority to enter into this Agreement
- Accredited investor status (if applicable)
- Investment for own account, not for resale
- Understanding of risks involved

### 5.3 Material Adverse Change
No material adverse change has occurred since {{mac_baseline_date}} including:
- Loss of key customers or suppliers
- Material litigation or regulatory action
- Key employee departures
- Significant financial deterioration

---

## 6. Covenants and Restrictions

### 6.1 Affirmative Covenants
The Company agrees to:
- Maintain corporate existence and good standing
- Comply with all applicable laws and regulations
- Maintain adequate insurance coverage
- Provide regular financial and operational reports
- {{additional_affirmative_covenants}}

### 6.2 Negative Covenants
Without Investor consent, Company shall not:
- Incur debt exceeding ${{debt_limit}}
- Make capital expenditures over ${{capex_limit}}
- Enter into related party transactions
- Change the nature of the business
- {{additional_negative_covenants}}

### 6.3 Financial Covenants
{{#if financial_covenants}}
Company shall maintain:
- **Minimum Cash:** ${{minimum_cash_requirement}}
- **Revenue Targets:** {{revenue_targets}}
- **Burn Rate:** Not to exceed ${{max_burn_rate}} per month
- **Financial Reporting:** {{financial_reporting_requirements}}
{{/if}}

---

## 7. Registration Rights

### 7.1 Demand Registration
{{#if demand_registration}}
Investor may require Company to register securities for public sale:
- **Number of Demands:** {{demand_registration_number}}
- **Minimum Offering:** ${{minimum_offering_size}}
- **Company Obligations:** {{demand_registration_obligations}}
{{/if}}

### 7.2 Piggyback Registration
{{#if piggyback_rights}}
If Company registers securities for sale, Investor has right to include their securities in the registration.
{{/if}}

### 7.3 Registration Expenses
{{#if registration_expenses}}
**Expense Allocation:** {{registration_expense_allocation}}
{{/if}}

---

## 8. Transfer Restrictions

### 8.1 Right of First Refusal
{{#if right_of_first_refusal}}
Before transferring securities, holder must offer them first to:
1. Company
2. Other investors (pro rata)
3. Third parties
{{/if}}

### 8.2 Tag-Along Rights
{{#if tag_along_rights}}
If founders sell shares, Investor has right to participate in the sale on same terms.
{{/if}}

### 8.3 Drag-Along Rights
{{#if drag_along_rights}}
If {{drag_along_threshold}}% of shareholders approve a sale, all shareholders must participate.
{{/if}}

### 8.4 Lock-Up Provisions
{{#if lock_up}}
**Lock-Up Period:** {{lock_up_period}}
**Exceptions:** {{lock_up_exceptions}}
{{/if}}

---

## 9. Exit Rights and Provisions

### 9.1 Redemption Rights
{{#if redemption_rights}}
Starting {{redemption_start_date}}, Investor may require Company to redeem securities:
- **Redemption Price:** {{redemption_price_formula}}
- **Payment Terms:** {{redemption_payment_terms}}
- **Conditions:** {{redemption_conditions}}
{{/if}}

### 9.2 Sale Process
{{#if sale_process_rights}}
If Company considers a sale, Investor has right to:
- Participate in sale process
- Review and approve terms
- Engage advisors at Company expense
{{/if}}

### 9.3 IPO Provisions
{{#if ipo_provisions}}
**Automatic Conversion:** All preferred shares convert to common upon IPO if:
- Offering price is at least ${{ipo_price_threshold}} per share
- Gross proceeds exceed ${{ipo_proceeds_threshold}}
{{/if}}

---

## 10. Default and Remedies

### 10.1 Events of Default
Events of default include:
- Material breach of representations or covenants
- Bankruptcy or insolvency proceedings
- Failure to provide required information
- {{additional_default_events}}

### 10.2 Remedies
Upon default, Investor may:
- Demand immediate cure
- Exercise enhanced voting rights
- Require board representation changes
- Pursue legal remedies

---

## 11. Closing and Post-Closing

### 11.1 Closing Date
**Closing Date:** {{closing_date}}
**Closing Location:** {{closing_location}}

### 11.2 Closing Deliverables
At closing, parties shall deliver:

**Company Deliverables:**
- Stock certificates or evidence of ownership
- Corporate resolutions authorizing transaction
- Updated articles and bylaws
- {{company_closing_deliverables}}

**Investor Deliverables:**
- Investment funds via wire transfer
- Executed agreement and related documents
- {{investor_closing_deliverables}}

### 11.3 Post-Closing Adjustments
{{#if post_closing_adjustments}}
Investment amount subject to adjustment based on:
{{post_closing_adjustment_mechanism}}
{{/if}}

---

## 12. General Provisions

### 12.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### 12.2 Dispute Resolution
{{#if arbitration}}
Disputes shall be resolved through binding arbitration in {{arbitration_location}}.
{{else}}
Disputes shall be resolved in the courts of {{jurisdiction}}.
{{/if}}

### 12.3 Confidentiality
Both parties agree to maintain confidentiality of non-public information shared in connection with this investment.

### 12.4 Entire Agreement
This Agreement constitutes the entire agreement and supersedes all prior negotiations.

### 12.5 Amendment
This Agreement may only be amended in writing signed by both parties.

### 12.6 Assignment
This Agreement may not be assigned without written consent, except to affiliates.

---

## 13. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Agreement as of the date first written above.

**COMPANY:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{company_name}} | |
| By: {{company_signatory}} | |
| Title: {{company_title}} | |

**INVESTOR:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{investor_name}} | |
| {{investor_title}} | |

---

**IMPORTANT LEGAL NOTICE:** This investment agreement should be reviewed by qualified legal and financial advisors to ensure compliance with securities laws and proper protection of investor and company interests. Investment terms should be carefully structured based on specific circumstances.

*Template generated by 123LegalDoc - Professional Legal Document Platform*