/**
 * RadialOverlay.js â€” SVG-based Radial Wheel with Gesture Tracking & Submenu Fan-Out
 * Company After Effects Radial Suite
 *
 * Rules:
 * - Minimum 7 slots, standardized default 8 slots (ADR-003)
 * - Gesture state machine: mousedown â†’ mousemove â†’ mouseup
 * - Submenu fan-out on outer ring after >150ms hover on folder slot
 * - Center hub: CLOSE at root, BACK in submenu; green flash on success, red on error
 * - Dead zone (r < DEAD_ZONE_RADIUS) registers center hub, not a slot
 */

import {
    RADIAL_CONSTANTS,
    createAnnularSectorPath,
    getWedgeCenterPoint,
    getSlotIndexFromPoint
} from '../utils/radialMath.js';
import { ActionExecutor } from '../utils/actionExecutor.js';
import { store } from '../state/store.js';

// SVG viewBox half-size; the canvas is centered at (0,0) per index.html viewBox="-220 -220 440 440"
const SVG_CX = 0;
const SVG_CY = 0;

export class RadialOverlay {
    constructor() {
        this.overlay = document.getElementById('radial-overlay-layer');
        this.menuRoot = document.getElementById('radial-menu-root');
        this.svgCanvas = document.getElementById('radial-svg-canvas');
        this.innerGroup = document.getElementById('inner-ring-group');
        this.outerGroup = document.getElementById('outer-ring-group');
        this.centerGroup = document.getElementById('center-hub-group');
        this.centerLabel = document.getElementById('center-hub-label');

        // Gesture state
        this._gestureActive = false;
        this._originX = 0;
        this._originY = 0;
        this._submenuTimer = null;
        this._hubFlashTimer = null;

        this._bindGestureListeners();
        this._bindKeyListener();
        this._bindCenterHubClick();
    }

    // â”€â”€â”€ Gesture Listeners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    _bindGestureListeners() {
        // Overlay mousedown â†’ start gesture (menu already open) or ignore
        this.overlay.addEventListener('mousedown', (e) => {
            if (!store.getState().radialOpen) return;
            e.preventDefault();
            this._gestureActive = true;
            this._originX = e.clientX;
            this._originY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this._gestureActive || !store.getState().radialOpen) return;
            this._handleGestureMove(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', (e) => {
            if (!store.getState().radialOpen) return;
            this._gestureActive = false;
            this._handleGestureRelease(e.clientX, e.clientY);
        });
    }
    _bindKeyListener() {
        // Alt+Space toggles the wheel open/closed at the cursor (WHEEL.md §7)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && store.getState().radialOpen) {
                this._closeWheel();
                return;
            }
            if (e.key === ' ' && e.altKey && !e.repeat) {
                e.preventDefault();
                store.setRadialOpen(!store.getState().radialOpen, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
            }
        });
    }


    _bindCenterHubClick() {
        if (this.centerGroup) {
            this.centerGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                const state = store.getState();
                if (state.activeSubmenuSlotIndex >= 0) {
                    store.setActiveSubmenuSlot(-1);
                } else {
                    this._closeWheel();
                }
            });
        }
    }

    _getWheelCenter() {
        const rect = this.svgCanvas.getBoundingClientRect();
        return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
    }

    _handleGestureMove(mouseX, mouseY) {
        const { cx, cy } = this._getWheelCenter();
        const state = store.getState();
        const profile = store.getActiveProfile();
        if (!profile) return;

        const totalSlots = Math.max(profile.slots.length, RADIAL_CONSTANTS.MIN_SLOTS);
        const svgScale = this.svgCanvas.getBoundingClientRect().width / 440;

        const scaledOuter = RADIAL_CONSTANTS.OUTER_RADIUS * svgScale;
        const scaledDead = RADIAL_CONSTANTS.DEAD_ZONE_RADIUS * svgScale;

        // If a submenu is active, check outer ring first
        if (state.activeSubmenuSlotIndex >= 0) {
            const activeSlot = profile.slots[state.activeSubmenuSlotIndex];
            if (activeSlot && activeSlot.children && activeSlot.children.length > 0) {
                const subCount = Math.max(activeSlot.children.length, RADIAL_CONSTANTS.MIN_SLOTS);
                const scaledSubInner = RADIAL_CONSTANTS.SUBMENU_INNER_RADIUS * svgScale;
                const scaledSubOuter = RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS * svgScale;
                const subIdx = getSlotIndexFromPoint(mouseX, mouseY, cx, cy, subCount, scaledSubInner, scaledSubOuter);
                if (subIdx >= 0) {
                    store.setHoveredSubSlot(subIdx);
                } else {
                    store.setHoveredSubSlot(-1);
                }
            }
        }

        // Check inner ring
        const slotIdx = getSlotIndexFromPoint(mouseX, mouseY, cx, cy, totalSlots, scaledDead, scaledOuter + RADIAL_CONSTANTS.ACTIVE_GROWTH * svgScale);
        if (slotIdx >= 0) {
            store.setHoveredSlot(slotIdx);

            const slot = profile.slots[slotIdx];
            if (slot && slot.type === 'folder') {
                if (state.activeSubmenuSlotIndex !== slotIdx) {
                    clearTimeout(this._submenuTimer);
                    this._submenuTimer = setTimeout(() => {
                        store.setActiveSubmenuSlot(slotIdx);
                    }, 150);
                }
            } else {
                clearTimeout(this._submenuTimer);
                if (state.activeSubmenuSlotIndex >= 0) {
                    store.setActiveSubmenuSlot(-1);
                }
            }
        } else {
            // In dead zone or outside
            clearTimeout(this._submenuTimer);
            store.setHoveredSlot(-1);
        }
    }

    _handleGestureRelease(mouseX, mouseY) {
        clearTimeout(this._submenuTimer);
        const { cx, cy } = this._getWheelCenter();
        const state = store.getState();
        const profile = store.getActiveProfile();
        if (!profile) { this._closeWheel(); return; }

        const svgScale = this.svgCanvas.getBoundingClientRect().width / 440;
        const scaledDead = RADIAL_CONSTANTS.DEAD_ZONE_RADIUS * svgScale;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Center hub â†’ close
        if (dist < scaledDead) {
            if (state.activeSubmenuSlotIndex >= 0) {
                store.setActiveSubmenuSlot(-1);
            } else {
                this._closeWheel();
            }
            return;
        }

        // Check if releasing over submenu outer ring
        if (state.activeSubmenuSlotIndex >= 0) {
            const activeSlot = profile.slots[state.activeSubmenuSlotIndex];
            if (activeSlot && activeSlot.children && activeSlot.children.length > 0) {
                const subCount = Math.max(activeSlot.children.length, RADIAL_CONSTANTS.MIN_SLOTS);
                const scaledSubInner = RADIAL_CONSTANTS.SUBMENU_INNER_RADIUS * svgScale;
                const scaledSubOuter = RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS * svgScale;
                const subIdx = getSlotIndexFromPoint(mouseX, mouseY, cx, cy, subCount, scaledSubInner, scaledSubOuter);
                if (subIdx >= 0 && subIdx < activeSlot.children.length) {
                    this._executeItem(activeSlot.children[subIdx]);
                    return;
                }
            }
        }

        // Check inner ring
        const totalSlots = Math.max(profile.slots.length, RADIAL_CONSTANTS.MIN_SLOTS);
        const scaledOuter = RADIAL_CONSTANTS.OUTER_RADIUS * svgScale;
        const slotIdx = getSlotIndexFromPoint(mouseX, mouseY, cx, cy, totalSlots, scaledDead, scaledOuter + RADIAL_CONSTANTS.ACTIVE_GROWTH * svgScale);
        if (slotIdx >= 0 && slotIdx < profile.slots.length) {
            const slot = profile.slots[slotIdx];
            if (slot.type !== 'folder') {
                this._executeItem(slot);
                return;
            }
            // Released on a folder without going into submenu â€” expand it
            store.setActiveSubmenuSlot(slotIdx);
            return;
        }

        // Released outside everything â€” close
        this._closeWheel();
    }

    async _executeItem(slotData) {
        const success = await ActionExecutor.execute(slotData);
        this._flashHub(success);
        this._closeWheel();
    }

    _closeWheel() {
        clearTimeout(this._submenuTimer);
        store.setRadialOpen(false);
    }

    // â”€â”€â”€ Hub Flash Feedback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    _flashHub(success) {
        if (!this.centerGroup) return;
        clearTimeout(this._hubFlashTimer);
        const cls = success ? 'hub-success' : 'hub-error';
        this.centerGroup.classList.add(cls);
        this._hubFlashTimer = setTimeout(() => {
            this.centerGroup.classList.remove(cls);
        }, 600);
    }

    // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    render(state) {
        const { radialOpen, radialPosition, activeSubmenuSlotIndex, hoveredSlotIndex, hoveredSubSlotIndex } = state;

        if (!radialOpen) {
            this.overlay.classList.add('hidden');
            this._clearRings();
            return;
        }

        this.overlay.classList.remove('hidden');

        const profile = store.getActiveProfile();
        if (!profile) return;

        const totalSlots = Math.max(profile.slots.length, RADIAL_CONSTANTS.MIN_SLOTS);
        const wedgeAngle = 360 / totalSlots;

        this._renderInnerRing(profile.slots, totalSlots, wedgeAngle, hoveredSlotIndex, activeSubmenuSlotIndex);
        this._renderOuterRing(profile.slots, activeSubmenuSlotIndex, hoveredSubSlotIndex);
        this._updateCenterHub(activeSubmenuSlotIndex);
    }

    _clearRings() {
        if (this.innerGroup) this.innerGroup.innerHTML = '';
        if (this.outerGroup) {
            this.outerGroup.innerHTML = '';
            this.outerGroup.classList.add('hidden');
        }
    }

    _renderInnerRing(slots, totalSlots, wedgeAngle, hoveredSlotIndex, activeSubmenuSlotIndex) {
        this.innerGroup.innerHTML = '';

        slots.forEach((slot, index) => {
            const isHovered = hoveredSlotIndex === index;
            const isFolderActive = activeSubmenuSlotIndex === index;
            const startAngle = index * wedgeAngle - wedgeAngle / 2;
            const endAngle = startAngle + wedgeAngle;

            const rInner = RADIAL_CONSTANTS.INNER_RADIUS;
            const rOuter = isHovered
                ? RADIAL_CONSTANTS.OUTER_RADIUS + RADIAL_CONSTANTS.ACTIVE_GROWTH
                : RADIAL_CONSTANTS.OUTER_RADIUS;

            const pathD = createAnnularSectorPath(SVG_CX, SVG_CY, rInner, rOuter, startAngle, endAngle);
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', pathD);

            let cls = 'radial-wedge';
            if (isHovered) cls += ' hovered';
            if (slot.type === 'folder') cls += ' is-folder';
            if (isFolderActive) cls += ' folder-active';
            pathEl.setAttribute('class', cls);
            pathEl.setAttribute('data-slot-index', index);

            // Hover events (click-mode support alongside gesture mode)
            pathEl.addEventListener('mouseenter', () => {
                store.setHoveredSlot(index);
                if (slot.type === 'folder') {
                    clearTimeout(this._submenuTimer);
                    this._submenuTimer = setTimeout(() => store.setActiveSubmenuSlot(index), 150);
                } else {
                    clearTimeout(this._submenuTimer);
                    store.setActiveSubmenuSlot(-1);
                }
            });

            pathEl.addEventListener('mouseleave', () => {
                store.setHoveredSlot(-1);
            });

            // Click-mode execution
            pathEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (slot.type !== 'folder') {
                    this._executeItem(slot);
                }
            });

            this.innerGroup.appendChild(pathEl);

            // Label
            const midR = (rInner + RADIAL_CONSTANTS.OUTER_RADIUS) / 2;
            const centerPt = getWedgeCenterPoint(SVG_CX, SVG_CY, midR, index, totalSlots);
            const textEl = this._createLabel(centerPt.x, centerPt.y, slot.label + (slot.type === 'folder' ? ' â–¸' : ''), `radial-label${isHovered ? ' hovered' : ''}`);
            this.innerGroup.appendChild(textEl);
        });
    }

    _renderOuterRing(slots, activeSubmenuSlotIndex, hoveredSubSlotIndex) {
        this.outerGroup.innerHTML = '';

        if (activeSubmenuSlotIndex < 0 || activeSubmenuSlotIndex >= slots.length) {
            this.outerGroup.classList.add('hidden');
            return;
        }

        const parentSlot = slots[activeSubmenuSlotIndex];
        if (!parentSlot || parentSlot.type !== 'folder' || !parentSlot.children || parentSlot.children.length === 0) {
            this.outerGroup.classList.add('hidden');
            return;
        }

        this.outerGroup.classList.remove('hidden');

        const subItems = parentSlot.children;
        const subCount = Math.max(subItems.length, RADIAL_CONSTANTS.MIN_SLOTS);
        const subWedgeAngle = 360 / subCount;

        subItems.forEach((subItem, sIdx) => {
            const isSubHovered = hoveredSubSlotIndex === sIdx;
            const sStartAngle = sIdx * subWedgeAngle - subWedgeAngle / 2;
            const sEndAngle = sStartAngle + subWedgeAngle;

            const sRInner = RADIAL_CONSTANTS.SUBMENU_INNER_RADIUS;
            const sROuter = isSubHovered
                ? RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS + RADIAL_CONSTANTS.ACTIVE_GROWTH
                : RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS;

            const subPathD = createAnnularSectorPath(SVG_CX, SVG_CY, sRInner, sROuter, sStartAngle, sEndAngle);
            const subPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            subPathEl.setAttribute('d', subPathD);
            subPathEl.setAttribute('class', `radial-submenu-wedge${isSubHovered ? ' hovered' : ''}`);

            subPathEl.addEventListener('mouseenter', () => store.setHoveredSubSlot(sIdx));
            subPathEl.addEventListener('mouseleave', () => store.setHoveredSubSlot(-1));
            subPathEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this._executeItem(subItem);
            });

            this.outerGroup.appendChild(subPathEl);

            const subMidR = (sRInner + RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS) / 2;
            const subCenterPt = getWedgeCenterPoint(SVG_CX, SVG_CY, subMidR, sIdx, subCount);
            const subTextEl = this._createLabel(subCenterPt.x, subCenterPt.y, subItem.label, `radial-sublabel${isSubHovered ? ' hovered' : ''}`);
            this.outerGroup.appendChild(subTextEl);
        });
    }

    _updateCenterHub(activeSubmenuSlotIndex) {
        if (!this.centerLabel) return;
        this.centerLabel.textContent = activeSubmenuSlotIndex >= 0 ? 'BACK' : 'CLOSE';
    }

    _createLabel(x, y, text, className) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        el.setAttribute('x', x);
        el.setAttribute('y', y + 4);
        el.setAttribute('class', className);
        el.setAttribute('text-anchor', 'middle');
        el.setAttribute('pointer-events', 'none');
        el.textContent = text;
        return el;
    }
}



