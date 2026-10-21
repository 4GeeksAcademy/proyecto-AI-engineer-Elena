# Regla de Cumplimiento y Privacidad de Datos de Salud

**Ámbito:** aplicar siempre que se diseñe, genere, modifique o revise código, configuración, prompts, integraciones, pruebas o flujos que puedan acceder, procesar, transmitir o almacenar PHI o datos personales de salud de HealthCore.

## Regla principal

No generes ni recomiendes código que exponga, transmita o persista PHI/datos personales de salud sin cifrado, controles de acceso y registro de auditoría adecuados. No presentes un ejemplo incompleto como listo para producción si alguno de esos controles falta.

## Requisitos obligatorios

- **Cifrado:** los datos de salud deben estar protegidos en tránsito y en reposo mediante mecanismos y bibliotecas aprobados por el proyecto. No implementes criptografía propia, no guardes PHI en texto plano y no incluyas claves, secretos ni credenciales en el código.
- **Acceso mínimo:** aplica autenticación y autorización de mínimo privilegio antes de acceder a datos de pacientes. No asumas que la autenticación por sí sola autoriza el acceso.
- **Auditoría:** cada acceso, modificación, exportación o procesamiento sensible debe generar un evento de auditoría. Registra solo los metadatos necesarios para identificar actor o servicio, recurso, acción, momento, resultado y propósito cuando esté definido. Protege la integridad y el acceso a estos eventos; no copies notas clínicas ni payloads de PHI al registro de auditoría.
- **Minimización y redacción:** usa únicamente los datos necesarios para la finalidad. No incluyas PHI en logs ordinarios, trazas, mensajes de error, telemetría, prompts o datos de prueba. Redacta o elimina identificadores antes de registrar información técnica.
- **Datos no productivos:** utiliza datos sintéticos o adecuadamente desidentificados en desarrollo, pruebas y demostraciones. No copies datos de producción a entornos no autorizados.
- **Separación jurisdiccional:** HIPAA aplica a las operaciones de EE. UU. y UK GDPR a las del Reino Unido. Conserva los límites de región y acceso definidos por el proyecto; no combines ni transfieras datos entre jurisdicciones sin revisión y aprobación documentadas de Cumplimiento.
- **Proveedores y servicios externos:** no envíes PHI a modelos, APIs, plataformas de automatización u otros proveedores externos hasta verificar que el servicio concreto y su configuración están aprobados para ese uso y que existen los acuerdos aplicables.

## Conducta al generar o revisar código

1. Identifica si el flujo maneja PHI o datos personales de salud y en qué jurisdicción opera. Si la clasificación o jurisdicción no está clara, pregunta antes de proponer persistencia, transferencia o procesamiento externo.
2. Comprueba cifrado, autorización, minimización y auditoría en todos los puntos de lectura, escritura, exportación y procesamiento, incluidos fallos y rutas de observabilidad.
3. Si no se conocen los mecanismos aprobados, no inventes proveedores, claves, algoritmos, regiones ni periodos de retención. Señala la dependencia y solicita la decisión necesaria; limita cualquier ejemplo a una interfaz o pseudocódigo que no exponga datos.
4. No elimines ni debilites controles para hacer pasar pruebas o facilitar depuración. Explica el riesgo y ofrece una alternativa segura.
5. Añade o propone pruebas que verifiquen acceso no autorizado denegado, auditoría de acciones sensibles, cifrado configurado y ausencia de PHI en logs, errores y telemetría. Usa datos sintéticos.

## Condiciones de bloqueo

Detén la generación de una implementación que maneje datos reales y solicita aclaración o aprobación de Seguridad/Cumplimiento cuando falte cualquiera de estos elementos: clasificación de datos, jurisdicción, autorización, mecanismo de cifrado aprobado, destino de auditoría protegido o aprobación del proveedor externo. No afirmes que una solución cumple HIPAA o UK GDPR solo por usar cifrado o un proveedor determinado.

Esta regla establece requisitos técnicos de protección; las interpretaciones legales, bases jurídicas, excepciones y periodos de conservación corresponden a los responsables de Cumplimiento y asesoría legal de HealthCore.
