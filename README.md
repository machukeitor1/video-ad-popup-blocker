# Video Ad Popup Blocker 🚫

Una extensión ligera para navegadores basada en Chrome/Edge diseñada específicamente para bloquear ventanas emergentes (pop-ups) y capas invisibles de publicidad en sitios de streaming como Cuevana.

## 🚀 Características

- **Bloqueo de Pop-ups Hard-Lock:** Bloquea `window.open` e impide que los scripts de publicidad restauren la función original.
- **Eliminación Segura de Overlays:** Detecta y desactiva capas invisibles gigantes ignorando inteligentemente los controles del reproductor de video.
- **Detección Flexible de Dominio:** Se activa automáticamente en cualquier variante del dominio de Cuevana.
- **Bajo Consumo de Recursos:** Algoritmos optimizados para ejecutarse sin ralentizar la navegación.

## ⚙️ Funcionamiento Técnico

La extensión opera mediante un `content_script` que se ejecuta al inicio de la carga de la página (`document_start`):

1. **Bloqueo Nativo Hard-Lock:** Inyecta un script en el contexto principal de la página para sobrescribir `window.open` y bloquearlo mediante `Object.defineProperty`, evitando restricciones de CSP y restauraciones por scripts de publicidad.
2. **Seguridad de Interfaz:** Escanea elementos con alto `z-index` pero omite deliberadamente aquellos que contienen tags `<video>` o controles, evitando romper la navegación del usuario.
3. **Intercepción de Eventos:** Escucha los clics en la fase de captura para detener eventos dirigidos a enlaces sospechosos.


## 📄 Licencia

Este proyecto es de código abierto y puede ser utilizado y modificado libremente.
