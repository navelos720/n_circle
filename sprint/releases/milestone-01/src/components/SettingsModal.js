/**
 * SettingsModal.js — Wheel Settings and Profile Configuration Modal
 * Company After Effects Radial Suite
 */

import { store } from '../state/store.js';

export class SettingsModal {
    constructor() {
        this.modal = document.getElementById('settings-modal');
        this.closeBtn = document.getElementById('modal-close-btn');
        this.cancelBtn = document.getElementById('cancel-settings-btn');
        this.saveBtn = document.getElementById('save-settings-btn');
        this.resetDefaultBtn = document.getElementById('reset-default-btn');
        this.rootPathInput = document.getElementById('setting-root-path');
        this.slotsContainer = document.getElementById('wheel-slots-editor');

        this.initEvents();
    }

    initEvents() {
        const closeModal = () => {
            this.modal.classList.add('hidden');
        };

        this.closeBtn.addEventListener('click', closeModal);
        this.cancelBtn.addEventListener('click', closeModal);

        this.saveBtn.addEventListener('click', () => {
            const rootPath = this.rootPathInput.value.trim();
            store.updateSettings({ rootPath });
            store.addToast("Settings saved successfully.", "success");
            closeModal();
        });

        this.resetDefaultBtn.addEventListener('click', () => {
            if (confirm("Reset current wheel profile to company defaults?")) {
                localStorage.removeItem('company_ae_radial_user_config');
                location.reload();
            }
        });
    }

    render(state) {
        const { config, library } = state;
        if (!config || !library) return;

        // Settings inputs
        if (this.rootPathInput && config.settings) {
            this.rootPathInput.value = config.settings.rootPath || '';
        }

        const profile = store.getActiveProfile();
        if (!profile) return;

        // Render Slots configuration cards
        this.slotsContainer.innerHTML = '';
        
        profile.slots.forEach(slot => {
            const card = document.createElement('div');
            card.className = 'slot-config-card';

            const leftDiv = document.createElement('div');
            leftDiv.innerHTML = `<span class="slot-num">#${slot.index + 1}</span> <strong>${slot.item.label}</strong> <small style="color:var(--text-secondary)">(${slot.item.type})</small>`;
            card.appendChild(leftDiv);

            // Re-assign dropdown
            const select = document.createElement('select');
            select.className = 'select-input';

            library.items.forEach(libItem => {
                const opt = document.createElement('option');
                opt.value = libItem.id;
                opt.textContent = `${libItem.label} [${libItem.type}]`;
                if (libItem.id === slot.item.id) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            select.addEventListener('change', (e) => {
                const chosenItem = library.items.find(i => i.id === e.target.value);
                if (chosenItem) {
                    store.updateSlot(profile.id, slot.index, chosenItem);
                    store.addToast(`Slot ${slot.index + 1} set to ${chosenItem.label}`, "info", 1500);
                }
            });

            card.appendChild(select);
            this.slotsContainer.appendChild(card);
        });
    }
}
