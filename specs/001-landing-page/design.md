# Diseño técnico 001: Landing page de HealthCore

Entradas: `specs/001-landing-page/spec.md` (requisitos R1–R17), `docs/brand/brand-guide.md` (tokens y estilo) y `uis/website/BRIEFING.md` / `BRIEFING.en.md` (contenido). Este documento define **cómo** se construye; el **qué** está en la spec.

Reparto con la guía de marca: la guía dice **cómo se ve** (colores, tipografía, foco, iconos, imágenes) y este documento dice **dónde y con qué etiqueta o clase** se aplica. Aquí no se repiten reglas de la guía: se citan por sección.

## 1. Archivos

```
uis/website/
├── index.html              # EN (lang="en")
├── index.es.html           # ES (lang="es")
├── assets/
│   ├── img/
│   │   ├── hero-1600.jpg        # imagen del Hero (§3.4)
│   │   ├── hero-800.jpg
│   │   ├── logo.png                    # logo, 128 px, fondo transparente (§3.6)
│   │   ├── service-primary-800.jpg     # Servicios (§3.5)
│   │   ├── service-specialist-800.jpg
│   │   ├── service-preventive-800.jpg
│   │   ├── why-1200.jpg                # Por qué HealthCore (§3.5)
│   │   └── why-600.jpg
│   └── js/
│       └── tailwind.config.js   # tokens de marca, compartido por ambas páginas
└── README.md               # objetivo, tecnología, cómo abrir y verificar
```

- Sin build ni dependencias instaladas. Se abre con doble clic (`file://`) o con cualquier servidor estático.
- Tailwind por Play CDN con versión fijada: `<script src="https://cdn.tailwindcss.com/3.4.17"></script>`, seguido de `<script src="assets/js/tailwind.config.js"></script>` con el bloque de la sección 10 de la guía de marca. Un único archivo de configuración evita que EN y ES diverjan.
- **Sin CSS propio:** todo lo necesario existe en Tailwind (`scroll-smooth`, `motion-reduce:scroll-auto`, `scroll-mt-*`, `sr-only`, `focus-visible:*`).
- **Sin JS de comportamiento:** la navegación usa anclas, el selector de idioma son enlaces y el CTA es un enlace. El único JS es la configuración de Tailwind.

## 2. Esqueleto común

Ambos archivos tienen la misma estructura y los mismos `id`; solo cambian los textos, `lang`, enlaces de idioma y metadatos.

```html
<!doctype html>
<html lang="en" class="scroll-smooth motion-reduce:scroll-auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>…</title>
  <meta name="description" content="…">
  <link rel="canonical" href="https://www.healthcore.com/">
  <link rel="alternate" hreflang="en" href="https://www.healthcore.com/">
  <link rel="alternate" hreflang="es" href="https://www.healthcore.com/index.es.html">
  <link rel="alternate" hreflang="x-default" href="https://www.healthcore.com/">
  <!-- Open Graph (sección 6) -->
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="assets/js/tailwind.config.js"></script>
  <script type="application/ld+json">…</script>
</head>
<body class="bg-surface font-sans text-ink antialiased">
  <a href="#main" class="sr-only focus:not-sr-only …">Skip to content</a>
  <header>…</header>
  <main id="main">
    <section id="home" aria-labelledby="home-title">…</section>
    <section id="services" aria-labelledby="services-title">…</section>
    <section id="why" aria-labelledby="why-title">…</section>
    <section id="locations" aria-labelledby="locations-title">…</section>
    <section id="contact" aria-labelledby="contact-title">…</section>
  </main>
  <footer>…</footer>
</body>
</html>
```

- Los `id` son iguales en EN y ES (no son texto visible).
- Cada `section` usa `scroll-mt-24` para que el encabezado fijo no tape su título al navegar.
- Jerarquía: un `h1` (titular del Hero), un `h2` por sección, `h3` en tarjetas de Servicios.

## 3. Diseño por sección

| Sección | Fondo | Estructura HTML | Layout Tailwind | Req. |
| --- | --- | --- | --- | --- |
| Header | `surface` + borde inferior `primary-tint` | `header` > enlace wordmark + `nav[aria-label]` > `ul` de anclas + `nav[aria-label]` de idioma | Móvil: fila 1 wordmark + EN\|ES, fila 2 navegación con `flex-wrap`. `md:` una sola fila y `md:sticky top-0 z-10`. Sin menú hamburguesa (evita JS). | R1, R8 |
| Hero | `primary` | `section` > `h1`, `p`, `a` (CTA) | `py-16 md:py-24`, texto blanco, `max-w-3xl`. CTA `bg-accent hover:bg-accent-dark` texto blanco, `rounded-lg`. | R2 |
| Servicios | `surface` | `section` > `h2` + `ul` de 3 `li` > `article` > `img` + `h3` + `ul` de 2 viñetas | `grid gap-6 md:grid-cols-3`; tarjetas `bg-primary-tint rounded-xl shadow-sm overflow-hidden`, contenido con `p-6`. Foto: §3.5. | R3, R14 |
| Por qué HealthCore | `surface-alt` | `section` > `h2` + `ul` de 4 `li` (la parte en negrita del briefing en `strong`) + `img` | Puntos en `grid gap-6 sm:grid-cols-2`, con icono en círculo `primary-tint`. Foto al lado en `lg:` (§3.5). | R4, R14 |
| Ubicaciones | `surface` | `section` > `h2` + contenedor con scroll > `table` con `caption` (`sr-only`), `thead` con `th scope="col"`, nombre de clínica como `th scope="row"` | Ver 3.1. | R5, R15 |
| Contacto | `surface-alt` | `section` > `h2` + `address` > `ul` de 4 `li` con etiqueta + enlace `mailto:`/`tel:` | `grid sm:grid-cols-2 gap-4`. | R6 |
| Footer | `primary-dark` | `footer` > cuadrícula de 3 columnas (marca · `nav` de enlaces con `h2` · `div` con `h2` + `address` de contacto) + fila inferior con `p` © y `nav` de redes. Detalle en §3.6. | `grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]`. Texto `footer-text`, títulos y enlaces `text-white hover:text-accent-light`, foco `ring-accent-light`. | R7 |

Enlaces de idioma: el idioma actual lleva `aria-current="page"` y no es un enlace activo visualmente distinto solo por color (se subraya y pone en negrita). El enlace al otro idioma lleva `hreflang` y `lang` (`<a href="index.es.html" hreflang="es" lang="es">ES</a>`). Ambos tienen `aria-label` completo ("English" / "Español") para lectores de pantalla.

### 3.1 Tabla de ubicaciones en móvil

Cinco columnas no caben en 320 px. Se envuelve la tabla en un contenedor con scroll propio:

```html
<div class="overflow-x-auto rounded-xl border border-primary-tint" role="region"
     aria-labelledby="locations-title" tabindex="0">
  <table class="min-w-[40rem] w-full text-left">…</table>
</div>
```

- La **página** no tiene scroll horizontal (R14, criterio 8); solo la tabla se desplaza dentro de su contenedor, lo que WCAG 1.4.10 admite para tablas de datos.
- `tabindex="0"` + `role="region"` permiten desplazarla con teclado y que axe no marque `scrollable-region-focusable`. El contenedor tiene foco visible.
- Se descarta convertir la tabla en tarjetas con `display:block` en móvil porque varios lectores de pantalla pierden la semántica de tabla.

### 3.2 Estados interactivos

Reglas de foco y objetivos táctiles: guía de marca §8. Aplicación en esta página:

- Clases de foco: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`, con `ring-offset` del color del fondo de la sección.
- El Hero va sobre `primary`, fondo que la guía no cubre para el foco: se usa `ring-accent-light` (4,6:1 sobre `primary`, ≥ 3:1 exigido para indicadores de foco).
- Enlaces de texto subrayados, para no distinguirlos solo por color (guía §5).
- Navegación con `py-2 px-3`; CTA con `px-6 py-3`.

### 3.3 Iconos

Estilo y accesibilidad: guía de marca §8. Aplicación: SVG inline con `stroke="currentColor"` y `focusable="false"`, basados en Lucide (licencia ISC), con la fuente citada en el README.

### 3.4 Imagen del Hero

Una sola imagen, solo en el Hero. Criterios de selección: guía de marca §9.

- **Origen:** Unsplash o Pexels (licencias que permiten uso comercial sin registro). El autor, la URL y la licencia se anotan en el README.
- **Archivos:** `assets/img/hero-1600.jpg` y `assets/img/hero-800.jpg`, redimensionados y comprimidos con `sips` (macOS). Se sirven en local: no se enlazan desde el banco de imágenes.
- **Marcado:** `<img>` dentro de la `section` del Hero, en capa de fondo (`absolute inset-0 h-full w-full object-cover`) con `srcset`/`sizes`, `width`/`height`, `fetchpriority="high"` y sin `loading="lazy"`, porque es lo primero que se ve.
- **Contraste:** la sección tiene fondo `primary` y la imagen va con `opacity-25`. En el peor caso (píxel blanco) el fondo resultante es `#54768B` y el texto blanco queda a 4,8:1, ≥ 4,5:1. No hace falta un `div` extra de capa.
- **Accesibilidad:** a esa opacidad y detrás del texto, la imagen es decorativa, así que lleva `alt=""`. Excepción prevista en la guía §9.

### 3.5 Imágenes de contenido

Cuatro imágenes además de la del Hero (cinco en total). Mismas reglas que §3.4: Unsplash o Pexels, archivos locales redimensionados con `sips` y crédito en el README.

| Sección | Imagen | Tema (guía §9) | Formato | Archivos |
| --- | --- | --- | --- | --- |
| Servicios: Atención primaria | 1 por tarjeta, arriba del todo | Médico conversando con un paciente adulto | 3:2, `aspect-[3/2] object-cover rounded-t-xl` | `service-primary-800.jpg` |
| Servicios: Especialistas | ídem | Especialista revisando resultados con un paciente | ídem | `service-specialist-800.jpg` |
| Servicios: Preventiva | ídem | Vacunación o revisión rutinaria, ambiente tranquilo | ídem | `service-preventive-800.jpg` |
| Por qué HealthCore | 1 junto a la lista | Recepción amable atendiendo a un paciente | 4:3; en `lg:` dos columnas (lista con sus 2 columnas de puntos a la izquierda, foto a la derecha); en móvil la foto va debajo de la lista | `why-1200.jpg`, `why-600.jpg` |

- Ubicaciones no lleva foto: una ciudad o una fachada podría parecer la clínica real (guía §9).
- En las tarjetas de Servicios la foto **sustituye al icono**, para no recargarlas. Los iconos quedan solo en Por qué HealthCore.
- Son imágenes informativas: llevan `alt` en EN y ES, `width`/`height` y `loading="lazy"` (están por debajo del Hero).
- Los textos `alt` se redactan cuando se elijan las fotos, describiendo lo que muestra cada una, y se aprueban antes de implementar (§4).
- Las 4 fotos deben parecer de la misma serie: luz, tono y diversidad de personas coherentes entre sí y con el Hero.

### 3.6 Logo y footer

- **Logo:** `assets/img/logo.png`, `alt=""` (el nombre va al lado como texto), `width="128" height="124"`. En el header, `h-9` junto al wordmark dentro del mismo enlace a `#home`. Reglas de uso: guía de marca §7.
- **Footer en la landing, de izquierda a derecha:**
  1. **Marca:** enlace a `#home` con el logo en una pastilla blanca (`bg-white rounded-xl p-2`, porque el logo no se lee sobre `primary-dark`), el wordmark y el eslogan.
  2. **Enlaces rápidos:** `nav` con `aria-labelledby` y 5 anclas: Home, Services, Why HealthCore, Locations, Contact (incluye "Why HealthCore", que no está en el menú del header).
  3. **Contacto:** `h2` + `address` con los 4 datos de R6 (correo y 3 teléfonos como `mailto:`/`tel:`). Los títulos van fuera del `address` (el validador W3C no admite `h2` dentro).
  4. **Fila inferior:** © y `nav` de redes, separadas por un borde `primary`.
- En móvil las columnas se apilan. Los enlaces del footer llevan `py-1` o `py-2` (objetivo táctil ≥ 24 px).

## 4. Contenido y textos nuevos

Todo el texto visible sale de los briefings, salvo estos textos de soporte necesarios para accesibilidad y SEO (aprobados, salvo los `alt`):

| Uso | EN | ES |
| --- | --- | --- |
| Enlace de salto | Skip to content | Saltar al contenido |
| `aria-label` nav principal | Main | Principal |
| `aria-label` nav idioma | Language | Idioma |
| `aria-label` nav redes | Social media | Redes sociales |
| Título de enlaces del footer | Quick links | Enlaces rápidos |
| Eslogan del footer | El titular del Hero | El titular del Hero |
| `aria-label` wordmark | HealthCore home | Inicio de HealthCore |
| `caption` de la tabla (`sr-only`) | HealthCore clinics in the United States | Clínicas de HealthCore en Estados Unidos |
| `title` | HealthCore \| Healthcare that fits your life | HealthCore \| Atención médica que se adapta a tu vida |
| `meta description` / `og:description` | Subtitular EN del briefing | Subtitular ES del briefing |
| `alt` Servicios: atención primaria | A grey-haired doctor with glasses speaks with a patient across a desk. | Un médico de pelo canoso y gafas habla con una paciente al otro lado del escritorio. |
| `alt` Servicios: especialistas | A woman doctor explains something to a young patient while holding a medication bottle. | Una doctora explica algo a una paciente joven mientras sostiene un frasco de medicación. |
| `alt` Servicios: preventiva | An older woman and a health professional look at a medication bottle together at a desk. | Una mujer mayor y una profesional de la salud miran juntas un frasco de medicación en un escritorio. |
| `alt` Por qué HealthCore | A woman checks in at a clinic reception desk while a doctor with a clipboard waits beside her. | Una mujer se registra en la recepción de una clínica mientras un médico con un portapapeles espera a su lado. |

Los 4 `alt` anteriores están **propuestos, pendientes de aprobación** (T4).

Títulos de sección: los del briefing ("Services", "Why HealthCore", "Locations", "Contact" / "Servicios", "Por qué HealthCore", "Ubicaciones", "Contacto"). Encabezados de tabla: los de la tabla del briefing en cada idioma. Horarios: texto literal del briefing ("Mon–Fri 7am–8pm · Sat 9am–3pm" / "Lun–Vie 7am–8pm · Sáb 9am–3pm").

## 5. Enlaces

| Elemento | EN | ES |
| --- | --- | --- |
| Navegación | `#home`, `#services`, `#locations`, `#contact` | igual |
| CTA Hero | `application.html` | `application.es.html` |
| Selector | ES → `index.es.html` | EN → `index.html` |
| Teléfonos | `tel:+15123408800` (E.164, sin espacios) | igual |
| Correo | `mailto:info@healthcore.com` | igual |
| Redes | URLs `sameAs` del briefing, misma pestaña | igual |

Los teléfonos de la tabla de Ubicaciones también son enlaces `tel:` (mejora móvil; no lo exige la spec, pero no la contradice).

## 6. Metadatos y SEO

- `canonical`: `https://www.healthcore.com/` (EN) y `https://www.healthcore.com/index.es.html` (ES). Las alternativas `hreflang` (en, es, x-default→EN) son idénticas en ambos archivos.
- Open Graph: `og:type=website`, `og:site_name=HealthCore`, `og:title` (= `title`), `og:description`, `og:url` (= canonical), `og:locale` `en_US` / `es_US` con `og:locale:alternate` cruzado. Sin `og:image` hasta que exista el logo (decisión 2 de la spec).

## 7. Schema.org

Un único `<script type="application/ld+json">` por página con `@graph`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalOrganization",
      "@id": "https://www.healthcore.com/#organization",
      "name": "HealthCore",
      "…": "resto de campos copiados literalmente del briefing"
    },
    {
      "@type": "MedicalClinic",
      "name": "HealthCore Austin Central",
      "telephone": "+1-512-340-8800",
      "openingHours": ["Mo-Fr 07:00-20:00", "Sa 09:00-15:00"],
      "address": { "@type": "PostalAddress", "addressLocality": "Austin", "addressRegion": "TX", "addressCountry": "US" },
      "parentOrganization": { "@id": "https://www.healthcore.com/#organization" }
    }
  ]
}
```

- `parentOrganization` referencia la organización por `@id` (R12).
- `address` de cada clínica usa solo ciudad y estado de la tabla (no hay dirección postal en el briefing; no se inventa).
- El bloque es **idéntico** en EN y ES: los valores vienen del briefing, que está en inglés, y JSON-LD no es texto visible (R9 no aplica).

Horarios convertidos (decisión 4 de la spec):

| Clínica | `telephone` | `openingHours` |
| --- | --- | --- |
| Austin Central | +1-512-340-8800 | Mo-Fr 07:00-20:00 · Sa 09:00-15:00 |
| Austin North | +1-512-340-8810 | Mo-Fr 08:00-19:00 |
| San Antonio | +1-210-720-4400 | Mo-Fr 08:00-18:00 · Sa 09:00-13:00 |
| Miami | +1-305-510-7700 | Mo-Fr 07:00-20:00 · Sa 09:00-16:00 |
| Orlando | +1-407-892-6600 | Mo-Fr 08:00-18:00 |
| Atlanta | +1-404-330-9900 | Mo-Fr 08:00-19:00 |

## 8. Privacidad y cumplimiento

- La landing no recoge, guarda ni envía datos: sin formularios, cookies, analítica ni almacenamiento local. No trata PHI, por lo que HIPAA y UK GDPR no imponen controles adicionales sobre esta página.
- Las imágenes se sirven desde el propio sitio, no desde Unsplash o Pexels, para que el banco de imágenes no reciba la IP del visitante.
- Única petición a terceros: Tailwind Play CDN, que recibe la IP del visitante. Aceptado por la decisión 7 de la spec; para producción se compilaría el CSS y se serviría desde el propio dominio.
- No se añaden scripts de terceros (analítica, chat, fuentes) sin revisión previa.

## 9. Verificación

No hay runner en el repo; la verificación es manual con herramientas públicas y se registra en `uis/website/README.md`.

| Criterio | Herramienta | Cómo |
| --- | --- | --- |
| 2, 3, 4, 5 | Revisión manual | Comparar textos, tabla y enlaces con los briefings EN/ES |
| 6, R13 | validator.schema.org | Pegar el HTML de cada página: 1 `MedicalOrganization`, 6 `MedicalClinic`, 0 errores |
| 7 (HTML) | validator.w3.org/nu | Subir cada archivo: 0 errores |
| 7 (a11y) | Lighthouse y axe DevTools en Chrome | ≥ 95 y 0 críticos en ambas páginas |
| R15 (Hero) | DevTools, selector de color | Texto blanco sobre la zona más clara de la imagen ≥ 4,5:1 |
| 8 | DevTools, modo dispositivo | 320, 768 y 1280 px: `document.documentElement.scrollWidth <= innerWidth` |
| 9 | Teclado | Recorrer con Tab/Shift+Tab: skip link, nav, idioma, CTA, tabla, enlaces; foco siempre visible |
| 10 | DevTools › Network | Solo `cdn.tailwindcss.com/3.4.17` como recurso externo |

Limitación conocida: el validador W3C y Lighthouse funcionan con Play CDN, pero Lighthouse puede penalizar rendimiento por generar CSS en tiempo de ejecución. Solo se exige la puntuación de Accesibilidad.

## 10. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Flash de contenido sin estilo (Play CDN genera CSS al cargar) | Aceptado para el proyecto; documentado en README. |
| EN y ES divergen al editar | Mismos `id` y estructura; tarea de revisión cruzada línea a línea antes de cerrar. |
| Script de CDN sin SRI (`integrity`): el CDN no envía cabeceras CORS, así que `integrity` + `crossorigin` bloquearía el script | Versión fijada en la URL; para producción, CSS compilado y servido desde el propio dominio (decisión 7). |
| CTA roto hasta la spec 002 | Aceptado (decisión 3 de la spec). |
| Texto de soporte inventado | Limitado a la tabla de la sección 4, ya aprobada. |
| Imagen con licencia o contenido inadecuado | Solo Unsplash/Pexels, criterios de la guía §9 y crédito en el README. |
