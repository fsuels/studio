# Service Agreement

**Document ID:** `service-agreement`

---

This Service Agreement ("Agreement") is made effective as of **{{startDate}}** between the following parties:

- **Service Provider:** {{providerName}}, a {{providerBusinessStructure}} with mailing address {{providerAddress}} ("Provider")
- **Client:** {{clientName}}, a {{clientBusinessStructure}} with mailing address {{clientAddress}} ("Client")

Provider and Client may be referred to individually as a "Party" and collectively as the "Parties".

---

## 1. Services and Scope

Provider agrees to perform the services described below (the "Services"):

- **Primary Services:** {{serviceDescription}}
{{#if projectScope}}
- **Project Scope / Milestones:** {{projectScope}}
{{/if}}
- **Deliverables:** {{deliverables}}
{{#if acceptanceCriteria}}
- **Acceptance Criteria:** {{acceptanceCriteria}}
{{/if}}

{{#if supportAndMaintenance}}
Provider will also provide the following ongoing support or maintenance: {{supportAndMaintenance}}.
{{/if}}

## 2. Term and Timeline

The Services begin on **{{startDate}}**.
{{#if completionDate}}
The Parties anticipate completion on or before **{{completionDate}}**.
{{/if}}

## 3. Compensation

- **Payment Structure:** {{paymentStructure}}
{{#if paymentAmount}}
- **Compensation Amount / Rate:** {{paymentAmount}}
{{/if}}
- **Payment Schedule:** {{paymentSchedule}}

{{#if expensesReimbursed}}
Client will reimburse Provider for reasonable expenses in accordance with the following policy: {{expensePolicy}}.
{{else}}
Client is not responsible for reimbursing Provider's incidental expenses unless otherwise agreed in writing.
{{/if}}

## 4. Intellectual Property and Confidentiality

- **Intellectual Property Ownership:** {{ipOwnership}}
{{#if confidentiality}}
The Parties agree to maintain confidentiality for sensitive or proprietary information exchanged in the course of the engagement.
{{else}}
No additional confidentiality obligations apply beyond the default duties imposed by law.
{{/if}}

## 5. Policies and Risk Allocation

{{#if terminationNoticeDays}}
Either Party may terminate this Agreement with {{terminationNoticeDays}} days' written notice.
{{/if}}

- **Dispute Resolution:** {{disputeResolution}}
- **Governing Law:** State of {{governingLawState}}

## 6. Notices

Official notices will be sent to the contact email provided by each Party. Client designates **{{noticesEmail}}** for notice delivery.

---

## 7. Additional Terms

{{#if acceptanceCriteria}}
Acceptance criteria described above will control sign-off for completed work.
{{/if}}
{{#if expensePolicy}}
Expense approvals and reimbursements must comply with the policy stated in Section 3.
{{/if}}
{{#if supportAndMaintenance}}
Support response times or maintenance coverage follow the commitments outlined in Section 1.
{{/if}}

---

## 8. Signatures

By signing below, the Parties acknowledge their agreement to the terms above.

**SERVICE PROVIDER**

Signature: ________________________________  Date: _____________

Name: {{providerName}}

**CLIENT**

Signature: ________________________________  Date: _____________

Name: {{clientName}}

---

*Generated via 123LegalDoc template system; values merge into the placeholders noted above.*
