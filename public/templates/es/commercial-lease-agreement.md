# Contrato de Arrendamiento Comercial / Commercial Lease Agreement

---

**CONTRATO DE ARRENDAMIENTO COMERCIAL**

Este Contrato de Arrendamiento Comercial ("Arrendamiento") se celebra el **{{lease_date}}**, entre:

- **Arrendador:** {{landlord_name}}, entidad {{landlord_entity_type}} organizada conforme a las leyes de {{landlord_state}}, con domicilio principal en {{landlord_address}}
- **Arrendatario:** {{tenant_name}}, entidad {{tenant_entity_type}} organizada conforme a las leyes de {{tenant_state}}, con domicilio principal en {{tenant_address}}

En adelante, las "Partes".

---

## 1. Descripcion del Inmueble / Premises Description

### 1.1 Inmueble Arrendado / Leased Premises

**Direccion:** {{property_address}}  
**Ciudad:** {{city}}, **Estado:** {{state}}, **Codigo Postal:** {{zip_code}}  
**Descripcion legal / Legal Description:** {{legal_description}}

### 1.2 Detalles del Edificio / Property Details

**Nombre del edificio:** {{building_name}}  
**Unidad o suite:** {{suite_number}}  
**Superficie total:** {{total_square_feet}} pies cuadrados  
**Superficie util:** {{usable_square_feet}} pies cuadrados  
**Tipo de inmueble / Property Type:** {{property_type}} (Oficina/Comercial/Industrial/Almacen/Otro)

### 1.3 Areas incluidas / Included Areas

**Areas comunes:** {{common_areas}}  
**Estacionamientos asignados:** {{parking_spaces}}  
**Bodegas/almacenaje:** {{storage_areas}}  
**Otras inclusiones:** {{other_inclusions}}

---

## 2. Plazo del Arrendamiento / Lease Terms

### 2.1 Periodo del arrendamiento / Lease Period

**Tipo de arrendamiento:** {{lease_type}} (Gross/Net/Modified Gross/Triple Net)  
**Inicio:** {{commencement_date}}  
**Vencimiento:** {{expiration_date}}  
**Duracion total:** {{lease_term_years}} anos y {{lease_term_months}} meses

### 2.2 Opciones de renovacion / Renewal Options

{{#if renewal_options}}
**Opciones:** El Arrendatario podra renovar {{renewal_option_count}} vez/veces por {{renewal_term}}, sujeto a {{renewal_terms}}.  
**Aviso de renovacion:** {{renewal_notice_days}} dias de anticipacion por escrito.  
**Renta durante renovacion:** {{renewal_rent_terms}}
{{else}}
**No existen opciones de renovacion** en este Arrendamiento.
{{/if}}

---

## 3. Renta y Cargos Adicionales / Rent and Additional Charges

### 3.1 Renta base / Base Rent

**Renta anual:** ${{annual_base_rent}}  
**Renta mensual:** ${{monthly_base_rent}}  
**Tarifa por pie cuadrado:** ${{rent_per_sq_ft}} por pie cuadrado anual  
**Inicio de renta:** {{rent_commencement_date}}

### 3.2 Condiciones de pago / Rent Payment Terms

**Fecha de pago:** {{rent_due_date}} de cada mes  
**Metodo de pago:** {{payment_method}}  
**Direccion de pago:** {{payment_address}}  
**Recargo por mora:** {{late_fee_percentage}}% o ${{late_fee_amount}} (lo que sea mayor)  
**Periodo de gracia:** {{grace_period}} dias

### 3.3 Incrementos de renta / Rent Increases

{{#if rent_increases}}
**Ajustes de renta:** {{rent_escalation_type}}

- **Incremento anual:** {{annual_increase_percentage}}% anual
- **Ajuste CPI:** {{#if cpi_adjustment}}Basado en el Indice de Precios al Consumidor{{/if}}
- **Revision a mercado:** {{#if market_rate_review}}Cada {{market_review_years}} anos{{/if}}
{{/if}}

### 3.4 Gastos operativos / Operating Expenses

{{#if operating_expenses}}
**Porcentaje del Arrendatario:** {{tenant_expense_percentage}}%

**Gastos incluidos:** impuestos, seguros, mantenimiento de areas comunes (CAM), servicios comunes, honorarios de administracion, reparaciones y {{additional_operating_expenses}}.

**Tope de gastos (Expense Stop):** ${{expense_stop}} por pie cuadrado anual  
**Conciliacion:** Informe anual antes de {{reconciliation_date}}
{{/if}}

---

## 4. Depositos / Security Deposit and Additional Deposits

### 4.1 Deposito en garantia / Security Deposit

**Monto:** ${{security_deposit}}  
**Aplicacion:** Garantizar el cumplimiento de obligaciones.  
**Devolucion:** Dentro de {{deposit_return_days}} dias tras la entrega, menos cargos autorizados.

### 4.2 Otros depositos / Additional Deposits

{{#if additional_deposits}}
- **Primer mes de renta:** ${{monthly_base_rent}}  
- **Ultimo mes de renta:** {{#if last_month_required}}${{monthly_base_rent}}{{else}}No requerido{{/if}}  
- **Depositos de servicios:** {{utility_deposits}}  
- **Deposito por llaves:** ${{key_deposit}}
{{/if}}

---

## 5. Uso y Operacion / Use and Operation

### 5.1 Uso autorizado / Permitted Use

{{permitted_use}}

### 5.2 Reglas del edificio / Building Rules

{{building_rules}}

### 5.3 Licencias y cumplimiento normativo / Compliance

El Arrendatario obtendra licencias aplicables y cumplira todas las leyes y ordenanzas.

---

## 6. Servicios y Mantenimiento / Services and Maintenance

### 6.1 Servicios incluidos / Included Services

{{utilities_and_services}}

### 6.2 Mantenimiento del Arrendatario / Tenant Maintenance

{{tenant_maintenance_obligations}}

### 6.3 Mantenimiento del Arrendador / Landlord Maintenance

{{landlord_maintenance_obligations}}

---

## 7. Mejoras y Alteraciones / Improvements and Alterations

### 7.1 Condicion inicial / Condition of Premises

{{initial_condition}}

### 7.2 Alteraciones / Alterations

{{alterations_clause}}

### 7.3 Mejoras permanentes / Leasehold Improvements

{{leasehold_improvements}}

---

## 8. Seguros e Indemnizacion / Insurance and Indemnification

### 8.1 Seguro del Arrendatario / Tenant Insurance

{{tenant_insurance_requirements}}

### 8.2 Seguro del Arrendador / Landlord Insurance

{{landlord_insurance_requirements}}

### 8.3 Indemnizacion / Indemnity

{{indemnification_clause}}

---

## 9. Cesion y Subarrendamiento / Assignment and Subletting

{{assignment_subletting_clause}}

---

## 10. Incumplimiento y Recursos / Default and Remedies

### 10.1 Eventos de incumplimiento

{{events_of_default}}

### 10.2 Recursos del Arrendador

{{landlord_remedies}}

### 10.3 Recursos del Arrendatario

{{tenant_remedies}}

---

## 11. Terminacion y Rescision / Termination

### 11.1 Terminacion anticipada

{{early_termination_clause}}

### 11.2 Desocupacion

{{surrender_clause}}

---

## 12. Notificaciones / Notices

**Direcciones de notificacion:**

- Arrendador: {{landlord_notice_address}}
- Arrendatario: {{tenant_notice_address}}

Metodo autorizado: {{notice_delivery_methods}}

---

## 13. Cumplimiento Ambiental y Seguridad / Environmental and Safety Compliance

### 13.1 Cumplimiento ambiental

{{environmental_compliance_clause}}

### 13.2 Materiales peligrosos

{{hazardous_materials_policy}}

### 13.3 Cumplimiento ADA

{{ada_compliance_responsibility}}

---

## 14. Siniestra y Expropiacion / Casualty and Condemnation

### 14.1 Danos por siniestro

{{casualty_provisions}}

### 14.2 Expropiacion

{{condemnation_provisions}}

---

## 15. Estacionamiento / Parking

### 15.1 Asignacion

- Espacios asignados: {{assigned_parking_spaces}}  
- Espacios para visitantes: {{visitor_parking_spaces}}  
- Cuota de estacionamiento: {{#if parking_fee}}${{parking_fee_amount}} por espacio al mes{{else}}Incluido en la renta{{/if}}

### 15.2 Normas de estacionamiento

{{parking_rules}}

---

## 16. Rotulacion / Signage

### 16.1 Rotulos permitidos

{{signage_rights}}

### 16.2 Aprobacion

Todo rotulo requiere aprobacion previa escrita del Arrendador y cumplimiento con normas locales.

---

## 17. Disposiciones Generales / General Provisions

### 17.1 Ley aplicable / Governing Law

Este contrato se rige por las leyes de {{governing_state}}.

### 17.2 Acuerdo integro / Entire Agreement

Este documento constituye el acuerdo completo entre las Partes.

### 17.3 Modificaciones / Amendment

Solo podra modificarse por escrito firmado por ambas Partes.

### 17.4 Divisibilidad / Severability

Si alguna clausula es invalida, las demas continuaran vigentes.

### 17.5 Obligaciones vinculantes / Binding Effect

Vincula a las Partes y a sus sucesores y cesionarios.

---

## 18. Disposiciones Especiales / Special Provisions

{{special_provisions}}

---

## Signatures / Firmas

## 19. Firmas / Signatures

**EN FE DE LO CUAL**, las Partes firman este Arrendamiento en la fecha indicada.

**ARRENDADOR / LANDLORD:**

| Firma                                   | Fecha           |
| --------------------------------------- | -------------- |
| ****************_****************       | {{lease_date}} |
| {{landlord_name}}                       |                |
| Por: {{landlord_signatory}}             |                |
| Cargo: {{landlord_title}}               |                |

**ARRENDATARIO / TENANT:**

| Firma                                   | Fecha           |
| --------------------------------------- | -------------- |
| ****************_****************       | {{lease_date}} |
| {{tenant_name}}                         |                |
| Por: {{tenant_signatory}}               |                |
| Cargo: {{tenant_title}}                 |                |

---

### Reconocimiento Notarial / Notarization

**Estado de {{state}}**  
**Condado de {{county}}**

[Incluir bloque notarial conforme a la ley aplicable]

---

**IMPORTANT LEGAL NOTICE / AVISO LEGAL IMPORTANTE:** Este contrato debe revisarse con un profesional legal para asegurar cumplimiento con las normas locales y las necesidades comerciales especificas. Los arrendamientos comerciales varian segun la jurisdiccion y el tipo de inmueble.

_Ac 2025 123LegalDoc - Formulario de autoservicio - No es asesoramiento legal - Terminos: 123LegalDoc.com/terms_