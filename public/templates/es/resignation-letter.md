# Carta de Renuncia

---

**CARTA DE RENUNCIA**

**Fecha:** {{letter_date}}

**Para:** {{supervisor_name}}
{{supervisor_title}}
{{company_name}}
{{company_address}}

**De:** {{employee_name}}
{{employee_position}}
{{employee_department}}
{{employee_address}}

**Re:** Renuncia al Puesto

---

## 1. Aviso de Renuncia

### 1.1 Aviso Formal
Por medio de la presente escribo para notificarle formalmente mi renuncia a mi puesto como {{employee_position}} con {{company_name}}. Mi último día de trabajo será el **{{last_working_day}}**.

### 1.2 Período de Aviso
Esta carta proporciona {{notice_period}} días de aviso según lo requerido por {{notice_requirement_source}}.

### 1.3 Fecha Efectiva
**Fecha Efectiva de Renuncia:** {{resignation_effective_date}}
**Último Día de Trabajo:** {{last_working_day}}

---

## 2. Razón de la Renuncia

### 2.1 Motivo de la Partida
{{#if resignation_reason}}
**Razón de la Renuncia:** {{resignation_reason}}
{{else}}
He decidido buscar otras oportunidades que se alineen con mis objetivos profesionales.
{{/if}}

### 2.2 Declaración Personal
{{#if personal_statement}}
{{personal_statement}}
{{else}}
Esta decisión fue tomada después de una consideración cuidadosa de mis objetivos profesionales y circunstancias personales.
{{/if}}

---

## 3. Planeación de Transición

### 3.1 Compromiso de Transición
Estoy comprometido(a) a asegurar una transición fluida de mis responsabilidades. Trabajaré diligentemente durante mi tiempo restante para:
- Completar proyectos y asignaciones actuales
- Documentar trabajo en curso y procedimientos
- Entrenar personal de reemplazo si es necesario
- Transferir conocimiento a miembros del equipo

### 3.2 Estado de Proyectos Actuales
**Proyectos Activos:**
{{#if current_projects}}
{{#each current_projects}}
- **{{project_name}}:** {{project_status}} - {{transition_plan}}
{{/each}}
{{else}}
- Todos los proyectos actuales están en camino de completarse o serán adecuadamente documentados para el traspaso
{{/if}}

### 3.3 Traspaso de Responsabilidades Clave
**Responsabilidades Principales a Transferir:**
{{#if key_responsibilities}}
{{#each key_responsibilities}}
- **{{responsibility}}:** {{handover_plan}}
{{/each}}
{{else}}
- Relaciones con clientes e información de contacto
- Relaciones continuas con proveedores
- Deberes administrativos y requisitos de reportes
- Acceso a sistemas y archivos
{{/if}}

### 3.4 Documentación
Prepararé documentación comprensiva incluyendo:
- {{documentation_item_1}}
- {{documentation_item_2}}
- {{documentation_item_3}}
- Procedimientos operativos estándar para tareas clave

---

## 4. Propiedad de la Empresa y Acceso

### 4.1 Devolución de Propiedad de la Empresa
Devolveré toda la propiedad de la empresa para mi último día de trabajo, incluyendo:
- Equipo de computadora/laptop de la empresa
- Teléfono móvil y accesorios
- Credencial de identificación y tarjetas de acceso
- Tarjetas de crédito de la empresa
- {{additional_company_property}}

### 4.2 Acceso Digital
Entiendo que mi acceso a los sistemas de la empresa será terminado en mi último día de trabajo:
- Cuenta de correo electrónico
- Sistemas de computadora y software
- Acceso al edificio
- Bases de datos de clientes
- {{additional_system_access}}

### 4.3 Información Confidencial
Reconozco mi obligación continua de mantener confidencialidad de:
- Información propietaria de la empresa
- Datos y relaciones de clientes
- Secretos comerciales y procesos
- Información estratégica del negocio

---

## 5. Asuntos Pendientes

### 5.1 Cheque Final
Por favor proporcione información respecto a:
- Fecha de procesamiento del cheque final
- Pago de vacaciones/PTO acumuladas: {{pto_balance}} días
- Reembolsos de gastos pendientes
- {{additional_compensation_items}}

### 5.2 Información de Beneficios
Solicito información sobre:
- Continuación de seguro de salud (COBRA)
- Opciones de plan de retiro (traspaso de 401k)
- Opciones de conversión de seguro de vida
- Opciones de acciones o cronogramas de adquisición

### 5.3 Entrevista de Salida
{{#if exit_interview_requested}}
Estoy disponible para una entrevista de salida a su conveniencia para discutir mi experiencia y proporcionar retroalimentación que pueda ser útil para la organización.
{{else}}
Si se requiere una entrevista de salida, por favor hágame saber cuándo puede programarse.
{{/if}}

---

## 6. Apreciación y Gratitud

### 6.1 Crecimiento Profesional
Quiero expresar mi sincera gratitud por las oportunidades que he tenido durante mis {{employment_duration}} con {{company_name}}. La experiencia ha sido valiosa para mi desarrollo profesional.

### 6.2 Apreciación del Equipo
He disfrutado trabajar con el talentoso equipo de {{company_name}} y aprecio el apoyo y colaboración que he recibido de mis colegas.

### 6.3 Habilidades y Experiencia Ganadas
Durante mi tiempo aquí, he ganado experiencia valiosa en:
- {{skill_gained_1}}
- {{skill_gained_2}}
- {{skill_gained_3}}
- {{additional_skills_gained}}

---

## 7. Información de Contacto Futura

### 7.1 Detalles de Contacto Personal
**Correo Electrónico Personal:** {{personal_email}}
**Teléfono Personal:** {{personal_phone}}
**Dirección Postal:** {{personal_mailing_address}}

### 7.2 Disponibilidad para Preguntas
Estaré disponible para responder preguntas sobre mis responsabilidades de trabajo por un período razonable después de mi partida. Puede contactarme en la información anterior.

### 7.3 Referencias Profesionales
{{#if reference_permission}}
Doy permiso para que {{company_name}} sirva como referencia profesional para futuras oportunidades de empleo.
{{else}}
Por favor dirija cualquier solicitud de referencia a RH para procesamiento según la política de la empresa.
{{/if}}

---

## 8. Obligaciones Post-Empleo

### 8.1 Acuerdo de No Divulgación
Entiendo que mis obligaciones bajo cualquier acuerdo de no divulgación o confidencialidad continuarán después de que termine mi empleo.

### 8.2 Acuerdo de No Competencia
{{#if non_compete_agreement}}
Reconozco mis obligaciones bajo el acuerdo de no competencia fechado {{non_compete_date}} y cumpliré con todos los términos.
{{else}}
No estoy sujeto(a) a ninguna restricción de no competencia.
{{/if}}

### 8.3 No Solicitación
{{#if non_solicitation_agreement}}
Entiendo mis obligaciones de no solicitar empleados o clientes de la empresa por {{non_solicitation_period}} después de mi partida.
{{/if}}

---

## 9. Información de Reenvío

### 9.1 Reenvío de Correo
Por favor reenvíe cualquier correo o comunicación a mi dirección personal:
{{forwarding_address}}

### 9.2 Documentos Fiscales
Por favor envíe documentos fiscales de fin de año (W-2, etc.) a la dirección anterior.

### 9.3 Comunicaciones Futuras
{{#if future_communications_preference}}
**Método Preferido de Contacto:** {{contact_preference}}
{{/if}}

---

## 10. Comentarios Finales

### 10.1 Compromiso con el Profesionalismo
Me mantengo comprometido(a) a mantener los más altos estándares de profesionalismo durante mi tiempo restante con la empresa y asegurar una transición positiva.

### 10.2 Disposición para Asistir
Si hay asuntos urgentes o preguntas que surjan después de mi partida respecto al trabajo que he completado, estoy dispuesto(a) a proporcionar asistencia razonable durante el período de transición.

### 10.3 Relación Futura
Espero mantener relaciones positivas con {{company_name}} y mis colegas. Espero tener noticias del éxito continuo de la empresa.

{{#if future_opportunities}}
### 10.4 Oportunidades Futuras
Estaría abierto(a) a oportunidades de consultoría o trabajo independiente con {{company_name}} en el futuro si tales arreglos fueran mutuamente beneficiosos.
{{/if}}

---

## 11. Cierre

Gracias por la oportunidad de contribuir a {{company_name}}. He valorado mi tiempo aquí y deseo a la empresa y mis colegas éxito continuo.

Por favor hágame saber si hay algo específico que necesite de mí durante este período de transición.

**Atentamente,**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{employee_name}} | |
| {{employee_position}} | |

---

**CC:**
- Departamento de Recursos Humanos
- {{additional_cc_recipients}}

---

**AVISO IMPORTANTE:** Esta carta de renuncia sirve como aviso formal de terminación de empleo. Por favor asegúrese de que se sigan todas las políticas de la empresa respecto a procedimientos de renuncia, incluyendo devolución de propiedad de la empresa y completar procedimientos de salida.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*