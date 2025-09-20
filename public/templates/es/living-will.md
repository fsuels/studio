# Testamento Vital (Directiva Anticipada de Atención Médica)

---

**TESTAMENTO VITAL**  
**DIRECTIVA ANTICIPADA DE ATENCIÓN MÉDICA**

**Estado de {{state}}**

---

## 1. Información personal

**Yo, {{declarant_name}}**, en pleno uso de mis facultades mentales y con al menos 18 años de edad, otorgo voluntariamente este Testamento Vital y Directiva Anticipada de Atención Médica.

**Información personal:**

- **Nombre completo:** {{declarant_name}}
- **Fecha de nacimiento:** {{declarant_dob}}
- **Domicilio:** {{declarant_address}}
- **Teléfono:** {{declarant_phone}}
- **Número de Seguro Social:** {{declarant_ssn}}

---

## 2. Finalidad e intención

### 2.1 Declaración de intención

Este Testamento Vital tiene como objetivo orientar a mi familia, médicos y demás proveedores de salud sobre mis deseos de tratamiento médico en caso de que no pueda comunicar mis decisiones sobre mi atención médica.

### 2.2 Autoridad legal

Este documento se emite al amparo de la legislación de {{state}} y está destinado a tener fuerza legal conforme a las leyes estatales y federales.

### 2.3 Alcance de la directiva

Esta directiva se aplica cuando:

- Me encuentro en una condición terminal
- Estoy en un estado de inconsciencia permanente
- Presento una condición en etapa terminal
- De otro modo no puedo comunicar mis decisiones de atención médica

---

## 3. Definición de términos

### 3.1 Condición terminal

Una condición terminal es una afección incurable causada por lesión, enfermedad o dolencia que, según el juicio médico razonable, provocará la muerte en un plazo relativamente corto con o sin la aplicación de tratamientos para sostener la vida.

### 3.2 Estado de inconsciencia permanente

Un estado de inconsciencia permanente es una condición incurable en la que no tengo conciencia de mí mismo ni de mi entorno y no muestro respuesta conductual ante el entorno.

### 3.3 Condición en etapa terminal

Una condición en etapa terminal es una afección incurable que ha provocado un deterioro progresivo, grave y permanente, y para la cual el tratamiento sería ineficaz.

### 3.4 Tratamiento para sostener la vida

Tratamiento para sostener la vida significa cualquier intervención, tecnología, procedimiento o medicamento administrado para retrasar el momento de la muerte.

---

## 4. Directivas de atención médica

### 4.1 Directivas en caso de condición terminal

{{#if terminal_condition_directive}}
**Si me encuentro en una condición terminal:** {{terminal_condition_wishes}}

{{#if withhold_life_sustaining_treatment}}
- [ ] **SUSPENDER** los tratamientos para sostener la vida, incluyendo entre otros:

- Ventilación mecánica/respiradores
- Nutrición e hidratación artificial
- Reanimación cardiopulmonar (RCP)
- Diálisis
- Antibióticos para infecciones potencialmente mortales
- {{additional_treatments_to_withhold}}
  {{/if}}

{{#if provide_comfort_care}}
- [ ] **PROPORCIONAR** cuidados paliativos y alivio del dolor, aun si ello pudiera acelerar la muerte
{{/if}}
{{/if}}

### 4.2 Directivas en caso de inconsciencia permanente

{{#if unconscious_state_directive}}
**Si me encuentro en un estado de inconsciencia permanente:** {{unconscious_state_wishes}}

{{#if withhold_life_sustaining_unconscious}}
- [ ] **SUSPENDER** los tratamientos para sostener la vida
- [ ] **PROPORCIONAR** únicamente cuidados de confort
{{/if}}
{{/if}}

### 4.3 Directivas en caso de condición en etapa terminal

{{#if end_stage_directive}}
**Si me encuentro en una condición en etapa terminal:** {{end_stage_wishes}}
{{/if}}

---

## 5. Instrucciones médicas específicas

### 5.1 Reanimación cardiopulmonar (RCP)

{{#if cpr_wishes}}
**Instrucciones sobre RCP:** {{cpr_directive}}
{{else}}
- [ ] Quiero que se intente la RCP
- [ ] NO quiero que se intente la RCP
- [ ] Deseo que se intente la RCP solo si la situación ofrece una posibilidad razonable de recuperación
{{/if}}

### 5.2 Ventilación mecánica

{{#if ventilation_wishes}}
**Instrucciones sobre ventilación:** {{ventilation_directive}}
{{else}}
- [ ] Deseo ventilación mecánica
- [ ] NO deseo ventilación mecánica
- [ ] Deseo ventilación mecánica por un periodo de prueba de {{trial_period}} días
{{/if}}

### 5.3 Nutrición e hidratación artificial

{{#if nutrition_wishes}}
**Instrucciones sobre nutrición/hidratación:** {{nutrition_directive}}
{{else}}
- [ ] Deseo nutrición e hidratación artificial
- [ ] NO deseo nutrición e hidratación artificial
- [ ] Deseo nutrición e hidratación artificial por un periodo limitado
{{/if}}

### 5.4 Diálisis

{{#if dialysis_wishes}}
**Instrucciones sobre diálisis:** {{dialysis_directive}}
{{else}}
- [ ] Deseo recibir diálisis
- [ ] NO deseo recibir diálisis
- [ ] Deseo diálisis solo si existe una probabilidad razonable de recuperación
{{/if}}

### 5.5 Antibióticos

{{#if antibiotics_wishes}}
**Instrucciones sobre antibióticos:** {{antibiotics_directive}}
{{else}}
- [ ] Deseo antibióticos para infecciones potencialmente mortales
- [ ] NO deseo antibióticos para infecciones potencialmente mortales
- [ ] Deseo antibióticos únicamente con fines de confort
{{/if}}

### 5.6 Cirugía

{{#if surgery_wishes}}
**Instrucciones sobre cirugía:** {{surgery_directive}}
{{else}}
- [ ] Deseo cirugía si puede resultar beneficiosa
- [ ] NO deseo cirugía
- [ ] Deseo cirugía solo con fines de confort
{{/if}}

---

## 6. Manejo del dolor y cuidados de confort

### 6.1 Alivio del dolor

{{#if pain_relief_directive}}
**Instrucciones sobre manejo del dolor:** {{pain_relief_wishes}}
{{else}}
- [ ] Deseo todos los medicamentos necesarios para el dolor, aun si acortan mi vida
- [ ] Deseo medicación para el dolor que no acorte mi vida
- [ ] Deseo la mínima medicación posible para el dolor
{{/if}}

### 6.2 Medidas de confort

**Instrucciones de cuidados de confort:** {{comfort_care_wishes}}

Deseo las siguientes medidas de confort:

- Mantenerme limpio(a) y cómodo(a)
- Brindar apoyo emocional y espiritual
- Permitir visitas de familiares y amigos
- {{additional_comfort_measures}}

### 6.3 Cuidados paliativos

{{#if palliative_care_wishes}}
**Cuidados paliativos:** {{palliative_care_directive}}
{{/if}}

---

## 7. Donación de órganos y tejidos

### 7.1 Deseos de donación

{{#if organ_donation}}
**Donación de órganos:** {{organ_donation_wishes}}

{{#if donate_all_organs}}
- [ ] Deseo donar todos los órganos y tejidos adecuados
{{/if}}

{{#if specific_organ_donation}}
- [ ] Deseo donar únicamente los siguientes órganos/tejidos: {{specific_organs}}
{{/if}}

{{#if no_organ_donation}}
- [ ] NO deseo donar órganos ni tejidos
{{/if}}
{{else}}
- [ ] Deseo donar todos los órganos y tejidos adecuados
- [ ] Deseo donar órganos específicos: **\*\***\_\_\_\_**\*\***
- [ ] NO deseo donar órganos ni tejidos
{{/if}}

### 7.2 Procedimientos de donación

{{#if donation_procedures}}
**Instrucciones especiales para la donación:** {{donation_instructions}}
{{/if}}

---

## 8. Consideraciones sobre embarazo

{{#if pregnancy_directive}}

### 8.1 Instrucciones durante el embarazo

**Si estoy embarazada:** {{pregnancy_wishes}}
{{else}}
**Si estoy embarazada cuando esta directiva deba surtir efecto, dispongo que:**
- [ ] Esta directiva se aplique sin importar el embarazo
- [ ] Se proporcionen tratamientos para sostener la vida hasta que el feto sea viable
- [ ] Otras instrucciones: ******\*\*******\_\_\_\_******\*\*******
{{/if}}

---

## 9. Consideraciones religiosas y espirituales

### 9.1 Preferencias religiosas

{{#if religious_preferences}}
**Instrucciones religiosas/espirituales:** {{religious_wishes}}

**Líder religioso a contactar:**

- **Nombre:** {{religious_leader_name}}
- **Título:** {{religious_leader_title}}
- **Teléfono:** {{religious_leader_phone}}
- **Afiliación religiosa:** {{religious_affiliation}}
  {{/if}}

### 9.2 Atención espiritual

{{#if spiritual_care_wishes}}
**Instrucciones de atención espiritual:** {{spiritual_care_directive}}
{{/if}}

---

## 10. Duración y revocación

### 10.1 Periodo de vigencia

Este Testamento Vital permanecerá vigente hasta que:

- Lo revoque por escrito
- Elabore un nuevo Testamento Vital que lo sustituya
- {{additional_termination_conditions}}

### 10.2 Proceso de revocación

Puedo revocar este Testamento Vital en cualquier momento mediante:

- Destruir este documento
- Redactar un nuevo Testamento Vital
- Expresar oralmente mi intención de revocarlo ante testigos
- Cualquier otro método reconocido por la ley de {{state}}

### 10.3 Actualizaciones y modificaciones

Debo revisar y actualizar este documento:

- Cada 5 años
- Después de cambios importantes en mi vida
- Tras cambios en mi estado de salud
- Cuando cambie la legislación aplicable

---

## 11. Designación de representante o apoderado para la atención médica

{{#if healthcare_agent_designated}}

### 11.1 Representante principal de atención médica

Designo a la siguiente persona como mi representante para tomar decisiones médicas en mi nombre si yo no puedo tomarlas:

**Representante principal:**

- **Nombre:** {{primary_agent_name}}
- **Relación:** {{primary_agent_relationship}}
- **Domicilio:** {{primary_agent_address}}
- **Teléfono:** {{primary_agent_phone}}
- **Correo electrónico:** {{primary_agent_email}}

### 11.2 Representante alterno de atención médica

Si mi representante principal no está disponible, designo a:

**Representante alterno:**

- **Nombre:** {{alternate_agent_name}}
- **Relación:** {{alternate_agent_relationship}}
- **Domicilio:** {{alternate_agent_address}}
- **Teléfono:** {{alternate_agent_phone}}

### 11.3 Facultades del representante

Mi representante de atención médica tiene la facultad de:

- Tomar decisiones de tratamiento médico conforme a este Testamento Vital
- Acceder a mis expedientes médicos
- Comunicarse con los proveedores de servicios de salud
- {{additional_agent_powers}}

### 11.4 Limitaciones del representante

Mi representante de atención médica NO puede:

- Contravenir las directrices específicas de este documento
- {{agent_limitations}}
  {{else}}
  **NO he designado un representante de atención médica.** Las decisiones médicas deberán tomarse conforme a este Testamento Vital y a la legislación aplicable.
  {{/if}}

---

## 12. Notificación a la familia

### 12.1 Personas a notificar

**Por favor, notificar a las siguientes personas sobre mi condición:**

**Contacto principal:**

- **Nombre:** {{primary_contact_name}}
- **Relación:** {{primary_contact_relationship}}
- **Teléfono:** {{primary_contact_phone}}

**Contactos adicionales:**

- {{contact_2_name}} ({{contact_2_relationship}}) - {{contact_2_phone}}
- {{contact_3_name}} ({{contact_3_relationship}}) - {{contact_3_phone}}
- {{additional_contacts}}

### 12.2 Deseos sobre visitas

{{#if visitation_wishes}}
**Instrucciones sobre visitas:** {{visitation_directive}}
{{/if}}

---

## 13. Instrucciones adicionales

### 13.1 Circunstancias especiales

{{#if special_circumstances}}
**Circunstancias médicas especiales:** {{special_circumstances_directive}}
{{/if}}

### 13.2 Preferencias de ubicación

{{#if location_preferences}}
**Lugar preferido para recibir atención:** {{care_location_wishes}}
{{/if}}

### 13.3 Otros deseos

{{#if other_wishes}}
**Instrucciones adicionales:** {{other_instructions}}
{{/if}}

---

## 14. Declaraciones legales

### 14.1 Capacidad mental

Estoy en pleno uso de mis facultades y no actúo bajo coacción, fraude ni influencia indebida. Comprendo la naturaleza y las consecuencias de este Testamento Vital.

### 14.2 Comprensión médica

Entiendo que mi condición puede cambiar y que la tecnología médica puede avanzar. Esta directiva refleja mis deseos según mi entendimiento actual.

### 14.3 Efecto legal

Comprendo que este documento tiene fuerza y efecto legales conforme a las leyes de {{state}}.

### 14.4 Instrucciones para proveedores de salud

Ordeno que cualquier proveedor de salud que no pueda o no desee cumplir esta directiva transfiera mi atención a profesionales que respeten mis deseos.

---

## 15. Firmas y testigos

### 15.1 Firma del declarante

**FIRMADO** el **{{execution_date}}** en {{execution_location}}.

**DECLARANTE:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{declarant_name}} | |
| Nombre en letra de imprenta: {{declarant_name}} | |

### 15.2 Requisitos de los testigos

{{#if witnesses_required}}
**TESTIGOS:**

Este documento fue firmado en nuestra presencia. Consideramos que el declarante está en pleno uso de sus facultades y no actúa bajo coacción.

**TESTIGO 1:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{witness_1_name}} | |
| Domicilio: {{witness_1_address}} | |

**TESTIGO 2:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{witness_2_name}} | |
| Domicilio: {{witness_2_address}} | |

**Calificaciones de los testigos:**

- Ninguno de los testigos está relacionado con el declarante
- Ninguno de los testigos tiene derecho a heredar del declarante
- Ninguno de los testigos participa directamente en la atención médica del declarante
  {{/if}}

---

## 16. Notarización

{{#if notarization_required}}
**Estado de {{state}}**  
**Condado de {{county}}**

En esta fecha **{{execution_date}}**, compareció personalmente ante mí {{declarant_name}}, quien demostró mediante pruebas satisfactorias ser la persona cuyo nombre aparece en este instrumento y reconoció que lo firmó en su carácter autorizado.

Certifico BAJO PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que el párrafo anterior es verdadero y correcto.

**DOY FE** con mi firma y sello oficial.

**Notario Público:** ******\*\*\*\*******\_******\*\*\*\*******  
**Mi comisión expira:** ****\*\*\*\*****\_****\*\*\*\*****

**[Sello del notario]**
{{/if}}

---

## 17. Reconocimiento del proveedor de atención médica

{{#if provider_acknowledgment}}
**RECONOCIMIENTO DEL PROVEEDOR DE SALUD:**

He recibido una copia de este Testamento Vital y la he incorporado al expediente médico del paciente. Entiendo y cumpliré las directivas aquí contenidas.

**Proveedor:** ******\*\*\*\*******\_******\*\*\*\*******  
**Cargo:** ******\*\*\*\*******\_******\*\*\*\*******  
**Fecha:** ******\*\*\*\*******\_******\*\*\*\*******  
**Centro médico:** ******\*\*\*\*******\_******\*\*\*\*******
{{/if}}

---

## 18. Distribución y resguardo

### 18.1 Copias entregadas a:

- [ ] Agente principal de atención médica  
- [ ] Agente de atención médica alterno  
- [ ] Médico de cabecera  
- [ ] Hospital/centro médico  
- [ ] Miembros de la familia  
- [ ] Abogado  
- [ ] {{additional_copy_recipients}}

### 18.2 Lugar de resguardo

**Documento original resguardado en:** {{storage_location}}  
**Copias adicionales en:** {{additional_storage_locations}}

---

**AVISO LEGAL IMPORTANTE:** Este testamento vital debe ser revisado por profesionales legales y médicos calificados para garantizar el cumplimiento con las leyes estatales sobre directivas anticipadas y para atender circunstancias médicas particulares. La normativa sobre testamentos vitales varía significativamente entre estados, y este documento debe revisarse con los proveedores de salud para asegurar su correcta implementación.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
