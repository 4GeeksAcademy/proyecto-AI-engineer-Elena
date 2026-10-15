# HealthCore Digital: Contexto Técnico

> **Estado:** propuesta arquitectónica inicial, basada en `context-healthcore.md` y `memory-bank/projectBrief.md`. El briefing no identifica los proveedores cloud ni los productos EHR actuales. Las decisiones de proveedor de este documento son recomendaciones que deben validarse con inventario técnico, contratos, Seguridad y Cumplimiento antes de procesar datos reales.

## Contexto y principios

HealthCore opera 12 clínicas en Estados Unidos y Reino Unido, con dos plataformas EHR que no se comunican, herramientas distintas de facturación y programación, procesos manuales y sin una capa de datos común. La unidad tecnológica tiene seis personas. La solución debe integrar sin interrumpir los sistemas clínicos actuales, permitir mejoras graduales y respetar HIPAA en EE.UU. y UK GDPR en Reino Unido.

Principios que guían las decisiones:

- Integrar primero y reemplazar sistemas solo mediante proyectos de migración aprobados.
- Mantener los datos identificables en su jurisdicción de origen por defecto. La experiencia puede ser unificada sin crear una base global de PHI.
- Diseñar para fallos y capacidades limitadas de los sistemas heredados, con sincronización trazable y recuperación segura.
- Automatizar tareas repetibles, pero mantener a una persona responsable de decisiones clínicas, codificación y acciones que puedan afectar la atención.
- Preferir servicios administrados y una arquitectura modular que el equipo actual pueda operar.
- Tratar toda selección tecnológica como condicionada a evaluación de seguridad, privacidad, coste, contratos y aptitud para el uso sanitario concreto.

## 1. Stack tecnológico recomendado

Se propone un stack principal de TypeScript para los productos y APIs, y Python para cargas de IA y analítica. AWS es una plataforma candidata por la disponibilidad de servicios regionales administrados; su uso no implica cumplimiento automático. Antes de seleccionarla, deben comprobarse los servicios concretos, regiones, configuración, acuerdos aplicables y requisitos de HealthCore. Si la empresa ya tiene una nube corporativa aprobada, se debe evaluar primero si satisface estos mismos requisitos y reducir la dispersión de plataformas.

| Capa                        | Recomendación inicial                                                                                               | Motivo y condiciones                                                                                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Aplicaciones web            | React, Next.js y TypeScript                                                                                         | Una base de código para reservas y portales internos, con interfaces y permisos separados por perfil. No guardar datos clínicos en el navegador más tiempo del necesario.                                                                                                                  |
| Backend de producto         | NestJS y TypeScript como monolito modular                                                                           | Mantiene juntas capacidades relacionadas, facilita límites de dominio y reduce la carga de despliegue y guardia frente a microservicios para un equipo de seis personas. Extraer un servicio solo si hay una necesidad demostrada de aislamiento, escala o ciclo de entrega independiente. |
| API y autenticación         | API Gateway delante de APIs REST documentadas con OpenAPI; OIDC/OAuth 2.0 y MFA                                     | Proporciona entrada controlada, versionado, límites de tasa e identidad federada. Reutilizar el proveedor de identidad corporativo si supera la revisión; no crear cuentas locales innecesarias.                                                                                           |
| Integración clínica         | Adaptadores TypeScript por EHR y jurisdicción; HL7 FHIR cuando el producto lo soporte de forma fiable               | Aísla el modelo interno de las APIs propietarias y permite sustituir o evolucionar integraciones sin reescribir las aplicaciones.                                                                                                                                                          |
| Datos transaccionales       | PostgreSQL administrado, con instancias y claves separadas por jurisdicción                                         | Adecuado para las transacciones del producto y conocido por el equipo. No usar una base global con separación únicamente lógica para reemplazar el aislamiento regional.                                                                                                                   |
| Eventos y trabajos durables | Cola y bus de eventos administrados, por ejemplo SQS y EventBridge si se selecciona AWS                             | Desacopla sistemas, absorbe interrupciones y soporta reintentos. Los eventos llevan identificadores mínimos y referencias, no notas clínicas completas por defecto.                                                                                                                        |
| Automatización              | Motor de flujos administrado, por ejemplo Step Functions en AWS, para procesos críticos                             | Facilita reintentos, estados, alertas y recuperación sin mantener una plataforma de automatización adicional. Reservar herramientas tipo n8n para flujos de bajo riesgo, autoalojados y aprobados, si existe una necesidad clara.                                                          |
| IA y ciencia de datos       | Python para workers y APIs internas de inferencia; servicio de modelos elegido tras evaluación                      | Mantiene el ecosistema de IA separado del backend transaccional. El proveedor/modelo debe aprobarse según residencia, retención, entrenamiento, seguridad y acuerdos de tratamiento.                                                                                                       |
| Almacenamiento analítico    | Almacenamiento de objetos regional para históricos aprobados; PostgreSQL para primeros marts operativos             | Permite empezar simple y crecer sin replicar los EHR en un warehouse global. Un warehouse o motor analítico adicional se justifica por volumen y concurrencia medidos.                                                                                                                     |
| Infraestructura y entrega   | Contenedores en un servicio administrado (AWS ECS/Fargate como candidato), Terraform y CI/CD con entornos separados | Reduce operación de clústeres y favorece despliegues repetibles. Requiere revisión de elegibilidad, configuración, recuperación y costes antes de producción.                                                                                                                              |
| Observabilidad              | OpenTelemetry y herramientas administradas de métricas, trazas y alertas                                            | Da visibilidad que hoy falta sin exponer PHI. Redactar payloads, tokens, identificadores y detalles clínicos en logs y trazas.                                                                                                                                                             |
| Dashboards                  | Herramienta BI con SSO, control por rol/sede y residencia revisada; seleccionar tras prueba de acceso a datos       | Evita acoplar decisiones de negocio a un producto no evaluado. Los dashboards ejecutivos consumen agregados aprobados, no registros clínicos identificables.                                                                                                                               |

## 2. Decisiones de arquitectura

### 2.1 Arquitectura general para 12 sedes y dos países

Adoptar una **arquitectura regional por celdas**, con un entorno lógico de EE.UU. y otro de Reino Unido. Cada celda contiene la API regional, adaptadores a los sistemas locales, almacenamiento transaccional, colas, automatizaciones e índices de búsqueda autorizados. La aplicación selecciona la celda según sede y política de datos; el tráfico entre regiones se deniega salvo flujo aprobado y explícito.

Dentro de cada región, desplegar un backend modular que cubra inicialmente acceso y citas, integración clínica, facturación, cumplimiento y workforce. Los módulos tienen límites y contratos internos claros, pero no se convierten en microservicios por defecto. Mantener desarrollo, pruebas y producción separados; usar datos sintéticos en los entornos no productivos.

La disponibilidad de cada clínica dependerá de sus conexiones y de las interfaces de sus sistemas actuales. Por eso, el diseño debe distinguir entre una vista en línea y datos sincronizados con su hora de última actualización. No prometer consistencia en tiempo real cuando la fuente solo ofrece exportaciones periódicas.

### 2.2 APIs, integración y sistemas de registro

- Crear una **API unificada de HealthCore** como fachada para las aplicaciones autorizadas. Normalizar entidades y operaciones comunes, sin ocultar la procedencia, jurisdicción ni frescura de los datos.
- Implementar un adaptador por combinación de proveedor EHR y jurisdicción. Preferir APIs soportadas; usar FHIR donde esté disponible y sea adecuado. Para sistemas sin API fiable, acordar exportaciones controladas con reconciliación y manejo de errores; no recurrir a scraping ni a escrituras directas en bases de datos de proveedores.
- Mantener cada EHR como sistema de registro clínico durante la integración inicial. La API no será una réplica maestra ni habilitará escrituras genéricas. Una escritura requiere caso de uso autorizado, validación, idempotencia, respuesta trazable y mecanismo de reconciliación.
- Definir un modelo canónico versionado para paciente, sede, profesional, cita, encuentro y reclamación. Conservar claves de origen y mapeos; no fusionar identidades de pacientes de forma automática si la coincidencia es incierta.
- Usar REST/JSON y OpenAPI para operaciones síncronas; eventos versionados y colas para tareas asíncronas. Los eventos tendrán identificadores de correlación, controles de duplicados, reintentos con backoff y cola de errores.
- Aplicar autorización por rol y atributos: usuario, finalidad, relación con la sede, jurisdicción y tipo de dato. La autenticación por sí sola no autoriza el acceso al expediente.

### 2.3 Servicios y bases de datos

- Separar los módulos de producto por dominio, pero empezar con un despliegue de backend modular para evitar la carga de operar muchos servicios.
- Mantener bases de datos transaccionales regionales separadas. Los datos maestros operacionales que no sean clínicos pueden consolidarse solo cuando haya propietario, definición, permisos y finalidad documentados.
- No replicar todos los datos EHR por comodidad. Guardar en la capa de HealthCore solo la información necesaria para la función definida, con retención y sincronización aprobadas.
- Mantener claves de cifrado, copias de seguridad y permisos regionales. Probar restauración y documentar dependencias de cada integración.
- Construir la analítica en una ruta separada de la transaccional: ingesta regional, validación y transformación reproducible, catálogo/linaje y marts de lectura. La capa BI no debe consultar en forma pesada los sistemas EHR operacionales.

### 2.4 Flujos concretos de IA y automatización

| Flujo                                    | Integración propuesta                                                                                                                                                  | Control y problema que aborda                                                                                                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reservas y recordatorios                 | Exponer disponibilidad mediante adaptadores de agenda; permitir reserva digital y orquestar confirmaciones, recordatorios y reprogramaciones por canal aprobado.       | Reduce la dependencia de llamadas y las inasistencias. Confirmar cambios con el sistema de agenda de origen; mensajes externos no deben revelar información clínica sensible.                          |
| Predicción de no-shows                   | Calcular riesgo a partir de atributos mínimos de la cita en la región correspondiente; mostrar prioridad de contacto al equipo de acceso.                              | Ayuda a intervenir ante la tasa de inasistencia del 22 %. No cancelar citas, restringir atención ni penalizar pacientes automáticamente. Medir calidad, calibración y resultados por sede y población. |
| Documentación clínica asistida           | Tras el encuentro, generar un borrador de nota desde el contexto clínico permitido y mostrarlo al profesional dentro del flujo de revisión.                            | Busca reducir los 35 minutos diarios de documentación. El profesional revisa, corrige y firma; ninguna salida del modelo se guarda en el EHR sin acción explícita.                                     |
| Revisión de reclamaciones y codificación | Antes del envío, contrastar campos y sugerir posibles errores/códigos con referencia a la documentación autorizada; devolver la recomendación al flujo de facturación. | Aborda rechazos de reclamaciones y codificación inconsistente. La persona responsable decide y envía; medir falsos positivos, rechazos evitados e impacto financiero.                                  |
| Seguimiento de reclamaciones             | Automatizar recordatorios internos, estados, tareas y escalado de reclamaciones rechazadas o impagadas, conservando historial de acciones.                             | Reduce seguimiento manual. Las comunicaciones externas y ajustes financieros requieren reglas aprobadas y supervisión.                                                                                 |
| Cumplimiento y RAG                       | Indexar por jurisdicción políticas internas y fuentes regulatorias aprobadas; recuperar por rol y región y responder con referencias, fecha y versión.                 | Facilita localizar procedimientos y responder consultas. No es asesor legal ni toma decisiones de cumplimiento; no mezclar índices de EE.UU. y Reino Unido.                                            |
| Solicitudes de datos del paciente        | Orquestar la búsqueda en fuentes autorizadas, registrar pasos y entregar a un revisor un paquete de datos para validar antes de responder.                             | Reduce recopilación manual entre sistemas sin automatizar la divulgación legalmente sensible. Los plazos, excepciones y aprobación dependen del marco aplicable.                                       |
| RR. HH. y CME                            | Crear tareas de onboarding, listas de credenciales, avisos de vencimiento de formación y respuestas a preguntas sobre políticas desde contenido aprobado.              | Sustituye hojas de cálculo y reduce carga administrativa. Limitar datos laborales por función; revisar respuestas y decisiones de empleo por personal autorizado.                                      |
| Operación tecnológica                    | Comprobar salud de integraciones, colas y servicios; generar alertas accionables con propietario y procedimiento de respuesta.                                         | Evita que el equipo se entere de fallos solo por llamadas de las clínicas. Las alertas deben excluir PHI.                                                                                              |

Para todos los casos de IA: registrar propósito, propietario, conjunto de datos, modelo y versión, evaluación, límites, aprobación y mecanismo de desactivación. No enviar PHI a un modelo externo ni usarlo para entrenamiento sin revisión formal, contrato aplicable y configuración aprobada. Proporcionar fallback manual ante indisponibilidad o baja confianza.

### 2.5 Pipelines de datos y dashboards

1. **Ingesta regional:** obtener cambios de EHR, agenda, facturación y workforce mediante APIs, eventos o exportaciones soportadas. Registrar origen, jurisdicción, hora de extracción, versión de esquema y estado de calidad.
2. **Validación y reconciliación:** detectar registros incompletos, tardíos o duplicados; comparar conteos y estados con el sistema de origen. No ocultar errores de integración presentando datos parciales como actuales.
3. **Transformación:** producir métricas y agregados a través de jobs versionados SQL/Python. Conservar definiciones de KPI compartidas entre departamentos y trazabilidad hasta fuentes.
4. **Publicación:** dashboards por área (clínica, acceso, facturación, cumplimiento, RR. HH.) con permisos por rol y sede. Ejecutivos consultan KPIs agregados y comparables, no expedientes identificables.
5. **Actualización:** usar eventos o cargas incrementales cuando la fuente lo permita. Acordar SLA de frescura por métrica una vez evaluadas las limitaciones de los EHR y la red; distinguir en cada vista datos en tiempo real de datos por lote.
6. **Vista transfronteriza:** compartir con dirección solo métricas agregadas o datos transformados cuya transferencia haya sido aprobada. La seudonimización no equivale automáticamente a anonimización.
7. **Entrega ejecutiva:** generar el informe semanal automático solicitado para los lunes a las 7:00, con zona horaria acordada, fecha de corte, frescura de las fuentes y alertas con umbral y responsable.

## 3. Restricciones técnicas, legales y operativas

### Seguridad, regulación y soberanía

- HealthCore opera bajo HIPAA en EE.UU. y UK GDPR en Reino Unido. La arquitectura debe aplicar políticas por jurisdicción y finalidad; el equipo legal/privacidad debe determinar las obligaciones concretas, bases legales, periodos de retención y requisitos de transferencia.
- Mantener datos identificables de pacientes en su región de origen por defecto. Toda transferencia o acceso transfronterizo requiere una necesidad documentada, revisión de base legal, salvaguardas contractuales y autorización de Cumplimiento. No asumir que una vista ejecutiva común autoriza mover datos fuente.
- Antes de contratar cualquier proveedor que pueda recibir PHI o datos personales, verificar BAA cuando corresponda, DPA, subencargados, región y replicación, retención, borrado, notificación de incidentes, soporte y uso de datos para entrenamiento. La ubicación regional o una certificación del proveedor no garantiza por sí sola el cumplimiento de la solución.
- Aplicar cifrado en tránsito y en reposo, gestión de claves, MFA, mínimo privilegio, segregación de entornos, gestión de secretos, revisión de accesos y proceso de baja de usuarios. Los datos de producción no se copian a desarrollo o demos; usar datos sintéticos.
- Revisar el impacto de nuevos usos de datos, en especial entrenamiento/inferencia de IA, perfilado y predicción de comportamiento, con responsables de privacidad y Cumplimiento antes de desplegar.

### Auditoría e integridad

- Registrar accesos y acciones relevantes sobre datos médicos: actor o servicio, paciente/recurso, acción, propósito, sede/jurisdicción, resultado, marca temporal y correlación con sistemas externos.
- Mantener pistas de auditoría separadas de los logs ordinarios, con almacenamiento append-only/inmutable, control de acceso segregado, protección contra borrado, sincronización temporal, retención aprobada y alertas ante manipulación.
- La consolidación para Cumplimiento debe poder consultar los eventos de ambas regiones sin mover innecesariamente contenido clínico identificable. Definir consultas, exportación, cadena de custodia y proceso de investigación.
- No registrar notas, prompts completos, tokens ni payloads con PHI en logs de aplicación, monitoreo, analítica de producto o historial de automatización, salvo excepción evaluada y controlada.

### Sistemas heredados y operación actual

- Se desconocen los proveedores EHR, sus capacidades FHIR/API, límites, costes de integración y acuerdos de soporte. La arquitectura final depende de un inventario técnico y pruebas de conectividad con cada sistema.
- Los EHR no se comunican; la facturación del Reino Unido y la programación dependen de hojas de cálculo/agendas manuales. Puede haber discrepancias, duplicados y falta de identificadores comunes; la integración necesita limpieza, resolución de identidad y reconciliación con participación del negocio.
- Las dependencias externas pueden ser intermitentes o solo ofrecer lotes. Las aplicaciones deben mostrar estado y antigüedad de los datos, admitir colas/reintentos y definir cómo continúa la clínica durante una caída.
- No cambiar el sistema de registro de un EHR ni hacer escrituras masivas en la primera fase. Cada operación de escritura necesita pruebas en sandbox, autorización del proveedor, control de duplicados, auditoría y rollback o compensación.

### Equipo, mantenimiento y continuidad

- La plataforma debe ser sostenible para seis personas en Austin. Priorizar servicios administrados, ownership explícito, pocos lenguajes, automatización de despliegues, documentación operativa y guardias que el equipo pueda sostener.
- Evitar microservicios, múltiples bases especializadas y agentes autónomos hasta demostrar necesidad y capacidad operativa. Mantener TypeScript como lenguaje de producto y Python para IA/datos reduce fragmentación.
- Cada integración y flujo automatizado tendrá responsable, alertas, runbook, pruebas, procedimiento de recuperación y mecanismo de desactivación. No depender de credenciales personales ni de intervención manual de una única persona.
- Definir disponibilidad, RTO/RPO, retención, presupuesto y tiempos de respuesta antes del lanzamiento. La arquitectura no puede prometer recuperación o latencia sin conocer las capacidades de los proveedores y la conectividad de las sedes.
- Versionar infraestructura, contratos API, esquemas, transformaciones, prompts y flujos; exigir revisión por pares y pruebas con datos sintéticos antes del despliegue.

## Decisiones pendientes antes de producción

1. Inventariar los dos proveedores EHR, agendas, facturación y formatos/API disponibles; confirmar sandbox, capacidades FHIR, cuotas, ventanas de mantenimiento y derechos de integración.
2. Confirmar nube corporativa existente o aprobar plataforma y regiones; revisar servicios elegibles, contratos, recuperación, soporte y coste total.
3. Acordar con Cumplimiento/Privacidad la clasificación de datos, residencia, acceso transfronterizo, retención, audit trail y proceso de solicitudes de pacientes.
4. Definir proveedor de identidad, canales de notificación, herramienta BI y proveedores de modelos de IA tras revisar residencia, contratos, configuración y controles.
5. Acordar propietarios y definiciones de KPIs, frescura requerida, objetivos de disponibilidad y procedimientos manuales de continuidad por departamento.
