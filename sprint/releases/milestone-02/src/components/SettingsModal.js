/**
 * SettingsModal.js — Wheel Settings and Profile Configuration Modal
 * Company After Effects Radial Suite
 */

import { store } from '../state/store.js';

export class SettingsModal {
    constructor() {
        this.modal = document.getElementById('settings-modal');
        this.closeBtn = document.getElementById('close-settings-modal-btn');
        this.cancelBtn = document.getElementById('cancel-settings-btn');
        this.saveBtn = document.getElementById('save-settings-btn');
        this.resetDefaultBtn = document.getElementById('reset-profile-btn');
        this.profileSelect = document.getElementById('editor-profile-select');
        this.rootPathInput = document.getElementById('setting-root-path');
        this.slotsContainer = document.getElementById('wheel-editor-preview');
        this.itemsContainer = document.getElementById('editor-items-list');
        this.itemSearchInput = document.getElementById('editor-item-search');
        this.tabs = document.querySelectorAll('.modal-tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        this.selectedCategory = 'all';
        this.itemSearchQuery = '';

        this.initEvents();
    }

    initEvents() {
        const closeModal = () => {
            if (this.modal) this.modal.classList.add('hidden');
        };

        if (this.closeBtn) this.closeBtn.addEventListener('click', closeModal);
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', closeModal);

        // Tab Switching
        if (this.tabs) {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.dataset.tab;
                    this.tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    if (this.tabPanes) {
                        this.tabPanes.forEach(pane => {
                            pane.classList.toggle('active', pane.id === targetId);
                        });
                    }
                });
            });
        }

        // Profile Selector
        if (this.profileSelect) {
            this.profileSelect.addEventListener('change', (e) => {
                store.setActiveProfile(e.target.value);
            });
        }

        // Item search in editor
        if (this.itemSearchInput) {
            this.itemSearchInput.addEventListener('input', (e) => {
                this.itemSearchQuery = e.target.value.trim().toLowerCase();
                this.renderItemsList(store.getState());
            });
        }

        // Category filter in editor
        const catBtns = document.querySelectorAll('.item-cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.dataset.cat || 'all';
                this.renderItemsList(store.getState());
            });
        });

        // Save Button
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => {
                if (this.rootPathInput) {
                    const rootPath = this.rootPathInput.value.trim();
                    store.updateSettings({ rootPath });
                }
                store.addToast("Settings saved successfully.", "success", 2000);
                closeModal();
            });
        }

        // Reset to Default
        if (this.resetDefaultBtn) {
            this.resetDefaultBtn.addEventListener('click', () => {
                if (confirm("Reset current wheel profile to company defaults?")) {
                    localStorage.removeItem('company_ae_radial_user_config');
                    location.reload();
                }
            });
        }
    }

    render(state) {
        const { config, library, activeProfileId } = state;
        if (!config || !library) return;

        // Settings inputs
        if (this.rootPathInput && config.settings) {
            this.rootPathInput.value = config.settings.rootPath || '';
        }

        // Profile Selector
        if (this.profileSelect && config.profiles) {
            this.profileSelect.innerHTML = '';
            config.profiles.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.name;
                opt.textContent = p.name;
                if (p.name === activeProfileId) {
                    opt.selected = true;
                }
                this.profileSelect.appendChild(opt);
            });
        }

        const profile = store.getActiveProfile();
        if (!profile) return;

        // Render Slots configuration
        if (this.slotsContainer) {
            this.slotsContainer.innerHTML = '';
            profile.slots.forEach(slot => {
                const card = document.createElement('div');
                card.className = 'slot-config-card';

                const leftDiv = document.createElement('div');
                leftDiv.innerHTML = `<span class="slot-num">#${(slot.position || 0) + 1}</span> <strong>${slot.label || 'Empty'}</strong> <small style="color:var(--text-secondary)">(${slot.type || 'empty'})</small>`;
                card.appendChild(leftDiv);

                // Re-assign dropdown
                const select = document.createElement('select');
                select.className = 'select-input';

                (library.items || []).forEach(libItem => {
                    const opt = document.createElement('option');
                    opt.value = libItem.id;
                    opt.textContent = `${libItem.label} [${libItem.type}]`;
                    if (libItem.id === slot.id) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });

                select.addEventListener('change', (e) => {
                    const chosenItem = (library.items || []).find(i => i.id === e.target.value);
                    if (chosenItem) {
                        store.updateSlot(profile.name, slot.position, chosenItem);
                        store.addToast(`Slot ${(slot.position || 0) + 1} set to ${chosenItem.label}`, "info", 1500);
                    }
                });

                card.appendChild(select);
                this.slotsContainer.appendChild(card);
            });
        }

        this.renderItemsList(state);
    }

    renderItemsList(state) {
        if (!this.itemsContainer || !state || !state.library) return;
        const items = state.library.items || [];
        const filtered = items.filter(item => {
            const matchesCat = this.selectedCategory === 'all' || item.category === this.selectedCategory || item.type === this.selectedCategory;
            const matchesSearch = !this.itemSearchQuery ||
                (item.label && item.label.toLowerCase().includes(this.itemSearchQuery)) ||
                (item.description && item.description.toLowerCase().includes(this.itemSearchQuery)) ||
                (item.shortcut && item.shortcut.toLowerCase().includes(this.itemSearchQuery));
            return matchesCat && matchesSearch;
        });

        this.itemsContainer.innerHTML = '';
        filtered.forEach(item => {
            const row = document.createElement('div');
            row.className = 'library-item-card';
            row.style.marginBottom = '4px';
            row.innerHTML = `<div class="item-left"><span class="item-badge badge-${item.type}">${(item.type || '').replace('_', ' ')}</span><span class="item-label">${item.label}</span></div>`;
            this.itemsContainer.appendChild(row);
        });
    }
}
