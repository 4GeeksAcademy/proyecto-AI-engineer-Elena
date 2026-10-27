# Tasks 001: Landing page de HealthCore

Derivadas de `plan.md`. Rutas relativas a `uis/website/`. Marcar `[x]` solo tras implementar y verificar la tarea.

## Base

- [x] T1 -- Crear `assets/js/tailwind.config.js` con el bloque de tokens de `docs/brand/brand-guide.md` §10.
- [x] T2 -- Crear `index.html` con el esqueleto: `head` (title, meta description, viewport, canonical, hreflang, Open Graph, Tailwind 3.4.17 y config), skip link, `header`, `main` con las 5 `section` e `id`, y `footer` (R10, R16, R17).

## Imágenes

- [x] T3 -- Buscar en Unsplash/Pexels y proponer 2–3 candidatas por hueco (Hero, 3 de Servicios, Por qué HealthCore), coherentes entre sí y según la guía de marca §9.
- [x] T4 -- Redactar los `alt` EN/ES de las 4 imágenes de contenido y obtener su aprobación junto con la selección de T3.
- [x] T5 -- Descargar las imágenes elegidas y generar con `sips` los 7 archivos de `design.md` §1 en `assets/img/`.

## Secciones EN (`index.html`)

- [x] T6 -- Header: wordmark, navegación con anclas (`#home`, `#services`, `#locations`, `#contact`) y selector EN | ES (R1, R8).
- [x] T7 -- Hero: `h1`, subtitular, CTA a `application.html` e imagen de fondo con `opacity-25` (R2).
- [x] T8 -- Servicios: 3 tarjetas con foto, `h3` y 2 viñetas del briefing (R3).
- [x] T9 -- Por qué HealthCore: lista de 4 puntos en 2 columnas con iconos SVG y foto al lado (R4).
- [x] T10 -- Ubicaciones: tabla de 6 clínicas con `caption`, `th scope` y contenedor con scroll (R5, R15).
- [x] T11 -- Contacto: `address` con enlaces `mailto:` y `tel:` (R6).
- [x] T12 -- Footer: © 2025 y enlaces a LinkedIn, Facebook e Instagram (R7).
- [x] T13 -- JSON-LD `@graph` con 1 `MedicalOrganization` y 6 `MedicalClinic` (R11, R12).
- [x] T14 -- Comprobar que el texto blanco del Hero sobre la zona más clara de la imagen tiene contraste ≥ 4,5:1.

## Versión ES

- [x] T15 -- Crear `index.es.html` a partir de `index.html` y traducir todos los textos con `BRIEFING.md` (R8, R9).
- [x] T16 -- Ajustar en `index.es.html` `lang`, canonical, `og:locale`, selector de idioma y CTA a `application.es.html` (R2, R10, R16).
- [x] T17 -- Revisión cruzada EN/ES: misma estructura e `id`, sin texto visible en el otro idioma salvo las excepciones de R9.

## Documentación y cierre

- [x] T18 -- Crear `README.md` mínimo en `uis/website/`: qué es, cómo abrirlo, créditos de imágenes e iconos y resultado de la verificación.
- [x] T19 -- Actualizar `memory-bank/progress.md` con el estado de la landing.
- [x] T20 -- Verificar los 10 criterios de aceptación de `spec.md` §6 en `index.html` e `index.es.html` y anotar el resultado en el README:
  1. Existen ambos archivos y el selector navega entre ellos.
  2. Las 7 secciones están en orden y con los textos exactos del briefing.
  3. Ninguna versión contiene texto visible en el otro idioma (salvo R9).
  4. La tabla muestra exactamente 6 clínicas con teléfonos y horarios del briefing.
  5. El CTA apunta a `application.html` / `application.es.html`.
  6. JSON-LD con 1 `MedicalOrganization` y 6 `MedicalClinic`, válido en validator.schema.org.
  7. Lighthouse Accesibilidad ≥ 95, 0 críticos en axe, HTML sin errores en validator.w3.org/nu y estructura semántica (R17).
  8. Sin scroll horizontal a 320, 768 y 1280 px.
  9. Uso completo solo con teclado y foco visible.
  10. Sin backend; Tailwind 3.4.17 por CDN como única dependencia externa.

## Cambio posterior: logo y footer

- [x] T21 -- Añadir `assets/img/logo.png` junto al nombre en el header y rediseñar el footer (logo, nombre, eslogan, contacto, enlaces a las secciones, © y redes) en `index.html` e `index.es.html`; actualizar spec (R1, R7, decisión 2), guía de marca §7 y `design.md` §3.6.
- [x] T22 -- Re-verificar tras T21: W3C y axe repetidos (0 mensajes, 0 violaciones); Elena confirmó haber repetido Lighthouse EN y el recorrido con Tab, ya con el footer.
