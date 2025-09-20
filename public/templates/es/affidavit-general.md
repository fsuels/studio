# Declaracion Jurada General

---

**DECLARACION JURADA GENERAL**

**Estado de {{state}}**  
**Condado de {{county}}**

---

## 1. Informacion de la Persona Declarante

Yo, **{{affiant_name}}**, debidamente juramentado, declaro lo siguiente:

**Datos de la Persona Declarante:**

- **Nombre completo:** {{affiant_name}}
- **Domicilio:** {{affiant_address}}
- **Fecha de nacimiento:** {{affiant_dob}}
- **Ocupacion:** {{affiant_occupation}}
- **Telefono:** {{affiant_phone}}

---

## 2. Proposito de la Declaracion

Esta declaracion se emite con el siguiente proposito:
{{affidavit_purpose}}

**Asunto relacionado:** {{related_matter}}  
**Numero de expediente (si aplica):** {{case_number}}

---

## 3. Relacion de Hechos

### 3.1 Conocimiento Personal

Tengo conocimiento personal de los hechos incluidos en esta Declaracion y, si fuera llamado a testificar, podria declarar competentemente sobre la veracidad de lo expuesto.

### 3.2 Declaraciones Factuales

{{#if numbered_facts}}

1. {{fact_1}}

2. {{fact_2}}

3. {{fact_3}}

4. {{fact_4}}

5. {{fact_5}}

{{additional_numbered_facts}}
{{else}}
**Declaracion de hechos:**
{{factual_narrative}}
{{/if}}

### 3.3 Documentos de Respaldo

{{#if supporting_documents}}
**Documentos adjuntos:** Los siguientes documentos se anexan y forman parte de esta Declaracion:
{{supporting_document_list}}
{{/if}}

{{#if witness_information}}
**Testigos presentes:** {{witness_information}}
{{/if}}

---

## 4. Circunstancias y Contexto

### 4.1 Fecha y Hora de los Eventos

**Fecha(s) relevante(s):** {{event_dates}}  
**Hora(s) relevante(s):** {{event_times}}  
**Lugar(es) de los hechos:** {{event_locations}}

### 4.2 Relacion con el Asunto

**Relacion con este asunto:** {{relationship_to_matter}}

### 4.3 Fuente del Conocimiento

**Como obtuve el conocimiento:** {{knowledge_source}}

---

## 5. Declaraciones Adicionales

### 5.1 Memoria y Estado Mental

Durante los eventos descritos mantuve plena capacidad mental y mi recuerdo de los hechos es fiel y exacto.

### 5.2 Compensacion

{{#if no_compensation}}
No he recibido ni se me ha prometido compensacion alguna por emitir esta Declaracion.
{{else}}
**Compensacion o intereses:** {{compensation_details}}
{{/if}}

### 5.3 Ausencia de Coaccion

Realizo esta Declaracion de manera voluntaria, sin presion, coaccion ni influencia indebida de ninguna persona.

---

## 6. Verificacion y Juramento

### 6.1 Veracidad y Exactitud

Declaro bajo pena de perjurio que las manifestaciones precedentes son ciertas y correctas segun mi leal saber y entender.

### 6.2 Divulgacion Completa

He revelado todos los hechos materiales que conozco sobre este asunto y no he omitido informacion relevante.

### 6.3 Actualizaciones o Correcciones

{{#if corrections_needed}}
**Correcciones a declaraciones previas:** {{corrections_details}}
{{else}}
Esta Declaracion sustituye cualquier declaracion previa que haya realizado respecto de este asunto.
{{/if}}

---

## 7. Adjuntos y Anexos

{{#if has_attachments}}
Los siguientes elementos se adjuntan y forman parte de esta Declaracion:

**Anexo A:** {{exhibit_a_description}}  
**Anexo B:** {{exhibit_b_description}}  
**Anexo C:** {{exhibit_c_description}}  
{{additional_exhibits}}
{{else}}
No se incluyen anexos con esta Declaracion.
{{/if}}

---

## 8. Aviso de Consecuencias Legales

Entiendo que:

- Esta Declaracion puede emplearse en procedimientos judiciales o administrativos
- Las declaraciones falsas pueden exponerme a sanciones por perjurio
- Esta Declaracion tiene la misma fuerza que un testimonio prestado bajo juramento en audiencia
- Puedo ser citado para testificar sobre los asuntos descritos

---

## Signatures

## 9. Firmas de la Persona Declarante

**FIRMADO** el **{{execution_date}}** en {{execution_location}}.

**DECLARANTE:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{affiant_name}}                    |                    |
| Nombre impreso: {{affiant_name}}    |                    |

---

## 10. Notarizacion

**COMPARECIO Y JURAMENTADO** ante mi en esta fecha **{{execution_date}}** {{affiant_name}}, quien demostro mediante evidencia satisfactoria ser la persona que comparece.

**Estado de {{state}}**  
**Condado de {{county}}**

Certifico bajo PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que lo anterior es verdadero y correcto.

**Notario Publico:** ****************_****************  
**Mi comision expira:** ************_************

**[Sello notarial]**

---

## 11. Testigos (si aplica)

{{#if witnesses_present}}
**TESTIGO 1:**

Fui testigo de la firma de esta Declaracion por {{affiant_name}}.

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{witness_1_name}}                  |                    |
| Domicilio: {{witness_1_address}}    |                    |

**TESTIGO 2:**

Fui testigo de la firma de esta Declaracion por {{affiant_name}}.

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{witness_2_name}}                  |                    |
| Domicilio: {{witness_2_address}}    |                    |
{{else}}
No se requirio la presencia de testigos para esta Declaracion.
{{/if}}

---

## 12. Constancia de Notificacion (si aplica)

{{#if service_required}}
Certifico que una copia fiel de esta Declaracion fue entregada a las siguientes partes el {{service_date}}:

**Metodo de entrega:** {{service_method}} (Entrega personal/Correo certificado/Correo electronico/Otro)

**Partes notificadas:**
{{parties_served}}

**Entregado por:** {{served_by_name}}  
**Fecha de entrega:** {{service_date}}

| Firma de quien notifica             | Fecha             |
| ----------------------------------- | ----------------- |
| ****************_****************   | {{service_date}}  |
| {{served_by_name}}                  |                   |
{{else}}
No se realizo notificacion adicional relacionada con esta Declaracion.
{{/if}}

---

## 13. Informacion del Abogado (si aplica)

{{#if attorney_prepared}}
**Preparado por abogado:**

**Nombre del abogado:** {{attorney_name}}  
**Numero de colegiatura:** {{attorney_bar_number}}  
**Despacho:** {{law_firm_name}}  
**Domicilio:** {{attorney_address}}  
**Telefono:** {{attorney_phone}}  
**Correo electronico:** {{attorney_email}}

**Abogado de:** {{attorney_represents}}
{{else}}
Esta Declaracion fue preparada sin asistencia legal formal.
{{/if}}

---

**IMPORTANT LEGAL NOTICE / AVISO LEGAL IMPORTANTE:** Esta declaracion jurada general debe revisarse con un profesional legal calificado para asegurar que cumple los requisitos especificos para su proposito. Declarar hechos falsos puede resultar en cargos por perjurio. El formato y las formalidades pueden variar segun la jurisdiccion y el tipo de procedimiento.

_Ac 2025 123LegalDoc - Formulario de autoservicio - No es asesoramiento legal - Terminos: 123LegalDoc.com/terms_