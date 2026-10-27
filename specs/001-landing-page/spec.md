# Spec 001: Landing page de HealthCore

Fuente única de contenido: `uis/website/BRIEFING.md` (ES) y `BRIEFING.en.md` (EN).

## 1. Objetivo y alcance

Presentar HealthCore (quiénes somos, servicios, ubicaciones) con una web pública profesional y bilingüe.

- **Dentro:** `index.html` (EN) e `index.es.html` (ES); HTML y JS vanilla, estilos con Tailwind CSS por CDN (requisito del proyecto).
- **Fuera:** formulario de consulta (spec aparte), `application.html`/`application.es.html`, backend, clínicas del Reino Unido, contenido no incluido en el briefing.

## 2. Requisitos por sección (EARS)

Las secciones aparecen en este orden: Header, Hero, Servicios, Por qué HealthCore, Ubicaciones, Contacto, Footer.

- **R1 Header:** La página SHALL mostrar el logo junto al nombre "HealthCore", la navegación (Home/Inicio, Services/Servicios, Locations/Ubicaciones, Contact/Contacto) y el selector EN | ES. WHEN se pulsa un enlace de navegación, THE página SHALL desplazarse a su sección.
- **R2 Hero:** La página SHALL mostrar el titular, el subtitular y el botón "Request an appointment" / "Solicitar una cita" con los textos exactos del briefing. WHEN se pulsa el botón, THE navegador SHALL ir a `application.html` (EN) o `application.es.html` (ES).
- **R3 Servicios:** La página SHALL mostrar 3 columnas (Primary Care & Chronic Disease, Specialist Consultations, Preventive Health & Wellbeing), cada una con sus 2 viñetas del briefing.
- **R4 Por qué HealthCore:** La página SHALL mostrar en 2 columnas los 4 puntos del briefing (citas el mismo día, horarios extendidos, personal bilingüe, 12 clínicas).
- **R5 Ubicaciones:** La página SHALL mostrar las 6 clínicas de EE. UU. (nombre, ciudad, estado, teléfono, horario) como tabla o tarjetas, con los datos exactos del briefing. IF una clínica no está en la tabla del briefing, THEN THE página SHALL NOT mostrarla; las clínicas del Reino Unido no aparecen en esta sección.
- **R6 Contacto:** La página SHALL mostrar info@healthcore.com, Austin (512) 340-8800, Miami (305) 510-7700 y Reino Unido (Londres) +44 20 7946 0100. WHEN se pulsa un teléfono o correo, THE navegador SHALL abrir `tel:` o `mailto:`.
- **R7 Footer:** La página SHALL mostrar el logo, el nombre "HealthCore", el eslogan (el titular del Hero), los datos de contacto de R6, enlaces a las secciones de la página, "© 2025 HealthCore. All rights reserved." / "Todos los derechos reservados." y enlaces a LinkedIn, Facebook e Instagram (URLs de `sameAs` del briefing).

## 3. Idiomas EN/ES

- **R8:** Cada idioma SHALL tener su propio archivo (`index.html`, `index.es.html`). WHEN se pulsa EN o ES, THE navegador SHALL ir al archivo del idioma elegido.
- **R9:** La versión EN SHALL NOT contener texto visible en español y la ES SHALL NOT contener texto visible en inglés. Excepciones: nombres propios (HealthCore, nombres de clínicas, LinkedIn, Facebook, Instagram) y las etiquetas EN | ES del selector.
- **R10:** Cada archivo SHALL declarar `lang="en"` o `lang="es"` y enlazar a su versión alternativa con `hreflang`.

## 4. Schema.org

- **R11:** Cada página SHALL incluir un bloque JSON-LD `MedicalOrganization` con los valores del briefing (nombre, descripción, url, foundingDate, logo, availableLanguage, areaServed, address, contactPoint, sameAs).
- **R12:** Cada página SHALL incluir un `MedicalClinic` por cada clínica de la tabla (6) con `name`, `telephone`, `openingHours` y `parentOrganization` que referencie a HealthCore.
- **R13:** El JSON-LD SHALL ser válido y sin errores en el validador de Schema.org.

## 5. Responsive, accesibilidad y SEO

- **R14:** La página SHALL mostrarse sin scroll horizontal desde 320 px; las columnas de Servicios y Por qué HealthCore SHALL apilarse en móvil.
- **R15:** La página SHALL cumplir WCAG 2.2 AA: contraste de texto ≥ 4,5:1, navegación completa por teclado con foco visible, objetivos táctiles ≥ 24×24 px, `alt` en imágenes informativas, un único `h1` y jerarquía de encabezados correcta, landmarks (`header`, `nav`, `main`, `footer`) y la tabla con `th`/`scope`.
- **R16:** Cada página SHALL tener `title`, `meta description` y metaetiquetas Open Graph en su idioma, además de `meta viewport` y `canonical`.
- **R17 (imprescindible):** El HTML SHALL ser semántico: cada sección en un `section` con su encabezado, listas en `ul`/`li`, datos de contacto en `address`, enlaces con `a` y acciones con `button`, y ningún `div`/`span` donde exista un elemento con el significado adecuado. El HTML SHALL pasar el validador W3C sin errores.

## 6. Criterios de aceptación

1. Existen `index.html` e `index.es.html` y el selector EN | ES navega entre ambos.
2. Las 7 secciones aparecen en el orden indicado y con los textos exactos del briefing.
3. Ninguna versión contiene texto visible en el otro idioma, salvo las excepciones de R9.
4. La tabla muestra exactamente 6 clínicas con teléfonos y horarios idénticos al briefing.
5. El botón del Hero apunta a `application.html` / `application.es.html`.
6. El JSON-LD contiene 1 `MedicalOrganization` y 6 `MedicalClinic`, y pasa el validador.
7. Lighthouse Accesibilidad ≥ 95 y 0 errores críticos en axe en ambas páginas. HTML sin errores en el validador W3C y estructura semántica según R17.
8. Sin scroll horizontal a 320, 768 y 1280 px.
9. Todo se puede usar solo con teclado, con foco visible.
10. Sin backend. La única dependencia externa es Tailwind CSS por CDN (versión fijada); el JS es vanilla y no hay otras librerías.

## 7. Decisiones (preguntas resueltas)

1. Las 3 clínicas de EE. UU. no listadas en el briefing se omiten.
2. El logo (`assets/img/logo.png`, recortado de la imagen que aportó la autora) se muestra junto al nombre "HealthCore" en el header y el footer. La URL `logo.png` de Schema.org se mantiene tal cual.
3. El CTA del Hero apunta a `application.html` / `application.es.html` aunque aún no existan (enlace roto hasta la spec del formulario).
4. Se aceptan conversiones de horario a formato Schema.org (p. ej. "Mo-Fr 07:00-20:00").
5. La URL del sitio y las de redes sociales son ficticias (proyecto ficticio); se usan las del briefing.
6. El teléfono de Reino Unido (Londres) se muestra en Contacto.
7. Tailwind CSS se carga por CDN por requisito del proyecto, aunque no se recomienda para producción; el CSS propio se limita a lo que Tailwind no cubra.
