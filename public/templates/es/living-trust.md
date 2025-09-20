# Fideicomiso Revocable en Vida

---

**ACUERDO DE FIDEICOMISO REVOCABLE EN VIDA**

Este Acuerdo de Fideicomiso Revocable en Vida ("Acuerdo de Fideicomiso") se celebra el **{{creation_date}}**, por **{{grantor_name}}**, como Fideicomitente y Fiduciario inicial.

---

## 1. Información del Fideicomiso

### 1.1 Nombre del Fideicomiso y partes

**Nombre del Fideicomiso:** {{trust_name}}  
**Fideicomitente/Constituyente:** {{grantor_name}} de {{grantor_address}}  
**Fiduciario inicial:** {{initial_trustee_name}} de {{initial_trustee_address}}  
**Fecha del Fideicomiso:** {{creation_date}}  
**Ley aplicable:** {{governing_state}}

### 1.2 Identificación del Fideicomiso

**ID fiscal del Fideicomiso:** {{trust_tax_id}} (si corresponde)  
**SSN del Fideicomitente:** {{grantor_ssn}}

---

## 2. Finalidad e intención del Fideicomiso

### 2.1 Finalidad principal

La finalidad de este Fideicomiso es:

- Proporcionar la administración y distribución de los bienes del Fideicomitente
- Evitar los procedimientos sucesorios tras el fallecimiento del Fideicomitente
- Brindar cuidados al Fideicomitente durante cualquier periodo de incapacidad
- Garantizar la sucesión ordenada de los bienes a los beneficiarios
- {{additional_purposes}}

### 2.2 Naturaleza revocable

Este Fideicomiso es REVOCABLE y podrá ser enmendado, modificado o revocado por el Fideicomitente en cualquier momento durante su vida mientras conserve capacidad.

---

## 3. Bienes del Fideicomiso

### 3.1 Bienes iniciales del Fideicomiso

El Fideicomitente transfiere al Fideicomiso los siguientes bienes:
{{initial_trust_property}}

### 3.2 Bienes adicionales

El Fideicomitente podrá añadir bienes adicionales a este Fideicomiso en cualquier momento mediante:

- Transferir el título al Fiduciario
- Inscribir una escritura o cesión
- Ejecutar los documentos de traspaso correspondientes
- Disposiciones vertedoras establecidas en el testamento del Fideicomitente

### 3.3 Relación de activos

Se adjunta como Anexo A una relación de los bienes del Fideicomiso, la cual se incorpora al presente por referencia. Esta relación podrá actualizarse periódicamente sin necesidad de modificar este Acuerdo de Fideicomiso.

---

## 4. Disposiciones sobre el Fiduciario

### 4.1 Fiduciario inicial

{{grantor_name}} actuará como Fiduciario inicial de este Fideicomiso.

### 4.2 Fiduciarios sucesores

Tras el fallecimiento, renuncia o incapacidad del Fideicomitente, actuarán como Fiduciarios sucesores, en el orden indicado:

**Primer Fiduciario sucesor:** {{successor_trustee_1_name}} de {{successor_trustee_1_address}}

**Segundo Fiduciario sucesor:** {{successor_trustee_2_name}} de {{successor_trustee_2_address}}

**Fiduciario corporativo:** {{#if corporate_trustee}}{{corporate_trustee_name}} de {{corporate_trustee_address}}{{else}}Ninguno designado{{/if}}

### 4.3 Facultades del Fiduciario

El Fiduciario tendrá todas las facultades necesarias para la administración del Fideicomiso, incluidas, entre otras:

**Facultades de inversión:**

- Comprar, vender, intercambiar y administrar inversiones
- Mantener efectivo e invertir en cualquier tipo de bien
- Diversificar o mantener inversiones concentradas
- Contratar asesores de inversión y delegar decisiones de inversión

**Facultades sobre bienes raíces:**

- Comprar, vender, arrendar y administrar bienes inmuebles
- Mantener, mejorar y desarrollar bienes raíces
- Otorgar servidumbres y celebrar convenios de desarrollo
- Gestionar todos los aspectos relativos a la propiedad inmobiliaria

**Facultades empresariales:**

- Continuar, operar o liquidar participaciones empresariales
- Constituir sociedades, corporaciones o LLC
- Realizar inversiones y decisiones empresariales
- Contratar agentes y profesionales

**Facultades generales:**

- Distribuir ingresos y principal a los beneficiarios
- Realizar elecciones fiscales y presentar declaraciones
- Obtener préstamos y otorgar garantías
- Transigir reclamaciones y defender litigios
- Contratar abogados, contadores y otros profesionales

---

## 5. Distribuciones durante la vida del Fideicomitente

### 5.1 Ingresos y principal

Durante la vida del Fideicomitente, todos los ingresos y el principal del Fideicomiso se distribuirán al Fideicomitente o para su beneficio según lo indique.

### 5.2 Distribuciones en caso de incapacidad

Si el Fideicomitente queda incapacitado, el Fiduciario distribuirá ingresos y principal según sea necesario para:

- Salud y atención médica
- Mantenimiento y sustento
- Bienestar general y comodidad
- Nivel de vida habitual

### 5.3 Determinación de incapacidad

El Fideicomitente se considerará incapacitado cuando:
{{incapacity_determination}}

---

## 6. Distribuciones tras el fallecimiento del Fideicomitente

### 6.1 Distribuciones inmediatas

Al fallecer el Fideicomitente, el Fiduciario deberá:

- Pagar los gastos funerarios y de sepelio
- Pagar las deudas y gastos de administración
- Pagar los impuestos sucesorios y hereditarios
- Realizar los legados específicos indicados a continuación

### 6.2 Legados específicos

El Fiduciario distribuirá los siguientes legados específicos:

{{#each specific_bequests}}
**A {{beneficiary_name}}:** {{bequest_description}}
{{/each}}

### 6.3 Distribución del remanente del Fideicomiso

#### Opción A: Distribución directa

{{#if outright_distribution}}
Los bienes restantes del Fideicomiso se distribuirán directamente conforme a lo siguiente:
{{outright_distribution_plan}}
{{/if}}

#### Opción B: Continuación del Fideicomiso para beneficiarios

{{#if continuing_trust}}
Los bienes restantes del Fideicomiso permanecerán en fideicomiso para los siguientes beneficiarios:

**Beneficiarios principales:**
{{#each primary_beneficiaries}}

- **{{name}}** ({{relationship}}): participación del {{percentage}}%
  {{/each}}

**Beneficiarios contingentes:**
{{#each contingent_beneficiaries}}

- **{{name}}** ({{relationship}}): participación del {{percentage}}%
  {{/each}}
  {{/if}}

---

## 7. Disposiciones para los beneficiarios del Fideicomiso

{{#if continuing_trust}}

### 7.1 Estándares de distribución

Para cualquier fideicomiso continuo, el Fiduciario podrá distribuir ingresos y principal para:

- Salud, educación, mantenimiento y sustento (estándar HEMS)
- Mejores intereses y bienestar de los beneficiarios
- {{additional_distribution_standards}}

### 7.2 Distribuciones según la edad

**Distribuciones obligatorias:**

- Edad {{distribution_age_1}}: {{distribution_percentage_1}}% de la porción del beneficiario
- Edad {{distribution_age_2}}: {{distribution_percentage_2}}% de la porción del beneficiario
- Edad {{distribution_age_3}}: {{distribution_percentage_3}}% de la porción del beneficiario (distribución final)

### 7.3 Terminación de los fideicomisos individuales

El fideicomiso de cada beneficiario terminará cuando:

- Ocurra el fallecimiento del beneficiario
- Se distribuyan todos los bienes del fideicomiso
- El beneficiario alcance la edad de {{final_distribution_age}}
- Se cumplan otras condiciones: {{termination_conditions}}
  {{/if}}

---

## 8. Disposiciones especiales

### 8.1 Protección antialienación

Ningún beneficiario podrá ceder, pignorar o gravar su interés en el Fideicomiso, ni dicho interés estará sujeto a embargo, ejecución u otro procedimiento legal.

### 8.2 Cláusula de no impugnación

Si algún beneficiario impugna este Fideicomiso o ayuda a impugnar su validez, esa persona perderá cualquier interés en el Fideicomiso.

### 8.3 Distribución por estirpes

Salvo disposición en contrario, las distribuciones a los descendientes se realizarán por estirpes (por derecho de representación).

### 8.4 Hijos posteriores

Cualquier hijo nacido o adoptado por el Fideicomitente después de la fecha de este Fideicomiso será tratado como beneficiario en los mismos términos que los hijos existentes.

---

## 9. Disposiciones administrativas

### 9.1 Compensación del Fiduciario

{{#if trustee_compensation}}
El Fiduciario tendrá derecho a una compensación razonable conforme a lo siguiente: {{compensation_terms}}
{{else}}
Los Fiduciarios individuales prestarán sus servicios sin remuneración. Los Fiduciarios corporativos tendrán derecho a sus honorarios habituales.
{{/if}}

### 9.2 Contabilidad y registros

El Fiduciario deberá:

- Llevar registros precisos de todas las operaciones
- Proporcionar estados contables anuales a los beneficiarios
- Presentar las declaraciones fiscales requeridas
- Mantener cuentas bancarias separadas del Fideicomiso

### 9.3 Estándar de inversión

El Fiduciario invertirá los bienes del Fideicomiso como lo haría un inversionista prudente, considerando los fines y términos del Fideicomiso.

### 9.4 Responsabilidad e indemnización

El Fiduciario no será responsable por pérdidas, salvo aquellas derivadas de mala fe, dolo o negligencia grave.

---

## 10. Disposiciones fiscales

### 10.1 Condición de fideicomiso del concedente

Durante la vida del Fideicomitente, este Fideicomiso se considera un "grantor trust" para efectos del impuesto sobre la renta, y todos los ingresos tributan al Fideicomitente.

### 10.2 Elecciones fiscales

El Fiduciario podrá realizar las elecciones fiscales que considere convenientes, incluidas:

- Elección conforme a la Sección 645 (si corresponde)
- Elecciones relativas al impuesto sobre transferencias generacionales
- Elecciones de distribución para efectos del impuesto sobre la renta

### 10.3 Pago de impuestos

El Fiduciario podrá pagar con bienes del Fideicomiso los impuestos que graven los ingresos del Fideicomiso o solicitar reembolso al Fideicomitente.

---

## 11. Modificación y revocación

### 11.1 Derecho de modificación

El Fideicomitente podrá modificar este Fideicomiso en cualquier momento mediante:

- Instrumento escrito firmado por el Fideicomitente
- Registro de la enmienda junto con este Acuerdo de Fideicomiso
- Entrega de un aviso al Fiduciario

### 11.2 Derecho de revocación

El Fideicomitente podrá revocar este Fideicomiso en su totalidad mediante:

- Revocación escrita entregada al Fiduciario
- Cumplimiento sustancial de los procedimientos de revocación
- Revocación expresa en un testamento o fideicomiso posterior

### 11.3 Irrevocabilidad después del fallecimiento

Este Fideicomiso se vuelve irrevocable tras el fallecimiento del Fideicomitente y no podrá ser modificado ni revocado posteriormente.

---

## 12. Disposiciones generales

### 12.1 Ley aplicable

Este Fideicomiso se regirá por las leyes de {{governing_state}}.

### 12.2 Divisibilidad

Si alguna disposición se considera inválida, las disposiciones restantes permanecerán en pleno vigor y efecto.

### 12.3 Interpretación

Este Fideicomiso se interpretará de forma amplia para cumplir con la intención del Fideicomitente expresada en el presente.

### 12.4 Títulos y encabezados

Los títulos de las secciones se incluyen solo para conveniencia y no afectan el significado de las disposiciones.

---

## 13. Definiciones

**"Fideicomitente"** significa {{grantor_name}} y cualquier fideicomitente sucesor.  
**"Fideicomiso"** significa este Fideicomiso Revocable en Vida y sus enmiendas.  
**"Fiduciario"** significa el o los fiduciarios en funciones de este Fideicomiso.  
**"Beneficiario"** significa toda persona con derecho a recibir distribuciones de este Fideicomiso.  
**"Descendencia"** significa los descendientes en cualquier grado, ya sean biológicos o adoptados.

---

## 14. Ejecución

**EN FE DE LO CUAL**, el Fideicomitente ha firmado este Acuerdo de Fideicomiso Revocable en Vida el **{{creation_date}}**.

**FIDEICOMITENTE:**

| Firma | Fecha |
| ------------------------------------------ | ----------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{creation_date}} |
| {{grantor_name}} | |
| Nombre en letra de imprenta: {{grantor_name}} | |

**ACEPTACIÓN DEL FIDUCIARIO:**

Acepto el cargo de Fiduciario y me comprometo a administrar este Fideicomiso conforme a sus términos.

| Firma | Fecha |
| ------------------------------------------ | ----------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{creation_date}} |
| {{initial_trustee_name}} | |
| Nombre en letra de imprenta: {{initial_trustee_name}} | |

---

## 15. Notarización

**Estado de {{state}}**  
**Condado de {{county}}**

En esta fecha **{{creation_date}}**, compareció personalmente ante mí {{grantor_name}}, quien demostró mediante pruebas satisfactorias ser la persona cuyo nombre figura en este instrumento y reconoció que lo firmó en su carácter autorizado, y que mediante su firma la persona, o la entidad en nombre de la cual actuó, ejecutó este instrumento.

Certifico BAJO PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que el párrafo anterior es verdadero y correcto.

**DOY FE** con mi firma y sello oficial.

**Notario Público:** ******\*\*\*\*******\_******\*\*\*\*******  
**Mi comisión expira:** ****\*\*\*\*****\_****\*\*\*\*****

---

**AVISO LEGAL IMPORTANTE:** Este Fideicomiso Revocable en Vida debe ser revisado por un abogado calificado en planificación patrimonial para garantizar el cumplimiento de las leyes estatales y su correcta integración con su plan patrimonial general. La normativa de fideicomisos varía considerablemente entre estados, y la correcta aportación de bienes al fideicomiso es esencial para su eficacia.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
