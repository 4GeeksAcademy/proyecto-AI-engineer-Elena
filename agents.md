# Proyecto

HealthCore opera 12 clínicas: nueve en EE. UU. y tres en Reino Unido. El proyecto busca modernizar sus procesos y conectar sistemas actualmente fragmentados, incluidos dos EHR que no se comunican. La empresa está sujeta a HIPAA en EE. UU. y UK GDPR en Reino Unido.

# Archivos de lectura obligatoria al inicio de sesión

Al inicio de cada sesión, antes de planificar o modificar archivos, lee:

1. `memory-bank/projectBrief.md`; si no está disponible, lee `context-healthcore.md` en la raíz.
2. `memory-bank/techContext.md`.
3. `memory-bank/progress.md`.

Si falta alguno de los archivos requeridos, informa de ello y no supongas su contenido. En este repositorio, el banco de memoria está en `memory-bank/`.

# Stack y estructura

El repositorio es una plantilla con carpetas por responsabilidad: `uis/`, `services/`, `data/`, `agents/`, `skills/`, `mcps/`, `workflows/`, `packages/`, `shared/`, `infra/`, `scripts/`, `internal/` y `docs/`.

El README propone FastAPI para una API central, menciona tipos TypeScript en `packages/shared/` y workflows n8n. Son guías de la plantilla; no implican que esas tecnologías estén desplegadas en el proyecto.

# Comandos

No hay comandos globales verificados ni runner de workspace configurado en la raíz. `packages/shared/package.json` no declara scripts.

# Convenciones

- Antes de trabajar en una carpeta, consulta su README.
- Ubica cada app, servicio, agente o pipeline en su carpeta correspondiente y documenta lo añadido con una subcarpeta y un README.
- En `agents/`, documenta objetivo, capacidades, fuentes de conocimiento o memoria, herramientas y cómo probar el agente. Usa `_template/` como referencia.
- En `skills/`, documenta cuándo usarla, sus entradas y salidas esperadas y ejemplos.

# Reglas de dominio

- Trata HIPAA como marco aplicable a EE. UU. y UK GDPR como marco aplicable al Reino Unido.
- Evalúa bajo el marco correspondiente cualquier sistema que gestione datos de pacientes.
- Los dos EHR actuales no se comunican; no asumas que sus datos o procesos están unificados.

# Formas de trabajar

- Mantén cada cambio en la carpeta responsable según la guía del repositorio; no acumules entregables en la raíz.
- Para agentes, consulta la plantilla y documenta pruebas funcionales, de regresión y de calidad según corresponda.
- No presentes las recomendaciones de la plantilla como decisiones ya implementadas.

# Flujo obligatorio antes de cada commit

Antes de confirmar cada commit, completa estos pasos en orden:

1. Revisa y actualiza los archivos pertinentes de `memory-bank/`, especialmente `memory-bank/progress.md`, para reflejar los cambios realizados. Actualiza `projectBrief.md` o `techContext.md` si esos documentos también cambiaron.
2. Consulta los README y las reglas específicas de las carpetas o módulos afectados.
3. Comprueba que los cambios respetan las restricciones del dominio: HIPAA en EE. UU., UK GDPR en Reino Unido y aislamiento de datos de pacientes.
4. Ejecuta o valida las pruebas y comandos de verificación aplicables antes del commit. Si no hay comandos definidos o no se pueden ejecutar, deja constancia y no afirmes que las pruebas pasaron.

# Archivos y carpetas protegidos

No modifiques automáticamente estas zonas sin permiso expreso del usuario o desarrollador:

- Archivos y carpetas de la raíz del repositorio.
- Configuraciones globales y compartidas del monorepo.
- `infra/` y su contenido.
- Este archivo `agents.md`.

Si una tarea requiere tocar una zona protegida, solicita autorización antes de hacerlo. Una autorización para un archivo o cambio concreto no se extiende a otros archivos protegidos.

# Límites

- El equipo tecnológico descrito es de seis personas en Austin.
- El repositorio se describe como estructura base, sin aplicaciones ejecutables ni scripts globales en la raíz.
- Los proveedores y capacidades concretas de los EHR no están especificados aquí; no los supongas.

# Verificación

- Sigue la guía y las pruebas documentadas en la carpeta afectada.
- No inventes comandos de instalación, ejecución o pruebas globales: no están definidos en la raíz.
