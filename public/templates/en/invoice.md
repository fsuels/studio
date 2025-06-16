# Invoice

---

**INVOICE**

**Invoice #:** {{invoice_number}}  
**Date:** {{invoice_date}}  
**Due Date:** {{due_date}}

---

## Bill To:

**{{client_name}}**  
{{client_address}}  
{{client_city}}, {{client_state}} {{client_zip}}  
{{client_country}}

**Contact Information:**  
**Email:** {{client_email}}  
**Phone:** {{client_phone}}  
**Tax ID/VAT:** {{client_tax_id}}

---

## Bill From:

**{{business_name}}**  
{{business_address}}  
{{business_city}}, {{business_state}} {{business_zip}}  
{{business_country}}

**Contact Information:**  
**Email:** {{business_email}}  
**Phone:** {{business_phone}}  
**Website:** {{business_website}}  
**Tax ID/EIN:** {{business_tax_id}}

---

## Project/Order Information

**Project Name:** {{project_name}}  
**Purchase Order #:** {{purchase_order_number}}  
**Reference #:** {{reference_number}}  
**Sales Representative:** {{sales_rep_name}}

---

## Items/Services

| Description | Quantity | Rate | Amount |
|-------------|----------|------|--------|
| {{item_1_description}} | {{item_1_quantity}} | ${{item_1_rate}} | ${{item_1_amount}} |
{{#if item_2_description}}| {{item_2_description}} | {{item_2_quantity}} | ${{item_2_rate}} | ${{item_2_amount}} |{{/if}}
{{#if item_3_description}}| {{item_3_description}} | {{item_3_quantity}} | ${{item_3_rate}} | ${{item_3_amount}} |{{/if}}
{{#if item_4_description}}| {{item_4_description}} | {{item_4_quantity}} | ${{item_4_rate}} | ${{item_4_amount}} |{{/if}}
{{#if item_5_description}}| {{item_5_description}} | {{item_5_quantity}} | ${{item_5_rate}} | ${{item_5_amount}} |{{/if}}
{{additional_items}}

---

## Cost Breakdown

### Subtotal Calculations
**Subtotal:** ${{subtotal}}

### Discounts
{{#if discount_applied}}
**Discount ({{discount_percentage}}%):** -${{discount_amount}}  
**Discount Description:** {{discount_description}}
{{else}}
**Discount:** $0.00
{{/if}}

### Taxes
{{#if tax_applicable}}
**Sales Tax ({{tax_rate}}%):** ${{sales_tax_amount}}  
**Tax Jurisdiction:** {{tax_jurisdiction}}  
{{#if additional_taxes}}
**Additional Taxes:** ${{additional_tax_amount}}  
**Tax Description:** {{additional_tax_description}}
{{/if}}
{{else}}
**Tax:** $0.00
{{/if}}

### Shipping & Handling
{{#if shipping_charges}}
**Shipping:** ${{shipping_amount}}  
**Handling:** ${{handling_amount}}  
**Shipping Method:** {{shipping_method}}
{{else}}
**Shipping & Handling:** $0.00
{{/if}}

### Other Fees
{{#if other_fees}}
{{other_fees_breakdown}}
{{else}}
**Other Fees:** $0.00
{{/if}}

---

## Total Amount Due

| | Amount |
|---|--------|
| **Subtotal** | ${{subtotal}} |
| **Discount** | -${{discount_amount}} |
| **Tax** | ${{total_tax_amount}} |
| **Shipping & Handling** | ${{total_shipping_amount}} |
| **Other Fees** | ${{other_fees_total}} |
| **TOTAL DUE** | **${{total_amount_due}}** |

---

## Payment Information

### Payment Terms
**Payment Terms:** {{payment_terms}}  
**Due Date:** {{due_date}}  

{{#if early_payment_discount}}
**Early Payment Discount:** {{early_payment_discount_rate}}% if paid by {{early_payment_date}}
{{/if}}

{{#if late_payment_fee}}
**Late Payment Fee:** {{late_payment_fee_rate}}% per month on overdue amounts
{{/if}}

### Accepted Payment Methods
{{#if accepts_cash}}☐ Cash{{/if}}  
{{#if accepts_check}}☐ Check (payable to {{business_name}}){{/if}}  
{{#if accepts_credit_card}}☐ Credit Card{{/if}}  
{{#if accepts_bank_transfer}}☐ Bank Transfer/ACH{{/if}}  
{{#if accepts_online_payment}}☐ Online Payment{{/if}}

### Payment Instructions
{{#if bank_transfer_details}}
**Bank Transfer Details:**  
**Bank Name:** {{bank_name}}  
**Account Name:** {{account_name}}  
**Account Number:** {{account_number}}  
**Routing Number:** {{routing_number}}  
**SWIFT Code:** {{swift_code}}
{{/if}}

{{#if online_payment_url}}
**Online Payment:** {{online_payment_url}}
{{/if}}

{{#if check_payment_address}}
**Mail Checks To:**  
{{check_payment_address}}
{{/if}}

---

## Additional Information

### Notes
{{#if invoice_notes}}
{{invoice_notes}}
{{else}}
Thank you for your business!
{{/if}}

### Terms and Conditions
{{#if terms_and_conditions}}
{{terms_and_conditions}}
{{else}}
1. Payment is due within {{payment_terms}} of invoice date
2. Late payments may incur additional fees
3. All work performed and materials provided are subject to our standard terms of service
{{/if}}

### Warranty/Return Policy
{{#if warranty_policy}}
{{warranty_policy}}
{{/if}}

---

## Contact Information

### Questions About This Invoice?
**Contact:** {{billing_contact_name}}  
**Phone:** {{billing_contact_phone}}  
**Email:** {{billing_contact_email}}  
**Hours:** {{business_hours}}

### Billing Department
{{#if separate_billing_contact}}
**Billing Contact:** {{billing_department_contact}}  
**Billing Phone:** {{billing_department_phone}}  
**Billing Email:** {{billing_department_email}}
{{/if}}

---

## Business Information

### Business Registration
**Business License #:** {{business_license_number}}  
**State of Incorporation:** {{state_of_incorporation}}  
**Federal Tax ID:** {{federal_tax_id}}

{{#if professional_licenses}}
### Professional Licenses
{{professional_license_information}}
{{/if}}

---

## Attachments

{{#if has_attachments}}
**Supporting Documents:**
- {{attachment_1}}
- {{attachment_2}}
- {{attachment_3}}
{{additional_attachments}}
{{else}}
No supporting documents attached.
{{/if}}

---

## For Internal Use Only

**Customer ID:** {{customer_id}}  
**Invoice Created By:** {{created_by}}  
**Sales Territory:** {{sales_territory}}  
**Commission Rate:** {{commission_rate}}%

---

## Payment Record

**For Accounting Use:**

| Payment Date | Amount Paid | Payment Method | Check/Transaction # | Balance Remaining |
|--------------|-------------|----------------|-------------------|-------------------|
| | | | | ${{total_amount_due}} |
| | | | | |
| | | | | |

---

## Remittance Advice

{{#if remittance_copy}}
**REMITTANCE COPY - RETURN WITH PAYMENT**

**Invoice #:** {{invoice_number}}  
**Invoice Date:** {{invoice_date}}  
**Amount Due:** ${{total_amount_due}}  
**Due Date:** {{due_date}}

**Remit To:**  
{{business_name}}  
{{remittance_address}}

**Amount Paid:** $ ________________  
**Check #:** ________________  
**Date Paid:** ________________
{{/if}}

---

## Important Legal Notices

### Collection Notice
{{#if collection_notice}}
**COLLECTION NOTICE:** Past due accounts may be subject to collection action, including but not limited to credit reporting, collection agency referral, and legal action. Additional collection costs may be added to your account.
{{/if}}

### Dispute Resolution
{{#if dispute_procedure}}
**Disputes:** Any disputes regarding this invoice must be raised within {{dispute_period}} days of the invoice date. Please contact {{dispute_contact}} to resolve billing questions.
{{/if}}

### Governing Law
This invoice and any disputes arising from it shall be governed by the laws of {{governing_state}}.

---

**IMPORTANT NOTICE:** This invoice should be reviewed carefully for accuracy. Please contact us immediately if you notice any discrepancies. Payment of this invoice constitutes acceptance of the goods/services provided and the terms stated herein.

*Invoice generated by 123LegalDoc - Professional Legal Document Platform*