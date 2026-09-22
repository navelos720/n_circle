/**
 * Toast.js — Non-blocking notification component
 * Company After Effects Radial Suite
 */

import { store } from '../state/store.js';

export class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    render(state) {
        const { toasts } = state;
        if (!this.container) return;

        this.container.innerHTML = '';
        toasts.forEach(toast => {
            const el = document.createElement('div');
            el.className = `toast toast-${toast.type}`;
            el.textContent = toast.message;
            this.container.appendChild(el);
        });
    }
}
