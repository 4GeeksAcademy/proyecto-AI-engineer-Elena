# Spec 002: Formulario de consulta para pacientes

Fuente única de contenido y de especificaciones de campos: `uis/website/BRIEFING.md` (ES) y `BRIEFING.en.md` (EN), apartados "Campos del formulario", "Validaciones específicas", "Mensajes de error esperados", "Mensaje de éxito" y "Restricción específica". Continúa la spec 001: el botón del Hero ya apunta a `application.html` / `application.es.html` (R2 de la 001). Guía de marca: `docs/brand/brand-guide.md`.

Esta spec no repite los textos del briefing: los nombres de campo, opciones, mensajes de error y mensaje de éxito SHALL copiarse literalmente de él, en EN y en ES. Una implementación genérica que ignore el briefing no es válida.

## 1. Objetivo y alcance

Capturar datos estructurados de consulta de pacientes para que recepción los llame y confirme una cita. Es un formulario de **consulta**, no de reserva.

- **Dentro:** `application.html` (EN), `application.es.html` (ES) y `assets/js/validation.js`. HTML y JS vanilla; estilos con Tailwind CSS por CDN (versión fijada, como la landing).
- **Fuera:** backend, envío o almacenamiento de datos (el envío se simula), tests automáticos (pendiente de decidir), cambios en la landing.

## 2. Campos

- **R1 (nombres exactos):** El formulario SHALL tener exactamente estos campos, con el atributo `name` tal como está en el briefing y un `id` idéntico al `name`: `first_name`, `last_name`, `date_of_birth`, `email`, `phone`, `preferred_language`, `preferred_clinic`, `preferred_date`, `preferred_time`, `service_type`, `new_patient`, `has_insurance`, `insurance_provider`, `insurance_member_id`, `health_concern`, `contact_consent`, y `patient_id` (opcional, ver R15).
- **R2 (tipos):** Cada campo SHALL usar el tipo del briefing (`text`, `date`, `email`, `tel`, `select`, `radio`, `textarea`, `checkbox`).
- **R3 (valores):** Las opciones de los `select` y `radio` SHALL usar los valores del briefing (los `value` se mantienen en inglés; el texto visible se traduce en ES). Las opciones de `preferred_clinic` SHALL ser las 6 clínicas de la tabla de Ubicaciones, con sus nombres exactos.
- **R4 (obligatorios):** Todos los campos SHALL llevar el atributo `required`, salvo `insurance_provider` e `insurance_member_id` (obligatorios solo si `has_insurance` = Yes, ver R14) y `patient_id` (opcional).

## 3. Estructura por pasos

El formulario tiene 4 pasos, con `fieldset` y `legend` por paso.

| Paso | Campos |
| --- | --- |
| 1. Datos personales | `first_name`, `last_name`, `date_of_birth`, `email`, `phone`, `preferred_language` |
| 2. Cita | `preferred_clinic`, `preferred_date`, `preferred_time`, `service_type`, `new_patient`, `patient_id` |
| 3. Seguro | `has_insurance`, `insurance_provider`, `insurance_member_id` |
| 4. Consulta y consentimiento | `health_concern`, `contact_consent`, aviso de proveedores y botones |

- **R5:** WHEN se pulsa "Siguiente" / "Next", THE formulario SHALL validar los campos del paso y avanzar solo si son válidos. IF hay errores, THEN THE formulario SHALL quedarse en el paso y llevar el foco al primer campo con error.
- **R6:** WHEN se pulsa "Atrás" / "Back", THE formulario SHALL volver al paso anterior conservando lo escrito.
- **R7:** La página SHALL indicar el paso actual y el total (p. ej. "Paso 2 de 4") y SHALL anunciarlo a tecnologías de apoyo. Al cambiar de paso, el foco SHALL pasar al encabezado del nuevo paso.
- **R8:** El paso 4 SHALL incluir el botón de envío ("Enviar" / "Submit") y un botón secundario `type="reset"` ("Limpiar formulario" / "Clear form"). WHEN se pulsa el secundario, THE formulario SHALL vaciar todos los campos y errores, ocultar los campos condicionales y volver al paso 1.
- **R9:** WHEN se pulsa "Enviar", THE formulario SHALL validar todos los pasos. IF alguno falla, THEN THE formulario SHALL impedir el envío y llevar al usuario al primer paso con errores.

## 4. Reglas de validación

Los literales y los mensajes están en el briefing; aquí van las reglas.

- **R10 Nombre y apellido:** 2–50 caracteres; letras, incluidas las acentuadas (á, é, í, ó, ú, ñ, ü). Se admiten espacios, guiones y apóstrofos solo entre letras (p. ej. `María José`, `Ana-Sofía`, `O'Brien`). Sin números ni otros caracteres especiales, ni espacios, guiones o apóstrofos al principio, al final o repetidos.
- **R11 Fecha de nacimiento:** fecha real, no futura, con edad entre 0 y 120 años. No hay edad mínima.
- **R12 Email:** formato de correo válido.
- **R13 Teléfono:** SHALL empezar por `+` seguido del código de país. Acepta `+1 305 555 0191` y `+34 612 345 678`. Se aceptan espacios, guiones y paréntesis.
- **R14 Seguro:** IF `has_insurance` = Yes, THEN `insurance_provider` (máx. 100 caracteres) e `insurance_member_id` (6–20 caracteres alfanuméricos) SHALL mostrarse, volverse obligatorios (atributo `required` incluido) y validarse. IF = No, THEN SHALL ocultarse, quitar `required` y no validarse.
- **R15 Paciente recurrente:** IF `new_patient` = No, THEN THE formulario SHALL mostrar `patient_id`, opcional, con formato `HC-` más 6 alfanuméricos (p. ej. `HC-A3F291`). IF se rellena, THEN SHALL validar el formato. IF `new_patient` = Yes, THEN SHALL ocultarlo.
- **R16 Fecha preferida:** al menos 1 día hábil desde hoy y no más de 60 días hacia adelante.
- **R17 Paediatric Care:** IF `service_type` = Paediatric Care y la persona tiene 18 años o más (según `date_of_birth`), THEN THE formulario SHALL mostrar el error específico del briefing. La regla SHALL revalidarse al cambiar `date_of_birth` o `service_type`.
- **R18 Franja y clínica:** IF `preferred_time` = Evening (5pm–8pm) y la clínica cierra antes de las 8pm entre semana, THEN THE formulario SHALL mostrar una **advertencia** (no bloquea el envío). Aplica a San Antonio, Orlando, Austin North y Atlanta.
- **R19 Consulta:** `health_concern` de 20 a 500 caracteres, con contador en vivo; el mensaje de error indica cuántos caracteres faltan.
- **R20 Consentimiento:** `contact_consent` SHALL estar marcada para enviar.
- **R21 Selects y radios:** `preferred_language`, `preferred_clinic`, `preferred_time`, `service_type`, `new_patient` y `has_insurance` SHALL tener una opción elegida; la opción vacía inicial no es válida.

## 5. Validación en tiempo real y errores

- **R22:** Cada campo SHALL validarse al perder el foco (`blur`). Una vez mostrado un error, SHALL revalidarse mientras el usuario escribe (`input`) y se quitará en cuanto sea válido. Los `select`, `radio` y `checkbox` se validan en `change`.
- **R23:** Cada tipo de fallo SHALL mostrar su mensaje específico del briefing (vacío, formato, longitud, rango de fechas, regla pediátrica…), junto al campo y en el idioma de la página. No se usan los mensajes nativos del navegador (`novalidate` en el formulario).
- **R24:** Los mensajes SHALL ser claros y visibles: color de error con contraste ≥ 4,5:1, icono o texto que no dependa solo del color, y borde del campo en estado de error. Los campos con error SHALL llevar `aria-invalid="true"` y `aria-describedby` hacia su mensaje; los errores SHALL anunciarse a lectores de pantalla.
- **R25:** IF hay algún error de validación, THEN THE formulario SHALL NOT enviarse (se previene el evento `submit`).
- **R26:** `validation.js` SHALL validar todos los campos del formulario, elegir los textos según el `lang` de la página y no depender de ninguna librería.

## 6. Éxito y restricción de pacientes

- **R27:** WHEN todos los campos son válidos y se pulsa "Enviar", THE página SHALL mostrar el mensaje de éxito del briefing (literal, en el idioma de la página) y ocultar el formulario. THE página SHALL NOT enviar ni guardar ningún dato (ni red, ni cookies, ni `localStorage`): el envío se simula.
- **R28:** El formulario SHALL mostrar de forma visible la nota para proveedores y organizaciones del briefing ("¿Eres un proveedor de salud u organización…?"), con `partnerships@healthcore.com` como enlace `mailto:`.

## 7. Idiomas EN/ES

- **R29:** Aplican R8–R10 de la spec 001 (archivos separados, `lang`, `hreflang`, sin mezcla de idiomas). Etiquetas, placeholders, mensajes de error, textos de botones, aviso del paso y mensaje de éxito SHALL estar completamente traducidos. El selector EN | ES lleva al archivo equivalente.
- **R30:** Ambas páginas SHALL compartir estructura, `id` y el mismo `validation.js`; el idioma se toma del atributo `lang`.

## 8. Diseño, responsive y accesibilidad

- **R31 Etiquetas:** Cada `input`, `select` y `textarea` SHALL tener un `label` visible asociado con `for`/`id`. Los grupos de opciones (`new_patient`, `has_insurance`) SHALL usar `fieldset`/`legend`. Los campos obligatorios se indican con texto, no solo con color.
- **R32 Tailwind:** Espaciado, tamaños y tipografía de la guía de marca. Los estados de foco (anillo `accent-light` o equivalente visible), error, deshabilitado y hover SHALL definirse con clases de Tailwind.
- **R33 Responsive:** Sin scroll horizontal desde 320 px. Una columna en móvil; los campos cortos pueden ir en dos columnas desde ≥ 768 px. Botones de ancho completo en móvil.
- **R34 WCAG 2.2 AA:** contraste ≥ 4,5:1, uso completo con teclado, foco visible, objetivos táctiles ≥ 24×24 px, un único `h1`, landmarks (`header`, `main`, `footer`).
- **R35 (imprescindible):** HTML semántico y válido en el validador W3C, como R17 de la spec 001.
- **R36:** Cabecera y pie coherentes con la landing, con enlace de vuelta al inicio y `title`, `meta description`, `viewport` y `canonical` en su idioma. Sin JSON-LD propio.

## 9. Criterios de aceptación

1. Existen `application.html`, `application.es.html` y `assets/js/validation.js`, y el botón del Hero de ambas landings llega a ellos.
2. Todos los `name` e `id` coinciden con el briefing; el campo `preferred_clinic` lista las 6 clínicas de la tabla.
3. Cada campo con `label` asociado, `required` donde corresponde, y los grupos de opciones en `fieldset`/`legend`.
4. No se avanza de paso ni se envía con campos vacíos o inválidos; cada fallo muestra su mensaje literal del briefing en el idioma de la página.
5. `+1 305 555 0191` y `+34 612 345 678` son válidos como teléfono; `305 555 0191` no.
6. Fechas de nacimiento futura, de más de 120 años o inexistente (31/02) son rechazadas; una fecha de bebé es válida.
7. Con `has_insurance` = No se puede avanzar sin aseguradora ni ID; con Yes no.
8. `service_type` = Paediatric Care con una persona adulta muestra el error pediátrico.
9. `preferred_time` = Evening con San Antonio muestra la advertencia y no bloquea.
10. `new_patient` = No muestra `patient_id`; `HC-A3F291` es válido y `HC-12` no.
11. El contador de `health_concern` se actualiza en vivo y el error indica los caracteres que faltan.
12. Sin `contact_consent` marcado no se envía.
13. Con todo válido se muestra el mensaje de éxito literal y no hay ninguna petición de red ni almacenamiento.
14. "Limpiar formulario" vacía todo y vuelve al paso 1.
15. Validación en tiempo real: el error aparece al salir de un campo y desaparece al corregirlo.
16. La nota de proveedores es visible en ambas páginas.
17. Lighthouse Accesibilidad ≥ 95, 0 errores críticos en axe y 0 errores en el validador W3C en ambas páginas.
18. Sin scroll horizontal a 320, 768 y 1280 px; uso completo con teclado.
19. La única dependencia externa es Tailwind CSS por CDN; el JS es vanilla.

## 10. Decisiones mías, a confirmar

1. **4 pasos** (no 3): los campos de cita tienen un paso propio, fácil de ocultar si más adelante se quitan.
2. **`id` igual al `name`** en todos los campos.
3. **`value` en inglés, texto visible traducido** en ES (p. ej. "Morning (7am–12pm)" se ve como "Mañana (7am–12pm)"); los nombres de clínicas no se traducen.
4. **Teléfono:** `+` más código de país y entre 8 y 15 dígitos en total; no comprueba que el número exista.
5. **Fecha preferida:** "día hábil" = lunes a viernes. No se rechazan sábados ni domingos como fecha; no se comprueba el horario del sábado de cada clínica.
6. **Advertencia de franja (R18):** todas las clínicas de la tabla abren después de las 5pm, así que no hay clínica "inválida"; el briefing pide advertencia, y la aplico a las que cierran antes de las 8pm entre semana.
7. **Quitados respecto a mi primera versión,** por no estar en el briefing: selector de país, edad mínima de 18 años, casilla de privacidad, recordatorios Sí/No y opción "Sin seguro / NHS".
8. **Mensaje de éxito literal del briefing:** dice "hemos recibido tu consulta" aunque no se envíe nada; es una simulación. Hay que cambiarlo cuando exista backend.
9. **Aviso de privacidad:** no está en el briefing y no lo añado. Antes de conectar un backend, Cumplimiento (HIPAA / UK GDPR) debe definir aviso, transporte seguro y retención, en otra spec.
10. **Botón de limpiar** al final del último paso, no en cada paso.
11. **Nombres con espacios, guiones y apóstrofos (R10):** el briefing dice "solo letras", pero rechazaría nombres habituales en el mercado hispano y anglosajón. Decisión aprobada por Elena.
