# Project Brief: HealthCore Digital

## Descripción del negocio

HealthCore es una empresa sanitaria de atención ambulatoria fundada en 2011 y con sede en Austin, Texas. Opera 12 clínicas: nueve en Estados Unidos (Texas, Florida y Georgia) y tres en el Reino Unido (Londres y Mánchester). Ofrece atención primaria, consultas con especialistas, gestión de enfermedades crónicas y programas de salud preventiva. Cuenta con unas 200 personas y una facturación anual aproximada de 28 millones de dólares.

Su propuesta de valor es ofrecer atención de calidad y accesible, con citas el mismo día, horarios ampliados y personal bilingüe en sus mercados estadounidenses. Para sostener y ampliar esa propuesta, HealthCore creó HealthCore Digital, una unidad interna encargada de modernizar los sistemas, procesos y herramientas de la organización.

La empresa opera en dos países y está sujeta a HIPAA en Estados Unidos y UK GDPR en el Reino Unido. Su infraestructura tecnológica está fragmentada: existen dos sistemas de historia clínica electrónica (EHR) que no se comunican, herramientas de facturación y programación diferentes por mercado y ausencia de una capa de datos compartida. Esta fragmentación limita la coordinación clínica y operativa, dificulta el cumplimiento y deja a los responsables sin información unificada y oportuna.

## Objetivos del proyecto por departamento

### Operaciones Clínicas

- **Objetivo:** Unificar el acceso a la información clínica de ambos sistemas EHR mediante una API común y permitir consultar el historial del paciente entre sedes.
  **Problema que resuelve:** Los EHR de EE.UU. y Reino Unido no se comunican, los procesos varían entre clínicas y el historial no acompaña al paciente cuando cambia de sede o de país.
- **Objetivo:** Asistir la documentación clínica con IA y mostrar indicadores operativos por sede.
  **Problema que resuelve:** El personal clínico dedica unos 35 minutos al día a tareas de documentación, y actualmente carece de visibilidad consolidada sobre el volumen de citas, el flujo de pacientes y el tiempo dedicado a documentar.

### Experiencia del Paciente y Acceso

- **Objetivo:** Implantar una plataforma unificada de reservas online para los pacientes de ambos mercados.
  **Problema que resuelve:** Las citas se reservan por teléfono en EE.UU. y mediante llamadas a recepción en el Reino Unido; no existe un canal compartido de reserva online.
- **Objetivo:** Enviar recordatorios por los canales disponibles y predecir citas con riesgo de inasistencia para activar contacto proactivo.
  **Problema que resuelve:** El 22 % de las citas termina en inasistencia, con una pérdida estimada de 1,8 millones de dólares al año en capacidad no utilizada, y no hay un proceso proactivo para recordar o reprogramar citas.
- **Objetivo:** Medir reservas, inasistencias y satisfacción por sede.
  **Problema que resuelve:** El área no cuenta con una visión unificada para identificar diferencias entre sedes ni evaluar la experiencia del paciente.

### Ciclo de Ingresos y Facturación

- **Objetivo:** Revisar reclamaciones con asistencia de IA antes de enviarlas y sugerir códigos a partir de las notas clínicas.
  **Problema que resuelve:** En EE.UU. se rechaza el 14 % de las reclamaciones, frente a una media sectorial aproximada del 5-8 %, debido en parte al envío manual y a prácticas de codificación inconsistentes.
- **Objetivo:** Consolidar en un dashboard las corrientes de ingresos de EE.UU. y Reino Unido y analizar patrones de rechazo.
  **Problema que resuelve:** La facturación estadounidense y la británica (pago privado y contrato con el NHS) se gestionan por separado, sin una vista común de cobros ni capacidad sencilla para detectar problemas sistemáticos.
- **Objetivo:** Automatizar el seguimiento de reclamaciones rechazadas o impagadas.
  **Problema que resuelve:** El seguimiento depende de procesos manuales y dificulta recuperar ingresos a tiempo.

### Cumplimiento y Gobierno del Dato

- **Objetivo:** Centralizar la monitorización de cumplimiento y consolidar automáticamente las pistas de auditoría.
  **Problema que resuelve:** HealthCore debe cumplir HIPAA y UK GDPR, pero los registros de acceso están repartidos entre sistemas y las pistas de auditoría son incompletas.
- **Objetivo:** Automatizar la recopilación de datos para solicitudes de acceso de pacientes.
  **Problema que resuelve:** Responder solicitudes bajo HIPAA o GDPR requiere reunir manualmente información de múltiples sistemas.
- **Objetivo:** Detectar y priorizar posibles riesgos de cumplimiento antes de que se conviertan en infracciones.
  **Problema que resuelve:** La fragmentación y la falta de monitorización unificada dificultan advertir accesos o prácticas potencialmente indebidas a tiempo.

### Personas y Fuerza Laboral

- **Objetivo:** Crear un portal interno para vacaciones, ausencias y consultas sobre políticas.
  **Problema que resuelve:** La gestión de una plantilla distribuida en 12 sedes y dos marcos laborales genera carga administrativa y depende de procesos dispersos.
- **Objetivo:** Automatizar el onboarding clínico con listas de verificación de credenciales.
  **Problema que resuelve:** El onboarding es manual y resulta difícil cubrir puestos clínicos, cuyo tiempo medio de contratación es de 47 días.
- **Objetivo:** Registrar las horas de formación médica continua (CME) y avisar de vencimientos.
  **Problema que resuelve:** Las horas obligatorias para mantener licencias se controlan en una hoja de cálculo, con riesgo de omisiones o vencimientos.
- **Objetivo:** Ofrecer indicadores de contratación, rotación y absentismo, además de respuestas automatizadas a consultas frecuentes de RR. HH.
  **Problema que resuelve:** La información de la plantilla está distribuida y el equipo no dispone de una visión consistente ni de una forma eficiente de resolver preguntas habituales.

### Tecnología

- **Objetivo:** Construir una API central y una capa de datos compartida para pacientes, citas, facturación y personal.
  **Problema que resuelve:** El mosaico de sistemas heredados no está integrado y no existe una fuente de datos común entre sedes, países y departamentos.
- **Objetivo:** Implantar telemetría, monitorización y comprobaciones de salud automatizadas con alertas.
  **Problema que resuelve:** No hay telemetría ni registro centralizado; el equipo suele enterarse de los fallos cuando una clínica los reporta.
- **Objetivo:** Crear un pipeline que alimente los dashboards clínicos, operativos y financieros, e indexar la documentación técnica para búsqueda semántica.
  **Problema que resuelve:** La información y la documentación están dispersas, lo que dificulta tanto el análisis transversal como la resolución eficiente de incidencias.

### Dirección Ejecutiva

- **Objetivo:** Proporcionar un dashboard unificado con indicadores actualizados de todos los departamentos y alertas para métricas críticas.
  **Problema que resuelve:** La dirección recibe informes semanales con formatos distintos, datos contradictorios y varios días de retraso, y no puede responder con rapidez preguntas operativas básicas.
- **Objetivo:** Generar y entregar automáticamente un informe semanal cada lunes a las 7:00 y habilitar consultas en lenguaje natural sobre los indicadores.
  **Problema que resuelve:** Preparar una visión ejecutiva requiere llamadas y consolidación manual, lo que retrasa las decisiones y consume tiempo de los responsables.
