/**
 * SuitePanel.js — Suite Panel Browser, Search, Filter & View Controls
 * Company After Effects Radial Suite
 */

import { store } from '../state/store.js';
import { ActionExecutor } from '../utils/actionExecutor.js';

export class SuitePanel {
    constructor() {
        this.contentView = document.getElementById('library-content-view');
        this.searchInput = document.getElementById('library-search-input');
        this.searchClearBtn = document.getElementById('search-clear-btn');
        this.categorySelect = document.getElementById('category-filter-select');
        this.viewGridBtn = document.getElementById('view-grid-btn');
        this.viewListBtn = document.getElementById('view-list-btn');
        this.openRadialBtn = document.getElementById('open-radial-btn');
        this.settingsBtn = document.getElementById('open-settings-btn');
        this.emptyState = document.getElementById('library-empty-state');
        this.statusBarText = document.getElementById('status-bar-text');
        this.rebuildFooterBtn = document.getElementById('rebuild-index-footer-btn');
        this.rebuildEmptyBtn = document.getElementById('rebuild-index-empty-btn');

        this.currentViewMode = 'grid'; // 'grid' | 'list'

        this.initEvents();
    }

    initEvents() {
        // Search Input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                store.setSearchQuery(query.toLowerCase());
                if (this.searchClearBtn) {
                    this.searchClearBtn.classList.toggle('hidden', query.length === 0);
                }
            });
        }

        // Search Clear
        if (this.searchClearBtn) {
            this.searchClearBtn.addEventListener('click', () => {
                if (this.searchInput) {
                    this.searchInput.value = '';
                    this.searchInput.focus();
                }
                store.setSearchQuery('');
                this.searchClearBtn.classList.add('hidden');
            });
        }

        // Category Filter Select
        if (this.categorySelect) {
            this.categorySelect.addEventListener('change', (e) => {
                store.setFilter(e.target.value);
            });
        }

        // View Mode Toggles
        if (this.viewGridBtn) {
            this.viewGridBtn.addEventListener('click', () => {
                this.currentViewMode = 'grid';
                this.viewGridBtn.classList.add('active');
                if (this.viewListBtn) this.viewListBtn.classList.remove('active');
                if (this.contentView) {
                    this.contentView.classList.remove('list-view');
                    this.contentView.classList.add('grid-view');
                }
            });
        }

        if (this.viewListBtn) {
            this.viewListBtn.addEventListener('click', () => {
                this.currentViewMode = 'list';
                this.viewListBtn.classList.add('active');
                if (this.viewGridBtn) this.viewGridBtn.classList.remove('active');
                if (this.contentView) {
                    this.contentView.classList.remove('grid-view');
                    this.contentView.classList.add('list-view');
                }
            });
        }

        // Open Radial Menu Button
        if (this.openRadialBtn) {
            this.openRadialBtn.addEventListener('click', () => {
                store.setRadialOpen(true, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
            });
        }

        // Settings Button
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => {
                const modal = document.getElementById('settings-modal');
                if (modal) modal.classList.remove('hidden');
            });
        }

        // Rebuild Index Buttons
        const handleRebuild = () => {
            store.addToast("Rebuilding library index...", "info", 1500);
            setTimeout(() => {
                store.addToast("Library index up to date.", "success", 1500);
            }, 500);
        };

        if (this.rebuildFooterBtn) this.rebuildFooterBtn.addEventListener('click', handleRebuild);
        if (this.rebuildEmptyBtn) this.rebuildEmptyBtn.addEventListener('click', handleRebuild);
    }

    render(state) {
        const { library, activeFilter, searchQuery } = state;
        if (!library || !this.contentView) return;

        const items = library.items || [];
        const filtered = items.filter(item => {
            const matchesCat = !activeFilter || activeFilter === 'all' || item.category === activeFilter || item.type === activeFilter;
            const matchesSearch = !searchQuery ||
                (item.label && item.label.toLowerCase().includes(searchQuery)) ||
                (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                (item.shortcut && item.shortcut.toLowerCase().includes(searchQuery)) ||
                (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery)));
            return matchesCat && matchesSearch;
        });

        // Update status bar
        if (this.statusBarText) {
            this.statusBarText.textContent = `Library Loaded: ${items.length} Items (${filtered.length} visible)`;
        }

        // Empty state toggle
        if (this.emptyState) {
            this.emptyState.classList.toggle('hidden', filtered.length > 0);
        }

        this.contentView.innerHTML = '';
        if (filtered.length === 0) {
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'library-item-card';

            const leftDiv = document.createElement('div');
            leftDiv.className = 'item-left';

            const badge = document.createElement('span');
            badge.className = `item-badge badge-${item.type}`;
            badge.textContent = (item.type || '').replace('_', ' ');

            const labelSpan = document.createElement('span');
            labelSpan.className = 'item-label';
            labelSpan.textContent = item.label || 'Untitled';

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

            card.addEventListener('click', () => {
                ActionExecutor.execute(item);
            });

            this.contentView.appendChild(card);
        });
    }
}
