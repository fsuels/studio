# Factura

---

**FACTURA**

**Factura n.º:** {{invoice_number}}  
**Fecha:** {{invoice_date}}  
**Fecha de vencimiento:** {{due_date}}

---

## Cliente

**{{client_name}}**  
{{client_address}}  
{{client_city}}, {{client_state}} {{client_zip}}  
{{client_country}}

**Contacto:**  
**Correo electrónico:** {{client_email}}  
**Teléfono:** {{client_phone}}  
**ID fiscal/VAT:** {{client_tax_id}}

---

## Emisor

**{{business_name}}**  
{{business_address}}  
{{business_city}}, {{business_state}} {{business_zip}}  
{{business_country}}

**Contacto:**  
**Correo electrónico:** {{business_email}}  
**Teléfono:** {{business_phone}}  
**Sitio web:** {{business_website}}  
**ID fiscal/EIN:** {{business_tax_id}}

---

## Información del proyecto o pedido

**Nombre del proyecto:** {{project_name}}  
**Orden de compra n.º:** {{purchase_order_number}}  
**Referencia n.º:** {{reference_number}}  
**Representante de ventas:** {{sales_rep_name}}

---

## Conceptos y servicios

| Descripción                | Cantidad               | Tarifa              | Importe             |
| -------------------------- | ---------------------- | ------------------- | ------------------ |
| {{item_1_description}}     | {{item_1_quantity}}    | ${{item_1_rate}}    | ${{item_1_amount}} |
| {{#if item_2_description}} | {{item_2_description}} | {{item_2_quantity}} | ${{item_2_rate}}   | ${{item_2_amount}} | {{/if}} |
| {{#if item_3_description}} | {{item_3_description}} | {{item_3_quantity}} | ${{item_3_rate}}   | ${{item_3_amount}} | {{/if}} |
| {{#if item_4_description}} | {{item_4_description}} | {{item_4_quantity}} | ${{item_4_rate}}   | ${{item_4_amount}} | {{/if}} |
| {{#if item_5_description}} | {{item_5_description}} | {{item_5_quantity}} | ${{item_5_rate}}   | ${{item_5_amount}} | {{/if}} |

{{additional_items}}

---

## Desglose de costos

### Subtotales

**Subtotal:** ${{subtotal}}

### Descuentos

{{#if discount_applied}}
**Descuento ({{discount_percentage}}%):** -${{discount_amount}}  
**Descripción del descuento:** {{discount_description}}
{{else}}
**Descuento:** $0.00
{{/if}}

### Impuestos

{{#if tax_applicable}}
**Impuesto sobre ventas ({{tax_rate}}%):** ${{sales_tax_amount}}  
**Jurisdicción fiscal:** {{tax_jurisdiction}}  
{{#if additional_taxes}}
**Impuestos adicionales:** ${{additional_tax_amount}}  
**Descripción:** {{additional_tax_description}}
{{/if}}
{{else}}
**Impuesto:** $0.00
{{/if}}

### Envío y manejo

{{#if shipping_charges}}
**Envío:** ${{shipping_amount}}  
**Manejo:** ${{handling_amount}}  
**Método de envío:** {{shipping_method}}
{{else}}
**Envío y manejo:** $0.00
{{/if}}

### Otros cargos

{{#if other_fees}}
{{other_fees_breakdown}}
{{else}}
**Otros cargos:** $0.00
{{/if}}

---

## Importe total a pagar

|                         | Importe                   |
| ----------------------- | ------------------------- |
| **Subtotal**            | ${{subtotal}}             |
| **Descuento**           | -${{discount_amount}}     |
| **Impuestos**           | ${{total_tax_amount}}     |
| **Envío y manejo**      | ${{total_shipping_amount}}|
| **Otros cargos**        | ${{other_fees_total}}     |
| **TOTAL A PAGAR**       | **${{total_amount_due}}** |

---

## Información de pago

### Condiciones de pago

- **Plazo:** {{payment_terms}}  
- **Método(s) aceptado(s):** {{accepted_payment_methods}}  
- **Instrucciones de pago:** {{payment_instructions}}

### Detalles bancarios

{{#if bank_transfer_details}}
**Nombre del banco:** {{bank_name}}  
**Número de cuenta:** {{bank_account_number}}  
**Número de ruta/ABA:** {{bank_routing_number}}  
**SWIFT/BIC:** {{bank_swift}}  
**Referencia obligatoria:** {{payment_reference}}
{{/if}}

### Pagos en línea

{{#if online_payment_link}}
Puede completar su pago en línea en: {{online_payment_link}}
{{/if}}

### Pagos parciales

{{#if partial_payment_terms}}
Se permiten pagos parciales conforme a: {{partial_payment_terms}}
{{else}}
Se requiere el pago completo para cerrar la factura.
{{/if}}

---

## Mensaje al cliente

{{customer_message}}

---

## Políticas y condiciones

### Política de devoluciones

{{return_policy}}

### Política de reembolsos

{{refund_policy}}

### Política de garantías

{{#if warranty_policy}}
{{warranty_policy}}
{{/if}}

---

## Información de contacto

### ¿Preguntas sobre la factura?

**Contacto:** {{billing_contact_name}}  
**Teléfono:** {{billing_contact_phone}}  
**Correo:** {{billing_contact_email}}  
**Horario:** {{business_hours}}

### Departamento de facturación

{{#if separate_billing_contact}}
**Contacto de facturación:** {{billing_department_contact}}  
**Teléfono:** {{billing_department_phone}}  
**Correo:** {{billing_department_email}}
{{/if}}

---

## Información empresarial

### Registro de la empresa

**Licencia comercial n.º:** {{business_license_number}}  
**Estado de constitución:** {{state_of_incorporation}}  
**ID fiscal federal:** {{federal_tax_id}}

{{#if professional_licenses}}

### Licencias profesionales

{{professional_license_information}}
{{/if}}

---

## Anexos

{{#if has_attachments}}
**Documentos de respaldo:**

- {{attachment_1}}
- {{attachment_2}}
- {{attachment_3}}
{{additional_attachments}}
{{else}}
No se adjuntaron documentos adicionales.
{{/if}}

---

## Uso interno

**ID del cliente:** {{customer_id}}  
**Factura creada por:** {{created_by}}  
**Territorio de ventas:** {{sales_territory}}  
**Porcentaje de comisión:** {{commission_rate}}%

---

## Registro de pagos

**Uso contable:**

| Fecha de pago | Importe pagado | Método de pago | Cheque/Transacción n.º | Saldo restante       |
| ------------- | -------------- | -------------- | ---------------------- | -------------------- |
|               |                |                |                        | ${{total_amount_due}}|
|               |                |                |                        |                      |
|               |                |                |                        |                      |

---

## Talón de remisión

{{#if remittance_copy}}
**COPIA DE REMISIÓN – FAVOR DEVOLVER CON EL PAGO**

**Factura n.º:** {{invoice_number}}  
**Fecha de emisión:** {{invoice_date}}  
**Importe a pagar:** ${{total_amount_due}}  
**Fecha de vencimiento:** {{due_date}}

**Enviar a:**  
{{business_name}}  
{{remittance_address}}

**Importe pagado:** $ ______________  
**Cheque n.º:** ______________  
**Fecha de pago:** ______________
{{/if}}

---

## Avisos legales importantes

### Aviso de cobranza

{{#if collection_notice}}
**AVISO:** Las cuentas vencidas pueden ser objeto de acciones de cobranza, incluyendo reportes de crédito, agencias externas y procesos legales. Los costos adicionales de cobranza podrán añadirse a su cuenta.
{{/if}}

### Resolución de disputas

{{#if dispute_procedure}}
**Disputas:** Cualquier aclaración sobre esta factura debe presentarse dentro de {{dispute_period}} días a {{dispute_contact}}.
{{/if}}

### Ley aplicable

Esta factura se regirá por las leyes de {{governing_state}}.

---

**AVISO LEGAL IMPORTANTE:** Revise esta factura cuidadosamente. Comuníquese con nosotros de inmediato si detecta discrepancias. El pago implica aceptación de los bienes/servicios y de los términos expuestos.

## _Factura generada por 123LegalDoc - Plataforma Profesional de Documentos Legales_

(c) 2025 123LegalDoc · Documento de autoayuda · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
