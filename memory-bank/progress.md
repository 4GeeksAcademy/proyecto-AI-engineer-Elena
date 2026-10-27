# HealthCore Digital — Progreso del Proyecto

**Fase actual:** Inicio y configuración de la infraestructura base. El repositorio contiene documentación y una estructura de plantilla; no hay una plataforma HealthCore desplegada. La única UI es la landing estática de `uis/website/` (hito 1), implementada en local y pendiente de verificación final.

## 1. Estado actual

- El monorepo tiene carpetas base por responsabilidad (`uis/`, `services/`, `data/`, `agents/`, `skills/`, `mcps/`, `workflows/`, `packages/`, `shared/`, `infra/`, `scripts/`, `internal/` y `docs/`). No hay runner ni comandos globales de proyecto verificados.
- El briefing de negocio está en `context-healthcore.md`; `CONTEXT.md` continúa siendo el placeholder de la plantilla y aún no se ha sustituido por el contexto de HealthCore.
- `memory-bank/` contiene `projectBrief.md`, `techContext.md` y `progress.md`.
- `agents.md` en la raíz documenta las convenciones del proyecto. `.agents/rules/gdpr-hipaa.md` contiene la regla local de privacidad; la skill GDPR está instalada bajo `.agents/skills/`.
- `techContext.md` define una propuesta inicial de arquitectura y tecnologías, pendiente de validar y aprobar. No representa infraestructura implementada.
- **Hito 1, sitio web público:** `specs/001-landing-page/` contiene `spec.md`, `design.md`, `plan.md` y `tasks.md`; la guía de marca está en `docs/brand/brand-guide.md`. La landing existe en `uis/website/` como `index.html` (EN) e `index.es.html` (ES). El formulario de consulta (`application*.html`) aún no existe; su spec será la 002.

## 2. Lo que funciona / completado

- **Contexto de negocio:** `context-healthcore.md` describe HealthCore, sus siete áreas, sistemas fragmentados, necesidades y marcos aplicables (HIPAA en EE. UU. y UK GDPR en Reino Unido).
- **Brief del proyecto:** `memory-bank/projectBrief.md` organiza los objetivos y problemas por departamento.
- **Arquitectura inicial:** `memory-bank/techContext.md` propone una arquitectura regional, una capa de integración, flujos de IA, datos y restricciones. Las opciones de stack y proveedor siguen siendo propuestas sujetas a validación.
- **Guía de trabajo para agentes:** `agents.md` recoge estructura, convenciones, dominio, límites y verificación con la información disponible.
- **Cumplimiento y privacidad:** existe la regla `.agents/rules/gdpr-hipaa.md`, con requisitos de cifrado, acceso mínimo, auditoría, minimización de datos, separación jurisdiccional y controles para proveedores externos. También está instalada la skill `.agents/skills/gdpr-data-handling/SKILL.md`, con referencias adicionales sobre GDPR, derechos de titulares y privacidad. La skill es guía general GDPR y no sustituye la revisión específica para UK GDPR ni cubre por sí sola HIPAA.
- **Landing page (EN/ES):** tareas T1–T22 de `specs/001-landing-page/tasks.md` completadas (T22: tras el logo y el nuevo footer, W3C y axe repetidos aquí; Lighthouse EN y teclado confirmados por Elena): 7 secciones, 5 imágenes locales, JSON-LD con 1 `MedicalOrganization` y 6 `MedicalClinic`, y README. Comprobado: sin scroll horizontal a 320, 768 y 1280 px, y misma estructura y textos del briefing en ambos idiomas. Verificación (T20): W3C 0 errores y axe 0 violaciones, medidos aquí; Lighthouse ES 100 en Accesibilidad (captura). Lighthouse EN, validador Schema.org y recorrido con teclado: validados por Elena, sin resultado registrado. No recoge ni envía datos; no trata PHI. Las 4 fotos de Envato Elements requieren confirmar el registro de licencia para el proyecto.
- **Base del monorepo:** existe el esqueleto de carpetas del template, pero no productos o servicios funcionales de HealthCore.

## 3. Hoja de ruta y tareas pendientes

| Fase / módulo                           | Trabajo pendiente                                                                                                                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Operaciones Clínicas**                | Integrar los dos EHR mediante una API y adaptadores; permitir acceso autorizado al historial entre sedes; evaluar soporte a documentación clínica asistida por IA con revisión del profesional; crear métricas de citas, flujo de pacientes y tiempo de documentación por sede. |
| **Experiencia del Paciente y Acceso**   | Diseñar reservas online para EE. UU. y Reino Unido; automatizar recordatorios y reprogramaciones; evaluar predicción de inasistencias para priorizar contacto humano; medir reservas, no-shows y satisfacción por sede.                                                         |
| **Ciclo de Ingresos y Facturación**     | Crear revisión asistida de reclamaciones antes del envío y sugerencias de codificación; unificar métricas de ingresos de EE. UU. y Reino Unido; analizar rechazos y automatizar tareas de seguimiento de reclamaciones impagadas o rechazadas.                                  |
| **Cumplimiento y Gobierno del Dato**    | Consolidar y proteger pistas de auditoría; habilitar monitorización de accesos y riesgos; apoyar la recopilación de datos para solicitudes de pacientes. Definir cada flujo con revisión de Cumplimiento para HIPAA o UK GDPR según corresponda.                                |
| **Personas y Fuerza Laboral (RR. HH.)** | Evaluar un portal para vacaciones, ausencias y políticas; automatizar onboarding y verificación de credenciales; sustituir la hoja de cálculo de CME por seguimiento y alertas; crear KPIs de contratación, rotación y absentismo y respuestas a preguntas frecuentes.          |
| **Tecnología y datos**                  | Construir la capa API e integraciones aprobadas; añadir telemetría, comprobaciones de salud y alertas; crear pipelines de datos para análisis y dashboards; preparar documentación técnica indexada para búsqueda semántica.                                                    |
| **Dirección Ejecutiva**                 | Consolidar KPIs departamentales en dashboards con datos y frescura claramente indicados; automatizar el informe semanal de los lunes a las 7:00; definir alertas de umbral y evaluar consultas en lenguaje natural sobre métricas autorizadas.                                  |

Las capacidades de IA, los accesos entre jurisdicciones y cualquier tratamiento de datos de pacientes requieren revisión y aprobación antes de producción. Los proveedores y capacidades concretas de los sistemas existentes aún deben confirmarse.

## 4. Próximos pasos inmediatos

1. **Validar la guía de privacidad:** revisar con Cumplimiento la aplicabilidad de la regla y la skill a los casos de HealthCore, distinguiendo UK GDPR de HIPAA y definiendo cualquier complemento necesario.
2. **Descubrir las integraciones reales:** identificar proveedores y capacidades de los dos EHR, agendas, facturación, formatos, interfaces disponibles, entornos de prueba y restricciones contractuales.
3. **Acordar la fundación técnica y de cumplimiento:** con el equipo de seis personas y Cumplimiento, validar clasificación de datos, jurisdicciones, accesos, auditoría, proveedor/regiones y criterios de seguridad antes de elegir servicios para producción.
4. **Cerrar la landing:** confirmar la licencia de las fotos de Envato Elements y crear la spec 002 del formulario de consulta (envío simulado, sin transmitir datos).
5. **Definir un primer MVP verificable:** seleccionar con Operaciones Clínicas y Tecnología un flujo acotado de integración, sus usuarios, datos permitidos, pruebas, métricas de éxito y alternativa manual; no iniciar escrituras en EHR ni usar datos reales hasta contar con aprobaciones.
