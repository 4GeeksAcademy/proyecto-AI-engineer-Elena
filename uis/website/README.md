# Website público de HealthCore

Landing page bilingüe (EN/ES) de HealthCore (quiénes somos, servicios y ubicaciones en EE. UU.) y formulario de consulta para pacientes. HTML y JS vanilla con Tailwind CSS por CDN. Sin backend: el formulario valida y simula el envío, no transmite ni guarda datos.

- Landing: `specs/001-landing-page/` (`spec.md`, `design.md`, `plan.md`, `tasks.md`).
- Formulario: `specs/002-application-form/` (mismos documentos).
- Marca: `docs/brand/brand-guide.md`. Contenido: `BRIEFING.md` (ES) y `BRIEFING.en.md` (EN).

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Landing en inglés |
| `index.es.html` | Landing en español |
| `application.html` | Formulario de consulta en inglés (4 pasos) |
| `application.es.html` | Formulario de consulta en español |
| `assets/js/tailwind.config.js` | Tokens de marca, compartidos por todas las páginas |
| `assets/js/validation.js` | Validación y pasos del formulario; el idioma sale de `lang` |
| `assets/img/` | Imágenes redimensionadas (Hero, Servicios, Por qué HealthCore) y `logo.png` |

El botón del Hero de cada landing enlaza a su formulario (`application.html` / `application.es.html`).

### Formulario de consulta

4 pasos (datos personales, cita, seguro, consulta y consentimiento), 16 campos con los `name` del briefing más `patient_id` opcional. Todos obligatorios salvo los de seguro (solo si `has_insurance` = Yes) y `patient_id`. Validación en tiempo real (`blur`, `input`, `change`), mensajes literales del briefing en EN y ES, y botón «Limpiar formulario». Al enviar un formulario válido se muestra el mensaje de éxito del briefing; **no se envía nada**. Decisiones propias y pendientes: `specs/002-application-form/design.md` §11.

Las reglas de validación son funciones puras que se pueden ejecutar con Node, sin navegador:

```
node -e "const v=require('./uis/website/assets/js/validation.js'); console.log(v.validateField('phone', {phone: '+1 305 555 0191'}))"
```

## Cómo verlo

Hace falta conexión: Tailwind 3.4.17 se carga desde `cdn.tailwindcss.com`, la única dependencia externa.

Desde la raíz del repositorio (local o en GitHub Codespaces):

```
npx http-server uis/website -p 3000 -a 0.0.0.0 -c-1
```

`-a 0.0.0.0` escucha en todas las interfaces (necesario en Codespaces), `-p 3000` es un puerto que `.devcontainer/devcontainer.json` ya reenvía y `-c-1` desactiva la caché mientras se desarrolla. `npx` descarga `http-server` la primera vez; no se añade ninguna dependencia al repo.

- **Local:** `http://localhost:3000/` (EN) y `http://localhost:3000/index.es.html` (ES).
- **Codespaces:** abre el puerto 3000 desde la pestaña **Ports** (o el aviso que aparece al arrancar). La URL tiene la forma `https://<nombre-del-codespace>-3000.app.github.dev/`. El puerto es privado por defecto; para que otra persona lo vea sin sesión, cambia su visibilidad a **Public**.

## Créditos

**Imágenes** (originales fuera del repo; aquí solo las versiones redimensionadas):

| Uso | Archivos | Origen |
| --- | --- | --- |
| Hero | `hero-800.jpg`, `hero-1600.jpg` | Envato Elements: «smiling woman doctor talking with patient at desk» |
| Servicios: atención primaria | `service-primary-800.jpg` | [Vitaly Gariev en Unsplash](https://unsplash.com/photos/doctor-talking-to-patient-in-an-office-IDM3n0LfNCY), licencia Unsplash |
| Servicios: especialistas | `service-specialist-800.jpg` | Envato Elements: «woman doctor consults with patient in office» |
| Servicios: preventiva | `service-preventive-800.jpg` | Envato Elements: «woman in consultation at doctor's office» |
| Por qué HealthCore | `why-600.jpg`, `why-1200.jpg` | Envato Elements: «friendly check-in at the medical office» |

Proyecto ficticio, repositorio privado: no se registran aquí licencias ni IDs de las fotos.

**Logo** (`logo.png`, header y footer): aportado por Elena y recortado de una captura de baja resolución (272×290 px), con el fondo quitado. Sustituir por el original (SVG o PNG grande transparente) en la misma ruta cuando exista.

**Iconos** (Por qué HealthCore): SVG inline basados en [Lucide](https://lucide.dev), licencia ISC.

## Verificación

Estado frente a los criterios de aceptación de `spec.md` §6 (T20 cerrada). Las filas «validado por Elena» son confirmación de la autora; no hay registro del resultado en el repo. Tras añadir el logo y rediseñar el footer se repitieron W3C (0 mensajes) y axe (0 violaciones), y Elena confirmó haber repetido Lighthouse EN y el recorrido con teclado, ya con el footer nuevo (sin registro del resultado en el repo).

| Comprobación | Estado |
| --- | --- |
| Sin scroll horizontal a 320, 768 y 1280 px (EN y ES) | Medido: cumple |
| Misma estructura, `id` y JSON-LD en EN y ES; sin texto en el otro idioma | Comprobado por script: cumple |
| Tabla con 6 clínicas y JSON-LD con 1 `MedicalOrganization` y 6 `MedicalClinic` | Comprobado: cumple |
| HTML en validator.w3.org/nu (EN y ES) | 0 errores y 0 avisos: cumple |
| axe-core 4.10.2 (wcag2a/aa, 2.1, 2.2 AA y best-practice) a 320 y 1280 px, EN y ES | 0 violaciones: cumple (el contraste del texto del Hero sobre la foto no lo puede calcular axe; peor caso medido a mano: 4,83:1) |
| Lighthouse Accesibilidad ≥ 95 | ES: 100 (Rendimiento 99, Prácticas 96, SEO 100, captura vista). EN: validado por Elena; resultado no registrado aquí |
| JSON-LD en validator.schema.org | Validado por Elena; resultado no registrado aquí (el JSON parsea y tiene 1 `MedicalOrganization` y 6 `MedicalClinic`) |
| Uso completo con teclado y foco visible | Código revisado: 23 elementos enfocables con estilo de foco, orden lógico, sin `tabindex` positivo. Recorrido manual validado por Elena |

### Formulario de consulta (spec 002)

Comprobado en `application.html` y `application.es.html` (T26 cerrada). Las filas «validado por Elena» son confirmación de la autora; no hay registro del resultado en el repo.

| Comprobación | Estado |
| --- | --- |
| Reglas puras (`validation.js`) con Node: nombres, teléfono, correo, fechas de nacimiento y de cita (día hábil, +60 días), regla pediátrica, `patient_id`, seguro, consulta, consentimiento, advertencia franja/clínica y mismas claves de mensaje en EN y ES | 91 casos: cumple |
| Comportamiento en jsdom, EN y ES: avance y retroceso por pasos, errores literales, tiempo real, campos condicionales, bloqueo y salto al primer paso con error, éxito sin peticiones de red, «Limpiar formulario» | 120 comprobaciones: cumple |
| HTML en validator.nu 20.6.30 (EN y ES) | 0 errores: cumple |
| axe-core 4 en jsdom (inicial, con errores en cada paso y con campos condicionales abiertos), EN y ES | 0 violaciones. El contraste no lo calcula jsdom: `danger` mide 6,57:1 sobre `surface` y 6,05:1 sobre `surface-alt` |
| Sin scroll horizontal a 320, 768 y 1280 px (Chrome headless, EN y ES) | Medido: cumple |
| Capturas a 1280 px y con errores visibles (ES) | Revisadas: errores con icono y prefijo, aviso de franja distinto del error |
| Lighthouse Accesibilidad ≥ 95, VoiceOver al cambiar de paso y recorrido completo con teclado | Validado por Elena; resultado no registrado aquí |

