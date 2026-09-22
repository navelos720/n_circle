/**
 * radialMath.js — Fitts's Law Wedge & Geometry Calculations
 * Company After Effects Radial Suite
 *
 * Rules:
 * - Minimum 7 slots, standardized default 8 slots (ADR-003)
 * - Dead zone: r < deadZoneRadius (default 40px)
 * - Angle math: 0 degrees = Top (12 o'clock), clockwise progression
 * - SVG Sector Path generator
 */

export const RADIAL_CONSTANTS = {
    DEFAULT_SLOTS: 8,
    MIN_SLOTS: 7,
    MAX_SLOTS: 12,
    DEAD_ZONE_RADIUS: 40,
    INNER_RADIUS: 50,
    OUTER_RADIUS: 140,
    SUBMENU_INNER_RADIUS: 145,
    SUBMENU_OUTER_RADIUS: 215,
    ACTIVE_GROWTH: 6 // Wedge expansion on hover (Fitts's Law)
};

/**
 * Normalizes angle in degrees to [0, 360) where 0 is at 12 o'clock (top) and clockwise.
 */
export function calculateNormalizedAngle(dx, dy) {
    // Math.atan2(y, x) -> 0 is 3 o'clock, positive is clockwise in screen coords
    // To make 0 at 12 o'clock:
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI; // -180 to 180 (0 is East)
    
    // Rotate 90 degrees so 0 is North
    angleDeg = angleDeg + 90;
    if (angleDeg < 0) {
        angleDeg += 360;
    }
    return angleDeg; // 0 to 360
}

/**
 * Calculates distance from origin (cx, cy)
 */
export function calculateDistance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Determines active slot index based on mouse position relative to center.
 * Returns -1 if outside the annular band [minRadius, maxRadius].
 * @param {number} x - Mouse clientX
 * @param {number} y - Mouse clientY
 * @param {number} cx - Wheel centerX
 * @param {number} cy - Wheel centerY
 * @param {number} slotCount - Total slots (>= 7)
 * @param {number} minRadius - Inner radius boundary in screen px
 * @param {number} maxRadius - Outer radius boundary in screen px
 * @returns {number} slot index (0-based) or -1
 */
export function getSlotIndexFromPoint(x, y, cx, cy, slotCount = 8, minRadius = 40, maxRadius = 150) {
    const dx = x - cx;
    const dy = y - cy;
    const dist = calculateDistance(dx, dy);

    if (dist < minRadius || dist > maxRadius) {
        return -1;
    }

    const angle = calculateNormalizedAngle(dx, dy);
    const wedgeAngle = 360 / slotCount;

    // Slot 0 centered at 0° (12 o'clock), spanning [-wedgeAngle/2, +wedgeAngle/2]
    const halfWedge = wedgeAngle / 2;
    const adjustedAngle = (angle + halfWedge) % 360;
    const index = Math.floor(adjustedAngle / wedgeAngle);

    return index >= 0 && index < slotCount ? index : -1;
}

/**
 * Generates an SVG path definition for an annular sector (pie wedge).
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} rInner - Inner radius
 * @param {number} rOuter - Outer radius
 * @param {number} startAngleDeg - Start angle in degrees (0 = 12 o'clock)
 * @param {number} endAngleDeg - End angle in degrees
 * @param {number} cornerRadius - Optional rounding (default 0)
 * @returns {string} SVG Path 'd' attribute
 */
export function createAnnularSectorPath(cx, cy, rInner, rOuter, startAngleDeg, endAngleDeg) {
    // Convert 12 o'clock degrees to standard radian (0 = East)
    const toRad = deg => ((deg - 90) * Math.PI) / 180;

    const startRad = toRad(startAngleDeg);
    const endRad = toRad(endAngleDeg);

    const x1Outer = cx + rOuter * Math.cos(startRad);
    const y1Outer = cy + rOuter * Math.sin(startRad);
    const x2Outer = cx + rOuter * Math.cos(endRad);
    const y2Outer = cy + rOuter * Math.sin(endRad);

    const x1Inner = cx + rInner * Math.cos(endRad);
    const y1Inner = cy + rInner * Math.sin(endRad);
    const x2Inner = cx + rInner * Math.cos(startRad);
    const y2Inner = cy + rInner * Math.sin(startRad);

    const angleDiff = (endAngleDeg - startAngleDeg + 360) % 360;
    const largeArcFlag = angleDiff > 180 ? 1 : 0;

    return [
        `M ${x1Outer} ${y1Outer}`,
        `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
        `L ${x1Inner} ${y1Inner}`,
        `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
        'Z'
    ].join(' ');
}

/**
 * Calculates icon and text label centroid for a wedge
 */
export function getWedgeCenterPoint(cx, cy, radius, slotIndex, totalSlots) {
    const wedgeAngle = 360 / totalSlots;
    const slotCenterAngle = slotIndex * wedgeAngle;
    const rad = ((slotCenterAngle - 90) * Math.PI) / 180;

    return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
        angle: slotCenterAngle
    };
}
