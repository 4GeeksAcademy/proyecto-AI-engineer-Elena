# Plan 001: Landing page de HealthCore

Basado en `spec.md` (R1–R17) y `design.md`. Sin dependencias nuevas: HTML, Tailwind Play CDN 3.4.17 y la configuración de la guía de marca. Sin frameworks de testing; verificación manual con las herramientas de `design.md` §9.

## 0. Pendiente antes de empezar

- [x] Aprobar los textos nuevos de `design.md` §4.
- [x] Actualizar `design.md` §3.4 con la imagen del Hero.
- [x] Decidir las imágenes adicionales: 3 en Servicios y 1 en Por qué HealthCore (`design.md` §3.5).

## 1. Base

| # | Paso | Archivos | Req. |
| --- | --- | --- | --- |
| 1.1 | Crear `assets/js/tailwind.config.js` con el bloque de la guía de marca §10 | `uis/website/assets/js/` | — |
| 1.2 | Esqueleto de `index.html`: `head` (meta, canonical, hreflang, OG), landmarks, skip link y las 5 `section` con sus `id` | `uis/website/index.html` | R10, R16, R17 |

## 2. Secciones (EN)

| # | Paso | Req. |
| --- | --- | --- |
| 2.1 | Header: wordmark, navegación con anclas y selector EN \| ES | R1, R8 |
| 2.2 | Hero: `h1`, subtitular, CTA a `application.html` e imagen de fondo | R2 |
| 2.3 | Servicios: 3 tarjetas con foto | R3 |
| 2.4 | Por qué HealthCore: lista de 4 puntos en 2 columnas, con iconos SVG y foto al lado | R4 |
| 2.5 | Ubicaciones: tabla de 6 clínicas en contenedor con scroll | R5, R15 |
| 2.6 | Contacto: `address` con `mailto:`/`tel:` | R6 |
| 2.7 | Footer: © y redes | R7 |
| 2.8 | JSON-LD `@graph`: 1 `MedicalOrganization` + 6 `MedicalClinic` | R11, R12 |

## 3. Imágenes (`design.md` §3.4 y §3.5)

| # | Paso |
| --- | --- |
| 3.1 | Buscar en Unsplash/Pexels según la guía de marca §9 y proponer 2–3 candidatas por hueco (Hero, 3 servicios, Por qué), coherentes entre sí |
| 3.2 | Redactar los `alt` EN/ES de las 4 imágenes de contenido y aprobarlos junto con la selección |
| 3.3 | Descargar las elegidas y generar los 7 archivos de `design.md` §1 con `sips` en `uis/website/assets/img/` |
| 3.4 | Comprobar el contraste del texto blanco sobre el Hero con `opacity-25` (≥ 4,5:1) |

## 4. Versión ES

| # | Paso | Req. |
| --- | --- | --- |
| 4.1 | Copiar `index.html` → `index.es.html` y traducir con los textos de `BRIEFING.md` | R8, R9 |
| 4.2 | Ajustar `lang`, canonical, `og:locale`, selector y CTA (`application.es.html`) | R2, R10, R16 |
| 4.3 | Revisión cruzada EN/ES: misma estructura e `id`, sin texto en el otro idioma | R9 |

## 5. README

| # | Paso |
| --- | --- |
| 5.1 | `uis/website/README.md` mínimo (lo exige `agents.md`): qué es, cómo abrir, crédito de imagen e iconos, resultado de la verificación |

## 6. Verificación (`design.md` §9)

- [ ] Textos, tabla y enlaces idénticos a los briefings (criterios 2–5).
- [ ] validator.schema.org: 0 errores en ambas páginas (criterio 6, R13).
- [ ] validator.w3.org/nu: 0 errores en ambas páginas (criterio 7).
- [ ] Lighthouse Accesibilidad ≥ 95 y axe con 0 críticos en ambas páginas (criterio 7).
- [ ] Sin scroll horizontal a 320, 768 y 1280 px (criterio 8).
- [ ] Recorrido completo con teclado y foco visible (criterio 9).
- [ ] Network: solo `cdn.tailwindcss.com/3.4.17` como recurso externo (criterio 10).

## 7. Cambio posterior: logo y footer

La autora aportó el logo. Se añade junto al nombre en el header y en el footer, y se rediseña el footer (logo, nombre, eslogan, contacto y enlaces a las secciones). Ver `design.md` §3.6.

## 8. Cierre

- [ ] Actualizar `memory-bank/progress.md` (flujo de commit de `agents.md`).
- [ ] Commit, cuando se autorice.
