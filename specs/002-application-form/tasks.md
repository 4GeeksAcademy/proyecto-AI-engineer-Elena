# Tasks 002: Formulario de consulta para pacientes

Derivadas de `plan.md`. Rutas relativas a `uis/website/`. Marcar `[x]` solo tras implementar y verificar la tarea.

## Decisiones previas

- [x] T1 -- Resolver los 3 puntos pendientes de `plan.md` §0: token `danger`, nombres con espacios/guiones/apóstrofos (y, si procede, ajustar R10) y textos propios de `design.md` §5.

## Base

- [x] T2 -- Añadir el token `danger` en `assets/js/tailwind.config.js` y en `docs/brand/brand-guide.md` §5, y comprobar su contraste sobre `surface` y `surface-alt` (R24, R32).
- [x] T3 -- Crear `application.html` con el esqueleto: `head` (title, meta description, viewport, canonical, hreflang, Open Graph, Tailwind 3.4.17 y config), skip link, `header` y `footer` adaptados de `index.html`, y `main` con `h1`, introducción y nota de proveedores con `mailto:` (R28, R29, R35, R36).

## Marcado del formulario (EN)

- [x] T4 -- Estructura del `form`: `novalidate`, `step-status`, barra de progreso y los 4 `fieldset` con `legend` > `h2` con `tabindex="-1"` (R3, R7, R31).
- [x] T5 -- Paso 1: `first_name`, `last_name`, `date_of_birth`, `email`, `phone`, `preferred_language`, con `label for`, `required`, `autocomplete`, `maxlength`, `aria-describedby` y contenedor de error (R1–R4, R31).
- [x] T6 -- Paso 2: `preferred_clinic` con las 6 clínicas literales, `preferred_date`, `preferred_time`, `service_type`, radios `new_patient` y `patient_id` oculto con "(optional)" (R1–R4, R15, R31).
- [x] T7 -- Paso 3: radios `has_insurance` e `insurance_provider` / `insurance_member_id` ocultos (R1–R4, R14).
- [x] T8 -- Paso 4: `health_concern` con contador, `contact_consent` y los botones Atrás / Siguiente / Enviar / Limpiar formulario (R1–R4, R8, R19, R20).
- [x] T9 -- Panel `#success` con el mensaje literal del briefing (EN) y botón "Back to home" (R27).
- [x] T10 -- Aplicar estilos Tailwind: tarjeta, campos, estados de foco y error, botones primario y secundario, barra de progreso, layout responsive y botones apilados en móvil (R24, R32–R34).

## `validation.js`

- [x] T11 -- Crear `assets/js/validation.js` con los datos: `MESSAGES.en` y `MESSAGES.es` (mensajes literales del briefing y textos de `design.md` §5), tabla de cierres de clínicas y `STEPS` (R17, R29).
- [x] T12 -- Funciones de fecha: `parseDate`, `ageOn`, `nextBusinessDay`, `maxPreferredDate` y `getToday` (R11, R16).
- [x] T13 -- Reglas puras de todos los campos, incluida la regla pediátrica y la advertencia franja/clínica, con exportación condicional (`module.exports`) (R10–R21).
- [x] T14 -- Comprobar las reglas puras con Node con los casos de `design.md` §9 y anotar el resultado (R10–R21).
- [x] T15 -- Interfaz de errores: mostrar y limpiar el mensaje por campo con `hidden`, `aria-invalid` y `aria-describedby`; contador en vivo; `min`/`max` de las fechas (R19, R23, R24).
- [x] T16 -- Validación en tiempo real con `focusout`, `input` y `change`, y revalidación cruzada nacimiento ↔ servicio y franja ↔ clínica (R17, R18, R22).
- [x] T17 -- Campos condicionales de seguro y `patient_id`, con alta y baja de `required` (R14, R15).
- [x] T18 -- Navegación por pasos: `showStep`, Siguiente, Atrás, Enter, foco al `h2` del paso y al primer campo con error (R5–R7).
- [x] T19 -- Envío: validar los 4 pasos, bloquear si hay errores, ir al primer paso con errores y mostrar el éxito sin red ni almacenamiento (R9, R25, R27).
- [x] T20 -- "Limpiar formulario": vaciar campos, errores, avisos y contador, ocultar condicionales y volver al paso 1 (R8).

## Versión ES

- [x] T21 -- Crear `application.es.html` a partir de `application.html` y traducir todos los textos con `BRIEFING.md` y `design.md` §5; `value` de `select` y `radio` en inglés (R29).
- [x] T22 -- Ajustar en `application.es.html` `lang`, canonical, `og:locale`, selector de idioma, navegación y pie a `index.es.html` (R29, R36).
- [x] T23 -- Revisión cruzada EN/ES: misma estructura, mismos `id` y `value`, sin texto visible en el otro idioma, y `validation.js` mostrando los mensajes en ES (R29, R30).

## Documentación y cierre

- [x] T24 -- Actualizar `uis/website/README.md` con el formulario, `validation.js` y el resultado de la verificación.
- [x] T25 -- Actualizar `memory-bank/progress.md` con el estado del formulario.
- [x] T26 -- Verificar los 19 criterios de aceptación de `spec.md` §9 en `application.html` y `application.es.html` y anotar el resultado en el README:
  1. Existen los tres archivos y el botón del Hero de ambas landings llega al formulario.
  2. `name` e `id` coinciden con el briefing y `preferred_clinic` lista las 6 clínicas.
  3. `label` asociado, `required` donde corresponde y radios en `fieldset`/`legend`.
  4. No se avanza ni se envía con campos vacíos o inválidos, y cada fallo muestra su mensaje literal.
  5. Teléfonos `+1 305 555 0191` y `+34 612 345 678` válidos; `305 555 0191` no.
  6. Fechas de nacimiento futura, de más de 120 años o inexistente rechazadas; la de un bebé es válida.
  7. Seguro condicional según `has_insurance`.
  8. Error pediátrico con una persona adulta.
  9. Advertencia Evening + San Antonio sin bloqueo.
  10. `patient_id` visible con `new_patient` = No; `HC-A3F291` válido y `HC-12` no.
  11. Contador en vivo y error con los caracteres que faltan.
  12. Sin `contact_consent` no se envía.
  13. Éxito literal sin peticiones de red ni almacenamiento.
  14. "Limpiar formulario" vacía todo y vuelve al paso 1.
  15. Validación en tiempo real al salir del campo y al corregirlo.
  16. Nota de proveedores visible.
  17. Lighthouse Accesibilidad ≥ 95, 0 críticos en axe y 0 errores en W3C.
  18. Sin scroll horizontal a 320, 768 y 1280 px y uso completo con teclado.
  19. Tailwind 3.4.17 por CDN como única dependencia externa.
