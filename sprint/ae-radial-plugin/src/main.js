/**
 * main.js — Application Bootstrap & Component Orchestration
 * Company After Effects Radial Suite
 */

import { store } from './state/store.js';
import { SuitePanel } from './components/SuitePanel.js';
import { RadialOverlay } from './components/RadialOverlay.js';
import { SettingsModal } from './components/SettingsModal.js';
import { ToastManager } from './components/Toast.js';

async function bootstrap() {
    try {
        // Load default static configurations
        const [configRes, libraryRes] = await Promise.all([
            fetch('./src/default_config.json'),
            fetch('./src/default_library.json')
        ]);

        const initialConfig = await configRes.json();
        const initialLibrary = await libraryRes.json();

        // Initialize UI components
        const suitePanel = new SuitePanel();
        const radialOverlay = new RadialOverlay(document.getElementById('radial-overlay-layer'));
        const settingsModal = new SettingsModal();
        const toastManager = new ToastManager();

        // Subscribe UI components to state updates
        store.subscribe((state) => {
            suitePanel.render(state);
            radialOverlay.render(state);
            settingsModal.render(state);
            toastManager.render(state);
        });

        // Initialize state store
        await store.init(initialConfig, initialLibrary);

        console.log("Company After Effects Radial Suite initialized successfully.");
        
        // Diagnostic: Check if we're in CEP runtime and if bridge is available
        checkExtendScriptBridge();
    } catch (error) {
        console.error("Failed to bootstrap Company Radial Suite:", error);
    }
}

/**
 * Diagnostic function to check if ExtendScript bridge is available
 * This runs AFTER UI is initialized, so it won't break the panel loading
 */
function checkExtendScriptBridge() {
    // Check if we're in CEP runtime (not browser preview)
    if (typeof window.CSInterface === 'undefined' || !window.CSInterface) {
        console.log('[Bridge Check] Running in browser preview mode - ExtendScript bridge not available');
        return;
    }

    console.log('[Bridge Check] Running in CEP runtime - checking bridge availability...');
    store.addToast('Checking ExtendScript connection...', 'info', 2000);
    
    const csInterface = new window.CSInterface();
    
    // Test 1: Simple eval to verify CEP communication works
    csInterface.evalScript('1+1', (result) => {
        console.log('[Bridge Check] Simple eval test (1+1):', result);
        
        if (result === 'EvalScript error.') {
            console.error('[Bridge Check] CRITICAL: evalScript is not working at all!');
            store.addToast('CEP ERROR: Cannot communicate with After Effects', 'error', 5000);
            return;
        }
        
        // Test 2: Check if CompanyRadialSuiteBridge exists
        csInterface.evalScript('typeof CompanyRadialSuiteBridge', (bridgeType) => {
            console.log('[Bridge Check] CompanyRadialSuiteBridge type:', bridgeType);
            
            if (bridgeType === 'undefined') {
                console.error('[Bridge Check] CRITICAL: CompanyRadialSuiteBridge does not exist!');
                console.error('[Bridge Check] This means hostScript.jsx was not loaded by CEP.');
                console.log('[Bridge Check] Attempting to load hostScript.jsx manually...');
                
                store.addToast('Bridge missing - attempting to load...', 'warning', 3000);
                
                // Try to load it manually
                const extensionRoot = csInterface.getSystemPath('extension');
                const scriptPath = extensionRoot + '/src/scripts/hostScript.jsx';
                console.log('[Bridge Check] Script path:', scriptPath);
                
                csInterface.evalScript('$.evalFile("' + scriptPath.replace(/\\/g, '/') + '")', (loadResult) => {
                    console.log('[Bridge Check] Manual load result:', loadResult);
                    
                    // Verify it loaded
                    csInterface.evalScript('typeof CompanyRadialSuiteBridge', (verifyType) => {
                        if (verifyType === 'object') {
                            console.log('[Bridge Check] ✅ Bridge loaded successfully!');
                            store.addToast('✓ Bridge connected! Buttons should work now.', 'success', 4000);
                        } else {
                            console.error('[Bridge Check] ❌ Bridge still not available after manual load');
                            store.addToast('ERROR: Bridge failed to load. Check logs.', 'error', 5000);
                        }
                    });
                });
            } else if (bridgeType === 'object') {
                console.log('[Bridge Check] ✅ Bridge is available and ready!');
                store.addToast('✓ Bridge ready - all systems operational', 'success', 3000);
            } else {
                console.warn('[Bridge Check] Unexpected bridge type:', bridgeType);
                store.addToast('WARNING: Unexpected bridge state: ' + bridgeType, 'warning', 4000);
            }
        });
    });
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
