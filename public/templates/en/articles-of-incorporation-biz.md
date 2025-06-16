# Articles of Incorporation (Business)

---

**ARTICLES OF INCORPORATION**

**Submitted to the Secretary of State of {{state}}**

---

## 1. Corporate Name

The name of the corporation is:

**{{corporation_name}}**

{{#if name_reservation}}
This name has been reserved under Reservation Number {{reservation_number}} dated {{reservation_date}}.
{{/if}}

---

## 2. Registered Office and Agent

### 2.1 Registered Office
The street address of the registered office is:
{{registered_office_address}}

### 2.2 Registered Agent
The name of the registered agent at the registered office is:
**{{registered_agent_name}}**

{{#if registered_agent_entity}}
**Registered Agent Entity:** {{registered_agent_entity_name}}
{{/if}}

The registered agent accepts appointment as registered agent for this corporation.

---

## 3. Purpose and Powers

### 3.1 General Purpose
The purpose for which this corporation is organized is:
{{#if general_purpose}}
To engage in any lawful act or activity for which corporations may be organized under the {{state}} Business Corporation Act.
{{else}}
**Specific Purpose:** {{specific_purpose}}
{{/if}}

### 3.2 Specific Business Activities
The corporation is organized to engage in the following business activities:
{{business_activities}}

### 3.3 Powers
The corporation shall have all powers granted to corporations under the laws of {{state}}, including but not limited to the power to:
- Conduct business and carry on operations
- Purchase, lease, or otherwise acquire property
- Sell, convey, mortgage, or otherwise dispose of property
- Borrow money and issue bonds, notes, and other obligations
- Lend money and invest funds
- Enter into contracts and agreements
- Sue and be sued in its corporate name

---

## 4. Capital Stock

### 4.1 Authorized Shares
The total number of shares of stock that the corporation is authorized to issue is:
**{{total_authorized_shares}}** shares

### 4.2 Classes of Stock
{{#if multiple_stock_classes}}
The corporation is authorized to issue the following classes of stock:

**Class A Common Stock:**
- Number of Shares: {{class_a_shares}}
- Par Value: ${{class_a_par_value}} per share
- Rights and Privileges: {{class_a_rights}}

**Class B Common Stock:**
- Number of Shares: {{class_b_shares}}
- Par Value: ${{class_b_par_value}} per share
- Rights and Privileges: {{class_b_rights}}

{{#if preferred_stock}}
**Preferred Stock:**
- Number of Shares: {{preferred_shares}}
- Par Value: ${{preferred_par_value}} per share
- Rights and Privileges: {{preferred_rights}}
{{/if}}
{{else}}
**Common Stock:**
- Number of Shares: {{common_shares}}
- Par Value: {{#if par_value}}${{par_value}} per share{{else}}No par value{{/if}}
{{/if}}

### 4.3 Stock Rights and Restrictions
{{stock_rights_restrictions}}

---

## 5. Incorporators

The name(s) and address(es) of the incorporator(s) is/are:

**Incorporator 1:**
**Name:** {{incorporator_1_name}}
**Address:** {{incorporator_1_address}}
**Signature:** _________________________________

{{#if incorporator_2_name}}
**Incorporator 2:**
**Name:** {{incorporator_2_name}}
**Address:** {{incorporator_2_address}}
**Signature:** _________________________________
{{/if}}

{{#if incorporator_3_name}}
**Incorporator 3:**
**Name:** {{incorporator_3_name}}
**Address:** {{incorporator_3_address}}
**Signature:** _________________________________
{{/if}}

---

## 6. Initial Directors

{{#if initial_directors_named}}
The name(s) and address(es) of the initial director(s) is/are:

**Director 1:**
**Name:** {{director_1_name}}
**Address:** {{director_1_address}}

**Director 2:**
**Name:** {{director_2_name}}
**Address:** {{director_2_address}}

**Director 3:**
**Name:** {{director_3_name}}
**Address:** {{director_3_address}}

{{additional_directors}}
{{else}}
The number of initial directors is {{initial_director_count}}, but their names and addresses are not set forth herein. The initial directors will be elected by the incorporators or shareholders in accordance with the bylaws.
{{/if}}

---

## 7. Principal Office

The street address of the principal office of the corporation is:
{{principal_office_address}}

**Mailing Address (if different):**
{{#if different_mailing_address}}
{{mailing_address}}
{{else}}
Same as principal office address
{{/if}}

---

## 8. Duration

{{#if perpetual_duration}}
The corporation shall have perpetual existence.
{{else}}
The period of duration for the corporation is {{duration_period}}.
{{/if}}

---

## 9. Additional Provisions

{{#if additional_provisions}}
### 9.1 Limitation of Director Liability
{{director_liability_limitation}}

### 9.2 Indemnification
{{indemnification_provisions}}

### 9.3 Business Combinations
{{business_combination_provisions}}

### 9.4 Other Provisions
{{other_provisions}}
{{else}}
None.
{{/if}}

---

## 10. Federal Tax Election

{{#if s_corporation_election}}
### 10.1 S Corporation Election
The corporation elects to be treated as an S Corporation for federal tax purposes and will file Form 2553 with the Internal Revenue Service.
{{/if}}

{{#if close_corporation}}
### 10.2 Close Corporation Election
The corporation elects to be treated as a close corporation under {{state}} law.
{{/if}}

---

## 11. Effective Date

{{#if delayed_effective_date}}
These Articles of Incorporation shall become effective on {{effective_date}}.
{{else}}
These Articles of Incorporation shall become effective upon filing with the Secretary of State.
{{/if}}

---

## 12. Incorporator Acknowledgment

The undersigned incorporator(s) acknowledge(s) that:
- The information contained in these Articles of Incorporation is true and correct
- The corporation has been organized for legitimate business purposes
- The incorporator(s) have the authority to execute these Articles of Incorporation

---

## 13. Signatures

**IN WITNESS WHEREOF**, the undersigned incorporator(s) have executed these Articles of Incorporation on {{execution_date}}.

**INCORPORATOR SIGNATURES:**

**{{incorporator_1_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{execution_date}} |
| {{incorporator_1_name}}, Incorporator | |

{{#if incorporator_2_name}}
**{{incorporator_2_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{execution_date}} |
| {{incorporator_2_name}}, Incorporator | |
{{/if}}

{{#if incorporator_3_name}}
**{{incorporator_3_name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{execution_date}} |
| {{incorporator_3_name}}, Incorporator | |
{{/if}}

---

## 14. Registered Agent Acceptance

{{#if registered_agent_acceptance_required}}
I, {{registered_agent_name}}, hereby accept appointment as registered agent for {{corporation_name}}.

**REGISTERED AGENT:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{execution_date}} |
| {{registered_agent_name}} | |
| Registered Agent | |
{{/if}}

---

## 15. Filing Information

**For Secretary of State Use Only:**

**Filing Fee:** $__________  
**File Number:** __________  
**Filing Date:** __________  
**Effective Date:** __________

**Filed by:** _________________________  
**Secretary of State of {{state}}**

---

## 16. Contact Information

**Primary Contact for Corporation:**
**Name:** {{primary_contact_name}}  
**Title:** {{primary_contact_title}}  
**Phone:** {{primary_contact_phone}}  
**Email:** {{primary_contact_email}}

**Attorney (if applicable):**
**Name:** {{attorney_name}}  
**Firm:** {{law_firm_name}}  
**Phone:** {{attorney_phone}}  
**Email:** {{attorney_email}}  
**State Bar Number:** {{attorney_bar_number}}

---

## 17. Required Attachments

{{#if required_attachments}}
The following documents are attached to these Articles of Incorporation:
{{attachment_list}}
{{else}}
No additional documents are attached.
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** These Articles of Incorporation should be reviewed by qualified legal counsel to ensure compliance with state corporation laws and specific business requirements. Corporation formation requirements vary by state, and proper legal and tax advice should be obtained before filing. Additional documents such as bylaws, shareholder agreements, and federal tax elections may be necessary to complete the incorporation process.

*Template generated by 123LegalDoc - Professional Legal Document Platform*