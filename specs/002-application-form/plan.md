# Plan 002: Formulario de consulta para pacientes

Basado en `spec.md` (R1–R36) y `design.md`. Sin dependencias nuevas: HTML, Tailwind Play CDN 3.4.17, la configuración de la guía de marca y JavaScript vanilla. Sin frameworks de testing; verificación manual con las herramientas de `design.md` §9 y comprobación de las reglas puras con Node (sin añadir ficheros al repo).

## 0. Pendiente antes de empezar

- [x] Aprobar el token `danger` (`#B42318`) y su alta en `assets/js/tailwind.config.js` y en `docs/brand/brand-guide.md` §5 (`design.md` §11, punto 1).
- [x] Nombres con espacios, guiones y apóstrofos entre letras (`design.md` §11, punto 2): aprobado, R10 de la spec actualizado.
- [x] Aprobar los textos propios de `design.md` §5 (interfaz, aviso de franja y error de `patient_id`).

## 1. Base

| # | Paso | Archivos | Req. |
| --- | --- | --- | --- |
| 1.1 | Añadir el token `danger` a la configuración de Tailwind y a la guía de marca | `uis/website/assets/js/tailwind.config.js`, `docs/brand/brand-guide.md` | R24, R32 |
| 1.2 | Esqueleto de `application.html`: `head` (meta, canonical, hreflang, OG), skip link, `header` y `footer` copiados de la landing y adaptados (`design.md` §2, §6), `main` con `h1`, introducción y nota de proveedores | `uis/website/application.html` | R28, R29, R35, R36 |

## 2. Marcado del formulario (EN)

| # | Paso | Req. |
| --- | --- | --- |
| 2.1 | `form#application-form` con `novalidate`, indicador de paso, barra de progreso y los 4 `fieldset` con `legend` > `h2` | R3, R7, R31 |
| 2.2 | Paso 1: `first_name`, `last_name`, `date_of_birth`, `email`, `phone`, `preferred_language` con el patrón de campo de `design.md` §3.2 | R1–R4, R31 |
| 2.3 | Paso 2: `preferred_clinic` (6 clínicas), `preferred_date`, `preferred_time`, `service_type`, `new_patient` (radios) y `patient_id` oculto | R1–R4, R15, R31 |
| 2.4 | Paso 3: `has_insurance` (radios) y `insurance_provider`, `insurance_member_id` ocultos | R1–R4, R14 |
| 2.5 | Paso 4: `health_concern` con contador y `contact_consent` | R1–R4, R19, R20 |
| 2.6 | Botones Atrás / Siguiente / Enviar / Limpiar formulario y panel `#success` con el mensaje literal del briefing | R5–R9, R27 |
| 2.7 | Estilos Tailwind de campos, errores, foco, botones y tarjeta según `design.md` §3.3 | R24, R32–R34 |

## 3. `validation.js`

| # | Paso | Req. |
| --- | --- | --- |
| 3.1 | Datos: `MESSAGES.en` y `MESSAGES.es` (mensajes literales de cada briefing más los textos de `design.md` §5), tabla de cierres de clínicas y `STEPS` | R17, R29 |
| 3.2 | Funciones de fecha: `parseDate`, `ageOn`, `nextBusinessDay`, `maxPreferredDate`, `getToday` | R11, R16 |
| 3.3 | Reglas puras por campo (`design.md` §4.2) y advertencia franja/clínica; exportación condicional para Node | R10–R21 |
| 3.4 | Comprobar las reglas puras con Node con los casos de `design.md` §9 | R10–R21 |
| 3.5 | Interfaz: mostrar/ocultar error por campo (`hidden`, `aria-invalid`, `aria-describedby`), contador, `min`/`max` de las fechas | R19, R23, R24 |
| 3.6 | Eventos en tiempo real: `focusout`, `input`, `change` y revalidación cruzada (nacimiento ↔ servicio, franja ↔ clínica) | R17, R18, R22 |
| 3.7 | Campos condicionales: seguro y `patient_id`, con alta/baja de `required` | R14, R15 |
| 3.8 | Navegación por pasos: `showStep`, Siguiente, Atrás, Enter, foco al `h2` y al primer error | R5–R7 |
| 3.9 | Envío: validar los 4 pasos, bloquear si hay errores, mostrar el éxito sin red ni almacenamiento | R9, R25, R27 |
| 3.10 | Reset: vaciar campos, errores, avisos y contador, ocultar condicionales y volver al paso 1 | R8 |

## 4. Versión ES

| # | Paso | Req. |
| --- | --- | --- |
| 4.1 | Copiar `application.html` → `application.es.html` y traducir con `BRIEFING.md` y `design.md` §5 | R29 |
| 4.2 | Ajustar `lang`, canonical, `og:locale`, selector de idioma, enlaces de navegación y pie a `index.es.html` | R29, R36 |
| 4.3 | Revisión cruzada EN/ES: misma estructura e `id`, `value` de `select`/`radio` idénticos, sin texto visible en el otro idioma | R29, R30 |

## 5. Documentación y estado

| # | Paso |
| --- | --- |
| 5.1 | Actualizar `uis/website/README.md` (qué hay, cómo abrirlo, `validation.js`, resultado de la verificación) |
| 5.2 | Actualizar `memory-bank/progress.md` con el estado del formulario (exigido por `agents.md` antes de cada commit) |

## 6. Verificación (`design.md` §9)

- [x] Reglas puras con Node: todos los casos de `design.md` §9 pasan.
- [x] `name`, `id`, `label[for]`, `required`, `fieldset`/`legend` y 6 clínicas idénticos al briefing (criterios 1–3).
- [x] Errores literales del briefing, en tiempo real y al avanzar (criterios 4, 12, 15); seguro y `patient_id` condicionales (7, 10); error pediátrico y aviso de franja (8, 9); contador (11).
- [x] Envío válido sin peticiones de red ni almacenamiento (13) y "Limpiar formulario" (14).
- [x] Nota de proveedores visible en ambas páginas (16).
- [x] validator.w3.org/nu: 0 errores; Lighthouse Accesibilidad ≥ 95 y axe con 0 críticos, también con errores visibles (17).
- [x] Sin scroll horizontal a 320, 768 y 1280 px y recorrido completo con teclado (18).
- [x] Solo `cdn.tailwindcss.com/3.4.17` como recurso externo (19).
- [x] Enlace del Hero de ambas landings (`application.html` / `application.es.html`) funciona (criterio 1).
