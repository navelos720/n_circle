/**
 * SuitePanel.js — Suite Panel Browser, Search, Filter & Profile Switcher
 * Company After Effects Radial Suite
 */

import { store } from '../state/store.js';
import { ActionExecutor } from '../utils/actionExecutor.js';

export class SuitePanel {
    constructor() {
        this.listContainer = document.getElementById('library-item-list');
        this.searchInput = document.getElementById('search-input');
        this.categoryTabs = document.getElementById('category-tabs');
        this.profileSelect = document.getElementById('profile-select');
        this.settingsBtn = document.getElementById('settings-btn');
        this.openRadialBtn = document.getElementById('open-radial-btn');

        this.initEvents();
    }

    initEvents() {
        // Search Input
        this.searchInput.addEventListener('input', (e) => {
            store.setSearchQuery(e.target.value.trim().toLowerCase());
        });

        // Category Filter Tabs
        this.categoryTabs.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.tab-btn');
            if (tabBtn) {
                const category = tabBtn.dataset.category;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tabBtn.classList.add('active');
                store.setFilter(category);
            }
        });

        // Profile Selector
        this.profileSelect.addEventListener('change', (e) => {
            store.setActiveProfile(e.target.value);
        });

        // Open Radial Menu Button
        this.openRadialBtn.addEventListener('click', () => {
            const rect = this.openRadialBtn.getBoundingClientRect();
            store.setRadialOpen(true, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
        });

        // Settings Button
        this.settingsBtn.addEventListener('click', () => {
            const modal = document.getElementById('settings-modal');
            if (modal) modal.classList.remove('hidden');
        });
    }

    render(state) {
        const { library, config, activeFilter, searchQuery, activeProfileId } = state;
        if (!library || !config) return;

        // 1. Populate Profile Selector
        this.profileSelect.innerHTML = '';
        config.profiles.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            if (p.id === activeProfileId) {
                opt.selected = true;
            }
            this.profileSelect.appendChild(opt);
        });

        // 2. Filter & Render Library Items
        const items = library.items || [];
        const filtered = items.filter(item => {
            // Category check
            const matchesCat = activeFilter === 'all' || item.category === activeFilter || item.type === activeFilter;
            // Search text check
            const matchesSearch = !searchQuery || 
                item.label.toLowerCase().includes(searchQuery) ||
                (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                (item.shortcut && item.shortcut.toLowerCase().includes(searchQuery)) ||
                (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery)));
            
            return matchesCat && matchesSearch;
        });

        this.listContainer.innerHTML = '';
        if (filtered.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.style.padding = '16px';
            emptyEl.style.textAlign = 'center';
            emptyEl.style.color = 'var(--text-disabled)';
            emptyEl.textContent = 'No matching items found.';
            this.listContainer.appendChild(emptyEl);
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'library-item-card';

            const leftDiv = document.createElement('div');
            leftDiv.className = 'item-left';

            const badge = document.createElement('span');
            badge.className = `item-badge badge-${item.type}`;
            badge.textContent = item.type.replace('_', ' ');

            const labelSpan = document.createElement('span');
            labelSpan.className = 'item-label';
            labelSpan.textContent = item.label;

            leftDiv.appendChild(badge);
            leftDiv.appendChild(labelSpan);

            if (item.description) {
                const descSpan = document.createElement('span');
                descSpan.className = 'item-desc';
                descSpan.textContent = `— ${item.description}`;
                leftDiv.appendChild(descSpan);
            }

            card.appendChild(leftDiv);

            if (item.shortcut) {
                const shortcutSpan = document.createElement('span');
                shortcutSpan.className = 'item-shortcut';
                shortcutSpan.textContent = item.shortcut;
                card.appendChild(shortcutSpan);
            }

            // Click to execute action
            card.addEventListener('click', () => {
                ActionExecutor.execute(item);
            });

            this.listContainer.appendChild(card);
        });
    }
}
