# Formulario de Autorización HIPAA

---

**AUTORIZACIÓN PARA USO Y DIVULGACIÓN DE INFORMACIÓN DE SALUD PROTEGIDA**

**Información del Paciente:**
- **Nombre del Paciente:** {{patient_name}}
- **Fecha de Nacimiento:** {{patient_dob}}
- **Dirección:** {{patient_address}}
- **Teléfono:** {{patient_phone}}
- **ID del Paciente/Número de Expediente Médico:** {{patient_id}}

**Proveedor de Atención Médica:**
- **Nombre del Proveedor:** {{provider_name}}
- **Dirección:** {{provider_address}}
- **Teléfono:** {{provider_phone}}
- **Número NPI:** {{provider_npi}}

**Fecha de Autorización:** {{authorization_date}}

---

## 1. Detalles de la Autorización

### 1.1 Información a Divulgar
Autorizo el uso y divulgación de mi información de salud protegida (PHI) como se describe a continuación:

**Tipo de Información Autorizada para Liberación:**
{{#if all_records}}
☑ Expediente médico completo/toda información de salud
{{else}}
☐ Expediente médico completo/toda información de salud
{{/if}}

{{#if specific_records}}
☑ Información específica (marcar todo lo que aplique):
- ☐ Historia y examen físico
- ☐ Reportes de consulta
- ☐ Resultados de laboratorio (especificar): {{lab_results_details}}
- ☐ Reportes de radiología/imágenes (especificar): {{radiology_details}}
- ☐ Reportes de patología
- ☐ Reportes operatorios/de procedimientos
- ☐ Registros de departamento de emergencias
- ☐ Resúmenes de alta
- ☐ Listas de medicamentos/registros de farmacia
- ☐ Registros de inmunización
- ☐ Otro (especificar): {{other_records_details}}
{{else}}
☐ Información específica
{{/if}}

**Rango de Fechas de la Información:**
- Desde: {{date_range_from}} Hasta: {{date_range_to}}
- ☐ Todas las fechas de servicio
- ☐ Información continua/futura

### 1.2 Información Sensible
{{#if sensitive_info_included}}
Esta autorización incluye los siguientes tipos de información sensible (marcar si aplica):
- ☐ Registros de salud mental/psiquiátricos
- ☐ Registros de tratamiento de abuso de sustancias
- ☐ Información relacionada con VIH/SIDA
- ☐ Información genética
- ☐ Información de salud reproductiva
- ☐ Otra información sensible: {{other_sensitive_info}}
{{/if}}

---

## 2. Partes Involucradas en la Divulgación

### 2.1 Persona/Organización Autorizada para Divulgar Información
**Nombre:** {{disclosing_entity}}
**Dirección:** {{disclosing_entity_address}}
**Teléfono:** {{disclosing_entity_phone}}
**Relación con el Paciente:** {{disclosing_relationship}}

### 2.2 Persona/Organización Autorizada para Recibir Información
**Nombre:** {{receiving_entity}}
**Dirección:** {{receiving_entity_address}}
**Teléfono:** {{receiving_entity_phone}}
**Relación con el Paciente:** {{receiving_relationship}}

### 2.3 Destinatarios Adicionales
{{#if additional_recipients}}
Las siguientes partes adicionales están autorizadas para recibir esta información:
{{#each additional_recipients}}
- **Nombre:** {{name}}
- **Dirección:** {{address}}
- **Relación:** {{relationship}}
{{/each}}
{{/if}}

---

## 3. Propósito de la Divulgación

### 3.1 Razón para la Autorización
Autorizo este uso/divulgación para el(los) siguiente(s) propósito(s):

{{#if purpose_treatment}}
☑ **Tratamiento:** {{treatment_details}}
{{else}}
☐ **Tratamiento**
{{/if}}

{{#if purpose_insurance}}
☑ **Seguro/Beneficios:** {{insurance_details}}
{{else}}
☐ **Seguro/Beneficios**
{{/if}}

{{#if purpose_legal}}
☑ **Procedimientos Legales:** {{legal_details}}
{{else}}
☐ **Procedimientos Legales**
{{/if}}

{{#if purpose_personal}}
☑ **Uso Personal:** {{personal_use_details}}
{{else}}
☐ **Uso Personal**
{{/if}}

{{#if purpose_disability}}
☑ **Determinación de Discapacidad:** {{disability_details}}
{{else}}
☐ **Determinación de Discapacidad**
{{/if}}

{{#if purpose_employment}}
☑ **Empleo:** {{employment_details}}
{{else}}
☐ **Empleo**
{{/if}}

{{#if purpose_other}}
☑ **Otro:** {{other_purpose_details}}
{{else}}
☐ **Otro:** _________________________
{{/if}}

### 3.2 Limitaciones de Uso Específicas
{{#if use_limitations}}
La información solo puede usarse para los siguientes propósitos específicos:
{{use_limitations_details}}
{{/if}}

---

## 4. Término y Expiración

### 4.1 Expiración
Esta autorización expirará:

{{#if expiration_date}}
☑ En la siguiente fecha: {{expiration_date}}
{{else}}
☐ En una fecha específica: _______________
{{/if}}

{{#if expiration_event}}
☑ Después del siguiente evento: {{expiration_event_description}}
{{else}}
☐ Después del siguiente evento: _______________
{{/if}}

{{#if no_expiration}}
☑ Esta autorización no expira
{{else}}
☐ Esta autorización no expira
{{/if}}

### 4.2 Expiración Automática
Si no se especifica fecha o evento de expiración, esta autorización expirará un año desde la fecha firmada.

---

## 5. Derechos del Paciente y Avisos

### 5.1 Derecho a Revocar
**Entiendo que:**
- Tengo derecho a revocar esta autorización en cualquier momento presentando una solicitud escrita
- La revocación no es efectiva para acciones ya tomadas basándose en esta autorización
- La revocación no afecta información ya divulgada
- Para revocar, debo presentar aviso escrito a: {{revocation_address}}

### 5.2 Derecho a Negarse
Entiendo que:
- Tengo derecho a negarme a firmar esta autorización
- Mi tratamiento, pago, inscripción o elegibilidad para beneficios no puede condicionarse a firmar esta autorización, excepto en circunstancias limitadas
- Si me niego a firmar, las consecuencias pueden ser: {{refusal_consequences}}

### 5.3 Advertencia de Re-divulgación
Entiendo que:
- La información divulgada bajo esta autorización puede ser re-divulgada por el destinatario
- La información re-divulgada puede no estar protegida por leyes federales de privacidad
- Tengo derecho a solicitar restricciones en la re-divulgación

### 5.4 Copia de la Autorización
Entiendo que:
- Tengo derecho a recibir una copia de esta autorización
- ☐ He recibido una copia de esta autorización
- ☐ Declino recibir una copia de esta autorización

---

## 6. Circunstancias Especiales

### 6.1 Pago de Terceros
{{#if third_party_payment}}
Entiendo que el destinatario puede pagar por obtener estos registros y que el pago no afecta la validez de esta autorización.
{{/if}}

### 6.2 Marketing y Recaudación de Fondos
{{#if marketing_disclosure}}
☑ Autorizo el uso de mi información para propósitos de marketing
☐ NO autorizo el uso de mi información para propósitos de marketing
{{/if}}

{{#if fundraising_disclosure}}
☑ Autorizo el uso de mi información para actividades de recaudación de fondos
☐ NO autorizo el uso de mi información para actividades de recaudación de fondos
{{/if}}

### 6.3 Propósitos de Investigación
{{#if research_disclosure}}
Entiendo que esta información puede usarse para propósitos de investigación y:
- El estudio de investigación es: {{research_study_details}}
- Mi participación es voluntaria
- Puedo retirarme de la investigación en cualquier momento
{{/if}}

---

## 7. Tarifas y Costos

### 7.1 Tarifas de Copia de Registros
{{#if copying_fees}}
Entiendo que pueden cobrarme tarifas razonables por copiar y enviar registros:
- **Tarifa de Copia:** ${{copying_fee_rate}} por página
- **Tarifa de Envío:** ${{mailing_fee}}
- **Tarifa Administrativa:** ${{admin_fee}}
- **Tarifa Total Máxima:** ${{max_fee}}
{{else}}
No se cobrarán tarifas por proporcionar registros bajo esta autorización.
{{/if}}

### 7.2 Responsabilidad de Pago
{{#if payment_responsibility}}
**El pago será hecho por:** {{payment_responsible_party}}
{{else}}
Responsabilidad de pago: Paciente
{{/if}}

---

## 8. Poblaciones Especiales

### 8.1 Pacientes Menores
{{#if minor_patient}}
**Para pacientes menores de 18 años:**
- **Nombre del Menor:** {{minor_name}}
- **Fecha de Nacimiento del Menor:** {{minor_dob}}
- **Nombre del Padre/Tutor:** {{parent_guardian_name}}
- **Relación:** {{parent_guardian_relationship}}

Certifico que soy el padre/tutor legal del menor arriba nombrado y tengo autoridad para firmar esta autorización.
{{/if}}

### 8.2 Pacientes Fallecidos
{{#if deceased_patient}}
**Para pacientes fallecidos:**
- **Fecha de Muerte:** {{death_date}}
- **Representante Autorizado:** {{authorized_representative}}
- **Autoridad:** {{representative_authority}}
{{/if}}

### 8.3 Pacientes Incapacitados
{{#if incapacitated_patient}}
**Para pacientes incapacitados:**
- **Representante Legal:** {{legal_representative}}
- **Nombramiento de Corte:** {{court_appointment_details}}
- **Poder Notarial:** {{poa_details}}
{{/if}}

---

## 9. Transmisión Electrónica

### 9.1 Entrega Electrónica
{{#if electronic_delivery}}
☑ Autorizo transmisión electrónica de registros a: {{electronic_address}}
**Método:** {{electronic_method}} (correo electrónico, portal seguro, fax, etc.)

**Aviso de Seguridad:** Entiendo que la transmisión electrónica puede no ser completamente segura y hay riesgos incluyendo:
- Interceptación por personas no autorizadas
- Entrega incorrecta
- Fallas técnicas de transmisión
{{/if}}

### 9.2 Preferencias de Entrega
**Método de entrega preferido:**
- ☐ Correo regular
- ☐ Correo certificado
- ☐ Correo electrónico
- ☐ Portal seguro del paciente
- ☐ Fax a: {{fax_number}}
- ☐ Recoger en persona
- ☐ Otro: {{other_delivery_method}}

---

## 10. Reconocimientos y Firmas

### 10.1 Reconocimiento del Paciente
Reconozco que:
- He leído este formulario de autorización y entiendo su contenido
- Todas mis preguntas sobre esta autorización han sido respondidas
- Entiendo mis derechos respecto a esta autorización
- Estoy firmando esta autorización voluntariamente
- Entiendo los riesgos y beneficios de autorizar esta divulgación

### 10.2 Firma del Paciente
**Firma del Paciente:** _________________________________ **Fecha:** _____________
**Nombre del Paciente (Letra de Molde):** {{patient_name}}

{{#if minor_patient}}
### 10.3 Firma del Padre/Tutor
**Firma del Padre/Tutor:** _________________________________ **Fecha:** _____________
**Nombre (Letra de Molde):** {{parent_guardian_name}}
**Relación:** {{parent_guardian_relationship}}
{{/if}}

{{#if witness_required}}
### 10.4 Firma del Testigo
**Firma del Testigo:** _________________________________ **Fecha:** _____________
**Nombre del Testigo (Letra de Molde):** {{witness_name}}
{{/if}}

---

## 11. Solo para Uso del Proveedor de Atención Médica

### 11.1 Verificación
**Miembro del Personal Revisando Formulario:** {{staff_member_name}}
**Fecha Revisada:** {{review_date}}
**Notas de Verificación:** {{verification_notes}}

### 11.2 Información de Procesamiento
**Fecha en que se Prepararon Registros:** {{preparation_date}}
**Preparado Por:** {{prepared_by}}
**Fecha Enviada/Entregada:** {{delivery_date}}
**Método de Entrega:** {{delivery_method}}
**Información de Seguimiento:** {{tracking_info}}

### 11.3 Tarifas Cobradas
**Total de Tarifas Cobradas:** ${{total_fees}}
**Método de Pago:** {{payment_method}}
**Fecha en que se Recibió el Pago:** {{payment_date}}
**Número de Recibo:** {{receipt_number}}

---

**AVISO IMPORTANTE:** Esta autorización cumple con la Regla de Privacidad de la Ley de Portabilidad y Responsabilidad del Seguro de Salud (HIPAA). Los proveedores de atención médica deben verificar la identidad de las personas que solicitan registros y asegurar autorización apropiada antes de liberar información de salud protegida.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*