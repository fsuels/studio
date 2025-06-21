# Vehicle Bill of Sale

**VEHICLE BILL OF SALE**

---

**Seller:** {{seller_name}}  
**Buyer:** {{buyer_name}}  
**Vehicle:** {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}  
**Sale Date:** {{sale_date}}

---

## 1. Seller Information

**Full Name:** {{seller_name}}  
**Address:** {{seller_address}}  
**City, State, ZIP:** {{seller_city}}, {{seller_state}} {{seller_zip}}  
**Phone:** {{seller_phone}}  
**Email:** {{seller_email}}  
**Driver's License:** {{seller_license_number}} ({{seller_license_state}})

---

## 2. Buyer Information

**Full Name:** {{buyer_name}}  
**Address:** {{buyer_address}}  
**City, State, ZIP:** {{buyer_city}}, {{buyer_state}} {{buyer_zip}}  
**Phone:** {{buyer_phone}}  
**Email:** {{buyer_email}}  
**Driver's License:** {{buyer_license_number}} ({{buyer_license_state}})

---

## 3. Vehicle Information

### 3.1 Vehicle Details

**Year:** {{vehicle_year}}  
**Make:** {{vehicle_make}}  
**Model:** {{vehicle_model}}  
**Body Style:** {{vehicle_body_style}}  
**Color:** {{vehicle_color}}  
**VIN:** {{vehicle_vin}}  
**License Plate:** {{license_plate_number}} ({{license_plate_state}})

### 3.2 Engine and Specifications

**Engine Size:** {{engine_size}}  
**Transmission:** {{transmission_type}}  
**Fuel Type:** {{fuel_type}}  
**Drivetrain:** {{drivetrain}}

### 3.3 Mileage and Condition

**Odometer Reading:** {{odometer_reading}} miles  
**Condition:** {{vehicle_condition}}  
**Known Issues:** {{known_issues}}

---

## 4. Sale Terms

### 4.1 Purchase Price

**Sale Price:** ${{sale_price}}  
**Payment Method:** {{payment_method}}  
**Payment Status:** {{payment_status}}

{{#if payment_plan}}
### 4.2 Payment Plan
**Down Payment:** ${{down_payment}}  
**Balance Due:** ${{balance_due}}  
**Payment Schedule:** {{payment_schedule}}
{{/if}}

### 4.3 Additional Costs

{{#if additional_costs}}
**Sales Tax:** ${{sales_tax}}  
**Registration Fees:** ${{registration_fees}}  
**Other Fees:** {{other_fees}}
{{/if}}

---

## 5. Vehicle Title and Documentation

### 5.1 Title Information

**Title Status:** {{title_status}}  
**Title Number:** {{title_number}}  
**Lien Holder:** {{#if lien_holder}}{{lien_holder_name}}{{else}}None{{/if}}

### 5.2 Title Transfer

Seller certifies that:
- They are the legal owner of the vehicle
- The title is clear and free of liens {{#if lien_holder}}except as noted above{{/if}}
- They have the right to sell the vehicle
- Title will be transferred to Buyer upon full payment

### 5.3 Documents Included

The following documents are included with this sale:
- {{#if title_included}}✓{{else}}✗{{/if}} Vehicle Title
- {{#if registration_included}}✓{{else}}✗{{/if}} Current Registration
- {{#if maintenance_records}}✓{{else}}✗{{/if}} Maintenance Records
- {{#if warranty_info}}✓{{else}}✗{{/if}} Warranty Information
- {{#if manuals_included}}✓{{else}}✗{{/if}} Owner's Manual
- {{additional_documents}}

---

## 6. Vehicle Condition and Warranties

### 6.1 Vehicle Condition

The vehicle is sold in its current condition. Seller makes the following representations:

**Mechanical Condition:** {{mechanical_condition}}  
**Accident History:** {{accident_history}}  
**Flood Damage:** {{flood_damage_history}}  
**Previous Use:** {{previous_use}}

### 6.2 Warranty Disclaimer

{{#if warranty_provided}}
**Warranty:** {{warranty_terms}}
{{else}}
**AS-IS SALE:** This vehicle is sold "AS-IS" with no warranties, express or implied. Buyer accepts the vehicle in its current condition and assumes all risks.
{{/if}}

### 6.3 Inspection Opportunity

{{#if inspection_allowed}}
Buyer has had the opportunity to inspect the vehicle and is satisfied with its condition.
{{/if}}

---

## 7. Disclosure Requirements

### 7.1 Odometer Disclosure

**Federal Odometer Statement:**

I, {{seller_name}}, state that the odometer reading of {{odometer_reading}} miles represents:

{{#if odometer_accurate}}
☑ The actual mileage of the vehicle
{{/if}}
{{#if odometer_exceeds_limit}}
☑ The mileage exceeds the odometer's mechanical limits
{{/if}}
{{#if odometer_not_actual}}
☑ The odometer reading is not the actual mileage (reason: {{odometer_discrepancy_reason}})
{{/if}}

### 7.2 Lemon Law Disclosure

{{lemon_law_disclosure}}

### 7.3 Environmental Disclosure

{{environmental_disclosure}}

---

## 8. Transfer of Ownership

### 8.1 Delivery

**Vehicle Location:** {{vehicle_location}}  
**Delivery Date:** {{delivery_date}}  
**Delivery Method:** {{delivery_method}}

### 8.2 Keys and Access

The following items are transferred with the vehicle:
- {{key_count}} vehicle keys
- {{#if remote_fobs}}{{remote_fob_count}} remote key fobs{{/if}}
- {{#if garage_remotes}}{{garage_remote_count}} garage door remotes{{/if}}
- {{additional_access_items}}

### 8.3 Personal Property

Seller certifies that all personal property has been removed from the vehicle.

---

## 9. Legal Provisions

### 9.1 Governing Law

This Bill of Sale is governed by the laws of {{governing_state}}.

### 9.2 Binding Agreement

This document constitutes a binding agreement between Seller and Buyer.

### 9.3 Entire Agreement

This Bill of Sale represents the complete agreement and supersedes all prior negotiations.

### 9.4 Assignment

This agreement may not be assigned without written consent of both parties.

---

## 10. Acknowledgments

### 10.1 Seller Acknowledgments

Seller acknowledges:
- Receipt of payment in the amount of ${{sale_price}}
- Transfer of ownership to Buyer
- Responsibility to notify DMV of sale
- {{seller_acknowledgments}}

### 10.2 Buyer Acknowledgments

Buyer acknowledges:
- Acceptance of vehicle in current condition
- Responsibility for title transfer and registration
- Understanding of all terms and conditions
- {{buyer_acknowledgments}}

---

## 11. Notarization

{{#if notarization_required}}
**Notary Requirements:** This document requires notarization in {{governing_state}}.

**Notary Section:**

State of {{notary_state}}  
County of {{notary_county}}

On {{notary_date}}, before me personally appeared {{seller_name}} and {{buyer_name}}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities.

**Notary Public:** ______________________________  
**Commission Expires:** {{notary_commission_expires}}  
**Notary Seal:** [SEAL]
{{/if}}

---

## 12. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Vehicle Bill of Sale on {{sale_date}}.

**SELLER:**

| Signature                                  | Date         |
| ------------------------------------------ | ------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{sale_date}} |
| {{seller_name}}                            |              |
| Print Name: {{seller_name}}                |              |

**BUYER:**

| Signature                                  | Date         |
| ------------------------------------------ | ------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{sale_date}} |
| {{buyer_name}}                             |              |
| Print Name: {{buyer_name}}                 |              |

{{#if witness_required}}
**WITNESS:**

| Signature                                  | Date         |
| ------------------------------------------ | ------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{sale_date}} |
| {{witness_name}}                           |              |
| Print Name: {{witness_name}}               |              |
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This Vehicle Bill of Sale should be reviewed for compliance with state DMV requirements and local laws. Both parties should retain copies and complete all necessary title transfer and registration procedures promptly.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
