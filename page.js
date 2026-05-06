(function() {
    'use strict';
    // Bloquear window.open de forma robusta
    window.open = function() { 
        console.log("Pop-up bloqueado por la extensión (page.js)."); 
        return null; 
    };
    try {
        // Bloquear la restauración de window.open por scripts de publicidad (CSP bypass)
        Object.defineProperty(window, 'open', { writable: false, configurable: false });
    } catch (e) {}

    // Bloquear simulaciones de clic en enlaces
    const originalClick = window.HTMLElement.prototype.click;
    window.HTMLElement.prototype.click = function() {
        if (this.tagName === 'A' && (this.target === '_blank' || this.target === '_new')) {
            return;
        }
        return originalClick.apply(this, arguments);
    };
})();
