/**
 * SettingsModal.js — Wheel Settings and Profile Configuration Modal
 * Company After Effects Radial Suite
 * Milestone 3: Visual wheel editor with drag-and-drop slot assignment
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
        this.draggedItem = null;
        this.editingSubmenu = null; // null = root wheel, or slot index for submenu editing

        this.initEvents();
        
        // Subscribe to store updates to re-render when profile changes
        store.subscribe((state) => {
            this.render(state);
        });
    }

    initEvents() {
        const closeModal = () => {
            if (this.modal) this.modal.classList.add('hidden');
            this.editingSubmenu = null; // Reset submenu state when closing
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
                this.editingSubmenu = null; // Reset submenu view on profile change
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
                store.persistConfig();
                store.addToast("Settings saved successfully.", "success", 2000);
                closeModal();
            });
        }

        // Reset to Default
        if (this.resetDefaultBtn) {
            this.resetDefaultBtn.addEventListener('click', () => {
                if (confirm("Reset current wheel profile to company defaults?")) {
                    store.resetProfileToDefault();
                    this.editingSubmenu = null;
                    store.addToast("Profile reset to company defaults.", "success", 2000);
                }
            });
        }

        // Add AEP Reference Button
        const addAepBtn = document.getElementById('add-aep-reference-btn');
        if (addAepBtn) {
            addAepBtn.addEventListener('click', () => {
                this.showAddAepDialog();
            });
        }

        // Rebuild Index Button
        const rebuildIndexBtn = document.getElementById('settings-rebuild-index-btn');
        if (rebuildIndexBtn) {
            rebuildIndexBtn.addEventListener('click', () => {
                store.addToast("Library indexing is a dev-time tool - see LIBRARY_INDEXING.md", "info", 3000);
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

        // Render Visual Wheel Editor
        this.renderVisualWheel(profile, library);
        this.renderItemsList(state);
    }

    renderVisualWheel(profile, library) {
        if (!this.slotsContainer) return;

        const slots = this.editingSubmenu === null 
            ? profile.slots 
            : (profile.slots[this.editingSubmenu]?.children || []);

        this.slotsContainer.innerHTML = '';

        // Add back button if editing submenu
        if (this.editingSubmenu !== null) {
            const backBtn = document.createElement('div');
            backBtn.className = 'submenu-back-btn';
            backBtn.innerHTML = `← Back to Root Wheel`;
            backBtn.addEventListener('click', () => {
                this.editingSubmenu = null;
                this.render(store.getState());
            });
            this.slotsContainer.appendChild(backBtn);
        }

        // Create visual wheel representation (simplified circular layout)
        const wheelViz = document.createElement('div');
        wheelViz.className = 'wheel-visual-editor';
        wheelViz.style.cssText = 'position: relative; width: 400px; height: 400px; margin: 20px auto; border: 2px dashed var(--border); border-radius: 50%;';

        const centerSize = 80;
        const slotRadius = 140;
        const slotSize = 60;

        // Center hub (just visual, not interactive in editor)
        const centerHub = document.createElement('div');
        centerHub.className = 'wheel-center-hub';
        centerHub.style.cssText = `position: absolute; top: 50%; left: 50%; width: ${centerSize}px; height: ${centerSize}px; margin: -${centerSize/2}px 0 0 -${centerSize/2}px; border-radius: 50%; background: var(--bg-secondary); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--text-secondary);`;
        centerHub.textContent = this.editingSubmenu === null ? 'ROOT' : 'SUBMENU';
        wheelViz.appendChild(centerHub);

        // Render each slot
        slots.forEach((slot, index) => {
            const angle = (index / slots.length) * 2 * Math.PI - Math.PI / 2;
            const x = 200 + slotRadius * Math.cos(angle);
            const y = 200 + slotRadius * Math.sin(angle);

            const slotEl = document.createElement('div');
            slotEl.className = 'wheel-slot-editor';
            slotEl.dataset.slotIndex = index;
            slotEl.style.cssText = `position: absolute; left: ${x}px; top: ${y}px; width: ${slotSize}px; height: ${slotSize}px; margin: -${slotSize/2}px 0 0 -${slotSize/2}px; border-radius: 8px; background: var(--bg-tertiary); border: 2px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;`;

            // Find library item for this slot
            const libraryItem = library.items.find(item => item.id === slot.id);

            // Slot content
            const label = document.createElement('div');
            label.style.cssText = 'font-size: 10px; text-align: center; padding: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;';
            label.textContent = libraryItem ? libraryItem.label : 'Empty';
            slotEl.appendChild(label);

            const slotNum = document.createElement('div');
            slotNum.style.cssText = 'font-size: 8px; color: var(--text-secondary);';
            slotNum.textContent = `#${index + 1}`;
            slotEl.appendChild(slotNum);

            // Click to edit submenu if it's a folder
            if (libraryItem && libraryItem.type === 'folder' && this.editingSubmenu === null) {
                slotEl.style.borderColor = 'var(--accent)';
                slotEl.addEventListener('click', () => {
                    this.editingSubmenu = index;
                    this.render(store.getState());
                });
            }

            // Drag-and-drop: accept drops
            slotEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                slotEl.style.background = 'var(--accent-bg)';
                slotEl.style.borderColor = 'var(--accent)';
            });

            slotEl.addEventListener('dragleave', () => {
                slotEl.style.background = 'var(--bg-tertiary)';
                slotEl.style.borderColor = 'var(--border)';
            });

            slotEl.addEventListener('drop', (e) => {
                e.preventDefault();
                slotEl.style.background = 'var(--bg-tertiary)';
                slotEl.style.borderColor = 'var(--border)';

                if (this.draggedItem) {
                    this.assignItemToSlot(index, this.draggedItem);
                    this.draggedItem = null;
                }
            });

            // Right-click to remove item
            slotEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (libraryItem) {
                    if (confirm(`Remove "${libraryItem.label}" from slot ${index + 1}?`)) {
                        this.clearSlot(index);
                    }
                }
            });

            wheelViz.appendChild(slotEl);
        });

        this.slotsContainer.appendChild(wheelViz);

        // Add slot management buttons
        const slotControls = document.createElement('div');
        slotControls.style.cssText = 'text-align: center; margin-top: 20px;';
        slotControls.innerHTML = `
            <button class="secondary-button" id="add-slot-btn">+ Add Slot</button>
            <button class="secondary-button" id="remove-slot-btn">− Remove Slot</button>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">
                Current slots: ${slots.length} | Minimum: 7 | Right-click slot to remove item
            </p>
        `;
        this.slotsContainer.appendChild(slotControls);

        // Slot management button events
        const addSlotBtn = document.getElementById('add-slot-btn');
        if (addSlotBtn) {
            addSlotBtn.addEventListener('click', () => this.addSlot());
        }

        const removeSlotBtn = document.getElementById('remove-slot-btn');
        if (removeSlotBtn) {
            removeSlotBtn.addEventListener('click', () => this.removeSlot());
        }
    }

    assignItemToSlot(slotIndex, libraryItem) {
        const profile = store.getActiveProfile();
        if (!profile) return;

        if (this.editingSubmenu === null) {
            // Assigning to root wheel
            store.updateSlot(profile.name, slotIndex, libraryItem);
            store.addToast(`Assigned "${libraryItem.label}" to slot ${slotIndex + 1}`, "success", 2000);
        } else {
            // Assigning to submenu
            store.updateSubmenuSlot(profile.name, this.editingSubmenu, slotIndex, libraryItem);
            store.addToast(`Assigned "${libraryItem.label}" to submenu slot ${slotIndex + 1}`, "success", 2000);
        }

        this.render(store.getState());
    }

    clearSlot(slotIndex) {
        const profile = store.getActiveProfile();
        if (!profile) return;

        const emptySlot = {
            id: '',
            label: 'Empty',
            type: 'empty',
            position: slotIndex
        };

        if (this.editingSubmenu === null) {
            store.updateSlot(profile.name, slotIndex, emptySlot);
        } else {
            store.updateSubmenuSlot(profile.name, this.editingSubmenu, slotIndex, emptySlot);
        }

        store.addToast(`Cleared slot ${slotIndex + 1}`, "info", 1500);
        this.render(store.getState());
    }

    addSlot() {
        const profile = store.getActiveProfile();
        if (!profile) return;

        const slots = this.editingSubmenu === null 
            ? profile.slots 
            : (profile.slots[this.editingSubmenu]?.children || []);

        const newSlot = {
            id: '',
            label: 'Empty',
            type: 'empty',
            position: slots.length
        };

        if (this.editingSubmenu === null) {
            profile.slots.push(newSlot);
        } else {
            if (!profile.slots[this.editingSubmenu].children) {
                profile.slots[this.editingSubmenu].children = [];
            }
            profile.slots[this.editingSubmenu].children.push(newSlot);
        }

        store.addToast(`Added slot ${slots.length + 1}`, "success", 1500);
        this.render(store.getState());
    }

    removeSlot() {
        const profile = store.getActiveProfile();
        if (!profile) return;

        const slots = this.editingSubmenu === null 
            ? profile.slots 
            : (profile.slots[this.editingSubmenu]?.children || []);

        if (slots.length <= 7) {
            store.addToast("Cannot remove slot - minimum 7 slots required", "error", 2000);
            return;
        }

        if (confirm(`Remove slot ${slots.length}?`)) {
            if (this.editingSubmenu === null) {
                profile.slots.pop();
            } else {
                profile.slots[this.editingSubmenu].children.pop();
            }
            store.addToast(`Removed slot ${slots.length + 1}`, "info", 1500);
            this.render(store.getState());
        }
    }

    showAddAepDialog() {
        const fileName = prompt("Enter .aep file name to add:");
        if (!fileName) return;

        const filePath = prompt("Enter full file path:");
        if (!filePath) return;

        const newAepItem = {
            id: `aep_${Date.now()}`,
            label: fileName,
            type: 'aep_file',
            category: 'aep_file',
            path: filePath,
            description: `Custom AEP file: ${fileName}`
        };

        store.addLibraryItem(newAepItem);
        store.addToast(`Added AEP file: ${fileName}`, "success", 2000);
        this.render(store.getState());
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
        
        if (filtered.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.cssText = 'padding: 20px; text-align: center; color: var(--text-secondary);';
            noResults.textContent = 'No items found';
            this.itemsContainer.appendChild(noResults);
            return;
        }

        filtered.forEach(item => {
            const row = document.createElement('div');
            row.className = 'library-item-card';
            row.style.marginBottom = '4px';
            row.style.cursor = 'grab';
            row.draggable = true;
            
            row.innerHTML = `
                <div class="item-left">
                    <span class="item-badge badge-${item.type}">${(item.type || '').replace('_', ' ')}</span>
                    <span class="item-label">${item.label}</span>
                </div>
                ${item.shortcut ? `<span class="item-shortcut" style="font-size: 11px; color: var(--text-secondary);">${item.shortcut}</span>` : ''}
            `;

            // Drag start
            row.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                row.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'copy';
            });

            // Drag end
            row.addEventListener('dragend', () => {
                row.style.opacity = '1';
                row.style.cursor = 'grab';
            });

            // Hover effect
            row.addEventListener('mouseenter', () => {
                row.style.background = 'var(--accent-bg)';
            });

            row.addEventListener('mouseleave', () => {
                row.style.background = '';
            });

            this.itemsContainer.appendChild(row);
        });
    }
}
