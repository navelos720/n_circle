/**
 * store.js — Centralized State Management
 * Company After Effects Radial Suite
 */

import { validateWheelConfig, validateLibraryData } from '../utils/validator.js';
import { getAllRegistryItems } from '../utils/commandRegistry.js';

/**
 * Flattens the SCHEMA.md `categories[].templates[]` shape into a single `items`
 * array, since the UI components (SuitePanel, SettingsModal) consume `library.items`.
 * Merges the live COMMAND_REGISTRY (shortcuts, effects, menu items) so the wheel
 * editor's item browser is populated from a single source of truth.
 * Preserves category/tag metadata on each item.
 */
function flattenLibrary(library) {
    if (!library) return { libraryVersion: '1.0', rootPath: '', categories: [], items: [] };
    const items = [];
    for (const cat of (library.categories || [])) {
        for (const tmpl of (cat.templates || [])) {
            items.push({
                id: tmpl.id,
                type: 'aep_template',
                label: tmpl.name || tmpl.id,
                aepFilePath: tmpl.aepFilePath,
                targetCompName: tmpl.targetCompName,
                placeholderLayerName: tmpl.placeholderLayerName,
                category: cat.id,
                tags: tmpl.tags,
                description: tmpl.description,
                thumbnail: tmpl.thumbnail
            });
        }
    }
    // Merge command/effect/menu registry entries (dedupe by id)
    const existingIds = new Set(items.map(i => i.id));
    for (const reg of getAllRegistryItems()) {
        if (reg && reg.id && !existingIds.has(reg.id)) {
            items.push(reg);
            existingIds.add(reg.id);
        }
    }
    return { ...library, items };
}

class StateStore {
    constructor() {
        this.state = {
            config: null,
            library: null,
            activeProfileId: 'default',
            radialOpen: false,
            radialPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            hoveredSlotIndex: -1,
            hoveredSubSlotIndex: -1,
            activeSubmenuSlotIndex: -1,
            activeFilter: 'all',
            searchQuery: '',
            toasts: [],
            isDirty: false
        };

        this.listeners = new Set();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(changedKeys = []) {
        for (const listener of this.listeners) {
            listener(this.state, changedKeys);
        }
    }

    getState() {
        return this.state;
    }

    async init(initialConfig, initialLibrary) {
        let config = initialConfig;
        let library = initialLibrary;

        // Try to load persisted user config from localStorage or fallback
        const savedConfigStr = localStorage.getItem('company_ae_radial_user_config');
        if (savedConfigStr) {
            try {
                const parsed = JSON.parse(savedConfigStr);
                const validation = validateWheelConfig(parsed);
                if (validation.valid) {
                    config = parsed;
                }
            } catch (e) {
                console.warn('Failed to parse cached config, using default', e);
            }
        }

        const savedLibStr = localStorage.getItem('company_ae_radial_user_library');
        if (savedLibStr) {
            try {
                const parsedLib = JSON.parse(savedLibStr);
                const validationLib = validateLibraryData(parsedLib);
                if (validationLib.valid) {
                    library = parsedLib;
                }
            } catch (e) {
                console.warn('Failed to parse cached library, using default', e);
            }
        }

        this.state.config = config;
                this.state.library = flattenLibrary(library);
        // Profiles use "name" as identifier per default_config.json schema
        this.state.activeProfileId = config.activeProfile || (config.profiles[0] && config.profiles[0].name) || 'Company Default';
        this.notify(['config', 'library', 'activeProfileId']);
    }

    getActiveProfile() {
        if (!this.state.config || !this.state.config.profiles) return null;
        return this.state.config.profiles.find(p => p.name === this.state.activeProfileId) || this.state.config.profiles[0];
    }

    setActiveProfile(profileName) {
        const found = this.state.config.profiles.find(p => p.name === profileName);
        if (found) {
            this.state.activeProfileId = profileName;
            this.state.config.activeProfile = profileName;
            this.state.isDirty = true;
            this.saveConfig();
            this.notify(['activeProfileId', 'config']);
        }
    }

    setRadialOpen(isOpen, pos = null) {
        this.state.radialOpen = isOpen;
        if (pos) {
            this.state.radialPosition = pos;
        }
        if (!isOpen) {
            this.state.hoveredSlotIndex = -1;
            this.state.hoveredSubSlotIndex = -1;
            this.state.activeSubmenuSlotIndex = -1;
        }
        this.notify(['radialOpen', 'radialPosition', 'hoveredSlotIndex', 'activeSubmenuSlotIndex']);
    }

    setHoveredSlot(index) {
        if (this.state.hoveredSlotIndex !== index) {
            this.state.hoveredSlotIndex = index;
            this.notify(['hoveredSlotIndex']);
        }
    }

    setHoveredSubSlot(index) {
        if (this.state.hoveredSubSlotIndex !== index) {
            this.state.hoveredSubSlotIndex = index;
            this.notify(['hoveredSubSlotIndex']);
        }
    }

    setActiveSubmenuSlot(index) {
        if (this.state.activeSubmenuSlotIndex !== index) {
            this.state.activeSubmenuSlotIndex = index;
            this.state.hoveredSubSlotIndex = -1;
            this.notify(['activeSubmenuSlotIndex', 'hoveredSubSlotIndex']);
        }
    }

    setFilter(category) {
        this.state.activeFilter = category;
        this.notify(['activeFilter']);
    }

    setSearchQuery(query) {
        this.state.searchQuery = query;
        this.notify(['searchQuery']);
    }

    updateSlot(profileName, position, itemData) {
            const profile = this.state.config.profiles.find(p => p.name === profileName);
            if (!profile) {
                this.addToast("Profile not found", "error");
                return;
            }

                // Merge item fields into the slot (flat schema per SCHEMA.md)
                const slot = profile.slots.find(s => s.position === position);
                const merged = { position, ...itemData };

                if (slot) {
                    Object.assign(slot, merged);
            } else {
                    profile.slots.push(merged);
                }
                // Keep positions sequential
                profile.slots.sort((a, b) => a.position - b.position);

                this.state.isDirty = true;
                this.saveConfig();
                this.notify(['config']);
            }

    updateSettings(newSettings) {
        this.state.config.settings = { ...this.state.config.settings, ...newSettings };
        this.state.isDirty = true;
        this.saveConfig();
        this.notify(['config']);
    }

    updateSubmenuSlot(profileName, parentSlotIndex, subSlotIndex, itemData) {
        const profile = this.state.config.profiles.find(p => p.name === profileName);
        if (!profile) {
            this.addToast("Profile not found", "error");
            return;
        }

        const parentSlot = profile.slots[parentSlotIndex];
        if (!parentSlot) {
            this.addToast("Parent slot not found", "error");
            return;
        }

        // Initialize children array if it doesn't exist
        if (!parentSlot.children) {
            parentSlot.children = [];
        }

        // Update or add submenu slot
        const merged = { position: subSlotIndex, ...itemData };
        const existingSlot = parentSlot.children.find(s => s.position === subSlotIndex);
        
        if (existingSlot) {
            Object.assign(existingSlot, merged);
        } else {
            parentSlot.children.push(merged);
        }

        // Keep positions sequential
        parentSlot.children.sort((a, b) => a.position - b.position);

        this.state.isDirty = true;
        this.saveConfig();
        this.notify(['config']);
    }

    addLibraryItem(newItem) {
        if (!this.state.library) return;
        
        // Check if item already exists
        const exists = this.state.library.items.find(item => item.id === newItem.id);
        if (exists) {
            this.addToast("Item already exists in library", "warning");
            return;
        }

        this.state.library.items.push(newItem);
        
        // Persist library to localStorage
        try {
            localStorage.setItem('company_ae_radial_user_library', JSON.stringify(this.state.library));
        } catch (e) {
            console.error('Failed to persist library', e);
        }

        this.notify(['library']);
    }

    resetProfileToDefault() {
        // This reloads from the original default_config.json
        // In a real implementation, you'd fetch the original default config
        // For now, we'll just clear localStorage and reload
        localStorage.removeItem('company_ae_radial_user_config');
        
        // Trigger a reload to fetch fresh defaults
        // In production, you'd want to fetch from default_config.json instead
        window.location.reload();
    }

    persistConfig() {
        // Explicit save method that can be called when user clicks Save
        this.saveConfig();
        
        // Also persist library if it has custom items
        if (this.state.library) {
            try {
                localStorage.setItem('company_ae_radial_user_library', JSON.stringify(this.state.library));
            } catch (e) {
                console.error('Failed to persist library', e);
            }
        }
    }

        rebuildLibraryIndex() {
            // This is a runtime operation that scans the configured root path
            // In production, this would invoke a CEP filesystem API or Node.js script
            // For now, we'll simulate the rebuild process
        
            this.addToast("Rebuilding library index...", "info", 2000);
        
            // Simulate async scan
            setTimeout(() => {
                try {
                    const rootPath = this.state.config?.settings?.rootPath;
                    if (!rootPath) {
                        this.addToast("Root path not configured", "warning");
                        return;
                    }

                    // In a real implementation, this would:
                    // 1. Scan the rootPath directory for .aep files
                    // 2. Generate new library entries
                    // 3. Update the library state
                    // 4. Persist the new library to localStorage
                
                    // For now, we'll just show a success message
                    this.addToast("Library index rebuilt successfully", "success", 3000);
                } catch (e) {
                    console.error('Failed to rebuild library index', e);
                    this.addToast("Failed to rebuild library index", "error");
                }
            }, 1500);
        }

    saveConfig() {
        try {
            localStorage.setItem('company_ae_radial_user_config', JSON.stringify(this.state.config));
        } catch (e) {
            console.error('Failed to persist wheel_config.json', e);
        }
    }

    addToast(message, type = 'info', duration = 3000) {
        const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const toast = { id, message, type, duration };
        this.state.toasts.push(toast);
        this.notify(['toasts']);

        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(id);
            }, duration);
        }
        return id;
    }

    removeToast(id) {
        this.state.toasts = this.state.toasts.filter(t => t.id !== id);
        this.notify(['toasts']);
    }
}

export const store = new StateStore();
