(function() {
    // Comprobar si estamos directamente en la página de Cuevana (flexible a cambios de dominio)
    const isCuevana = window.location.hostname.includes('cuevana');
    let isEmbeddedInCuevana = false;

    // Si estamos dentro de un iframe (el reproductor de video de otro dominio)
    // verificamos si la página padre es de Cuevana
    if (window.location !== window.parent.location && window.location.ancestorOrigins) {
        for (let i = 0; i < window.location.ancestorOrigins.length; i++) {
            if (window.location.ancestorOrigins[i].includes('cuevana')) {
                isEmbeddedInCuevana = true;
                break;
            }
        }
    }

    if (!isCuevana && !isEmbeddedInCuevana) {
        return;
    }

    // 1. Sobrescribir funciones nativas para bloquear la creación de ventanas y clics programáticos
    const script = document.createElement('script');
    script.textContent = `
      (function() {
          // Bloquear window.open de forma robusta
          window.open = function() { 
              console.log("Pop-up bloqueado por la extensión."); 
              return null; 
          };
          // Bloquear la restauración de window.open por scripts de publicidad
          Object.defineProperty(window, 'open', { writable: false, configurable: false });

          // Bloquear simulaciones de clic en enlaces
          const originalClick = window.HTMLElement.prototype.click;
          window.HTMLElement.prototype.click = function() {
              if (this.tagName === 'A' && (this.target === '_blank' || this.target === '_new')) {
                  return;
              }
              return originalClick.apply(this, arguments);
          };
      })();
    `;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    // 2. Desactivar capas invisibles (overlays) que capturan clics antes de que el usuario interactúe
    function disableOverlays() {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
            const style = window.getComputedStyle(el);
            if (style.position === 'absolute' || style.position === 'fixed') {
                const zIndex = parseInt(style.zIndex);
                if (zIndex > 90) {
                    const isTransparent = style.opacity < 0.1 || style.backgroundColor === 'transparent' || style.backgroundColor.includes('rgba(0, 0, 0, 0)');
                    const isGiant = el.offsetWidth > window.innerWidth * 0.4 && el.offsetHeight > window.innerHeight * 0.4;
                    
                    if (isTransparent && isGiant && el.style.pointerEvents !== 'none') {
                        // SEGURIDAD: No desactivar si el elemento contiene el video o controles del reproductor
                        const hasPlayerContent = el.querySelector('video, .vjs-tech, .jw-video, [role="button"], button');
                        if (hasPlayerContent) continue;

                        el.style.pointerEvents = 'none';
                        console.log("Overlay gigante transparente desactivado (pointer-events: none).");
                    }
                }
            }
        }
    }

            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    checkAndDisableOverlay(node);
                    node.querySelectorAll('*').forEach(checkAndDisableOverlay);
                }
            });
        }
    });

    // Iniciar observación en el documento completo
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // Ejecución inicial para limpiar overlays ya presentes
    setTimeout(() => document.querySelectorAll('*').forEach(checkAndDisableOverlay), 500);

    // 3. Interceptar clics globales en la fase de captura y destruir trampas al vuelo
    function interceptClicks(e) {
        const el = e.target;

        // Verificar si el elemento clickeado es un contenedor gigante y sospechoso
        if (el.tagName !== 'VIDEO' && el.tagName !== 'IFRAME') {
            const style = window.getComputedStyle(el);
            const isTransparent = style.opacity < 0.1 || style.backgroundColor.includes('rgba(0, 0, 0, 0)') || style.backgroundColor === 'transparent';
            const isGiant = el.offsetWidth > window.innerWidth * 0.5 && el.offsetHeight > window.innerHeight * 0.5;
            
            // Si el usuario hace clic en una capa invisible que cubre la pantalla
            if (isTransparent && isGiant) {
                e.preventDefault();
                e.stopPropagation();
                el.style.pointerEvents = 'none'; // Desactivarlo instantáneamente
                console.log("Clic bloqueado en una trampa invisible. Evento detenido.");
                return;
            }
        }

        // Verificar si el clic fue en un enlace '_blank' que no es confiable (vacío, enorme o invisible)
        const link = el.closest('a');
        if (link && (link.target === '_blank' || link.target === '_new')) {
            const style = window.getComputedStyle(link);
            const isTransparent = style.opacity < 0.1 || style.visibility === 'hidden';
            const isGiant = link.offsetWidth > window.innerWidth * 0.5;
            
            if (isTransparent || isGiant) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Clic bloqueado hacia enlace _blank sospechoso.");
            }
        }
    }

    // Interceptar en la fase de captura para actuar antes que los scripts de publicidad
    document.addEventListener('click', interceptClicks, true);
    document.addEventListener('mousedown', interceptClicks, true);
    document.addEventListener('mouseup', interceptClicks, true);
})();
