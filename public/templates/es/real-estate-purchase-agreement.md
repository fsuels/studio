# Contrato de Compraventa de Bienes Raíces

---

**CONTRATO DE COMPRAVENTA DE BIENES RAÍCES**

Este Contrato de Compraventa de Bienes Raíces ("Contrato") se celebra el **{{agreement_date}}**, entre:

- **Vendedor:** {{seller_name}}, {{seller_entity_type}} con domicilio en {{seller_address}}

- **Comprador:** {{buyer_name}}, {{buyer_entity_type}} con domicilio en {{buyer_address}}

Referidas colectivamente como las "Partes".

---

## 1. Descripción de la Propiedad

### 1.1 Dirección de la Propiedad
La propiedad sujeta a este Contrato está ubicada en:
**{{property_address}}**

### 1.2 Descripción Legal
**Descripción Legal:** {{legal_description}}
**ID de Parcela/APN:** {{parcel_id}}
**Condado:** {{property_county}}
**Estado:** {{property_state}}

### 1.3 Detalles de la Propiedad
- **Tipo de Propiedad:** {{property_type}}
- **Año de Construcción:** {{year_built}}
- **Pies Cuadrados:** {{square_footage}} pies²
- **Tamaño del Lote:** {{lot_size}}
- **Recámaras:** {{bedrooms}}
- **Baños:** {{bathrooms}}

### 1.4 Artículos Incluidos
Los siguientes artículos están incluidos en la venta:
{{included_items}}

### 1.5 Artículos Excluidos
Los siguientes artículos están excluidos de la venta:
{{excluded_items}}

---

## 2. Precio de Compra y Términos Financieros

### 2.1 Precio de Compra
El precio total de compra para la Propiedad es: **${{purchase_price}}**

### 2.2 Estructura de Pago
**Dinero en Serio:** ${{earnest_money}} vencido al ejecutar este Contrato
**Enganche:** ${{down_payment}} vencido al cierre
**Monto de Financiamiento:** ${{financing_amount}}
**Efectivo al Cierre:** ${{cash_at_closing}}

### 2.3 Depósito de Dinero en Serio
- **Monto:** ${{earnest_money}}
- **Fecha de Vencimiento:** {{earnest_money_due_date}}
- **Retenido Por:** {{earnest_money_holder}}
- **Cuenta:** {{earnest_money_account}}

### 2.4 Contingencia de Financiamiento
{{#if financing_contingency}}
Este Contrato está contingente a que el Comprador obtenga financiamiento como sigue:
- **Tipo de Préstamo:** {{loan_type}}
- **Monto del Préstamo:** ${{loan_amount}}
- **Tasa de Interés:** No exceder {{max_interest_rate}}%
- **Término del Préstamo:** {{loan_term}} años
- **Fecha Límite de Financiamiento:** {{financing_deadline}}
{{else}}
Esta es una compra en efectivo sin contingencia de financiamiento.
{{/if}}

---

## 3. Contingencias y Condiciones

### 3.1 Contingencia de Inspección
{{#if inspection_contingency}}
**Período de Inspección:** {{inspection_period}} días desde la ejecución
**Selección de Inspector:** Elección del Comprador de inspector calificado
**Alcance de Inspección:** {{inspection_scope}}
**Período de Resolución:** {{inspection_resolution_period}} días después del reporte de inspección
{{else}}
La propiedad se vende "como está" sin contingencia de inspección.
{{/if}}

### 3.2 Contingencia de Avalúo
{{#if appraisal_contingency}}
Este Contrato está contingente a que la Propiedad se avalúe en o por encima del precio de compra dentro de {{appraisal_period}} días.
{{/if}}

### 3.3 Contingencia de Título
La venta está contingente a la aprobación del Comprador del título dentro de {{title_review_period}} días. El título debe ser comercializable y asegurable.

### 3.4 Contingencia de Topografía
{{#if survey_contingency}}
**Topografía Requerida:** {{survey_type}}
**Período de Topografía:** {{survey_period}} días
**Estándares de Topografía:** {{survey_standards}}
{{/if}}

### 3.5 Contingencia de HOA/Condominio
{{#if hoa_contingency}}
El Comprador tendrá {{hoa_review_period}} días para revisar documentos de HOA incluyendo:
- Estatutos y convenios de HOA
- Estados financieros
- Actas de reuniones
- Cronogramas de evaluación
{{/if}}

---

## 4. Condición de la Propiedad y Divulgaciones

### 4.1 Condición de la Propiedad
El Vendedor representa que la Propiedad está en la siguiente condición:
{{property_condition_description}}

### 4.2 Defectos Conocidos
El Vendedor divulga los siguientes defectos o problemas conocidos:
{{known_defects}}

### 4.3 Divulgaciones Ambientales
{{#if environmental_disclosures}}
Condiciones ambientales divulgadas:
{{environmental_disclosures_list}}
{{/if}}

### 4.4 Divulgación de Pintura con Plomo
{{#if lead_paint_disclosure}}
Para propiedades construidas antes de 1978: {{lead_paint_disclosure_details}}
{{/if}}

### 4.5 Servicios Públicos y Sistemas
- **Calefacción:** {{heating_system}}
- **Aire Acondicionado:** {{cooling_system}}
- **Plomería:** {{plumbing_system}}
- **Eléctrico:** {{electrical_system}}
- **Fuente de Agua:** {{water_source}}
- **Drenaje/Séptico:** {{sewer_system}}

---

## 5. Detalles del Cierre

### 5.1 Fecha de Cierre
El cierre tendrá lugar en o antes del **{{closing_date}}** a las {{closing_time}} en la oficina de {{closing_agent}}.

### 5.2 Agente de Cierre
**Compañía de Títulos/Abogado:** {{closing_agent_name}}
**Dirección:** {{closing_agent_address}}
**Contacto:** {{closing_agent_contact}}

### 5.3 Posesión
La posesión de la Propiedad será entregada al Comprador:
{{#if possession_at_closing}}
Al cierre al registrar la escritura
{{else}}
El {{possession_date}} a las {{possession_time}}
{{/if}}

### 5.4 Prorrateos
Los siguientes artículos serán prorrateados a la fecha de cierre:
- Impuestos a la propiedad
- Cuotas de HOA (si aplica)
- Servicios públicos (si se asumen)
- {{additional_prorations}}

---

## 6. Título y Escritura

### 6.1 Seguro de Título
{{#if buyer_title_insurance}}
El Comprador obtendrá seguro de título del propietario por el monto del precio de compra.
{{/if}}

{{#if seller_title_insurance}}
El Vendedor proporcionará seguro de título como sigue: {{seller_title_insurance_details}}
{{/if}}

### 6.2 Tipo de Escritura
El Vendedor transferirá el título por: {{deed_type}}

### 6.3 Excepciones de Título
El título estará sujeto solamente a:
- Asuntos de registro aceptables para el Comprador
- Impuestos a la propiedad del año actual
- {{acceptable_title_exceptions}}

### 6.4 Problemas de Título
Si se descubren problemas de título, el Vendedor tendrá {{title_cure_period}} días para curar tales problemas.

---

## 7. Costos de Cierre

### 7.1 Costos del Vendedor
El Vendedor pagará los siguientes costos de cierre:
- {{seller_closing_cost_1}}
- {{seller_closing_cost_2}}
- {{seller_closing_cost_3}}
- Comisión de bienes raíces: {{commission_rate}}%

### 7.2 Costos del Comprador
El Comprador pagará los siguientes costos de cierre:
- {{buyer_closing_cost_1}}
- {{buyer_closing_cost_2}}
- {{buyer_closing_cost_3}}
- Tarifas y costos de originación de préstamo

### 7.3 Costos Compartidos
Los siguientes costos serán compartidos igualmente:
{{shared_closing_costs}}

---

## 8. Incumplimiento y Remedios

### 8.1 Incumplimiento del Comprador
Si el Comprador incumple, el Vendedor puede:
- Retener el dinero en serio como daños liquidados
- Buscar cumplimiento específico
- Buscar otros remedios legales

### 8.2 Incumplimiento del Vendedor
Si el Vendedor incumple, el Comprador puede:
- Buscar devolución del dinero en serio
- Buscar cumplimiento específico
- Buscar daños
- Otros remedios legales

### 8.3 Resolución de Disputas
{{#if arbitration}}
Las disputas serán resueltas a través de arbitraje vinculante en {{arbitration_location}}.
{{else}}
Las disputas serán resueltas en las cortes de {{jurisdiction}}.
{{/if}}

---

## 9. Términos y Condiciones Adicionales

### 9.1 El Tiempo es Esencial
El tiempo es esencial respecto a todas las fechas y plazos en este Contrato.

### 9.2 Extensiones
Cualquier extensión debe ser acordada por escrito por ambas partes.

### 9.3 Cesión
{{#if assignment_allowed}}
Este Contrato puede ser cedido por el Comprador con consentimiento escrito del Vendedor.
{{else}}
Este Contrato no puede cederse sin consentimiento escrito de ambas partes.
{{/if}}

### 9.4 Supervivencia
Las siguientes disposiciones sobrevivirán al cierre:
- Garantías y representaciones
- Divulgaciones ambientales
- {{surviving_provisions}}

---

## 10. Riesgo de Pérdida

### 10.1 Seguro
{{#if seller_maintains_insurance}}
El Vendedor mantendrá seguro en la Propiedad hasta el cierre.
{{/if}}

### 10.2 Daño Antes del Cierre
Si la Propiedad es dañada antes del cierre:
- Daño menor al {{minor_damage_threshold}}% del precio de compra: El Vendedor repara
- Daño mayor al {{major_damage_threshold}}% del precio de compra: El Comprador puede terminar
- Ganancias del seguro asignadas a {{insurance_proceeds_recipient}}

---

## 11. Representaciones y Garantías

### 11.1 Representaciones del Vendedor
El Vendedor representa y garantiza:
- Autoridad legal para vender la Propiedad
- No hay acciones legales pendientes que afecten la Propiedad
- No hay violaciones de zonificación o códigos de construcción
- {{additional_seller_representations}}

### 11.2 Representaciones del Comprador
El Comprador representa y garantiza:
- Autoridad legal para comprar la Propiedad
- Recursos financieros adecuados para completar la compra
- {{additional_buyer_representations}}

---

## 12. Disposiciones Generales

### 12.1 Ley Aplicable
Este Contrato se regirá por las leyes de {{governing_state}}.

### 12.2 Acuerdo Completo
Este Contrato constituye el acuerdo completo y reemplaza todas las negociaciones previas.

### 12.3 Modificación
Este Contrato solo puede modificarse por escrito firmado por ambas partes.

### 12.4 Separabilidad
Si alguna disposición se considera inválida, el resto permanecerá en vigor.

### 12.5 Avisos
Todos los avisos deben ser por escrito y entregados a las direcciones especificadas arriba.

### 12.6 Contrapartes
Este Contrato puede firmarse en contrapartes, incluyendo firmas electrónicas.

---

## 13. Firmas

**EN FE DE LO CUAL**, las partes han ejecutado este Contrato en la fecha arriba escrita.

**VENDEDOR:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{seller_name}} | |
| {{seller_title}} | |

**COMPRADOR:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{buyer_name}} | |
| {{buyer_title}} | |

---

**AVISO LEGAL IMPORTANTE:** Este contrato de compraventa de bienes raíces debe ser revisado por profesionales inmobiliarios calificados y asesoría legal para asegurar cumplimiento con leyes locales y estatales. Las transacciones de bienes raíces involucran consideraciones legales y financieras significativas.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*