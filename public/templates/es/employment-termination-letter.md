# Carta de Terminación de Empleo

---

**CARTA DE TERMINACIÓN DE EMPLEO**

**Fecha:** {{termination_date}}

**Para:** {{employee_name}}  
**ID del empleado:** {{employee_id}}  
**Departamento:** {{department}}  
**Puesto:** {{job_title}}

**De:** {{company_name}}  
**Domicilio:** {{company_address}}

---

## 1. Aviso de terminación

Estimado(a) {{employee_name}}:

Mediante la presente notificamos formalmente que su relación laboral con {{company_name}} finalizará con efecto a partir del **{{effective_date}}**.

### 1.1 Detalles de la terminación

**Motivo de terminación:** {{termination_reason}}  
**Tipo de terminación:** {{termination_type}} (Voluntaria/Involuntaria/Despido/Resignación)  
**Fecha de efectividad:** {{effective_date}}  
**Último día laborado:** {{last_working_day}}

---

## 2. Motivo de la terminación

{{#if performance_related}}

### Terminación por desempeño

Su empleo se termina debido a asuntos de desempeño, específicamente:
{{performance_issues}}

Acciones disciplinarias previas:
{{disciplinary_history}}
{{/if}}

{{#if misconduct}}

### Terminación por conducta indebida

Su empleo se termina debido a conducta indebida, específicamente:
{{misconduct_details}}
{{/if}}

{{#if layoff}}

### Terminación por despido/reducción de personal

Su puesto se elimina debido a:
{{layoff_reason}}

Esta decisión no está relacionada con su desempeño individual y forma parte de una reestructuración organizacional.
{{/if}}

{{#if voluntary}}

### Terminación voluntaria

Acusamos recibo de su carta de renuncia con fecha {{resignation_date}}. Su baja voluntaria se hará efectiva el {{effective_date}}.
{{/if}}

---

## 3. Compensación y prestaciones finales

### 3.1 Pago final

**Fecha de pago final:** {{final_pay_date}}  
**Monto del pago final:** ${{final_pay_amount}}  
**Periodo cubierto:** {{final_pay_period}}

**El pago final incluye:**

- Salarios ordinarios hasta {{last_working_day}}
- {{#if overtime_owed}}Pago de horas extras: ${{overtime_amount}}{{/if}}
- {{#if vacation_payout}}Pago de vacaciones acumuladas: {{vacation_days}} días = ${{vacation_payout}}{{/if}}
- {{#if sick_leave_payout}}Pago de licencias por enfermedad acumuladas (cuando corresponda): ${{sick_leave_amount}}{{/if}}
- {{#if commission_owed}}Comisiones pendientes: ${{commission_amount}}{{/if}}
- {{#if bonus_owed}}Bono prorrateado: ${{bonus_amount}}{{/if}}

### 3.2 Deducciones

Las siguientes deducciones se realizarán de su pago final:
{{final_pay_deductions}}

### 3.3 Paquete de liquidación

{{#if severance_offered}}
**Pago por separación:** ${{severance_amount}}  
**Periodo de separación:** {{severance_weeks}} semanas  
**Calendario de pago:** {{severance_payment_schedule}}  
**Condiciones de la separación:** {{severance_conditions}}
{{else}}
**No se ofrece** un paquete de liquidación con esta terminación.
{{/if}}

---

## 4. Información sobre prestaciones

### 4.1 Seguro médico

**Elegibilidad COBRA:** {{#if cobra_eligible}}Es elegible para continuar su cobertura médica mediante COBRA{{else}}No es elegible para COBRA{{/if}}  
**Fecha de finalización de la cobertura:** {{health_insurance_end_date}}  
**Información de COBRA:** Recibirá por separado la documentación de COBRA dentro de {{cobra_notice_days}} días

### 4.2 Prestaciones de retiro

**Plan 401(k):** {{retirement_plan_status}}  
**Estatus de consolidación (vesting):** {{vesting_status}}  
**Contacto:** {{retirement_plan_contact}}

### 4.3 Otras prestaciones

**Seguro de vida:** Finaliza el {{life_insurance_end_date}}  
**Seguro por incapacidad:** Finaliza el {{disability_insurance_end_date}}  
**Cuenta de gastos flexibles:** {{fsa_status}}  
**Opciones sobre acciones:** {{stock_option_status}}

---

## 5. Devolución de bienes de la empresa

Debe devolver los siguientes bienes de la empresa a más tardar el {{property_return_deadline}}:

**Elementos a devolver:**

- [ ] Computadora portátil/equipo de la empresa: {{laptop_details}}
- [ ] Teléfono móvil: {{phone_details}}
- [ ] Gafete/carnés de acceso
- [ ] Tarjetas de crédito corporativas
- [ ] Llaves de la oficina
- [ ] Vehículo de la empresa (si aplica)
- [ ] Documentos y archivos confidenciales
- [ ] {{additional_company_property}}

**Lugar de entrega:** {{property_return_location}}  
**Persona de contacto:** {{property_return_contact}}

---

## 6. Confidencialidad y no divulgación

### 6.1 Obligaciones vigentes

Sus obligaciones de confidencialidad y no divulgación continúan después de la terminación e incluyen:

- Protección de secretos comerciales e información propietaria de la empresa
- No divulgación de listas de clientes e información comercial confidencial
- {{additional_confidentiality_obligations}}

### 6.2 Acuerdo de no competencia

{{#if non_compete_applies}}
Su acuerdo de no competencia fechado el {{non_compete_date}} permanece vigente durante {{non_compete_duration}} posteriores a su terminación.
{{else}}
Esta terminación no está sujeta a restricciones de no competencia.
{{/if}}

---

## 7. Requisitos finales de trabajo

### 7.1 Transferencia de conocimiento

{{#if knowledge_transfer_required}}
Debe completar las siguientes actividades de transferencia de conocimiento:
{{knowledge_transfer_tasks}}

**Fecha límite de cumplimiento:** {{knowledge_transfer_deadline}}
{{/if}}

### 7.2 Proyectos pendientes

{{#if final_projects}}
**Proyectos en curso:** {{final_project_list}}  
**Plan de transición:** {{project_transition_plan}}
{{/if}}

---

## 8. Referencias y empleo futuro

### 8.1 Política de referencias

{{reference_policy}}

### 8.2 Verificación de empleo

Las futuras verificaciones de empleo confirmarán:

- Fechas de empleo: {{employment_start_date}} a {{effective_date}}
- Puesto desempeñado: {{job_title}}
- {{employment_verification_details}}

---

## 9. Cumplimiento con leyes laborales estatales

### 9.1 Requisitos sobre pago final

{{#if state_california}}
**Ley de California:** El pago final debe entregarse inmediatamente en terminaciones involuntarias o dentro de 72 horas en renuncias voluntarias sin aviso.
{{/if}}
{{#if state_new_york}}
**Ley de Nueva York:** El pago final debe realizarse en el siguiente día de pago regular posterior a la terminación.
{{/if}}
{{#if state_texas}}
**Ley de Texas:** El pago final debe proporcionarse dentro de los 6 días posteriores a la terminación.
{{/if}}
{{#if state_florida}}
**Ley de Florida:** El pago final debe realizarse en el siguiente día de pago regular posterior a la terminación.
{{/if}}
**Requisitos de {{state}}:** {{state_final_pay_requirements}}

### 9.2 Leyes estatales sobre pago de vacaciones

{{#if state_california}}
**Ley de California:** Las vacaciones acumuladas deben pagarse al momento de la terminación. Las políticas de "úsalo o piérdelo" están prohibidas.
{{/if}}
{{#if state_massachusetts}}
**Ley de Massachusetts:** Las vacaciones acumuladas deben pagarse si la política de la empresa lo prevé.
{{/if}}
**Leyes de vacaciones en {{state}}:** {{state_vacation_payout_requirements}}

### 9.3 Cumplimiento de la Ley WARN

{{#if warn_act_applicable}}
**Ley WARN (Worker Adjustment and Retraining Notification):** Esta terminación {{#if warn_notice_given}}se ha precedido del aviso requerido de 60 días{{else}}no activa las obligaciones de la Ley WARN{{/if}}.
{{/if}}

### 9.4 Leyes estatales tipo Mini-WARN

{{#if state_warn_law}}
**Requisitos WARN de {{state}}:** {{state_warn_law_details}}
{{/if}}

### 9.5 Reconocimiento de empleo a voluntad

{{#if at_will_employment}}
Esta terminación es consistente con la relación laboral a voluntad. Cualquiera de las partes puede terminar la relación laboral en cualquier momento, con o sin causa y con o sin aviso.
{{/if}}

### 9.6 Leyes estatales contra la discriminación

Esta terminación no se basa en ninguna característica protegida conforme a las leyes federales, estatales o locales contra la discriminación, incluyendo entre otras:

- Raza, color, religión, sexo, origen nacional, edad, discapacidad (protecciones federales)
- {{state_protected_classes}}

### 9.7 Protección a denunciantes

{{#if whistleblower_protections}}
Esta terminación no constituye represalia por actividades protegidas de denuncia (whistleblower) bajo la ley de {{state}}.
{{/if}}

### 9.8 Leyes de derecho al trabajo

{{#if right_to_work_state}}
**Derecho al trabajo en {{state}}:** Este estado cuenta con leyes de derecho al trabajo. La afiliación sindical no es requisito para el empleo.
{{/if}}

---

## 10. Cumplimiento con leyes laborales federales

### 10.1 Requisitos de notificación COBRA

{{#if cobra_eligible}}
**Requisitos federales de COBRA:** Usted tiene derecho a continuar su cobertura de salud bajo COBRA hasta por 18 meses (o 36 meses en ciertos eventos). Debe recibir una notificación escrita de sus derechos COBRA dentro de los 44 días posteriores a la terminación.
{{/if}}

### 10.2 Igualdad de oportunidades de empleo

Esta terminación cumple con todas las leyes federales de igualdad de oportunidades y no se basa en ninguna característica protegida por el Título VII, la ADA, la ADEA u otros estatutos federales contra la discriminación.

### 10.3 Ley de Licencia Médica y Familiar (FMLA)

{{#if fmla_eligible}}
Esta terminación no afecta sus derechos conforme a la Ley de Licencia Médica y Familiar (FMLA).
{{/if}}

### 10.4 Clasificación de trabajadores

{{#if contractor_classification}}
**Aviso al contratista independiente:** Cualquier relación de trabajo posterior a la terminación debe cumplir con las leyes de correcta clasificación de trabajadores.
{{/if}}

---

## 11. Consideraciones legales

### 11.1 Acuerdo de separación

{{#if separation_agreement}}
Se adjunta un acuerdo de separación que aborda términos adicionales de su terminación. Revíselo y fírmelo si está de acuerdo.
{{/if}}

### 11.2 Beneficios de desempleo

{{unemployment_benefits_info}}

**Requisitos estatales:** Conforme a la ley de {{state}}, debemos proporcionarle información sobre los beneficios de desempleo. Comuníquese con la oficina estatal de desempleo en {{state_unemployment_contact}}.

### 11.3 Resolución de disputas

{{dispute_resolution_clause}}

### 11.4 Plazos legales

{{#if legal_time_limits}}
**Importante:** Ciertas reclamaciones legales tienen plazos específicos. Por ejemplo:

- Reclamaciones federales por discriminación: 180 días (300 días en estados con agencias autorizadas)
- Reclamaciones estatales por discriminación: {{state_discrimination_deadline}}
- Reclamaciones salariales y de horas: {{state_wage_hour_deadline}}
  {{/if}}

---

## 12. Información de contacto

Para preguntas relacionadas con esta terminación o sus prestaciones finales, comuníquese con:

**Contacto de RR. HH.:** {{hr_contact_name}}  
**Teléfono:** {{hr_contact_phone}}  
**Correo electrónico:** {{hr_contact_email}}  
**Horario de atención:** {{hr_office_hours}}

**Preguntas sobre nómina:** {{payroll_contact}}  
**Preguntas sobre prestaciones:** {{benefits_contact}}

---

## 13. Acuse de recibo

Por favor, firme y devuelva una copia de esta carta para confirmar su recepción.

Reconozco que he recibido y entiendo esta Carta de Terminación de Empleo y la información contenida en ella.

**Acuse del empleado:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | **\*\***\_**\*\*** |
| {{employee_name}} | |
| Nombre en letra de imprenta: {{employee_name}} | |

---

## 14. Representante de la empresa

**Emitido por:**

| Firma | Fecha |
| ------------------------------------------ | -------------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{termination_date}} |
| {{hr_representative_name}} | |
| Cargo: {{hr_representative_title}} | |

{{#if supervisor_signature_required}}
**Supervisor:**

| Firma | Fecha |
| ------------------------------------------ | -------------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{termination_date}} |
| {{supervisor_name}} | |
| Cargo: {{supervisor_title}} | |

{{/if}}

---

## 15. Recordatorios importantes

- Devuelva toda la propiedad de la empresa a más tardar el {{property_return_deadline}}
- Conserve esta carta para sus registros
- Comuníquese con RR. HH. ante cualquier duda sobre su pago final o prestaciones
- {{#if cobra_eligible}}Esté atento a la documentación de COBRA que llegará por correo{{/if}}
- {{additional_reminders}}

---

**AVISO LEGAL IMPORTANTE:** Esta carta de terminación de empleo debe ser revisada por asesores legales calificados para garantizar el cumplimiento de las leyes laborales federales, estatales y locales. Los procedimientos de terminación varían según la jurisdicción y deben seguir los protocolos legales correspondientes.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
