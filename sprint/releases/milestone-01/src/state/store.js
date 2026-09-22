/**
 * store.js — Centralized State Management
 * Company After Effects Radial Suite
 */

import { validateWheelConfig, validateLibrary } from '../utils/validator.js';

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
                const validationLib = validateLibrary(parsedLib);
                if (validationLib.valid) {
                    library = parsedLib;
                }
            } catch (e) {
                console.warn('Failed to parse cached library, using default', e);
            }
        }

        this.state.config = config;
        this.state.library = library;
        this.state.activeProfileId = config.activeProfileId || (config.profiles[0] && config.profiles[0].id) || 'default';
        this.notify(['config', 'library', 'activeProfileId']);
    }

    getActiveProfile() {
        if (!this.state.config || !this.state.config.profiles) return null;
        return this.state.config.profiles.find(p => p.id === this.state.activeProfileId) || this.state.config.profiles[0];
    }

    setActiveProfile(profileId) {
        const found = this.state.config.profiles.find(p => p.id === profileId);
        if (found) {
            this.state.activeProfileId = profileId;
            this.state.config.activeProfileId = profileId;
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

    updateSlot(profileId, slotIndex, itemData) {
        const profile = this.state.config.profiles.find(p => p.id === profileId);
        if (!profile) return;

        const existingSlot = profile.slots.find(s => s.index === slotIndex);
        if (existingSlot) {
            existingSlot.item = itemData;
        } else {
            profile.slots.push({ index: slotIndex, item: itemData });
        }

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
