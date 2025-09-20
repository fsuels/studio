# Acuerdo de Custodia de Menores

---

**ACUERDO DE CUSTODIA DE MENORES**

Este Acuerdo de Custodia de Menores ("Acuerdo") se celebra el **{{agreement_date}}** entre:

- **Progenitor 1:** {{parent_1_name}}, con domicilio en {{parent_1_address}}
- **Progenitor 2:** {{parent_2_name}}, con domicilio en {{parent_2_address}}

En adelante, los "Progenitores".

---

## 1. Informacion del Menor

### 1.1 Menores sujetos a este Acuerdo

Este Acuerdo abarca a los siguientes hijos menores:

**Menor 1:**

- **Nombre:** {{child_1_name}}
- **Fecha de nacimiento:** {{child_1_dob}}
- **Edad:** {{child_1_age}}
- **Numero de Seguro Social:** {{child_1_ssn}}

{{#if child_2_name}}
**Menor 2:**

- **Nombre:** {{child_2_name}}
- **Fecha de nacimiento:** {{child_2_dob}}
- **Edad:** {{child_2_age}}
- **Numero de Seguro Social:** {{child_2_ssn}}
{{/if}}

{{#if child_3_name}}
**Menor 3:**

- **Nombre:** {{child_3_name}}
- **Fecha de nacimiento:** {{child_3_dob}}
- **Edad:** {{child_3_age}}
- **Numero de Seguro Social:** {{child_3_ssn}}
{{/if}}

### 1.2 Residencia actual

Los menores residen actualmente con {{current_primary_parent}} en {{current_residence_address}}.

---

## 2. Custody Arrangements / Arreglos de Custodia

### 2.1 Custodia legal

{{#if joint_legal_custody}}
**Custodia legal compartida:** Ambos Progenitores compartiran la custodia legal. Las decisiones sobre salud, educacion, religion y bienestar se tomaran de forma conjunta.  
- **Autoridad medica:** {{medical_decision_authority}}  
- **Autoridad educativa:** {{educational_decision_authority}}  
- **Autoridad religiosa:** {{religious_decision_authority}}  
- **Autoridad extracurricular:** {{extracurricular_decision_authority}}
{{else}}
**Custodia legal exclusiva:** {{sole_legal_custody_parent}} tendra autoridad exclusiva para las decisiones fundamentales de los menores.
{{/if}}

### 2.2 Custodia fisica

{{#if joint_physical_custody}}
**Custodia fisica compartida:** Los Progenitores compartirán el tiempo fisico conforme al calendario de la Seccion 3.
{{else}}
**Custodia fisica primaria:** {{primary_custody_parent}} sera el custodio principal.  
**Derechos de visita:** {{visitation_parent}} seguira el calendario descrito en la Seccion 3.
{{/if}}

### 2.3 Restricciones geograficas

{{geographic_restrictions}}

### 2.4 Reubicacion

- **Aviso previo:** {{relocation_notice_requirement}}  
- **Proceso de aprobacion:** {{relocation_approval_process}}  
- **Ajustes al calendario:** {{relocation_schedule_modification}}

---

## 3. Visitation Schedule / Calendario de Visitas

### 3.1 Horario semanal

{{#if alternating_weeks}}
**Semanas alternadas:** Los menores alternaran semanas completas, con cambios los {{transition_day}} a las {{transition_time}}.
{{else}}
**Horario semanal:**

- **{{parent_1_name}}:** {{parent_1_schedule}}  
- **{{parent_2_name}}:** {{parent_2_schedule}}  
- **Detalle de transicion:** {{transition_details}}
{{/if}}

### 3.2 Festivos

| Festivo               | {{holiday_year_1}}          | {{holiday_year_2}}          |
| --------------------- | --------------------------- | --------------------------- |
| Ano Nuevo             | {{new_years_parent_1}}      | {{new_years_parent_2}}      |
| Pascua / Semana Santa | {{easter_parent_1}}         | {{easter_parent_2}}         |
| Dia de los Caidos     | {{memorial_parent_1}}       | {{memorial_parent_2}}       |
| Dia de la Independencia | {{july4_parent_1}}        | {{july4_parent_2}}          |
| Dia del Trabajo       | {{labor_parent_1}}          | {{labor_parent_2}}          |
| Halloween             | {{halloween_parent_1}}      | {{halloween_parent_2}}      |
| Accion de Gracias     | {{thanksgiving_parent_1}}   | {{thanksgiving_parent_2}}   |
| Nochebuena            | {{christmas_eve_parent_1}}  | {{christmas_eve_parent_2}}  |
| Navidad               | {{christmas_parent_1}}      | {{christmas_parent_2}}      |

Cada periodo festivo inicia a las {{holiday_start_time}} y finaliza a las {{holiday_end_time}}, salvo pacto escrito distinto.

### 3.3 Vacaciones de verano

{{summer_vacation_schedule}}

### 3.4 Recesos escolares

{{school_break_schedule}}

### 3.5 Ocasiones especiales

- **Cumpleanos de los menores:** {{birthday_schedule}}  
- **Dia de la Madre:** {{mothers_day_schedule}}  
- **Dia del Padre:** {{fathers_day_schedule}}  
- **Cumpleanos de los Progenitores:** {{parent_birthday_schedule}}

### 3.6 Requisitos de supervision

{{supervision_requirements}}

---

## 4. Transporte e Intercambios

### 4.1 Punto de intercambio

Los intercambios se realizaran en {{exchange_location}}.

### 4.2 Responsabilidad de transporte

{{transportation_responsibility}}

### 4.3 Retrasos y contingencias

Retrasos mayores a {{late_notice_threshold}} minutos deben comunicarse de inmediato. Instrucciones adicionales: {{additional_exchange_guidelines}}

---

## 5. Comunicacion y Toma de Decisiones

### 5.1 Comunicacion entre Progenitores

La coordinacion primaria se hara mediante {{parent_communication_methods}} y {{communication_platform}}. Las emergencias se comunicaran por telefono y mensaje escrito.

### 5.2 Comunicacion con los menores

El Progenitor no conviviente tendra contacto segun {{communication_schedule}}, considerando {{communication_methods}} y {{communication_times}}.

### 5.3 Decisiones relevantes

- **Salud:** {{medical_decision_authority}} / {{medical_expense_allocation}}  
- **Educacion:** {{educational_decision_authority}} / {{educational_expense_allocation}}  
- **Religion:** {{religious_decision_authority}}  
- **Actividades extracurriculares:** {{extracurricular_decision_authority}} / {{extracurricular_expense_allocation}}

---

## 6. Child Support / Manutencion

### 6.1 Obligacion de manutencion

- **Quien paga:** {{support_paying_parent}}  
- **Quien recibe:** {{support_receiving_parent}}  
- **Monto mensual:** {{monthly_support_amount}}  
- **Orden o referencia:** {{support_order_date}}

Los pagos se realizaran mediante {{support_payment_method}}, siguiendo {{support_payment_schedule}}. Si interviene una agencia, el metodo es {{child_support_method}} con vencimiento el dia {{child_support_due_day}} de cada mes.

### 6.2 Gastos compartidos

- **Cuidado infantil:** {{childcare_expense_allocation}}  
- **Gastos medicos no cubiertos:** {{medical_expense_split}}  
- **Cobertura de seguro medico:** {{health_insurance_responsibility}}  
- **Gastos educativos:** {{education_expense_split}}  
- **Costos extracurriculares:** {{extracurricular_split}}

### 6.3 Reembolsos

Los reembolsos documentados se pagaran dentro de {{reimbursement_days}} dias de recibida la solicitud.

---

## 7. Salud y Seguridad

### 7.1 Planes de salud

{{mental_health_plan}}

### 7.2 Sustancias y seguridad

- **Restricciones de sustancias:** {{substance_use_restrictions}}  
- **Politica adicional:** {{substance_policy}}  
- **Otras restricciones:** {{additional_restrictions}}

---

## 8. Educacion y Actividades

- **Institucion educativa:** {{school_name}}  
- **Actividades autorizadas:** {{extracurricular_activities}}

---

## 9. Directrices de Crianza

- **Presentacion de nuevas parejas:** {{new_partner_policy}}  
- **Expectativas adicionales:** {{additional_restrictions}}

---

## 10. Resolucion de Disputas

### 10.1 Mediacion

Las controversias se someteran inicialmente a {{mediation_provider}}.

### 10.2 Intervencion judicial

Si la mediacion fracasa, cualquiera de los Progenitores podra solicitar intervencion judicial. Detalles: {{court_intervention_process}}

### 10.3 Honorarios legales

{{attorney_fees_provision}}

---

## 11. Modificacion

### 11.1 Cambios

El Acuerdo solo podra modificarse por escrito con firma de ambos Progenitores o por orden judicial basada en un cambio sustancial de circunstancias.

### 11.2 Interes superior del menor

Toda modificacion debera priorizar el interes superior de los menores.

---

## 12. Ejecucion

### 12.1 Cumplimiento judicial

Este Acuerdo puede ejecutarse ante los tribunales de {{jurisdiction}}.

### 12.2 Sanciones

El incumplimiento podra derivar en procedimientos por desacato u otras sanciones.

---

## 13. Disposiciones Generales

### 13.1 Ley aplicable

Este Acuerdo se rige por las leyes del Estado de {{state}}.

### 13.2 Interes superior

Todas las clausulas buscan proteger el interes superior de los menores.

### 13.3 Acuerdo integro

Este documento constituye el acuerdo completo sobre custodia y visitas.

### 13.4 Divisibilidad

Si alguna clausula se declara invalida, las demas permanecen vigentes.

### 13.5 Carácter vinculante

El Acuerdo obliga a los Progenitores y a sus herederos y cesionarios.

---

## 14. Disposiciones Adicionales

{{additional_provisions}}

---

## Signatures / Firmas

## 15. Firmas

**EN FE DE LO CUAL**, los Progenitores firman este Acuerdo en la fecha indicada.

**PROGENITOR 1:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{agreement_date}} |
| {{parent_1_name}}                   |                    |
| Nombre en letra de molde: {{parent_1_name}} |             |

**PROGENITOR 2:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{agreement_date}} |
| {{parent_2_name}}                   |                    |
| Nombre en letra de molde: {{parent_2_name}} |             |

---

## 16. Notario

**Estado de {{state}}**  
**Condado de {{county}}**

En {{agreement_date}} comparecieron {{parent_1_name}} y {{parent_2_name}}, quienes acreditaron su identidad y reconocieron haber firmado este instrumento.

**Notario Publico:** ****************_****************  
**Mi comision expira:** ************

---

## 17. Aprobacion Judicial (si aplica)

{{#if court_approval_required}}
**USO DEL TRIBUNAL:**

[ ] APROBADO y ORDENADO  
[ ] RECHAZADO

**Juez:** ************  
**Fecha:** ************  
**Juzgado:** ************
{{/if}}

---

**IMPORTANT LEGAL NOTICE / AVISO LEGAL IMPORTANTE:** Este acuerdo debe revisarse con un profesional legal para asegurar cumplimiento con las leyes de familia de {{state}} y proteger el interes superior de los menores. Las normas de custodia varian segun la jurisdiccion y puede requerirse aprobacion judicial. Ambos Progenitores deben comprender plenamente sus derechos y obligaciones.

_Ac 2025 123LegalDoc - Formulario de autoservicio - No es asesoramiento legal - Terminos: 123LegalDoc.com/terms_