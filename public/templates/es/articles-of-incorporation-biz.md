# Estatutos de Incorporacion (Empresa)

---

**ARTICULOS DE INCORPORACION**

**Presentados ante la Secretaria de Estado de {{state}}**

---

## 1. Nombre Corporativo

El nombre de la corporacion es:

**{{corporation_name}}**

{{#if name_reservation}}
Este nombre fue reservado bajo el Numero de Reserva {{reservation_number}} con fecha {{reservation_date}}.
{{/if}}

---

## 2. Domicilio Registrado y Agente

### 2.1 Domicilio Registrado

La direccion del domicilio registrado es:
{{registered_office_address}}

### 2.2 Agente Registrado

El nombre del agente registrado en dicho domicilio es:
**{{registered_agent_name}}**

{{#if registered_agent_entity}}
**Entidad del Agente Registrado:** {{registered_agent_entity_name}}
{{/if}}

El agente registrado acepta el nombramiento y actuara en nombre de la corporacion para fines de notificaciones oficiales.

---

## 3. Proposito y Facultades

### 3.1 Proposito General

El proposito para el cual se organiza esta corporacion es:
{{#if general_purpose}}
Realizar cualquier acto o actividad licita permitida por la Ley de Corporaciones Comerciales de {{state}}.
{{else}}
**Proposito especifico:** {{specific_purpose}}
{{/if}}

### 3.2 Actividades Comerciales Especificas

La corporacion se organiza para desarrollar las siguientes actividades comerciales:
{{business_activities}}

### 3.3 Facultades

La corporacion tendra todas las facultades otorgadas por las leyes de {{state}}, incluyendo:

- Realizar negocios y operaciones
- Comprar, arrendar o adquirir bienes
- Vender, ceder, hipotecar o disponer de bienes
- Obtener creditos y emitir obligaciones
- Otorgar prestamos e invertir fondos
- Celebrar contratos y acuerdos
- Demandar y ser demandada en su nombre corporativo

---

## 4. Capital Social

### 4.1 Acciones Autorizadas

El numero total de acciones que la corporacion puede emitir es:
**{{total_authorized_shares}}** acciones

### 4.2 Clases de Acciones

{{#if multiple_stock_classes}}
La corporacion esta autorizada para emitir las siguientes clases de acciones:

**Acciones Ordinarias Clase A:**

- Numero de acciones: {{class_a_shares}}
- Valor nominal: ${{class_a_par_value}} por accion
- Derechos y privilegios: {{class_a_rights}}

**Acciones Ordinarias Clase B:**

- Numero de acciones: {{class_b_shares}}
- Valor nominal: ${{class_b_par_value}} por accion
- Derechos y privilegios: {{class_b_rights}}

{{#if preferred_stock}}
**Acciones Preferentes:**

- Numero de acciones: {{preferred_shares}}
- Valor nominal: ${{preferred_par_value}} por accion
- Derechos y privilegios: {{preferred_rights}}
{{/if}}
{{else}}
**Acciones Ordinarias:**

- Numero de acciones: {{common_shares}}
- Valor nominal: {{#if par_value}}${{par_value}} por accion{{else}}Sin valor nominal{{/if}}
{{/if}}

### 4.3 Derechos y Restricciones sobre las Acciones

{{stock_rights_restrictions}}

---

## 5. Incorporadores

Los nombres y domicilios de los incorporadores son:

**Incorporador 1:**
**Nombre:** {{incorporator_1_name}}
**Domicilio:** {{incorporator_1_address}}
**Firma:** ****************_****************

{{#if incorporator_2_name}}
**Incorporador 2:**
**Nombre:** {{incorporator_2_name}}
**Domicilio:** {{incorporator_2_address}}
**Firma:** ****************_****************
{{/if}}

{{#if incorporator_3_name}}
**Incorporador 3:**
**Nombre:** {{incorporator_3_name}}
**Domicilio:** {{incorporator_3_address}}
**Firma:** ****************_****************
{{/if}}

---

## 6. Directores Iniciales

{{#if initial_directors_named}}
Los nombres y domicilios de los directores iniciales son:

**Director 1:**
**Nombre:** {{director_1_name}}
**Domicilio:** {{director_1_address}}

**Director 2:**
**Nombre:** {{director_2_name}}
**Domicilio:** {{director_2_address}}

**Director 3:**
**Nombre:** {{director_3_name}}
**Domicilio:** {{director_3_address}}

{{additional_directors}}
{{else}}
El numero de directores iniciales es {{initial_director_count}}, pero sus nombres y domicilios no se detallan en este documento. Seran designados conforme a los estatutos sociales.
{{/if}}

---

## 7. Oficina Principal

La direccion de la oficina principal de la corporacion es:
{{principal_office_address}}

**Direccion postal (si es diferente):**
{{#if different_mailing_address}}
{{mailing_address}}
{{else}}
Igual que la direccion de la oficina principal.
{{/if}}

---

## 8. Duracion

{{#if perpetual_duration}}
La corporacion tendra existencia perpetua.
{{else}}
La corporacion tendra una duracion de {{duration_period}}.
{{/if}}

---

## 9. Disposiciones Adicionales

{{#if additional_provisions}}

### 9.1 Limitacion de Responsabilidad de los Directores

{{director_liability_limitation}}

### 9.2 Indemnizacion

{{indemnification_provisions}}

### 9.3 Combinaciones de Negocios

{{business_combination_provisions}}

### 9.4 Otras Disposiciones

{{other_provisions}}
{{else}}
No se incluyen disposiciones adicionales.
{{/if}}

---

## 10. Elecciones Fiscales y Corporativas

{{#if s_corporation_election}}

### 10.1 Eleccion de Corporacion S

La corporacion elige el tratamiento como Corporacion S para efectos fiscales federales y presentara el Formulario 2553 ante el Servicio de Impuestos Internos.
{{/if}}

{{#if close_corporation}}

### 10.2 Eleccion de Corporacion Cerrada

La corporacion elige ser tratada como corporacion cerrada conforme a la ley de {{state}}.
{{/if}}

---

## 11. Fecha de Vigencia

{{#if delayed_effective_date}}
Estos Estatutos entraran en vigor el {{effective_date}}.
{{else}}
Estos Estatutos entraran en vigor al momento de su presentacion ante la Secretaria de Estado.
{{/if}}

---

## 12. Declaracion de los Incorporadores

Los incorporadores declaran que:

- La informacion contenida en estos Estatutos es verdadera y correcta.
- La corporacion se organiza con fines legitimos.
- Los incorporadores tienen autoridad para firmar estos Estatutos de Incorporacion.

---

## Signatures

## 13. Firmas de los Incorporadores

**EN FE DE LO CUAL**, los incorporadores suscriben estos Estatutos con fecha {{execution_date}}.

**FIRMAS DE INCORPORADORES:**

**{{incorporator_1_name}}:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{incorporator_1_name}}, Incorporador |                    |

{{#if incorporator_2_name}}
**{{incorporator_2_name}}:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{incorporator_2_name}}, Incorporador |                    |
{{/if}}

{{#if incorporator_3_name}}
**{{incorporator_3_name}}:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{incorporator_3_name}}, Incorporador |                    |
{{/if}}

---

## 14. Aceptacion del Agente Registrado

{{#if registered_agent_acceptance_required}}
Yo, {{registered_agent_name}}, acepto el nombramiento como agente registrado de {{corporation_name}}.

**AGENTE REGISTRADO:**

| Firma                               | Fecha              |
| ----------------------------------- | ------------------ |
| ****************_****************   | {{execution_date}} |
| {{registered_agent_name}}           |                    |
| Agente Registrado                   |                    |

{{/if}}

---

## 15. Informacion de Presentacion

**Para uso de la Secretaria de Estado:**

**Cuota de presentacion:** $****__****  
**Numero de expediente:** ****__****  
**Fecha de presentacion:** ****__****  
**Fecha de vigencia:** ****__****

**Registrado por:** ************__************  
**Secretaria de Estado de {{state}}**

---

## 16. Informacion de Contacto

**Contacto principal de la corporacion:**
**Nombre:** {{primary_contact_name}}  
**Cargo:** {{primary_contact_title}}  
**Telefono:** {{primary_contact_phone}}  
**Correo electronico:** {{primary_contact_email}}

**Abogado (si aplica):**
**Nombre:** {{attorney_name}}  
**Despacho:** {{law_firm_name}}  
**Telefono:** {{attorney_phone}}  
**Correo electronico:** {{attorney_email}}  
**Numero de colegiatura:** {{attorney_bar_number}}

---

## 17. Documentos Requeridos

{{#if required_attachments}}
Se adjuntan los siguientes documentos:
{{attachment_list}}
{{else}}
No se adjuntan documentos adicionales.
{{/if}}

---

**IMPORTANT LEGAL NOTICE / AVISO LEGAL IMPORTANTE:** Estos Estatutos de Incorporacion deben revisarse con un profesional legal calificado para asegurar el cumplimiento de las leyes corporativas de {{state}} y de los requisitos comerciales especificos. Las exigencias estatales pueden variar, por lo que se recomienda obtener asesoria legal y fiscal antes de presentar esta documentacion. Documentos adicionales, como reglamentos internos, acuerdos de accionistas y elecciones fiscales federales, pueden ser necesarios para completar el proceso de incorporacion.

_Ac 2025 123LegalDoc - Formulario de autoservicio - No es asesoramiento legal - Terminos: 123LegalDoc.com/terms_