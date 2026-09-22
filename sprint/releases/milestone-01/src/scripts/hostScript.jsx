/**
 * hostScript.jsx — ExtendScript Bridge for After Effects
 * Company After Effects Radial Suite
 *
 * Rules:
 * 1. Every app.executeCommand() call is wrapped in try/catch.
 * 2. Selection-context checks before commands requiring selection.
 * 3. Never throw unhandled exceptions to CEP; return JSON strings.
 */

#target aftereffects

var CompanyRadialSuiteBridge = (function() {
    var bridge = {};

    function sanitizeString(str) {
        if (!str) return "";
        return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "\\n");
    }

    function createResult(success, message, data) {
        var obj = {
            success: success === true,
            message: message || (success ? "Success" : "Error"),
            data: data || null
        };
        // Simple JSON serializer for ExtendScript
        return "{\"success\":" + (obj.success ? "true" : "false") + 
               ",\"message\":\"" + sanitizeString(obj.message) + "\"" +
               (obj.data ? ",\"data\":" + obj.data : "") + "}";
    }

    /**
     * Check current After Effects context (active comp, selected layers)
     */
    bridge.checkContext = function() {
        try {
            var hasComp = app.project && app.project.activeItem && (app.project.activeItem instanceof CompItem);
            var selectedLayersCount = 0;
            var aeVersion = app.version || "Unknown";

            if (hasComp && app.project.activeItem.selectedLayers) {
                selectedLayersCount = app.project.activeItem.selectedLayers.length;
            }

            var dataJson = "{\"hasActiveComp\":" + (hasComp ? "true" : "false") + 
                           ",\"selectedLayersCount\":" + selectedLayersCount + 
                           ",\"hasSelectedLayer\":" + (selectedLayersCount > 0 ? "true" : "false") + 
                           ",\"aeVersion\":\"" + sanitizeString(aeVersion) + "\"}";
            return createResult(true, "Context checked", dataJson);
        } catch (e) {
            return createResult(false, "Context check failed: " + e.toString());
        }
    };

    /**
     * Execute an After Effects Command ID (SHORTCUTS.md / MENU_ITEMS.md)
     * e.g., 1056 for Easy Ease, 2797 for New Null
     */
    bridge.executeCommand = function(commandId, requiresSelection) {
        try {
            var numId = parseInt(commandId, 10);
            if (isNaN(numId) || numId <= 0) {
                return createResult(false, "Invalid Command ID: " + commandId);
            }

            if (requiresSelection === true || requiresSelection === "true") {
                if (!app.project || !app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
                    return createResult(false, "No active composition found.");
                }
                if (!app.project.activeItem.selectedLayers || app.project.activeItem.selectedLayers.length === 0) {
                    return createResult(false, "Select a layer to use this action.");
                }
            }

            app.beginUndoGroup("Company Radial Suite Action");
            app.executeCommand(numId);
            app.endUndoGroup();

            return createResult(true, "Executed command " + numId);
        } catch (e) {
            return createResult(false, "Action failed: " + e.toString());
        }
    };

    /**
     * Apply an Effect by match name or display name to selected layer(s)
     */
    bridge.applyEffect = function(effectName) {
        try {
            if (!effectName) {
                return createResult(false, "No effect name specified.");
            }
            if (!app.project || !app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
                return createResult(false, "No active composition found.");
            }
            var selectedLayers = app.project.activeItem.selectedLayers;
            if (!selectedLayers || selectedLayers.length === 0) {
                return createResult(false, "Select a layer to use this action.");
            }

            app.beginUndoGroup("Apply Effect: " + effectName);
            var appliedCount = 0;
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                if (layer && layer.property("ADBE Effect Parade")) {
                    var fxGroup = layer.property("ADBE Effect Parade");
                    fxGroup.addProperty(effectName);
                    appliedCount++;
                }
            }
            app.endUndoGroup();

            if (appliedCount > 0) {
                return createResult(true, "Applied " + effectName + " to " + appliedCount + " layer(s)");
            } else {
                return createResult(false, "This effect cannot be applied in the current context.");
            }
        } catch (e) {
            return createResult(false, "Failed to apply effect: " + e.toString());
        }
    };

    /**
     * Open an AEP file as project (AEP_FILES.md)
     */
    bridge.openAepProject = function(resolvedFilePath) {
        try {
            if (!resolvedFilePath) {
                return createResult(false, "Missing AEP file path.");
            }
            var aepFile = new File(resolvedFilePath);
            if (!aepFile.exists) {
                return createResult(false, "The selected AEP file could not be found.");
            }

            app.open(aepFile);
            return createResult(true, "Opened project: " + aepFile.name);
        } catch (e) {
            return createResult(false, "Failed to open AEP: " + e.toString());
        }
    };

    /**
     * Import an AEP file template into the current project (AEP_INJECTION.md foundation)
     */
    bridge.importAepTemplate = function(resolvedFilePath, targetCompName) {
        try {
            if (!resolvedFilePath) {
                return createResult(false, "Missing AEP file path.");
            }
            var aepFile = new File(resolvedFilePath);
            if (!aepFile.exists) {
                return createResult(false, "The selected AEP file could not be found.");
            }

            if (!app.project) {
                app.newProject();
            }

            app.beginUndoGroup("Import Template: " + aepFile.name);
            var importOptions = new ImportOptions(aepFile);
            var importedItem = app.project.importFile(importOptions);

            // If targetCompName provided, find it and place into active comp
            if (targetCompName && app.project.activeItem && (app.project.activeItem instanceof CompItem)) {
                var activeComp = app.project.activeItem;
                var foundComp = null;

                for (var j = 1; j <= app.project.numItems; j++) {
                    var item = app.project.item(j);
                    if (item instanceof CompItem && item.name === targetCompName) {
                        foundComp = item;
                        break;
                    }
                }

                if (foundComp) {
                    var newLayer = activeComp.layers.add(foundComp);
                    newLayer.startTime = activeComp.time;
                }
            }

            app.endUndoGroup();
            return createResult(true, "Template imported successfully");
        } catch (e) {
            return createResult(false, "Template import failed: " + e.toString());
        }
    };

    return bridge;
})();
