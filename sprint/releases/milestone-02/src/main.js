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
    } catch (error) {
        console.error("Failed to bootstrap Company Radial Suite:", error);
    }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
