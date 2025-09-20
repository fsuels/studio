# Contrato de Arrendamiento Comercial

---

**CONTRATO DE ARRENDAMIENTO COMERCIAL**

Este Contrato de Arrendamiento Comercial ("Contrato") se celebra el **{{lease_date}}** entre:

- **Arrendador:** {{landlord_name}}, una {{landlord_entity_type}} constituida conforme a las leyes de {{landlord_state}}, con domicilio principal en {{landlord_address}}

- **Arrendatario:** {{tenant_name}}, una {{tenant_entity_type}} constituida conforme a las leyes de {{tenant_state}}, con domicilio principal en {{tenant_address}}

Denominados conjuntamente las "Partes".

---

## 1. Descripción del inmueble

### 1.1 Inmueble arrendado

**Domicilio del inmueble:** {{property_address}}  
**Ciudad:** {{city}}, **Estado:** {{state}}, **ZIP:** {{zip_code}}  
**Descripción legal:** {{legal_description}}

### 1.2 Detalles de la propiedad

**Nombre del edificio:** {{building_name}}  
**Número de suite/unidad:** {{suite_number}}  
**Superficie total:** {{total_square_feet}} pies cuadrados  
**Superficie útil:** {{usable_square_feet}} pies cuadrados  
**Tipo de inmueble:** {{property_type}} (Oficina/Comercio/Industrial/Bodega/Otro)

### 1.3 Áreas incluidas

**Áreas comunes:** {{common_areas}}  
**Estacionamientos asignados:** {{parking_spaces}} espacios  
**Áreas de almacenamiento:** {{storage_areas}}  
**Otros elementos incluidos:** {{other_inclusions}}

---

## 2. Términos del arrendamiento

### 2.1 Plazo

**Tipo de arrendamiento:** {{lease_type}} (Bruto/Neto/Bruto modificado/Triple neto)  
**Fecha de inicio:** {{commencement_date}}  
**Fecha de vencimiento:** {{expiration_date}}  
**Duración total:** {{lease_term_years}} años, {{lease_term_months}} meses

### 2.2 Opciones de renovación

{{#if renewal_options}}
**Renovaciones:** El Arrendatario tendrá {{renewal_option_count}} opción(es) para renovar por {{renewal_term}} cada una, sujetas a {{renewal_terms}}.  
**Aviso de renovación:** Se requiere notificación escrita con {{renewal_notice_days}} días de anticipación.  
**Renta en renovación:** {{renewal_rent_terms}}
{{else}}
**Sin opciones de renovación** incluidas en este Contrato.
{{/if}}

---

## 3. Renta y cargos adicionales

### 3.1 Renta base

**Renta base anual:** ${{annual_base_rent}}  
**Renta base mensual:** ${{monthly_base_rent}}  
**Tarifa por pie cuadrado:** ${{rent_per_sq_ft}} por pie cuadrado anual  
**Fecha de inicio de renta:** {{rent_commencement_date}}

### 3.2 Condiciones de pago de renta

**Fecha de vencimiento:** {{rent_due_date}} de cada mes  
**Método de pago:** {{payment_method}}  
**Dirección de pago:** {{payment_address}}  
**Cargo por mora:** {{late_fee_percentage}}% de la renta mensual o ${{late_fee_amount}}, el monto que sea mayor  
**Periodo de gracia:** {{grace_period}} días

### 3.3 Incrementos de renta

{{#if rent_increases}}
**Ajuste de renta:** {{rent_escalation_type}}

- **Incremento anual:** {{annual_increase_percentage}}% por año
- **Ajuste por IPC:** {{#if cpi_adjustment}}Basado en el Índice de Precios al Consumidor{{/if}}
- **Revisión a valor de mercado:** {{#if market_rate_review}}Cada {{market_review_years}} años{{/if}}
  {{/if}}

### 3.4 Renta adicional y gastos operativos

{{#if operating_expenses}}
**Gastos operativos:** Participación proporcional del Arrendatario: {{tenant_expense_percentage}}%

**Gastos operativos incluidos:**

- Impuestos y contribuciones sobre la propiedad
- Primas de seguros
- Mantenimiento de áreas comunes (CAM)
- Servicios públicos de áreas comunes
- Honorarios de administración del inmueble
- Reparaciones y mantenimiento
- {{additional_operating_expenses}}

**Tope de gastos:** ${{expense_stop}} por pie cuadrado anualmente  
**Conciliación:** Se entregará conciliación anual a más tardar el {{reconciliation_date}}
{{/if}}

---

## 4. Depósito de garantía y otros depósitos

### 4.1 Depósito de garantía

**Monto del depósito:** ${{security_deposit}}  
**Finalidad:** Garantizar el cumplimiento de las obligaciones del Arrendatario  
**Devolución:** Dentro de {{deposit_return_days}} días posteriores a la terminación del arrendamiento, menos deducciones legales

### 4.2 Depósitos adicionales

{{#if additional_deposits}}
**Renta del primer mes:** ${{monthly_base_rent}}  
**Renta del último mes:** {{#if last_month_required}}${{monthly_base_rent}}{{else}}No requerida{{/if}}  
**Depósitos de servicios:** {{utility_deposits}}  
**Depósito por llaves:** ${{key_deposit}}
{{/if}}

---

## 5. Uso permitido y restricciones

### 5.1 Uso permitido

**Uso principal:** {{permitted_use}}  
**Tipo de negocio:** {{business_type}}  
**Horario de operación:** {{operating_hours}}  
**Clasificación de zonificación:** {{zoning_classification}}

### 5.2 Usos prohibidos

El Arrendatario no podrá utilizar el inmueble para:  
{{prohibited_uses}}

### 5.3 Acuerdos de uso exclusivo

{{#if exclusive_use}}
**Derechos exclusivos:** {{exclusive_use_description}}
{{/if}}

---

## 6. Servicios y suministros

### 6.1 Servicios proporcionados por el Arrendador

{{landlord_utilities}}

### 6.2 Servicios proporcionados por el Arrendatario

{{tenant_utilities}}

### 6.3 HVAC fuera de horario

{{#if after_hours_hvac}}
**Tarifa:** ${{hvac_hourly_rate}} por hora  
**Aviso requerido:** {{hvac_notice_hours}} horas de anticipación
{{/if}}

---

## 7. Mantenimiento y reparaciones

### 7.1 Responsabilidades del Arrendador

El Arrendador mantendrá y reparará:

- Componentes estructurales del edificio
- Techo y muros exteriores
- Áreas y servicios comunes
- Sistemas del edificio (HVAC, eléctrico, plomería) que sirvan a múltiples arrendatarios
- {{landlord_maintenance_items}}

### 7.2 Responsabilidades del Arrendatario

El Arrendatario mantendrá y reparará:

- El interior del inmueble arrendado
- Instalaciones y equipos instalados por el Arrendatario
- Sistemas HVAC que atiendan únicamente al inmueble
- {{tenant_maintenance_items}}

### 7.3 Reparaciones de emergencia

**Contacto de emergencia:** {{emergency_contact}}  
**Teléfono de emergencia:** {{emergency_phone}}

---

## 8. Requisitos de seguro

### 8.1 Seguros del Arrendador

El Arrendador mantendrá:

- Seguro de propiedad que cubra el edificio
- Seguro de responsabilidad civil general: ${{landlord_liability_minimum}}
- {{landlord_additional_insurance}}

### 8.2 Seguros del Arrendatario

El Arrendatario mantendrá:

- **Responsabilidad civil general:** ${{tenant_liability_minimum}} por incidente
- **Seguro de bienes:** Cobertura total de reposición de los bienes del Arrendatario
- **Interrupción de negocio:** {{#if business_interruption_required}}${{business_interruption_amount}}{{else}}No requerido{{/if}}
- **Seguro de riesgos laborales:** Conforme a la ley aplicable

### 8.3 Asegurados adicionales

{{#if additional_insured_required}}
El Arrendador deberá figurar como asegurado adicional en las pólizas de responsabilidad del Arrendatario.
{{/if}}

---

## 9. Modificaciones y mejoras

### 9.1 Mejoras del Arrendatario

**Requiere aprobación:** Toda alteración requiere consentimiento previo y por escrito del Arrendador  
**Mejoras permitidas:** {{permitted_improvements}}  
**Estándares de mejora:** {{improvement_standards}}

### 9.2 Obligaciones de restitución

{{#if restoration_required}}
Al finalizar el arrendamiento, el Arrendatario restituirá el inmueble a su condición original, salvo desgaste normal.
{{/if}}

### 9.3 Mejoras del Arrendador

{{#if landlord_improvements}}
**Asignación para mejoras:** ${{improvement_allowance}} por pie cuadrado  
**Fecha de conclusión:** {{improvement_completion_date}}
{{/if}}

---

## 10. Cesiones y subarrendamientos

### 10.1 Restricciones a la cesión

**Regla general:** El Arrendatario no podrá ceder este Contrato sin el consentimiento previo y por escrito del Arrendador.

### 10.2 Restricciones al subarrendamiento

**Subarrendamiento:** Permitido con {{subletting_approval_requirement}}  
**Cuota por subarrendar:** ${{subletting_fee}}  
**Participación en utilidades:** {{#if profit_sharing}}{{profit_sharing_percentage}}% de las utilidades a favor del Arrendador{{/if}}

---

## 11. Incumplimientos y remedios

### 11.1 Supuestos de incumplimiento

Constituyen incumplimiento del Arrendatario:

- Falta de pago de la renta durante {{default_cure_period}} días después de la notificación escrita
- Violación de términos del contrato no subsanada dentro de {{lease_violation_cure_period}} días tras notificación escrita
- Bancarrota o insolvencia del Arrendatario
- {{additional_default_events}}

### 11.2 Remedios del Arrendador

Ante un incumplimiento, el Arrendador podrá:

- Dar por terminado este Contrato
- Recuperar la posesión y volver a arrendar el inmueble
- Cobrar toda renta y daños pendientes
- Ejercer cualquier otro remedio legal o equitativo

### 11.3 Pago tardío

**Cargo por mora:** {{late_fee_percentage}}% del monto vencido  
**Interés:** {{interest_rate}}% anual sobre montos atrasados

---

## 12. Acceso e inspecciones

### 12.1 Derechos de acceso del Arrendador

El Arrendador podrá ingresar al inmueble:

- Con {{inspection_notice_hours}} horas de aviso para inspecciones
- Sin aviso en caso de emergencia
- Para mostrar el inmueble a posibles arrendatarios/compradores con aviso razonable
- {{additional_access_rights}}

### 12.2 Horarios de acceso

**Horario laboral habitual:** {{access_hours}}  
**Acceso fuera de horario:** {{after_hours_access_policy}}

---

## 13. Cumplimiento ambiental y de seguridad

### 13.1 Cumplimiento ambiental

Ambas Partes cumplirán con todas las leyes y regulaciones ambientales aplicables.

### 13.2 Materiales peligrosos

**Prohibición:** {{hazardous_materials_policy}}  
**Declaración del Arrendatario:** El Arrendatario certifica que no utilizará, almacenará ni desechará materiales peligrosos en el inmueble sin los permisos correspondientes.

### 13.3 Cumplimiento ADA

{{ada_compliance_responsibility}}

---

## 14. Daños y expropiación

### 14.1 Daños por siniestro

En caso de daños por incendio u otro siniestro:  
{{casualty_provisions}}

### 14.2 Expropiación

Si el inmueble es expropiado por dominio eminente:  
{{condemnation_provisions}}

---

## 15. Estacionamiento

### 15.1 Asignación de estacionamientos

**Espacios asignados:** {{assigned_parking_spaces}}  
**Espacios para visitantes:** {{visitor_parking_spaces}}  
**Cuota de estacionamiento:** {{#if parking_fee}}${{parking_fee_amount}} por espacio al mes{{else}}Incluido en la renta{{/if}}

### 15.2 Reglas de estacionamiento

{{parking_rules}}

---

## 16. Señalización

### 16.1 Señalización permitida

{{signage_rights}}

### 16.2 Aprobación de señalización

Toda señalización requiere la aprobación previa y por escrito del Arrendador y debe cumplir con las ordenanzas locales.

---

## 17. Disposiciones generales

### 17.1 Ley aplicable

Este Contrato se regirá por las leyes de {{governing_state}}.

### 17.2 Contrato íntegro

Este Contrato constituye el acuerdo completo entre las Partes.

### 17.3 Modificaciones

Este Contrato solo podrá modificarse mediante acuerdo escrito firmado por ambas Partes.

### 17.4 Divisibilidad

Si alguna disposición se declara inválida, el resto permanecerá en pleno vigor y efecto.

### 17.5 Carácter vinculante

Este Contrato obliga a las Partes, sus herederos, sucesores y cesionarios.

---

## 18. Disposiciones especiales

{{special_provisions}}

---

## Firmas

## 19. Firmas

**EN FE DE LO CUAL**, las Partes firman este Contrato de Arrendamiento Comercial en la fecha mencionada al inicio.

**ARRENDADOR:**

| Firma | Fecha |
| ------------------------------------------ | -------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{lease_date}} |
| {{landlord_name}} | |
| Por: {{landlord_signatory}} | |
| Cargo: {{landlord_title}} | |

**ARRENDATARIO:**

| Firma | Fecha |
| ------------------------------------------ | -------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{lease_date}} |
| {{tenant_name}} | |
| Por: {{tenant_signatory}} | |
| Cargo: {{tenant_title}} | |

---

### Notarización

**Estado de {{state}}**  
**Condado de {{county}}**

[Se incluirá el bloque de notarización estándar exigido por la ley estatal]

---

**AVISO LEGAL IMPORTANTE:** Este contrato de arrendamiento comercial debe ser revisado por asesoría legal calificada para garantizar el cumplimiento con las leyes locales y las necesidades específicas del negocio. Los términos de los arrendamientos comerciales varían significativamente según la ubicación y el tipo de propiedad.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
