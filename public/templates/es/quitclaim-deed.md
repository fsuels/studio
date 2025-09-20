# Escritura de Renuncia de Derechos (Quitclaim)

---

**ESCRITURA DE RENUNCIA DE DERECHOS (QUITCLAIM)**

**Estado de {{state}}**  
**Condado de {{county}}**

---

## 1. Información de la transferencia

**Fecha del documento:** {{deed_date}}  
**Datos de registro:** {{recording_info}} (para uso del registrador)

### 1.1 Partes

**Cedente (propietario actual):** {{grantor_name}}  
**Domicilio del cedente:** {{grantor_address}}  
**Estado civil del cedente:** {{grantor_marital_status}}

{{#if multiple_grantors}}
**Cedente adicional:** {{grantor_2_name}}  
**Domicilio del cedente adicional:** {{grantor_2_address}}
{{/if}}

**Cesionario (nuevo propietario):** {{grantee_name}}  
**Domicilio del cesionario:** {{grantee_address}}  
**Estado civil del cesionario:** {{grantee_marital_status}}

{{#if multiple_grantees}}
**Cesionario adicional:** {{grantee_2_name}}  
**Domicilio del cesionario adicional:** {{grantee_2_address}}  
**Tipo de titularidad:** {{ownership_type}} (Copropietarios con derecho de supervivencia/Inquilinos en común/Bienes gananciales)
{{/if}}

---

## 2. Descripción del inmueble

### 2.1 Domicilio del inmueble

**Dirección:** {{property_address}}  
**Ciudad:** {{city}}, **Estado:** {{state}}, **ZIP:** {{zip_code}}  
**Condado:** {{county}}

### 2.2 Descripción legal

{{legal_description}}

**Número de parcela del catastro (APN):** {{assessors_parcel_number}}

### 2.3 Detalles del inmueble

**Tipo de propiedad:** {{property_type}} (Residencial/Comercial/Terreno baldío)  
**Tamaño aproximado:** {{property_size}}  
**Zonificación:** {{zoning_designation}}

---

## 3. Contraprestación y transferencia

### 3.1 Contraprestación

{{#if nominal_consideration}}
**Contraprestación:** Por la suma de Diez Dólares ($10.00) y otros valores y consideraciones, cuyo recibo se reconoce por la presente.
{{else}}
**Contraprestación:** Por la suma de **${{consideration_amount}}** y otros valores y consideraciones, cuyo recibo se reconoce por la presente.
{{/if}}

### 3.2 Declaración de transferencia

El/Los Cedente(s) ceden, liberan y renuncian de manera irrevocable al/los Cesionario(s), sus herederos y cesionarios, todo derecho, título, interés y reclamación que el/los Cedente(s) tengan sobre el inmueble descrito anteriormente.

---

## 4. Alcance de la renuncia y garantías

### 4.1 Naturaleza de la escritura de renuncia

**IMPORTANTE:** Esta es una escritura de renuncia (Quitclaim). El Cedente NO ofrece GARANTÍAS sobre el título de la propiedad. El Cedente transmite únicamente el interés que tenga, si alguno, sobre el inmueble. El Cesionario no recibe garantía alguna sobre la calidad o extensión del título transferido.

### 4.2 Ausencia de garantías de título

El Cedente NO garantiza ni asegura:

- Que sea propietario del inmueble
- Que el título esté libre de gravámenes
- Que no existan hipotecas o cargas
- Que la descripción del inmueble sea exacta
- Protección contra defectos de título

### 4.3 Transferencia "tal como está"

El inmueble se transfiere en su condición actual, "TAL COMO ESTÁ", sin garantías ni representaciones respecto a:

- Condición física del inmueble
- Cumplimiento con códigos de construcción o normas de zonificación
- Condiciones ambientales
- Conflictos de linderos
- Derechos de acceso

---

## 5. Sujeción a condiciones existentes

### 5.1 Gravámenes existentes

Esta transferencia queda sujeta a:

- Todos los gravámenes, hipotecas y cargas registradas
- Servidumbres, restricciones y convenios inscritos
- Impuestos y contribuciones sobre la propiedad
- {{existing_encumbrances}}

### 5.2 Reservas específicas

{{#if has_reservations}}
El Cedente se reserva los siguientes derechos:
{{reserved_rights}}
{{else}}
El Cedente no reserva derechos sobre la propiedad.
{{/if}}

---

## 6. Declaraciones complementarias

### 6.1 Declaración de impuestos sobre transferencia

{{#if transfer_tax_exempt}}
Esta transferencia está exenta del impuesto de transferencia por la siguiente razón: {{transfer_tax_exemption_reason}}
{{else}}
El impuesto de transferencia aplicable será pagado conforme a la ley.
{{/if}}

### 6.2 Declaración de ocupación

{{#if grantor_is_owner_occupied}}
El inmueble era ocupado por el Cedente como residencia principal.
{{else}}
El inmueble no era ocupado por el Cedente como residencia principal.
{{/if}}

---

## 7. Declaraciones tributarias

{{#if tax_declarations}}
{{tax_declarations}}
{{/if}}

### 7.1 Declaración del cedente

El Cedente certifica que la información proporcionada es exacta y completa.

### 7.2 Declaración del cesionario

El Cesionario reconoce que recibe la propiedad sin garantías de título.

---

## 8. Condiciones adicionales

### 8.1 Condiciones especiales

{{#if special_conditions}}
{{special_conditions}}
{{else}}
No aplican condiciones especiales a esta transferencia.
{{/if}}

### 8.2 Fecha de vigencia

Esta escritura surtirá efecto a partir de {{effective_date}}.

### 8.3 Ley aplicable

Esta escritura se regirá por las leyes del Estado de {{state}}.

---

## 9. Reconocimiento del cedente

El/Los Cedente(s) reconocen que:

- Comprenden la naturaleza de una escritura de renuncia
- No otorgan garantías sobre el título
- Han leído y entienden este documento
- Firman esta escritura de manera voluntaria

---

## 10. Ejecución y firmas

**EN TESTIMONIO DE LO CUAL**, el/los Cedente(s) suscriben esta Escritura de Renuncia de Derechos el **{{deed_date}}**.

**CEDENTE:**

| Firma | Fecha |
| ------------------------------------------ | ------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{deed_date}} |
| {{grantor_name}} | |
| Nombre en letra de imprenta: {{grantor_name}} | |

{{#if multiple_grantors}}
**CEDENTE ADICIONAL:**

| Firma | Fecha |
| ------------------------------------------ | ------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{deed_date}} |
| {{grantor_2_name}} | |
| Nombre en letra de imprenta: {{grantor_2_name}} | |

{{/if}}

---

## 11. Reconocimiento/Notarización

**Estado de {{state}}**  
**Condado de {{county}}**

En esta fecha **{{deed_date}}**, compareció/comparecieron personalmente ante mí **{{grantor_name}}**{{#if multiple_grantors}} y **{{grantor_2_name}}**{{/if}}, quienes acreditaron mediante pruebas satisfactorias ser la(s) persona(s) cuyo(s) nombre(s) aparece(n) en este instrumento y reconocieron haberlo firmado en su carácter autorizado, y que mediante su firma dicho instrumento fue ejecutado por la(s) persona(s) o la entidad en cuyo nombre actuaron.

Certifico BAJO PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que el párrafo anterior es verdadero y correcto.

**DOY FE** con mi firma y sello oficial.

**Notario Público:** ******\*\*\*\*******\_******\*\*\*\*******  
**Mi comisión expira:** ****\*\*\*\*****\_****\*\*\*\*****

**[Sello del notario]**

---

## 12. Información para el registro

**Solo para uso del registrador:**

**Número de documento:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Fecha de registro:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Hora de registro:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Registrado por:** **\*\*\*\***\_\_\_**\*\*\*\***

**Honorarios de registro:**

- Cuota de registro: $\***\*\_\_\_\*\***
- Impuesto de transferencia: $\***\*\_\_\_\*\***
- Otros cargos: $\***\*\_\_\_\*\***
- **Total:** $\***\*\_\_\_\*\***

---

## 13. Devolver el documento a

Después del registro, devuélvase este documento a:

**{{return_to_name}}**  
{{return_to_address}}

**Teléfono:** {{return_to_phone}}

---

## 14. Avisos importantes

### 14.1 Recomendación sobre seguro de título

**SE RECOMIENDA ENÉRGICAMENTE:** El Cesionario debe obtener un seguro de título para protegerse contra defectos, gravámenes u otros problemas no revelados por esta escritura de renuncia.

### 14.2 Asesoría profesional

Esta escritura debe ser revisada por profesionales legales y fiscales calificados antes de su firma, especialmente en lo relativo a:

- Implicaciones fiscales de la transferencia
- Consideraciones de planificación patrimonial
- Posibles responsabilidades
- Requisitos de registro

### 14.3 Requisito de registro

Esta escritura debe registrarse en la oficina del registrador del condado donde se ubica el inmueble para dar aviso público de la transferencia.

---

**AVISO LEGAL IMPORTANTE:** Esta escritura de renuncia debe ser revisada por un abogado inmobiliario calificado para asegurar el cumplimiento con las leyes estatales y locales. Las escrituras de renuncia no otorgan garantías de título y deben utilizarse solo cuando las partes comprenden los riesgos involucrados. Obtenga siempre seguro de título y asesoría legal profesional antes de completar transferencias inmobiliarias.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
