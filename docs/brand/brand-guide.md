# Guía de marca: HealthCore

Fuentes: `uis/website/BRIEFING.md` y `specs/001-landing-page/spec.md`. Aplica a la web pública (EN/ES).

## 1. Brand overview

HealthCore es una red de servicios de salud ambulatorios fundada en 2011 en Austin (Texas). Tiene 12 clínicas: 9 en EE. UU. (Texas, Florida, Georgia) y 3 en Reino Unido. Ofrece atención primaria, especialistas, manejo de enfermedades crónicas y salud preventiva. Su ventaja competitiva es la **accesibilidad**: citas el mismo día, horarios extendidos y personal bilingüe en EE. UU.

## 2. Problema / solución

- **Problema:** la presencia online es un placeholder de 2019, con un teléfono y sin SSL. Los pacientes dudan de que la empresa sea real. Además, las consultas llegan por teléfono sin estructura (unos 20 min por llamada) y no hay contenido en español para una población hispanohablante importante.
- **Solución:** una web pública profesional y bilingüe que transmita credibilidad, presente servicios y ubicaciones y lleve al formulario de consulta.

## 3. Posicionamiento

> Para pacientes de Texas, Florida y Georgia que necesitan atención sin esperas ni barreras de idioma, HealthCore es la red de clínicas ambulatorias que ofrece citas el mismo día, horarios extendidos y atención en inglés y español.

Pilares, todos del briefing: **mismo día** · **horarios extendidos** · **bilingüe** · **red de 12 clínicas**.

## 4. Tono de voz

Profesional, cercano y claro. En español se tutea, igual que el briefing ("tu vida", "recibas"). No hay humor, alarmismo ni jerga clínica sin explicar.

| Rasgo | Significado | Decimos (EN / ES) | Nunca decimos (EN / ES) |
| --- | --- | --- | --- |
| Profesional | Preciso, creíble, sin exagerar ni prometer lo que no está en el briefing | "Same-day appointments at most locations" / "Citas el mismo día en la mayoría de las ubicaciones" | "Guaranteed same-day care, always!" / "¡Cita el mismo día garantizada, siempre!" |
| Cercano | Habla a la persona, con calidez y sin condescendencia | "Healthcare that fits your life" / "Atención médica que se adapta a tu vida" | "Patients must submit enquiries" / "El usuario deberá remitir su solicitud" |
| Claro | Frases cortas, una idea por frase, verbos de acción | "Request an appointment" / "Solicitar una cita" | "Initiate the appointment pre-qualification process" / "Inicie el proceso de precalificación de cita" |
| Inclusivo | Ambos idiomas con el mismo nivel de cuidado; sin mezclarlos | "Bilingual staff in English and Spanish" / "Personal bilingüe en inglés y español" | Textos a medio traducir ("Book tu cita") o traducciones literales |

## 5. Color

El primario es un **azul marea**: un azul petróleo profundo, distinto de los azules saturados genéricos (tipo WordPress) y de los índigo/violeta habituales en productos de IA. El acento terracota se usa **solo en CTAs** y en dosis pequeñas.

| Token | Rol | Hex | % de uso |
| --- | --- | --- | --- |
| `surface` | Fondo principal | `#FFFFFF` | 50 % |
| `surface-alt` | Fondo de secciones alternas | `#F2F6F8` | 20 % |
| `primary` | Marca, encabezados, enlaces, cabecera | `#1B4965` | 15 % |
| `primary-dark` | Footer, hover de primario, bloques de alto contraste | `#0F2E42` | 7 % |
| `primary-tint` | Fondos de tarjetas e iconos | `#E3EEF3` | 3 % |
| `ink` | Texto principal | `#1F2A33` | — (texto) |
| `muted` | Texto secundario | `#4A5A66` | — (texto) |
| `accent` | Fondo de CTA principal | `#B4461F` | ≤ 5 % |
| `accent-dark` | Hover/activo del CTA | `#8F3516` | — (estado) |
| `accent-light` | Anillo de foco y enlaces sobre `primary-dark` | `#F2A07B` | — (estado) |

**Pares texto/fondo permitidos** (WCAG 2.x; todos ≥ 4,5:1):

| Texto | Fondo | Ratio |
| --- | --- | --- |
| `ink` #1F2A33 | `surface` #FFFFFF / `surface-alt` #F2F6F8 / `primary-tint` #E3EEF3 | 14,61 / 13,44 / 12,38 |
| `muted` #4A5A66 | `surface` / `surface-alt` / `primary-tint` | 7,13 / 6,56 / 6,04 |
| `primary` #1B4965 | `surface` / `surface-alt` / `primary-tint` | 9,60 / 8,83 / 8,13 |
| `primary-dark` #0F2E42 | `surface` / `surface-alt` | 14,10 / 12,96 |
| Blanco #FFFFFF | `primary` / `primary-dark` | 9,60 / 14,10 |
| Blanco #FFFFFF | `accent` #B4461F / `accent-dark` #8F3516 | 5,47 / 7,81 |
| `accent` #B4461F | `surface` / `surface-alt` | 5,47 / 5,03 |
| `accent-light` #F2A07B | `primary-dark` | 6,77 |
| `#B8C9D4` (texto footer) | `primary-dark` | 8,29 |

No se permite `accent` sobre `primary-dark` (2,58:1). Tampoco se debe transmitir información solo con color.

## 6. Tipografía

Solo fuentes del sistema: sin Google Fonts ni CDNs, y nada que descargar.

- **Familia:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Pesos:** 400 para texto, 600 para subtítulos y botones, 700 para titulares.
- **Escala (Tailwind):** `h1` `text-4xl md:text-5xl` · `h2` `text-3xl` · `h3` `text-xl` · cuerpo `text-base` (16 px) · notas `text-sm` (mínimo 14 px).
- **Ritmo:** interlineado 1,5 en el cuerpo y 1,2 en los titulares; líneas de 60–75 caracteres como máximo; alineación a la izquierda, nunca justificada.

## 7. Logo

El logo es el símbolo (escudo con un corazón, en degradado azul a turquesa) junto al wordmark de texto. Archivo: `uis/website/assets/img/logo.png` (PNG con fondo transparente, 128 px de ancho).

- **Fondos:** sobre fondos claros va tal cual. Sobre `primary-dark` o fotos va dentro de una pastilla blanca (`bg-white rounded-xl p-2`), porque el degradado azul pierde contraste y el recorte deja artefactos sobre fondos oscuros.
- **Símbolo:** `alt=""` porque el nombre va al lado como texto. No se estira, no se recolorea y no se le añaden sombras.
- **Pendiente:** el archivo sale de una captura de baja resolución. Cuando exista el original (SVG o PNG grande con transparencia), sustituirlo en la misma ruta.

### Wordmark

- "Health" en peso 600 y "Core" en peso 700, sin espacio entre ambos, en `primary` sobre fondos claros o en blanco sobre `primary`/`primary-dark`.
- Altura mínima de 20 px. El espacio libre alrededor equivale a la altura de la "H".
- En el HTML es texto real (enlace a inicio), no una imagen, para que sea accesible y traducible.
- No se permite estirarlo, cambiarle el color fuera de los indicados, añadirle sombras ni degradados, ni ponerlo sobre fotos sin una capa de contraste.

## 8. Lenguaje visual

- **Iconos:** de contorno, trazo de 1,5–2 px, a 24 px, en `primary` sobre `primary-tint`. Van como SVG inline en el repo (sin librerías por CDN). Si son decorativos llevan `aria-hidden="true"`; si son informativos, llevan texto alternativo.
- **Radios:** botones e inputs `rounded-lg` (8 px), tarjetas `rounded-xl` (12 px), sin formas pill salvo en etiquetas.
- **Sombras:** mínimas; las tarjetas usan `shadow-sm` y en hover `shadow-md`. No hay sombras de colores. Espaciado en múltiplos de 4 px; secciones con `py-16 md:py-24`.
- **Foco:** anillo de 2 px con separación (`ring-2 ring-offset-2`), en `accent` sobre fondos claros y en `accent-light` sobre `primary-dark`. Nunca se elimina el outline.
- **Objetivos táctiles:** mínimo de 24×24 px (WCAG 2.2); se recomienda 44 px en botones.

## 9. Dirección de imagen

- Personas reales y diversas, de distintas edades y orígenes, que reflejen a pacientes de Texas, Florida y Georgia. Luz natural, ambientes de clínica limpios y cercanos.
- Momentos de atención (conversación con el médico, recepción amable) mejor que objetos aislados.
- Se evitan los clichés de stock (estetoscopio en primer plano, batas posando ante la cámara), las imágenes alarmistas y las imágenes que parezcan una clínica concreta si no lo son.
- Toda imagen informativa lleva `alt` en el idioma de la página; las decorativas llevan `alt=""`.

## 10. Tokens para Tailwind (Play CDN v3)

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          surface: { DEFAULT: '#FFFFFF', alt: '#F2F6F8' },
          primary: { DEFAULT: '#1B4965', dark: '#0F2E42', tint: '#E3EEF3' },
          ink: '#1F2A33',
          muted: '#4A5A66',
          accent: { DEFAULT: '#B4461F', dark: '#8F3516', light: '#F2A07B' },
          'footer-text': '#B8C9D4',
        },
        fontFamily: {
          sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        },
        borderRadius: { lg: '8px', xl: '12px' },
      },
    },
  };
</script>
```
