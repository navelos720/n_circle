/* 
 * Adobe CEP CSInterface shim for standalone browser testing & real CEP hosting
 */
var CSInterface = (function() {
    function CSInterface() {}

    CSInterface.prototype.evalScript = function(script, callback) {
        if (window.__adobe_cep__ && typeof window.__adobe_cep__.evalScript === 'function') {
            window.__adobe_cep__.evalScript(script, callback);
        } else {
            console.log('[CSInterface Mock Eval]:', script);
            if (typeof callback === 'function') {
                if (script.indexOf('checkContext') !== -1) {
                    callback(JSON.stringify({ success: true, hasSelectedLayer: true, hasActiveComp: true, aeVersion: "24.2.0" }));
                } else if (script.indexOf('executeCommand') !== -1) {
                    callback(JSON.stringify({ success: true, commandId: 1056, message: "Executed successfully" }));
                } else if (script.indexOf('applyEffect') !== -1) {
                    callback(JSON.stringify({ success: true, effectName: "ADBE Fast Blur", message: "Effect applied" }));
                } else {
                    callback(JSON.stringify({ success: true }));
                }
            }
        }
    };

    CSInterface.prototype.getHostEnvironment = function() {
        if (window.__adobe_cep__ && typeof window.__adobe_cep__.getHostEnvironment === 'function') {
            return JSON.parse(window.__adobe_cep__.getHostEnvironment());
        }
        return {
            appName: "AEFT",
            appVersion: "24.2",
            appLocale: "en_US",
            appUILocale: "en_US",
            appId: "AEFT"
        };
    };

    CSInterface.prototype.closeExtension = function() {
        if (window.__adobe_cep__ && typeof window.__adobe_cep__.closeExtension === 'function') {
            window.__adobe_cep__.closeExtension();
        } else {
            console.log('[CSInterface Mock]: closeExtension() called');
        }
    };

    CSInterface.prototype.addEventListener = function(type, listener, obj) {
        if (window.__adobe_cep__ && typeof window.__adobe_cep__.addEventListener === 'function') {
            window.__adobe_cep__.addEventListener(type, listener, obj);
        } else {
            window.addEventListener(type, listener);
        }
    };

    CSInterface.prototype.requestOpenExtension = function(extensionId, params) {
        if (window.__adobe_cep__ && typeof window.__adobe_cep__.requestOpenExtension === 'function') {
            window.__adobe_cep__.requestOpenExtension(extensionId, params);
        }
    };

    return CSInterface;
})();

window.CSInterface = CSInterface;

