/**
 * Validation helpers for wheel_config.json and library.json
 */

export function validateWheelConfig(config) {
    if (!config || typeof config !== 'object') {
        return { valid: false, error: 'Config must be an object' };
    }
    if (typeof config.activeProfile !== 'string') {
        return { valid: false, error: 'Missing or invalid activeProfile' };
    }
    if (!Array.isArray(config.profiles) || config.profiles.length === 0) {
        return { valid: false, error: 'Config must have at least one profile in profiles array' };
    }

    for (let p = 0; p < config.profiles.length; p++) {
        const profile = config.profiles[p];
        if (!profile.name || typeof profile.name !== 'string') {
            return { valid: false, error: `Profile at index ${p} missing name` };
        }
        if (!Array.isArray(profile.slots)) {
            return { valid: false, error: `Profile "${profile.name}" slots must be an array` };
        }
        if (profile.slots.length < 7) {
            return { valid: false, error: `Profile "${profile.name}" has ${profile.slots.length} slots; minimum is 7 slots.` };
        }

        for (let s = 0; s < profile.slots.length; s++) {
            const slot = profile.slots[s];
            if (typeof slot.position !== 'number') {
                return { valid: false, error: `Slot ${s} in profile "${profile.name}" missing valid position number` };
            }
            const validTypes = ['ae_command', 'menu_item', 'effect', 'aep_file', 'aep_template', 'folder'];
            if (!validTypes.includes(slot.type)) {
                return { valid: false, error: `Slot ${s} has invalid type: ${slot.type}` };
            }
            if (slot.type === 'folder' && (!Array.isArray(slot.children))) {
                return { valid: false, error: `Folder slot at position ${slot.position} missing children array` };
            }
        }
    }

    return { valid: true };
}

export function validateLibraryData(library) {
    if (!library || typeof library !== 'object') {
        return { valid: false, error: 'Library must be an object' };
    }
    if (!library.libraryVersion) {
        return { valid: false, error: 'Missing libraryVersion' };
    }
    if (!Array.isArray(library.categories)) {
        return { valid: false, error: 'Missing categories array' };
    }
    return { valid: true };
}
