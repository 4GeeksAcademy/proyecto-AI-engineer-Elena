# Diseño técnico 002: Formulario de consulta para pacientes

Entradas: `specs/002-application-form/spec.md` (R1–R36), `uis/website/BRIEFING.md` / `BRIEFING.en.md` (campos, mensajes, éxito), `docs/brand/brand-guide.md` (tokens y estilo) y `specs/001-landing-page/design.md` (cabecera, pie y convenciones que se reutilizan). Este documento define **cómo** se construye; el **qué** está en la spec.

Reparto con la guía de marca, como en la 001: la guía dice cómo se ve y aquí se dice dónde y con qué clase o etiqueta se aplica. Los textos literales del briefing (etiquetas, opciones, errores, éxito, nota de proveedores) **no se repiten aquí**: se copian del briefing de cada idioma. Aquí solo van los textos que el briefing no define (§5).

## 1. Archivos

```
uis/website/
├── application.html          # EN (lang="en")
├── application.es.html       # ES (lang="es")
└── assets/js/
    ├── tailwind.config.js    # ya existe; se añade el token `danger` (§3.3)
    └── validation.js         # nuevo: validación y comportamiento por pasos
```

- Sin build ni dependencias. Tailwind Play CDN 3.4.17 y `tailwind.config.js`, igual que la landing.
- **Sin CSS propio.** Los estados de error y foco usan variantes de Tailwind (`aria-[invalid=true]:`, `focus-visible:`, `motion-reduce:`).
- Un único `validation.js` para ambos idiomas: el idioma se lee de `document.documentElement.lang` (R30). Se carga con `<script src="assets/js/validation.js" defer></script>`.

## 2. Esqueleto de página

Ambas páginas tienen la misma estructura e `id`; solo cambian textos, `lang`, enlaces de idioma y metadatos.

```html
<!doctype html>
<html lang="en" class="scroll-smooth motion-reduce:scroll-auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Request an appointment | HealthCore</title>
  <meta name="description" content="…">
  <link rel="canonical" href="https://www.healthcore.com/application.html">
  <link rel="alternate" hreflang="en" href="https://www.healthcore.com/application.html">
  <link rel="alternate" hreflang="es" href="https://www.healthcore.com/application.es.html">
  <link rel="alternate" hreflang="x-default" href="https://www.healthcore.com/application.html">
  <!-- Open Graph como la landing (og:locale en_US / es_US) -->
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="assets/js/tailwind.config.js"></script>
</head>
<body class="bg-surface font-sans text-ink antialiased">
  <a href="#main" class="sr-only focus:not-sr-only …">Skip to content</a>
  <header>…</header>
  <main id="main" class="bg-surface-alt">
    <div class="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 id="form-title">…</h1>
      <p>introducción</p>
      <p id="partner-note">nota de proveedores</p>
      <form id="application-form" novalidate aria-labelledby="form-title">…</form>
      <section id="success" hidden tabindex="-1" aria-labelledby="success-title">…</section>
    </div>
  </main>
  <footer>…</footer>
  <script src="assets/js/validation.js" defer></script>
</body>
</html>
```

- **Cabecera y pie:** copia de los de `index.html`/`index.es.html` (wordmark con logo, navegación, selector de idioma; footer de 3 columnas con la pastilla blanca del logo). Cambios: los enlaces de navegación y de "Enlaces rápidos" apuntan a `index.html#home`, `#services`, `#locations`, `#contact` (`index.es.html#…` en ES); el selector de idioma apunta a `application.es.html` / `application.html`; el wordmark enlaza a `index.html` (R36).
- **Sin JSON-LD** y sin metadatos de organización: no es una página de contenido (R36).
- **`novalidate`** en el `form`: los mensajes los controla `validation.js`, no el navegador (R23). El atributo `required` se mantiene en los campos (R4, R31) por semántica y para lectores de pantalla.
- Jerarquía: un `h1`, un `h2` por paso (dentro del `legend`, ver §3.1) y un `h2` en el mensaje de éxito.
- Todos los elementos que se muestran/ocultan usan el atributo `hidden`, y **nunca** llevan a la vez una clase de `display` (`grid`, `flex`…) en el mismo elemento, porque la clase anularía `hidden`. Si hace falta layout, va en un `div` interior.

## 3. Formulario

### 3.1 Estructura por pasos

```html
<form id="application-form" novalidate …>
  <p id="step-status" aria-live="polite">Step 1 of 4</p>
  <div aria-hidden="true"><!-- barra de progreso: 4 segmentos, el actual en bg-primary --></div>

  <fieldset data-step="1" class="…">
    <legend><h2 id="step-1-title" tabindex="-1">Personal details</h2></legend>
    <div class="grid gap-6 sm:grid-cols-2">…campos…</div>
  </fieldset>
  <fieldset data-step="2" hidden>…</fieldset>
  <fieldset data-step="3" hidden>…</fieldset>
  <fieldset data-step="4" hidden>…</fieldset>

  <div class="…botones…">
    <button type="button" id="btn-back" hidden>Back</button>
    <button type="button" id="btn-next">Next</button>
    <button type="submit" id="btn-submit" hidden>Submit</button>
    <button type="reset" id="btn-reset" hidden>Clear form</button>
  </div>
</form>
```

- `fieldset` + `legend` por paso (R31). El `h2` va dentro del `legend` (HTML 5.2 lo permite) y lleva `tabindex="-1"` para recibir el foco al cambiar de paso (R7). Los `fieldset` llevan `border-0 p-0 m-0 min-w-0`.
- **Grupos de radio** (`new_patient`, `has_insurance`): `fieldset` interior con su `legend` (la pregunta del briefing) y dos `input type="radio"` con `label`. Cada radio lleva el mismo `name` y el `id` `new_patient_yes`, `new_patient_no`, etc.; el `fieldset` lleva el `id` del `name` base (`new_patient`) para `aria-describedby` y para enfocar el error.
- Botones: "Atrás" visible desde el paso 2; "Siguiente" en los pasos 1–3; "Enviar" y "Limpiar formulario" solo en el paso 4 (R8). Los botones de avance son `type="button"` (el `submit` solo existe en el paso 4).
- Pulsar Enter en un campo de un paso intermedio no debe enviar: el único `type="submit"` está oculto fuera del paso 4, y `validation.js` captura `keydown` Enter en pasos 1–3 y lo trata como "Siguiente".

### 3.2 Patrón de campo

Todos los campos de texto, `select` y `textarea` siguen este patrón (`id` = `name`, R1):

```html
<div>
  <label for="first_name" class="block font-semibold text-ink">First name</label>
  <input type="text" id="first_name" name="first_name" required maxlength="50"
         autocomplete="given-name"
         aria-describedby="first_name-error"
         class="mt-1 block w-full rounded-lg border border-muted bg-white px-3 py-2 text-base text-ink
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger">
  <p id="first_name-error" class="mt-1 text-sm font-semibold text-danger" hidden></p>
</div>
```

- El error lleva el prefijo visible "Error:" / "Error:" más un icono SVG (`aria-hidden="true"`), para no depender solo del color (R24). `validation.js` rellena el texto, quita `hidden` y pone `aria-invalid="true"` en el control; al corregirlo hace lo contrario.
- Las pistas (hint) como el formato del teléfono van en `<p id="phone-hint" class="mt-1 text-sm text-muted">`, y `aria-describedby` apunta a pista y error: `aria-describedby="phone-hint phone-error"`.
- Las **advertencias** (franja vs clínica, R18) usan un `<p id="preferred_time-warning">` aparte, con icono de aviso y prefijo "Warning:" / "Aviso:", color `accent-dark` y sin tocar `aria-invalid`. `aria-describedby` de `preferred_time` y `preferred_clinic` incluye ese `id`.
- **Radio:** el error y `aria-invalid` van en el `fieldset` del grupo, que lleva `role="radiogroup"` (los `fieldset` sin ese rol no admiten `aria-invalid` según ARIA 1.2); `aria-describedby` en el `fieldset`.
- **Checkbox `contact_consent`:** `label` envolvente con la casilla a la izquierda (`h-5 w-5` para ≥ 24 px) y el texto del briefing; error debajo.
- **Contador:** `<p id="health_concern-counter" class="text-sm text-muted">0 / 500</p>`, actualizado en `input`, fuera de `aria-live` para no saturar a lectores de pantalla (el error ya anuncia lo que falta).
- `maxlength` en `first_name`/`last_name` (50), `insurance_provider` (100), `insurance_member_id` (20), `patient_id` (9) y `health_concern` (500): el briefing no define mensaje para "demasiado largo", así que el navegador lo impide en vez de mostrar un error inventado. El teléfono y el correo no llevan `maxlength` fijo.
- `autocomplete` correcto donde existe: `given-name`, `family-name`, `bday`, `email`, `tel`. `autocomplete="off"` en `insurance_provider`, `insurance_member_id`, `patient_id` y `health_concern` (datos de salud, ver §8).

### 3.3 Estilos (guía de marca)

| Elemento | Clases clave |
| --- | --- |
| Tarjeta del formulario | `rounded-xl bg-surface p-6 shadow-sm md:p-8` |
| Campos (§3.2) | `rounded-lg`, borde `muted` (7,1:1 sobre blanco, ≥ 3:1 exigido a controles), foco `ring-2 ring-accent ring-offset-2` |
| Etiquetas | `font-semibold text-ink`; ayudas `text-sm text-muted` |
| Botón primario (Siguiente, Enviar) | `rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2` |
| Botón secundario (Atrás, Limpiar) | `rounded-lg border-2 border-primary bg-transparent px-6 py-3 font-semibold text-primary hover:bg-primary-tint` + mismo foco |
| Barra de progreso | 4 segmentos `h-2 rounded-full`; completados y actual `bg-primary`, pendientes `bg-primary-tint` |
| Éxito | tarjeta `bg-primary-tint rounded-xl p-6 md:p-8`, borde izquierdo `border-l-4 border-primary` |

- **Token nuevo `danger`:** la guía de marca no define un color de error. Propongo `danger: '#B42318'`: 6,6:1 sobre `surface` y 6,0:1 sobre `surface-alt`. Se añade a `assets/js/tailwind.config.js` y a la tabla de colores de la guía (§5) con el rol "Mensajes de error y bordes de campo inválido". Es una decisión mía a confirmar (§9 de este documento). Las advertencias reutilizan `accent-dark` (7,8:1 sobre blanco), con icono y prefijo para distinguirlas de los errores.
- **Layout:** una columna en móvil; en `sm:` los pares nombre/apellido, correo/teléfono, fecha/franja, aseguradora/ID van en `grid gap-6 sm:grid-cols-2`. Botones apilados a ancho completo en móvil (`w-full sm:w-auto`), en fila desde `sm:` con "Atrás" a la izquierda y los demás a la derecha (R33).
- **Objetivos táctiles:** campos con `py-2` (≈ 42 px de alto) y botones con `py-3` (≈ 48 px), ≥ 24 px (R34).
- Sin transiciones ni animaciones; no hay nada que condicionar con `motion-reduce`.

### 3.4 Campos por paso

| Paso | Campo | Control | Notas |
| --- | --- | --- | --- |
| 1 | `first_name`, `last_name` | `input[type=text]` | `sm:` en 2 columnas |
| 1 | `date_of_birth` | `input[type=date]` | `min` = hoy − 120 años y `max` = hoy, fijados por JS (ayuda del selector; la validación no depende de ellos) |
| 1 | `email` | `input[type=email]` | pista con el ejemplo del briefing en placeholder |
| 1 | `phone` | `input[type=tel]` | `inputmode="tel"`; placeholder `+1 305 555 0191` |
| 1 | `preferred_language` | `select` | opción vacía inicial + English/Spanish |
| 2 | `preferred_clinic` | `select` | opción vacía + las 6 clínicas de la tabla de Ubicaciones, nombres literales |
| 2 | `preferred_date` | `input[type=date]` | `min`/`max` fijados por JS (§4.3) |
| 2 | `preferred_time` | `select` | opción vacía + 3 franjas |
| 2 | `service_type` | `select` | opción vacía + 7 servicios |
| 2 | `new_patient` | 2 radios | al elegir No se muestra `patient_id` |
| 2 | `patient_id` | `input[type=text]` | en un `div hidden`; opcional; texto "(optional)" en la etiqueta |
| 3 | `has_insurance` | 2 radios | al elegir Yes se muestran los dos siguientes |
| 3 | `insurance_provider`, `insurance_member_id` | `input[type=text]` | en un `div hidden` |
| 4 | `health_concern` | `textarea rows="5"` | contador en vivo |
| 4 | `contact_consent` | `input[type=checkbox]` | texto del briefing |

Los `select` llevan una primera `option value=""` con el texto "Select…" / "Selecciona…", `selected` y sin `disabled`: es el estado "sin elegir" que R21 declara inválido.

## 4. `validation.js`

### 4.1 Estructura

Un solo archivo, IIFE sin dependencias, con tres capas:

1. **Datos:** textos por idioma (`MESSAGES.en`, `MESSAGES.es`), tabla de cierres de clínicas y lista de campos por paso.
2. **Reglas puras:** funciones `(value, context) → clave de error | null`, sin tocar el DOM. Se exportan con `if (typeof module !== 'undefined') module.exports = { … }` para poder comprobarlas con Node sin navegador (§9). No se añade ningún runner al repo.
3. **Interfaz:** lectura de `lang`, delegación de eventos, gestión de pasos, errores, contador, campos condicionales, reset y éxito.

```js
const STEPS = {
  1: ['first_name', 'last_name', 'date_of_birth', 'email', 'phone', 'preferred_language'],
  2: ['preferred_clinic', 'preferred_date', 'preferred_time', 'service_type', 'new_patient', 'patient_id'],
  3: ['has_insurance', 'insurance_provider', 'insurance_member_id'],
  4: ['health_concern', 'contact_consent'],
};
```

### 4.2 Reglas (spec R10–R21)

Cada regla devuelve una clave que se resuelve en `MESSAGES[lang][clave]`. Las claves coinciden con los mensajes del briefing, uno por campo y tipo de fallo:

| Campo | Regla | Clave |
| --- | --- | --- |
| `first_name`, `last_name` | recorte de espacios; longitud 2–50 y `/^\p{L}+(?:[ '’\-]\p{L}+)*$/u` (letras con espacios, guiones o apóstrofos solo entre letras) | `first_name`, `last_name` |
| `date_of_birth` | formato `YYYY-MM-DD`, fecha real, ≤ hoy, edad ≤ 120 | `date_of_birth` |
| `email` | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, ≤ 254 | `email` |
| `phone` | quitar espacios, guiones, puntos y paréntesis; `/^\+[1-9]\d{7,14}$/` | `phone` |
| `preferred_language`, `preferred_clinic`, `preferred_time`, `service_type` | valor distinto de `""` | una clave por campo |
| `preferred_date` | fecha real, ≥ siguiente día hábil, ≤ hoy + 60 días | `preferred_date` |
| `service_type` (cruzada) | `Paediatric Care` y edad ≥ 18 (si `date_of_birth` es válida) | `service_type_paediatric` |
| `new_patient`, `has_insurance` | uno de los dos radios marcado | `new_patient`, `has_insurance` |
| `patient_id` | vacío válido; si no, `/^HC-[A-Za-z0-9]{6}$/i` (acepta minúsculas) | `patient_id` |
| `insurance_provider` | solo si `has_insurance` = Yes: texto no vacío (≤ 100 por `maxlength`) | `insurance_provider` |
| `insurance_member_id` | solo si `has_insurance` = Yes: `/^[A-Za-z0-9]{6,20}$/` | `insurance_member_id` |
| `health_concern` | recortado: 20–500 caracteres | `health_concern` (con `{n}` = 20 − longitud) |
| `contact_consent` | casilla marcada | `contact_consent` |

- **Advertencia** (no es error): `preferred_time` = `Evening` y la clínica elegida cierra antes de las 20:00 entre semana → clave `time_clinic_warning`. Tabla: `{ 'HealthCore Austin Central': 20, 'HealthCore Austin North': 19, 'HealthCore San Antonio': 18, 'HealthCore Miami': 20, 'HealthCore Orlando': 18, 'HealthCore Atlanta': 19 }`, copiada de la tabla de Ubicaciones.
- **Texto del error con `{n}`:** el mensaje del briefing lleva "X"; en `MESSAGES` queda como `{n}` y se sustituye por `20 − longitud`.
- **Campos condicionales ocultos** (`insurance_*` con `has_insurance` = No o sin elegir; `patient_id` con `new_patient` = Yes o sin elegir) no se validan ni cuentan como error.

### 4.3 Fechas

Todas las fechas se manejan como `YYYY-MM-DD` en hora local, sin `new Date('YYYY-MM-DD')` (que interpreta UTC y desplaza un día):

- `parseDate(str)` → `{y, m, d}` o `null`; comprueba que sea real (31/02 inválido) construyendo `new Date(y, m-1, d)` y verificando que año, mes y día coinciden.
- `ageOn(dob, today)` → años cumplidos.
- `nextBusinessDay(today)`: suma 1 día y, si cae en sábado o domingo, avanza al lunes (decisión 5 de la spec). Ejemplo: viernes → lunes; sábado → lunes; domingo → lunes.
- `maxPreferredDate(today)` = hoy + 60 días.
- "Hoy" se obtiene de una función `getToday()` con el reloj local, que los comprobadores de Node pueden sustituir.
- Al cargar, `validation.js` fija `min`/`max` de `date_of_birth` y `preferred_date` para ayudar al selector del navegador. La validación no depende de ellos (`novalidate`).

### 4.4 Comportamiento

- **Eventos (R22):** un único listener delegado en el `form`.
  - `focusout` en `input`, `textarea` y `select`: valida el campo y lo marca como tocado.
  - `input` en un campo tocado, o con error visible: revalida y quita el error en cuanto es válido.
  - `change` en `select`, radios y checkbox: valida al momento.
  - `input` en `health_concern`: actualiza el contador siempre.
- **Revalidación cruzada:** al cambiar `date_of_birth` se revalida `service_type` si ya tiene valor; al cambiar `service_type` se revalida él mismo; al cambiar `preferred_time` o `preferred_clinic` se recalcula la advertencia.
- **Campos condicionales:** al cambiar `has_insurance` se muestran u ocultan `insurance_provider` e `insurance_member_id` en su `div` y se les añade o quita `required`; al cambiar `new_patient` se hace lo mismo con `patient_id` (sin `required`). Al ocultar, se limpia el error del campo; no se borra lo escrito (si el usuario vuelve a Yes, lo recupera). Al enviar solo se validan los visibles.
- **`showStep(n)`:** oculta los demás `fieldset`, actualiza `step-status`, la barra, los botones visibles y mueve el foco al `h2` del paso.
- **Siguiente (R5):** valida los campos del paso. Si hay errores, muestra todos, enfoca el primer campo con error (`input` o `fieldset` en radios) y no avanza.
- **Enviar (R9, R25):** en `submit` hace `preventDefault()`, valida los 4 pasos y, si falla alguno, va al primero con errores y enfoca el primer campo; si no, muestra el éxito.
- **Éxito (R27):** oculta el `form` y el `step-status`, muestra `#success` y le da el foco (`tabindex="-1"`, con el `h2` dentro). No hay `fetch`, `XMLHttpRequest`, `sendBeacon`, `localStorage` ni cookies; el envío se simula (`agents.md`, Límites). Un botón "Back to home" / "Volver al inicio" enlaza a la landing.
- **Reset (R8):** en el evento `reset` del `form`, tras el vaciado nativo (`setTimeout(…, 0)`), se limpian errores, `aria-invalid`, advertencias y contador; se ocultan y desmarcan los campos condicionales y se vuelve al paso 1. Se conserva la página en el mismo idioma.
- **Enter:** `keydown` Enter en un control de pasos 1–3 (salvo `textarea`/botones) → `preventDefault()` y equivale a "Siguiente".
- **Selección de idioma de textos:** `const lang = document.documentElement.lang.startsWith('es') ? 'es' : 'en'`.

## 5. Textos que el briefing no define

Todo lo demás (etiquetas, opciones, errores, éxito, nota de proveedores, encabezados de tabla) es literal del briefing. Estos textos son **míos, pendientes de aprobación**:

| Elemento | EN | ES |
| --- | --- | --- |
| `title` | Request an appointment \| HealthCore | Solicitar una cita \| HealthCore |
| `h1` | Request an appointment | Solicitar una cita |
| Introducción | Tell us how to reach you and what you need. Our front desk team will contact you to confirm your appointment. | Cuéntanos cómo contactarte y qué necesitas. Nuestro equipo de recepción te llamará para confirmar tu cita. |
| `meta description` | Send your enquiry to HealthCore. Our front desk team will contact you to confirm your appointment. | Envía tu consulta a HealthCore. Nuestro equipo de recepción se pondrá en contacto contigo para confirmar tu cita. |
| Aviso de obligatorios | All fields are required unless marked optional. | Todos los campos son obligatorios, salvo los marcados como opcionales. |
| Sufijo opcional | (optional) | (opcional) |
| Estado del paso | Step {n} of 4 | Paso {n} de 4 |
| Títulos de paso (`h2`) | 1 Personal details · 2 Appointment · 3 Insurance · 4 Your enquiry | 1 Datos personales · 2 Cita · 3 Seguro · 4 Tu consulta |
| Botones | Back · Next · Submit · Clear form | Atrás · Siguiente · Enviar · Limpiar formulario |
| Opción vacía de `select` | Select… | Selecciona… |
| Prefijo de error | Error: | Error: |
| Prefijo de aviso | Warning: | Aviso: |
| Texto de aviso (franja/clínica) | {clinic} closes at {hora} on weekdays, so evening appointments may not be available. You can still send your enquiry. | {clinic} cierra a las {hora} entre semana, así que puede que no haya citas por la tarde-noche. Puedes enviar tu consulta igualmente. |
| Error de `patient_id` | Patient ID must start with HC- followed by 6 letters or numbers (example: HC-A3F291) | El Patient ID debe empezar por HC- seguido de 6 letras o números (ejemplo: HC-A3F291) |
| Contador | {n} / 500 | {n} / 500 |
| Volver al inicio | Back to home | Volver al inicio |
| Opciones `preferred_language` visibles | English · Spanish | Inglés · Español |
| Opciones `preferred_time` visibles | Morning (7am–12pm) · Afternoon (12pm–5pm) · Evening (5pm–8pm) | Mañana (7am–12pm) · Tarde (12pm–5pm) · Noche (5pm–8pm) |
| Opciones `service_type` visibles | las del briefing en inglés | Atención primaria · Manejo de enfermedades crónicas · Consulta con especialista · Salud preventiva · Salud de la mujer · Atención pediátrica · Salud mental |
| Radios Yes/No visibles | Yes · No | Sí · No |

Los `value` de `select` y `radio` son siempre los del briefing en inglés (`Evening`, `Paediatric Care`, `Yes`…), también en ES (spec §10, decisión 3). Los nombres de clínicas no se traducen. El mensaje de error pediátrico ES conserva "Paediatric Care" tal como está en el briefing.

## 6. Enlaces

| Elemento | EN | ES |
| --- | --- | --- |
| Navegación | `index.html#home`, `#services`, `#locations`, `#contact` | `index.es.html#…` |
| Wordmark | `index.html` | `index.es.html` |
| Selector | ES → `application.es.html` | EN → `application.html` |
| Nota de proveedores | `mailto:partnerships@healthcore.com` | igual |
| Footer: contacto y redes | como la landing | como la landing |
| Volver al inicio (éxito) | `index.html` | `index.es.html` |

## 7. Metadatos y SEO

- `canonical` `https://www.healthcore.com/application.html` (EN) y `…/application.es.html` (ES); `hreflang` en/es/x-default→EN en ambos.
- Open Graph como la landing (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale` con alternativa cruzada).
- Sin JSON-LD. No se añade `noindex`: es una página pública enlazada desde el Hero.

## 8. Privacidad y cumplimiento

- El formulario **no transmite ni guarda** nada: sin `fetch`, cookies, `localStorage` ni analítica; el envío es simulado (R27, `agents.md`). Única petición a terceros: Tailwind Play CDN, como la landing.
- `health_concern`, seguro y fecha de nacimiento son datos de salud potencialmente identificables. Por eso: `autocomplete="off"` en los de seguro y consulta, y ningún valor se escribe en la URL (el `form` no tiene `action` ni `method`, y `preventDefault()` evita el envío).
- Al conectar un backend se necesitará una spec aparte que defina aviso de privacidad, transporte seguro, retención y base legal bajo HIPAA (EE. UU.) y UK GDPR (Reino Unido), con revisión de Cumplimiento. El mensaje de éxito ("hemos recibido tu consulta") deberá reevaluarse entonces (spec §10, decisión 8).

## 9. Verificación

No hay runner en el repo. La verificación es manual y se registra en `uis/website/README.md`. Casos puros con Node, sin añadir ficheros al repo:

```
node -e "const v=require('./uis/website/assets/js/validation.js'); console.log(v.validateField(...))"
```

| Criterio de la spec | Herramienta | Cómo |
| --- | --- | --- |
| 1, 2, 3 | Revisión manual y DevTools | Comparar `name`/`id`, `label[for]`, `required` y los 6 nombres de clínica con el briefing |
| 4, 12, 15 | Navegador | Dejar campos vacíos/ inválidos, comprobar mensaje literal y que `blur`/`input` actualizan el error |
| 5, 6, 7, 10, 11 | Node (reglas puras) y navegador | Casos de la tabla de abajo |
| 8, 9 | Navegador | DOB de adulto + Paediatric Care → error; Evening + San Antonio → aviso sin bloqueo |
| 13 | DevTools › Network y Application | Sin peticiones ni almacenamiento al enviar un formulario válido |
| 14 | Navegador | "Limpiar formulario" vacía todo y vuelve al paso 1 |
| 16 | Revisión manual | Nota de proveedores visible en ambas páginas |
| 17 (HTML) | validator.w3.org/nu | 0 errores en ambas páginas |
| 17 (a11y) | Lighthouse y axe DevTools | ≥ 95 y 0 críticos en ambas páginas, también con un error visible |
| 18 | DevTools modo dispositivo y teclado | 320, 768, 1280 px sin scroll horizontal; recorrer los 4 pasos solo con teclado |
| 19 | DevTools › Network | Solo `cdn.tailwindcss.com/3.4.17` como recurso externo |

Casos de las reglas puras (esperado entre paréntesis):

- Nombre: `María José` (ok), `Ana-Sofía` (ok), `O'Brien` (ok), `A` (error), `Ana2` (error), `-Ana` (error), `Ana  Sofía` (dos espacios, error), `Ana-` (error).
- Teléfono: `+1 305 555 0191` (ok), `+34 612 345 678` (ok), `305 555 0191` (error), `+1 (305) 555-0191` (ok), `+0 123` (error).
- Nacimiento (con "hoy" fijado): fecha de ayer (ok, bebé), `2026-02-31` (error), mañana (error), hoy − 121 años (error), hoy − 120 años (ok).
- Fecha preferida: hoy (error), siguiente día hábil (ok), hoy + 60 días (ok), hoy + 61 (error); desde un viernes, el sábado y el domingo (error) y el lunes (ok).
- Paediatric Care: DOB de 30 años (error), de 10 años (ok), de exactamente 18 años cumplidos hoy (error).
- `patient_id`: vacío (ok), `HC-A3F291` (ok), `HC-12` (error), `hc-a3f291` (ok).
- `insurance_member_id`: `ABC12` (error), `ABC123` (ok), 21 caracteres (error).
- `health_concern`: 19 caracteres (error con "(faltan 1 caracteres)"), 20 (ok), 501 (error).
- Contexto cruzado: `Evening` + San Antonio (aviso), `Evening` + Miami (sin aviso), `Morning` + San Antonio (sin aviso).

## 10. Riesgos

- **Selector de fecha:** `input[type=date]` en navegadores antiguos (Safari < 14) cae a un campo de texto. La validación acepta solo `YYYY-MM-DD`; si el texto no encaja, da el mismo error de fecha. Se acepta (público objetivo con navegadores actuales).
- **Foco al cambiar de paso:** mover el foco a un `h2` con `tabindex="-1"` es la técnica estándar; hay que comprobar con VoiceOver que se lee el título del paso y no solo "grupo".
- **Play CDN:** igual que la 001: no recomendado para producción; el CSS de variantes `aria-[…]:` requiere Tailwind ≥ 3.2 (3.4.17 lo cumple).
- **Varias comprobaciones de accesibilidad** (axe con errores visibles, tabulación entre pasos) se hacen a mano; sin tests automáticos hay riesgo de regresión (spec §1: pendiente de decidir).

## 11. Decisiones mías, a confirmar

1. **Token `danger` (#B42318)** para errores. La guía no define un color de error; hay que añadirlo a `tailwind.config.js` y a la guía de marca §5.
2. **Nombres con espacios, guiones y apóstrofos entre letras (R10, aprobado por Elena):** se admiten `María José`, `Ana-Sofía` y `O'Brien`. Se desvía del "solo letras" literal del briefing.
3. **`maxlength` en lugar de mensaje de exceso:** el briefing no define mensaje para "demasiado largo", así que el navegador impide pasar del máximo.
4. **Mensaje propio para `patient_id` inválido** y **texto propio del aviso franja/clínica** (§5): el briefing no los define.
5. **Contador sin `aria-live`**, para no repetir cada pulsación a los lectores de pantalla.
6. **Aviso de franja:** texto neutro ("puede que no haya citas"), sin prometer ni negar disponibilidad.
7. **Textos de interfaz de §5** (`h1`, introducción, botones, títulos de paso): redactados por mí con el tono de la guía de marca.
