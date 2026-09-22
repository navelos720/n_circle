/**
 * actionExecutor.js — Safe Execution of AE Commands, Effects, and AEPs
 * Company After Effects Radial Suite
 *
 * Rules:
 * - try/catch around every single AE call (ERROR_HANDLING.md)
 * - Non-blocking toasts on error or success
 * - Full support for mock mode when running in browser
 */

import { csInterface } from '../lib/CSInterface.js';
import { store } from '../state/store.js';

export class ActionExecutor {
    /**
     * Executes any wheel or library item safely
     */
    static async execute(item) {
        if (!item) {
            store.addToast("Cannot execute empty item.", "warning");
            return false;
        }

        try {
            switch (item.type) {
                case 'shortcut':
                case 'menu_item':
                    return await this.executeCommand(item.commandId, item.requiresSelection, item.label);

                case 'effect':
                    return await this.applyEffect(item.effectName || item.label, item.label);

                case 'aep_file':
                    return await this.openAep(item.path, item.label);

                case 'folder':
                    // Folders don't execute actions directly
                    return true;

                default:
                    store.addToast(`Unknown action type: ${item.type}`, "warning");
                    return false;
            }
        } catch (error) {
            console.error("Action execution caught unexpected exception:", error);
            store.addToast(`Execution failed: ${error.message || error}`, "error");
            return false;
        }
    }

    /**
     * Execute an After Effects Command ID via ExtendScript
     */
    static async executeCommand(commandId, requiresSelection = false, label = "Command") {
        if (!commandId) {
            store.addToast(`Missing command ID for ${label}`, "warning");
            return false;
        }

        const script = `CompanyRadialSuiteBridge.executeCommand(${commandId}, ${requiresSelection})`;
        return new Promise((resolve) => {
            csInterface.evalScript(script, (resultStr) => {
                try {
                    const res = JSON.parse(resultStr || "{}");
                    if (res.success) {
                        store.addToast(`Executed: ${label}`, "success", 1800);
                        resolve(true);
                    } else {
                        store.addToast(res.message || `Failed to execute ${label}`, "warning");
                        resolve(false);
                    }
                } catch (e) {
                    store.addToast(`Bridge error: ${resultStr || e.message}`, "error");
                    resolve(false);
                }
            });
        });
    }

    /**
     * Apply an Effect to selected layer(s)
     */
    static async applyEffect(effectName, label = "Effect") {
        if (!effectName) {
            store.addToast(`Missing effect identifier for ${label}`, "warning");
            return false;
        }

        const escapedName = effectName.replace(/"/g, '\\"');
        const script = `CompanyRadialSuiteBridge.applyEffect("${escapedName}")`;

        return new Promise((resolve) => {
            csInterface.evalScript(script, (resultStr) => {
                try {
                    const res = JSON.parse(resultStr || "{}");
                    if (res.success) {
                        store.addToast(`Applied: ${label}`, "success", 1800);
                        resolve(true);
                    } else {
                        store.addToast(res.message || `Could not apply ${label}. Select a layer first.`, "warning");
                        resolve(false);
                    }
                } catch (e) {
                    store.addToast(`Bridge error: ${resultStr || e.message}`, "error");
                    resolve(false);
                }
            });
        });
    }

    /**
     * Open an AEP File
     */
    static async openAep(relativePathOrFull, label = "AEP Project") {
        if (!relativePathOrFull) {
            store.addToast("Missing AEP file path.", "warning");
            return false;
        }

        // Resolve path against rootPath if configured
        const config = store.getState().config;
        const rootPath = (config && config.settings && config.settings.rootPath) || "";
        
        let fullPath = relativePathOrFull;
        if (rootPath && !relativePathOrFull.includes(":") && !relativePathOrFull.startsWith("/")) {
            fullPath = rootPath.replace(/\\/g, "/") + "/" + relativePathOrFull.replace(/\\/g, "/");
        }
        
        const escapedPath = fullPath.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const script = `CompanyRadialSuiteBridge.openAepProject("${escapedPath}")`;

        return new Promise((resolve) => {
            csInterface.evalScript(script, (resultStr) => {
                try {
                    const res = JSON.parse(resultStr || "{}");
                    if (res.success) {
                        store.addToast(`Opened: ${label}`, "success", 2500);
                        resolve(true);
                    } else {
                        store.addToast(res.message || `Could not open ${label}`, "error");
                        resolve(false);
                    }
                } catch (e) {
                    store.addToast(`Bridge error: ${resultStr || e.message}`, "error");
                    resolve(false);
                }
            });
        });
    }
}
