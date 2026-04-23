# Seguridad de formulario

Este proyecto incluye un formulario de registro con validación en el cliente y recomendaciones de seguridad.

## Mejoras aplicadas

- Inputs con atributos `required`, `maxlength`, `minlength` y `pattern`.
- `autocomplete="off"` en el formulario para reducir autocompletado no deseado.
- Validación de JavaScript con comprobaciones de formato y mensajes claros.
- Uso de `textContent` para mostrar mensajes dinámicos y evitar XSS.
- Content Security Policy (CSP) para restringir orígenes de scripts, estilos e imágenes.

## Ejemplo de CSP

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:;">
```

Esta política permite:

- scripts solo desde el mismo origen (`'self'`)
- estilos desde el mismo origen y CSS inline
- imágenes desde el mismo origen, fuentes HTTPS confiables y datos embebidos
