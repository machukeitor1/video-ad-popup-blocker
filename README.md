# Video Ad Popup Blocker 🚫

Una extensión ligera para navegadores basada en Chrome/Edge diseñada específicamente para bloquear ventanas emergentes (pop-ups) y capas invisibles de publicidad en sitios de streaming como Cuevana.

## 🚀 Características

- **Bloqueo de Pop-ups:** Intercepta y anula llamadas a `window.open` y clics programáticos en enlaces `_blank`.
- **Eliminación de Overlays:** Detecta capas invisibles gigantes que capturan el primer clic del usuario y las desactiva automáticamente.
- **Bajo Consumo de Recursos:** Utiliza `MutationObserver` para monitorear cambios en el DOM en lugar de intervalos constantes, optimizando el uso de CPU.
- **Enfoque Selectivo:** Solo se activa en dominios específicos para no afectar la navegación en otros sitios web.

## 🛠️ Instalación (Modo Desarrollador)

Dado que esta extensión no está en la Chrome Web Store, debes instalarla manualmente:

1. Descarga o clona este repositorio en tu computadora.
2. Abre tu navegador (Chrome, Edge, Brave, etc.).
3. Ve a la sección de Extensiones: `chrome://extensions/` o `edge://extensions/`.
4. Activa el **"Modo de desarrollador"** (Developer mode) en la esquina superior derecha.
5. Haz clic en el botón **"Cargar descomprimida"** (Load unpacked).
6. Selecciona la carpeta donde se encuentra el archivo `manifest.json`.

## ⚙️ Funcionamiento Técnico

La extensión opera mediante un `content_script` que se ejecuta al inicio de la carga de la página (`document_start`):

1. **Inyección de Script:** Sobrescribe la función nativa `window.open` para evitar la apertura de pestañas publicitarias.
2. **Observador de Mutaciones:** Monitorea la creación de nuevos elementos en el DOM para desactivar capas transparentes con `z-index` elevado.
3. **Intercepción de Eventos:** Escucha los clics en la fase de captura para detener eventos dirigidos a enlaces sospechosos antes de que lleguen al script de la página.

## 📄 Licencia

Este proyecto es de código abierto y puede ser utilizado y modificado libremente.
