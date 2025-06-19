# Contrato de Construcción

---

**CONTRATO DE CONSTRUCCIÓN**

Este Contrato de Construcción ("Contrato") se celebra el **{{agreement_date}}**, entre:

- **Propietario:** {{owner_name}}, una {{owner_entity_type}} con domicilio en {{owner_address}}

- **Contratista:** {{contractor_name}}, una {{contractor_entity_type}} organizada bajo las leyes de {{contractor_state}}, con su lugar principal de negocios en {{contractor_address}}

Referidas colectivamente como las "Partes."

---

## 1. Descripción del Proyecto

### 1.1 Resumen del Proyecto
**Nombre del Proyecto:** {{project_name}}
**Ubicación del Proyecto:** {{project_address}}
**Descripción del Proyecto:** {{project_description}}

### 1.2 Alcance del Trabajo
El Contratista acuerda proporcionar toda la mano de obra, materiales, equipos y servicios necesarios para:
{{scope_of_work}}

### 1.3 Documentos de Construcción
El trabajo se realizará de acuerdo con:
- **Planos:** {{plans_description}}
- **Especificaciones:** {{specifications_description}}
- **Permisos de Construcción:** {{permit_numbers}}
- **Códigos Aplicables:** {{building_codes}}

### 1.4 Detalles del Proyecto
- **Tipo de Proyecto:** {{project_type}}
- **Pies Cuadrados:** {{square_footage}} pies cuadrados
- **Número de Pisos:** {{number_of_stories}}
- **Características Especiales:** {{special_features}}

---

## 2. Precio del Contrato y Pago

### 2.1 Precio del Contrato
El precio total del contrato para el trabajo descrito aquí es: **${{total_contract_price}}**

### 2.2 Estructura de Pago
**Método de Pago:** {{payment_method}}
- {{#if fixed_price}}**Contrato de Precio Fijo:** El precio total incluye toda la mano de obra, materiales y costos{{/if}}
- {{#if cost_plus}}**Contrato de Costo Más:** Costos reales más {{markup_percentage}}% de margen{{/if}}
- {{#if unit_price}}**Contrato de Precio Unitario:** Basado en la cantidad de trabajo completado{{/if}}

### 2.3 Cronograma de Pagos
| Pago # | Descripción | Cantidad | Fecha de Vencimiento |
|--------|-------------|----------|---------------------|
| 1 | Pago Inicial | ${{down_payment}} | Al firmar |
| 2 | {{milestone_1_description}} | ${{milestone_1_amount}} | {{milestone_1_date}} |
| 3 | {{milestone_2_description}} | ${{milestone_2_amount}} | {{milestone_2_date}} |
| 4 | {{milestone_3_description}} | ${{milestone_3_amount}} | {{milestone_3_date}} |
| Final | Pago Final | ${{final_payment}} | Al completar |

### 2.4 Órdenes de Cambio
- Todos los cambios deben aprobarse por escrito
- Tarifa de orden de cambio: {{change_order_fee}}% de margen sobre trabajo adicional
- Ningún trabajo procederá sin orden de cambio firmada

### 2.5 Retención
{{#if retention}}
El Propietario puede retener {{retention_percentage}}% de cada pago hasta {{retention_release_condition}}.
{{/if}}

---

## 3. Tiempo de Desempeño

### 3.1 Inicio
El trabajo comenzará el **{{start_date}}** o dentro de {{commencement_days}} días después de recibir todos los permisos y aprobaciones necesarios.

### 3.2 Finalización
**Finalización Sustancial:** {{substantial_completion_date}}
**Finalización Final:** {{final_completion_date}}

### 3.3 Hitos Críticos
| Hito | Descripción | Fecha Objetivo | Penalidad |
|------|-------------|---------------|-----------|
| {{milestone_1_name}} | {{milestone_1_description}} | {{milestone_1_target}} | ${{milestone_1_penalty}}/día |
| {{milestone_2_name}} | {{milestone_2_description}} | {{milestone_2_target}} | ${{milestone_2_penalty}}/día |
| {{milestone_3_name}} | {{milestone_3_description}} | {{milestone_3_target}} | ${{milestone_3_penalty}}/día |

### 3.4 Extensiones de Tiempo
Se pueden otorgar extensiones de tiempo por:
- Retrasos climáticos que excedan {{weather_delay_threshold}} días
- Retrasos causados por el Propietario
- Cambios en el alcance
- Eventos de fuerza mayor

---

## 4. Materiales y Mano de Obra

### 4.1 Estándares de Materiales
Todos los materiales deberán ser:
- Nuevos a menos que se especifique lo contrario
- De acuerdo con las especificaciones del proyecto
- De buena calidad y libres de defectos
- Almacenados y protegidos adecuadamente

### 4.2 Adquisición de Materiales
{{#if contractor_provides_materials}}
**Responsabilidad del Contratista:** El Contratista proporcionará todos los materiales especificados en los documentos del contrato.
{{else}}
**Materiales Proporcionados por el Propietario:** El Propietario proporcionará los siguientes materiales: {{owner_furnished_materials}}
{{/if}}

### 4.3 Requisitos de Mano de Obra
- Todos los trabajadores deberán ser expertos en sus respectivos oficios
- El Contratista mantendrá fuerza laboral adecuada para cumplir el cronograma
- Todo trabajo cumplirá con requisitos de salario prevaleciente si aplica
- Calificaciones de trabajadores: {{worker_qualifications}}

### 4.4 Sustituciones
Las sustituciones de materiales requieren aprobación escrita y deben ser:
- Iguales o superiores en calidad
- Compatibles con el trabajo existente
- Aprobadas por el arquitecto/ingeniero si aplica

---

## 5. Permisos y Aprobaciones

### 5.1 Responsabilidad de Permisos
{{#if contractor_obtains_permits}}
**Responsabilidad del Contratista:** El Contratista obtendrá y pagará todos los permisos de construcción y aprobaciones necesarios.
{{else}}
**Responsabilidad del Propietario:** El Propietario obtendrá y pagará todos los permisos y aprobaciones necesarios.
{{/if}}

### 5.2 Cumplimiento de Códigos
Todo trabajo cumplirá con:
- Códigos y ordenanzas de construcción locales
- Regulaciones de construcción estatales
- Requisitos de seguridad federales
- Estándares de la industria: {{industry_standards}}

### 5.3 Inspecciones
- El Contratista programará todas las inspecciones requeridas
- El trabajo no procederá sin las aprobaciones requeridas
- Las inspecciones fallidas se corregirán a expensas del Contratista

---

## 6. Seguros y Fianzas

### 6.1 Requisitos de Seguros
El Contratista mantendrá los siguientes seguros:
- **Responsabilidad General:** ${{general_liability_amount}} por ocurrencia
- **Compensación de Trabajadores:** Según requerido por ley
- **Responsabilidad de Vehículos:** ${{auto_liability_amount}}
- **Riesgo del Constructor:** ${{builders_risk_amount}}

### 6.2 Fianza de Cumplimiento
{{#if performance_bond_required}}
El Contratista proporcionará una fianza de cumplimiento por el {{performance_bond_percentage}}% del precio del contrato.
{{/if}}

### 6.3 Fianza de Pago
{{#if payment_bond_required}}
El Contratista proporcionará una fianza de pago por el {{payment_bond_percentage}}% del precio del contrato.
{{/if}}

### 6.4 Certificado de Seguros
El Contratista proporcionará certificados de seguros nombrando al Propietario como asegurado adicional.

---

## 7. Seguridad y Condiciones del Sitio

### 7.1 Programa de Seguridad
El Contratista deberá:
- Mantener un programa integral de seguridad
- Cumplir con las regulaciones de OSHA
- Realizar reuniones regulares de seguridad
- Proporcionar equipo de seguridad requerido

### 7.2 Seguridad del Sitio
- Contratista responsable de la seguridad del sitio durante horas laborales
- Propietario responsable de la seguridad después de horas a menos que se acuerde lo contrario
- Medidas de seguridad: {{security_measures}}

### 7.3 Condiciones Existentes
{{#if existing_conditions}}
Se conocen las siguientes condiciones existentes:
{{existing_conditions_description}}
{{/if}}

### 7.4 Servicios Públicos
- **Localización de Servicios:** {{utility_location_responsibility}}
- **Protección de Servicios:** {{utility_protection_requirements}}
- **Coordinación de Servicios:** {{utility_coordination_plan}}

---

## 8. Control de Calidad y Garantías

### 8.1 Estándares de Calidad
Todo trabajo se realizará de manera buena y profesional de acuerdo con:
- Mejores prácticas de la industria
- Especificaciones del fabricante
- Requisitos del código de construcción
- Documentos del contrato

### 8.2 Período de Garantía
El Contratista garantiza todo trabajo por {{warranty_period}} años desde la finalización sustancial contra:
- Defectos en materiales y mano de obra
- Falta de conformidad con los requisitos del contrato
- Desgaste normal excluido

### 8.3 Remedios de Garantía
Si aparecen defectos durante el período de garantía, el Contratista deberá:
- Reparar o reemplazar el trabajo defectuoso sin costo para el Propietario
- Responder dentro de {{warranty_response_time}} días
- Completar reparaciones dentro de {{warranty_completion_time}} días

### 8.4 Garantías Extendidas
{{#if extended_warranties}}
Se aplican las siguientes garantías extendidas:
{{extended_warranties_list}}
{{/if}}

---

## 9. Cambios y Modificaciones

### 9.1 Proceso de Orden de Cambio
1. **Solicitud:** Cualquier parte puede solicitar cambios por escrito
2. **Estimación:** El Contratista proporciona estimación de costo y tiempo
3. **Aprobación:** El Propietario aprueba o rechaza el cambio propuesto
4. **Autorización:** Orden de cambio escrita firmada por ambas partes

### 9.2 Cambios de Emergencia
En emergencias, el Contratista puede proceder con trabajo necesario y formalizar la orden de cambio dentro de {{emergency_change_deadline}} días.

### 9.3 Ajustes de Costo
- **Trabajo Adicional:** Costo más {{markup_percentage}}% de margen
- **Trabajo Eliminado:** Crédito menos {{deletion_fee}}% de tarifa de manejo
- **Extensiones de Tiempo:** Según se acuerde mutuamente

---

## 10. Resolución de Disputas y Remedios

### 10.1 Proceso de Resolución de Disputas
Las disputas se resolverán a través de:
1. **Negociación Directa:** {{negotiation_period}} días
2. **Mediación:** Mediación vinculante si la negociación falla
3. {{#if arbitration}}**Arbitraje:** Arbitraje vinculante en {{arbitration_location}}{{else}}**Litigio:** Procedimientos judiciales en {{jurisdiction}}{{/if}}

### 10.2 Suspensión del Trabajo
El Propietario puede suspender el trabajo por:
- Falta de pago a subcontratistas
- Violaciones de seguridad
- Incumplimiento material del contrato

### 10.3 Derechos de Terminación
Cualquier parte puede terminar por:
- Incumplimiento material no corregido después de {{cure_period}} días de notificación
- Insolvencia o bancarrota
- Abandono del trabajo

---

## 11. Incumplimiento y Terminación

### 11.1 Incumplimiento del Contratista
El Contratista incumple si:
- Falla en realizar el trabajo según el cronograma
- Viola términos materiales del contrato
- Se vuelve insolvente o declara bancarrota
- Abandona el trabajo

### 11.2 Incumplimiento del Propietario
El Propietario incumple si:
- Falla en hacer pagos cuando se deben
- Interfiere con el desempeño del Contratista
- Falla en proporcionar elementos del propietario

### 11.3 Remedios por Incumplimiento
**Remedios del Propietario:**
- Completar trabajo con otros contratistas
- Buscar daños por retraso y costos adicionales
- Cobrar de la fianza de cumplimiento si aplica

**Remedios del Contratista:**
- Detener trabajo hasta que los pagos estén al día
- Buscar cantidades no pagadas más interés
- Presentar gravamen de mecánico si se permite

---

## 12. Disposiciones Generales

### 12.1 Ley Aplicable
Este Contrato se regirá por las leyes de {{governing_state}}.

### 12.2 Contrato Completo
Este Contrato constituye el acuerdo completo y reemplaza todas las negociaciones previas.

### 12.3 Modificación
Este Contrato solo puede modificarse a través de órdenes de cambio escritas firmadas por ambas partes.

### 12.4 Cesión
{{#if assignment_allowed}}
Este Contrato puede cederse con consentimiento escrito de ambas partes.
{{else}}
Este Contrato no puede cederse sin consentimiento escrito.
{{/if}}

### 12.5 Separabilidad
Si alguna disposición se considera inválida, el resto permanecerá en vigor.

### 12.6 Notificación
Todas las notificaciones deben ser por escrito y entregadas a las direcciones especificadas arriba.

---

## 13. Firmas

**EN FE DE LO CUAL**, las partes han ejecutado este Contrato en la fecha arriba escrita.

**PROPIETARIO:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{owner_name}} | |
| {{owner_title}} | |

**CONTRATISTA:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{contractor_name}} | |
| Por: {{contractor_signatory}} | |
| Título: {{contractor_title}} | |
| Licencia #: {{contractor_license}} | |

---

**AVISO LEGAL IMPORTANTE:** Este contrato de construcción debe ser revisado por un abogado y profesionales de la construcción para asegurar el cumplimiento con las leyes aplicables y los estándares de la industria. Los términos deben adaptarse a los requisitos específicos del proyecto y las regulaciones locales.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*