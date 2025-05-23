# Contrato de Compraventa de Vehículo
**ID del Documento:** `bill-of-sale-vehicle`

---

Este Contrato de Compraventa de Vehículo ("Acuerdo") se celebra y entra en vigor el **{{sale_date}}**, entre:

{{#each sellers}}
- **Vendedor:** {{this.name}}, con domicilio en {{this.address}}{{#if this.phone}}, Teléfono: {{this.phone}}{{/if}}
{{/each}}

{{#each buyers}}
- **Comprador:** {{this.name}}, con domicilio en {{this.address}}{{#if this.phone}}, Teléfono: {{this.phone}}{{/if}}
{{/each}}

Referidos colectivamente en este documento como las “Partes”.

---

## 1. Descripción del Vehículo

El Vendedor por el presente vende al Comprador, y el Comprador por el presente compra al Vendedor, el siguiente vehículo motorizado (el “Vehículo”):

| Campo                                      | Descripción                         |
|--------------------------------------------|-------------------------------------|
| Año                                        | {{year}}                    |
| Marca                                      | {{make}}                    |
| Modelo                                     | {{model}}                   |
| Color                                      | {{color}}                   |
| Número de Identificación del Vehículo (VIN) | {{vin}}            |
| Lectura del Odómetro                       | {{odometer}} millas         |

## 2. Precio de Compra y Pago

1. **Precio de Venta:** El precio total de compra es **${{price}}** (Dólares Estadounidenses).
2. **Método de Pago:** {{payment_method}} (ej., Efectivo, Cheque, Transferencia Bancaria).
3. **Fecha de Pago:** El pago se realizó en su totalidad el **{{sale_date}}**.

## 3. Condición "Tal Como Está" ("As-Is")

El Comprador reconoce que el Vehículo se vende **"TAL COMO ESTÁ"**, sin ninguna garantía, expresa o implícita, incluyendo pero no limitándose a cualquier garantía implícita de comerciabilidad o idoneidad para un propósito particular.
{{#if warranty_text}}
**Garantías (si las hay):**
{{warranty_text}}
{{/if}}

## 4. Declaraciones y Garantías del Vendedor

El Vendedor declara y garantiza que:

1. El Vendedor es el propietario legal del Vehículo y tiene plena autoridad para venderlo.
2. El Vehículo está libre de todo gravamen, carga e interés de seguridad, excepto según se divulga:
   - {{existing_liens}}
3. A leal saber y entender del Vendedor, la lectura del odómetro es precisa.

## 5. Ley Aplicable

Este Acuerdo se regirá e interpretará de conformidad con las leyes del Estado de **{{state}}**.

{{#if requireNotary}}
Este documento debe ser notariado bajo las leyes de {{state}}.
{{/if}}

{{#if witnessCount}}
Número de Testigos Requeridos: {{witnessCount}}
{{/if}}

## 6. Firmas

**EN FE DE LO CUAL**, las Partes han ejecutado este Acuerdo en la fecha indicada anteriormente.

| Firma del Vendedor      | Fecha                |
|-------------------------|----------------------|
{{#each sellers}}
| ________________________| _____________________|
| ({{this.name}})       |                      |
| {{#if this.phone}}Teléfono: {{this.phone}}{{/if}} | |
{{/each}}


| Firma del Comprador     | Fecha                |
|-------------------------|----------------------|
{{#each buyers}}
| ________________________| _____________________|
| ({{this.name}})        |                      |
| {{#if this.phone}}Teléfono: {{this.phone}}{{/if}} | |
{{/each}}

### Reconocimiento Notarial

Estado de **{{state}}**
Condado de **{{county}}**

En este día **____** de **______________, 20__**, ante mí, el suscrito, Notario Público en y para dicho Estado, comparecieron personalmente {{#each sellers}}{{this.name}}{{#unless @last}}, {{/unless}}{{/each}} y {{#each buyers}}{{this.name}}{{#unless @last}}, {{/unless}}{{/each}}, conocidos personalmente por mí (o comprobados ante mí sobre la base de evidencia satisfactoria) como las personas cuyos nombres están suscritos a este Acuerdo y reconocieron que lo ejecutaron para los fines contenidos en el mismo.

**Notario Público:**   __________________________
Mi Comisión Expira: ______________

---

*Plantilla generada por 123 LegalDoc. Reemplace los campos entre corchetes con datos reales.*
