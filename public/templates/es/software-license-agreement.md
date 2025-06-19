# Contrato de Licencia de Software

---

**CONTRATO DE LICENCIA DE SOFTWARE**

Este Contrato de Licencia de Software ("Contrato") se celebra el **{{agreement_date}}**, entre:

- **Licenciante:** {{licensor_name}}, una {{licensor_entity_type}} organizada bajo las leyes de {{licensor_state}}, con su lugar principal de negocios en {{licensor_address}}

- **Licenciatario:** {{licensee_name}}, una {{licensee_entity_type}} organizada bajo las leyes de {{licensee_state}}, con su lugar principal de negocios en {{licensee_address}}

Referidas colectivamente como las "Partes".

---

## 1. Software y Otorgamiento de Licencia

### 1.1 Software Licenciado
**Nombre del Software:** {{software_name}}
**Versión:** {{software_version}}
**Descripción:** {{software_description}}

### 1.2 Otorgamiento de Licencia
Sujeto a los términos y condiciones de este Contrato, el Licenciante otorga al Licenciatario una licencia {{license_type}} para usar el Software.

### 1.3 Alcance de la Licencia
**Tipo de Licencia:** {{license_type}}
- {{#if exclusive_license}}**Licencia Exclusiva:** El Licenciatario tiene derechos exclusivos para usar el Software{{/if}}
- {{#if non_exclusive_license}}**Licencia No Exclusiva:** El Licenciante puede licenciar a otras partes{{/if}}
- **Territorio:** {{license_territory}}
- **Campo de Uso:** {{field_of_use}}

### 1.4 Usos Permitidos
El Licenciatario puede:
- {{permitted_use_1}}
- {{permitted_use_2}}
- {{permitted_use_3}}
- Instalar el Software en {{installation_limit}} dispositivos/usuarios

---

## 2. Restricciones de Licencia

### 2.1 Actividades Prohibidas
El Licenciatario NO puede:
- Hacer ingeniería inversa, descompilar o desensamblar el Software
- Modificar, adaptar o crear trabajos derivados
- Distribuir, sublicenciar o transferir el Software
- Remover o alterar avisos propietarios
- {{additional_restrictions}}

### 2.2 Limitaciones de Usuario
**Usuarios Máximos:** {{max_users}}
**Usuarios Concurrentes:** {{concurrent_users}}
**Límite de Instalación:** {{installation_limit}}

### 2.3 Restricciones Técnicas
{{#if technical_restrictions}}
El Software incluye medidas técnicas para hacer cumplir:
- {{technical_restriction_1}}
- {{technical_restriction_2}}
- {{technical_restriction_3}}
{{/if}}

---

## 3. Término y Terminación

### 3.1 Término de la Licencia
Este Contrato comenzará el **{{start_date}}** y continuará por {{license_term}} {{term_period}}, a menos que se termine antes.

### 3.2 Renovación
{{#if auto_renewal}}
Este Contrato se renovará automáticamente por períodos sucesivos de {{renewal_period}} a menos que sea terminado por cualquier Parte con {{renewal_notice}} días de aviso.
{{else}}
Este Contrato debe renovarse explícitamente por acuerdo mutuo.
{{/if}}

### 3.3 Terminación por Causa
Cualquier Parte puede terminar inmediatamente por:
- Incumplimiento material no corregido después de {{cure_period}} días de aviso escrito
- Insolvencia o bancarrota de la otra Parte
- Violación de restricciones de licencia

### 3.4 Efecto de la Terminación
Al terminar, el Licenciatario debe:
- Cesar todo uso del Software
- Desinstalar y eliminar todas las copias
- Devolver o destruir todos los materiales del Software
- Proporcionar certificación escrita de cumplimiento

---

## 4. Tarifas y Pago

### 4.1 Tarifas de Licencia
**Estructura de Tarifas de Licencia:** {{fee_structure}}
- {{#if upfront_fee}}**Tarifa Inicial de Licencia:** ${{upfront_fee}}{{/if}}
- {{#if annual_fee}}**Tarifa Anual de Licencia:** ${{annual_fee}}{{/if}}
- {{#if per_user_fee}}**Tarifa por Usuario:** ${{per_user_fee}} por usuario por {{fee_period}}{{/if}}

### 4.2 Términos de Pago
- **Pago Debido:** {{payment_terms}} días desde fecha de factura
- **Pago Tardío:** {{late_fee_rate}}% por mes
- **Moneda:** {{payment_currency}}

### 4.3 Impuestos
{{#if taxes_included}}
Todas las tarifas incluyen impuestos aplicables.
{{else}}
El Licenciatario es responsable de todos los impuestos, aranceles y tarifas aplicables.
{{/if}}

### 4.4 Ajustes de Tarifas
{{#if fee_escalation}}
Las tarifas pueden aumentar anualmente en {{escalation_rate}}% o el Índice de Precios al Consumidor, lo que sea menor.
{{/if}}

---

## 5. Soporte y Mantenimiento

### 5.1 Servicios de Soporte
{{#if support_included}}
**Nivel de Soporte:** {{support_level}}
- **Horarios de Soporte:** {{support_hours}}
- **Tiempo de Respuesta:** {{response_time}}
- **Métodos de Soporte:** {{support_methods}}
- **Período de Soporte:** {{support_period}}
{{else}}
No se incluyen servicios de soporte con esta licencia.
{{/if}}

### 5.2 Actualizaciones y Mejoras
{{#if updates_included}}
**Actualizaciones Incluidas:**
- Correcciones de errores y parches: {{updates_policy}}
- Actualizaciones de versión menor: {{minor_updates_policy}}
- Mejoras de versión mayor: {{major_upgrades_policy}}
{{else}}
Las actualizaciones y mejoras no están incluidas y deben comprarse por separado.
{{/if}}

### 5.3 Mantenimiento
{{#if maintenance_included}}
El mantenimiento incluye:
- {{maintenance_service_1}}
- {{maintenance_service_2}}
- {{maintenance_service_3}}
{{/if}}

---

## 6. Derechos de Propiedad Intelectual

### 6.1 Propiedad
El Licenciante retiene todo derecho, título e interés en y sobre el Software, incluyendo todos los derechos de propiedad intelectual.

### 6.2 No Transferencia
No se transfiere título o propiedad del Software al Licenciatario. Este Contrato otorga solo los derechos expresamente establecidos aquí.

### 6.3 Componentes de Terceros
{{#if third_party_components}}
El Software puede incluir componentes de terceros sujetos a términos de licencia separados:
{{third_party_licenses}}
{{/if}}

### 6.4 Retroalimentación
{{#if feedback_assignment}}
Cualquier retroalimentación o sugerencia proporcionada por el Licenciatario respecto al Software se convertirá en propiedad del Licenciante.
{{/if}}

---

## 7. Garantías y Descargos de Responsabilidad

### 7.1 Garantía Limitada
{{#if limited_warranty}}
El Licenciante garantiza que el Software funcionará sustancialmente de acuerdo con la documentación por {{warranty_period}} días desde la entrega.

**Remedios de Garantía:**
- Corrección de defectos
- Reemplazo de Software defectuoso
- Reembolso si la corrección no es posible
{{else}}
EL SOFTWARE SE PROPORCIONA "COMO ESTÁ" SIN NINGUNA GARANTÍA.
{{/if}}

### 7.2 Descargo de Responsabilidad
EXCEPTO POR LA GARANTÍA LIMITADA ANTERIOR, EL LICENCIANTE DESCARTA TODAS LAS DEMÁS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUYENDO COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN.

### 7.3 No Garantía Contra Interferencia
El Licenciante no garantiza que el Software operará sin interrupciones o libre de errores.

---

## 8. Limitación de Responsabilidad

### 8.1 Límite de Responsabilidad
LA RESPONSABILIDAD TOTAL DEL LICENCIANTE NO EXCEDERÁ LAS CANTIDADES TOTALES PAGADAS POR EL LICENCIATARIO BAJO ESTE CONTRATO EN LOS 12 MESES ANTERIORES A LA RECLAMACIÓN.

### 8.2 Daños Consecuenciales
EN NINGÚN EVENTO EL LICENCIANTE SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES O CONSECUENCIALES, INCLUYENDO PÉRDIDA DE GANANCIAS, PÉRDIDA DE DATOS O INTERRUPCIÓN DE NEGOCIOS.

### 8.3 Propósito Esencial
Estas limitaciones se aplican incluso si el remedio limitado falla en su propósito esencial.

---

## 9. Indemnización

### 9.1 Indemnización de PI
{{#if ip_indemnification}}
El Licenciante defenderá e indemnizará al Licenciatario contra reclamaciones de que el Software infringe derechos de propiedad intelectual de terceros, siempre que el Licenciatario:
- Notifique prontamente al Licenciante de la reclamación
- Dé al Licenciante control de la defensa
- Coopere en la defensa

**Opciones del Licenciante:**
- Obtener derechos para uso continuo
- Modificar Software para evitar infracción
- Reemplazar con alternativa no infractora
- Terminar licencia y reembolsar tarifas
{{/if}}

### 9.2 Indemnización del Licenciatario
El Licenciatario indemnizará al Licenciante contra reclamaciones que surjan de:
- Mal uso del Software
- Modificaciones hechas por el Licenciatario
- Incumplimiento de este Contrato

---

## 10. Datos y Privacidad

### 10.1 Procesamiento de Datos
{{#if data_processing}}
El Software procesa los siguientes tipos de datos:
{{data_types_processed}}

**Ubicación de Datos:** {{data_location}}
**Retención de Datos:** {{data_retention_period}}
{{/if}}

### 10.2 Cumplimiento de Privacidad
{{#if privacy_compliance}}
Ambas Partes cumplirán con las leyes de privacidad aplicables incluyendo:
{{privacy_laws_list}}
{{/if}}

### 10.3 Seguridad de Datos
{{#if data_security}}
El Licenciante mantiene las siguientes medidas de seguridad:
{{security_measures}}
{{/if}}

### 10.4 Propiedad de Datos
{{#if data_ownership}}
**Propiedad de Datos:** {{data_ownership_terms}}
{{/if}}

---

## 11. Cumplimiento y Auditoría

### 11.1 Cumplimiento de Licencia
El Licenciatario mantendrá registros precisos del uso del Software y cumplirá con todos los términos de licencia.

### 11.2 Derechos de Auditoría
{{#if audit_rights}}
El Licenciante puede auditar el uso del Software por el Licenciatario con {{audit_notice}} días de aviso, no más de {{audit_frequency}} por año.
{{/if}}

### 11.3 Controles de Exportación
{{#if export_controls}}
El Software está sujeto a leyes de control de exportación. El Licenciatario acuerda cumplir con todas las regulaciones de exportación aplicables.
{{/if}}

---

## 12. Disposiciones Generales

### 12.1 Ley Aplicable
Este Contrato se regirá por las leyes de {{governing_state}}.

### 12.2 Resolución de Disputas
{{#if arbitration}}
Las disputas se resolverán a través de arbitraje vinculante en {{arbitration_location}}.
{{else}}
Las disputas se resolverán en las cortes de {{jurisdiction}}.
{{/if}}

### 12.3 Contrato Completo
Este Contrato constituye el acuerdo completo y reemplaza todas las negociaciones previas.

### 12.4 Modificación
Este Contrato solo puede modificarse por escrito firmado por ambas Partes.

### 12.5 Cesión
{{#if assignment_allowed}}
Este Contrato puede cederse con consentimiento escrito previo.
{{else}}
Este Contrato no puede cederse sin consentimiento escrito.
{{/if}}

### 12.6 Separabilidad
Las disposiciones inválidas no afectarán la validez de las disposiciones restantes.

### 12.7 Fuerza Mayor
Ninguna Parte será responsable por retrasos debido a circunstancias fuera de su control razonable.

---

## 13. Firmas

**EN FE DE LO CUAL**, las Partes han ejecutado este Contrato en la fecha arriba escrita.

**LICENCIANTE:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{licensor_name}} | |
| Por: {{licensor_signatory}} | |
| Título: {{licensor_title}} | |

**LICENCIATARIO:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{licensee_name}} | |
| Por: {{licensee_signatory}} | |
| Título: {{licensee_title}} | |

---

**AVISO LEGAL IMPORTANTE:** Este contrato de licencia de software debe ser revisado por asesoría legal para asegurar cumplimiento con leyes aplicables y protección apropiada de derechos de propiedad intelectual. Los términos deben adaptarse a los requisitos específicos del software y del negocio.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*