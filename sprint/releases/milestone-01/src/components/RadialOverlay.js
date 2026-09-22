/**
 * RadialOverlay.js — SVG-based Radial Wheel with Submenu Wedge Ring
 * Company After Effects Radial Suite
 *
 * Rules:
 * - Minimum 7 slots, standardized default 8 slots (ADR-003)
 * - Fitts's law target expansion & dead zone center (RADIAL_CONSTANTS)
 * - Submenu on outer ring when hovering folder items (>150ms hover delay)
 * - Center cancel button / dead zone
 */

import { RADIAL_CONSTANTS, createAnnularSectorPath, getWedgeCenterPoint } from '../utils/radialMath.js';
import { ActionExecutor } from '../utils/actionExecutor.js';
import { store } from '../state/store.js';

export class RadialOverlay {
    constructor(containerElement) {
        this.container = containerElement;
        this.svg = document.getElementById('radial-svg');
        this.deadzone = document.getElementById('radial-deadzone');
        this.submenuDelayTimer = null;

        this.initEvents();
    }

    initEvents() {
        this.deadzone.addEventListener('click', (e) => {
            e.stopPropagation();
            store.setRadialOpen(false);
        });

        // Close on background click
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                store.setRadialOpen(false);
            }
        });

        // ESC key to dismiss
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && store.getState().radialOpen) {
                store.setRadialOpen(false);
            }
        });
    }

    render(state) {
        const { radialOpen, radialPosition, activeSubmenuSlotIndex, hoveredSlotIndex, hoveredSubSlotIndex } = state;
        
        if (!radialOpen) {
            this.container.classList.remove('open');
            this.svg.innerHTML = '';
            return;
        }

        this.container.classList.add('open');
        
        // Position wheel container
        const wheelWrapper = document.getElementById('radial-wheel-container');
        if (wheelWrapper) {
            wheelWrapper.style.left = `${radialPosition.x}px`;
            wheelWrapper.style.top = `${radialPosition.y}px`;
        }

        const profile = store.getActiveProfile();
        if (!profile) return;

        const totalSlots = Math.max(profile.slots.length, RADIAL_CONSTANTS.MIN_SLOTS);
        const wedgeAngle = 360 / totalSlots;
        const cx = 250;
        const cy = 250;

        // Clear previous SVG contents
        this.svg.innerHTML = '';

        // 1. Render Root Slots
        profile.slots.forEach((slot, index) => {
            const isHovered = hoveredSlotIndex === index;
            const startAngle = index * wedgeAngle - wedgeAngle / 2;
            const endAngle = startAngle + wedgeAngle;

            const rInner = RADIAL_CONSTANTS.INNER_RADIUS;
            const rOuter = isHovered 
                ? RADIAL_CONSTANTS.OUTER_RADIUS + RADIAL_CONSTANTS.ACTIVE_GROWTH 
                : RADIAL_CONSTANTS.OUTER_RADIUS;

            // Wedge Path
            const pathD = createAnnularSectorPath(cx, cy, rInner, rOuter, startAngle, endAngle);
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', pathD);
            pathEl.setAttribute('class', `radial-wedge ${isHovered ? 'hovered' : ''} ${slot.item.type === 'folder' ? 'is-folder' : ''}`);
            pathEl.setAttribute('data-slot-index', index);

            // Wedge hover & click
            pathEl.addEventListener('mouseenter', () => {
                store.setHoveredSlot(index);

                if (slot.item.type === 'folder') {
                    clearTimeout(this.submenuDelayTimer);
                    this.submenuDelayTimer = setTimeout(() => {
                        store.setActiveSubmenuSlot(index);
                    }, 120);
                } else {
                    clearTimeout(this.submenuDelayTimer);
                    store.setActiveSubmenuSlot(-1);
                }
            });

            pathEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (slot.item.type !== 'folder') {
                    ActionExecutor.execute(slot.item);
                    store.setRadialOpen(false);
                }
            });

            this.svg.appendChild(pathEl);

            // Centroid for Icon + Label
            const centerPt = getWedgeCenterPoint(cx, cy, (rInner + rOuter) / 2, index, totalSlots);
            
            // Text Label
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', centerPt.x);
            textEl.setAttribute('y', centerPt.y + 4);
            textEl.setAttribute('class', `radial-label ${isHovered ? 'hovered' : ''}`);
            textEl.setAttribute('text-anchor', 'middle');
            textEl.textContent = slot.item.label + (slot.item.type === 'folder' ? ' ▸' : '');
            
            this.svg.appendChild(textEl);
        });

        // 2. Render Submenu Ring if a folder is active
        if (activeSubmenuSlotIndex >= 0) {
            const activeSlot = profile.slots[activeSubmenuSlotIndex];
            if (activeSlot && activeSlot.item.type === 'folder' && activeSlot.item.children) {
                const subItems = activeSlot.item.children;
                const subSlotsCount = Math.max(subItems.length, RADIAL_CONSTANTS.MIN_SLOTS);
                const subWedgeAngle = 360 / subSlotsCount;

                subItems.forEach((subItem, sIdx) => {
                    const isSubHovered = hoveredSubSlotIndex === sIdx;
                    const sStartAngle = sIdx * subWedgeAngle - subWedgeAngle / 2;
                    const sEndAngle = sStartAngle + subWedgeAngle;

                    const sRInner = RADIAL_CONSTANTS.SUBMENU_INNER_RADIUS;
                    const sROuter = isSubHovered 
                        ? RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS + RADIAL_CONSTANTS.ACTIVE_GROWTH 
                        : RADIAL_CONSTANTS.SUBMENU_OUTER_RADIUS;

                    const subPathD = createAnnularSectorPath(cx, cy, sRInner, sROuter, sStartAngle, sEndAngle);
                    const subPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    subPathEl.setAttribute('d', subPathD);
                    subPathEl.setAttribute('class', `radial-submenu-wedge ${isSubHovered ? 'hovered' : ''}`);

                    subPathEl.addEventListener('mouseenter', () => {
                        store.setHoveredSubSlot(sIdx);
                    });

                    subPathEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        ActionExecutor.execute(subItem);
                        store.setRadialOpen(false);
                    });

                    this.svg.appendChild(subPathEl);

                    // Submenu Label
                    const subCenterPt = getWedgeCenterPoint(cx, cy, (sRInner + sROuter) / 2, sIdx, subSlotsCount);
                    const subTextEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    subTextEl.setAttribute('x', subCenterPt.x);
                    subTextEl.setAttribute('y', subCenterPt.y + 4);
                    subTextEl.setAttribute('class', `radial-sublabel ${isSubHovered ? 'hovered' : ''}`);
                    subTextEl.setAttribute('text-anchor', 'middle');
                    subTextEl.textContent = subItem.label;

                    this.svg.appendChild(subTextEl);
                });
            }
        }
    }
}
