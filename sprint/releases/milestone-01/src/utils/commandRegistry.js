/**
 * COMMAND_REGISTRY.md & SHORTCUTS.md & EFFECTS.md
 * Master Command Registry for After Effects Actions
 */

export const COMMAND_REGISTRY = {
    // 1. SHORTCUTS (type: "ae_command")
    shortcuts: [
        {
            id: "cmd_easy_ease",
            type: "ae_command",
            commandId: 1056,
            label: "Easy Ease",
            icon: "easy_ease",
            category: "Keyframes",
            description: "Apply standard Easy Ease interpolation (F9)",
            requiresSelection: true
        },
        {
            id: "cmd_easy_ease_in",
            type: "ae_command",
            commandId: 1057,
            label: "Easy Ease In",
            icon: "easy_ease_in",
            category: "Keyframes",
            description: "Apply Easy Ease In to keyframes (Shift+F9)",
            requiresSelection: true
        },
        {
            id: "cmd_easy_ease_out",
            type: "ae_command",
            commandId: 1058,
            label: "Easy Ease Out",
            icon: "easy_ease_out",
            category: "Keyframes",
            description: "Apply Easy Ease Out to keyframes (Ctrl+Shift+F9)",
            requiresSelection: true
        },
        {
            id: "cmd_toggle_hold",
            type: "ae_command",
            commandId: 4176,
            label: "Toggle Hold Keyframe",
            icon: "hold_keyframe",
            category: "Keyframes",
            description: "Toggle hold keyframe on selected keyframes (Ctrl+Alt+H)",
            requiresSelection: true
        },
        {
            id: "cmd_new_null",
            type: "ae_command",
            commandId: 2797,
            label: "New Null Object",
            icon: "null_layer",
            category: "Layer Creation",
            description: "Create a new Null Object layer (Ctrl+Alt+Shift+Y)",
            requiresSelection: false
        },
        {
            id: "cmd_new_adjustment",
            type: "ae_command",
            commandId: 2798,
            label: "New Adjustment Layer",
            icon: "adjustment_layer",
            category: "Layer Creation",
            description: "Create a new Adjustment Layer (Ctrl+Alt+Y)",
            requiresSelection: false
        },
        {
            id: "cmd_new_solid",
            type: "ae_command",
            commandId: 2796,
            label: "New Solid Layer",
            icon: "solid_layer",
            category: "Layer Creation",
            description: "Create a new Solid Layer (Ctrl+Y)",
            requiresSelection: false
        },
        {
            id: "cmd_new_shape",
            type: "ae_command",
            commandId: 3736,
            label: "New Shape Layer",
            icon: "shape_layer",
            category: "Layer Creation",
            description: "Create a new empty Shape Layer",
            requiresSelection: false
        },
        {
            id: "cmd_new_text",
            type: "ae_command",
            commandId: 2562,
            label: "New Text Layer",
            icon: "text_layer",
            category: "Layer Creation",
            description: "Create a new Text layer (Ctrl+Alt+Shift+T)",
            requiresSelection: false
        },
        {
            id: "cmd_new_camera",
            type: "ae_command",
            commandId: 2563,
            label: "New Camera",
            icon: "camera_layer",
            category: "Layer Creation",
            description: "Create a new Camera layer (Ctrl+Alt+Shift+C)",
            requiresSelection: false
        },
        {
            id: "cmd_precompose",
            type: "ae_command",
            commandId: 2073,
            label: "Pre-compose",
            icon: "precompose",
            category: "Layer Manipulation",
            description: "Pre-compose selected layers (Ctrl+Shift+C)",
            requiresSelection: true
        },
        {
            id: "cmd_split_layer",
            type: "ae_command",
            commandId: 2150,
            label: "Split Layer",
            icon: "split_layer",
            category: "Layer Manipulation",
            description: "Split selected layer at playhead (Ctrl+Shift+D)",
            requiresSelection: true
        },
        {
            id: "cmd_duplicate",
            type: "ae_command",
            commandId: 2080,
            label: "Duplicate",
            icon: "duplicate",
            category: "Layer Manipulation",
            description: "Duplicate selected layer (Ctrl+D)",
            requiresSelection: true
        },
        {
            id: "cmd_time_remap",
            type: "ae_command",
            commandId: 2153,
            label: "Enable Time Remapping",
            icon: "time_remap",
            category: "Layer Manipulation",
            description: "Enable time remapping on selected layer (Ctrl+Alt+T)",
            requiresSelection: true
        },
        {
            id: "cmd_freeze_frame",
            type: "ae_command",
            commandId: 2397,
            label: "Freeze Frame",
            icon: "freeze_frame",
            category: "Layer Manipulation",
            description: "Freeze frame at current time indicator",
            requiresSelection: true
        },
        {
            id: "cmd_center_anchor_layer",
            type: "ae_command",
            commandId: 2357,
            label: "Center Anchor in Layer",
            icon: "center_anchor",
            category: "Transform & Anchor",
            description: "Center anchor point in layer content (Ctrl+Alt+Home)",
            requiresSelection: true
        },
        {
            id: "cmd_center_anchor_comp",
            type: "ae_command",
            commandId: 2358,
            label: "Center Layer in Comp",
            icon: "center_comp",
            category: "Transform & Anchor",
            description: "Center selected layer in composition view (Ctrl+Home)",
            requiresSelection: true
        },
        {
            id: "cmd_fit_to_comp",
            type: "ae_command",
            commandId: 2157,
            label: "Fit to Comp",
            icon: "fit_comp",
            category: "Transform & Anchor",
            description: "Fit selected layer to composition size (Ctrl+Alt+F)",
            requiresSelection: true
        },
        {
            id: "cmd_fit_to_comp_width",
            type: "ae_command",
            commandId: 2155,
            label: "Fit to Comp Width",
            icon: "fit_width",
            category: "Transform & Anchor",
            description: "Fit layer width to comp width (Ctrl+Alt+Shift+H)",
            requiresSelection: true
        },
        {
            id: "cmd_flip_horizontal",
            type: "ae_command",
            commandId: 2158,
            label: "Flip Horizontal",
            icon: "flip_h",
            category: "Transform & Anchor",
            description: "Flip selected layer horizontally",
            requiresSelection: true
        },
        {
            id: "cmd_new_comp",
            type: "ae_command",
            commandId: 2003,
            label: "New Composition",
            icon: "new_comp",
            category: "Project",
            description: "Create a new composition (Ctrl+N)",
            requiresSelection: false
        },
        {
            id: "cmd_import_file",
            type: "ae_command",
            commandId: 2139,
            label: "Import File",
            icon: "import_file",
            category: "Project",
            description: "Open import file dialog (Ctrl+I)",
            requiresSelection: false
        },
        {
            id: "cmd_save_project",
            type: "ae_command",
            commandId: 12,
            label: "Save Project",
            icon: "save",
            category: "Project",
            description: "Save active After Effects project (Ctrl+S)",
            requiresSelection: false
        },
        {
            id: "cmd_increment_save",
            type: "ae_command",
            commandId: 13,
            label: "Increment and Save",
            icon: "save_increment",
            category: "Project",
            description: "Increment and save project version (Ctrl+Alt+Shift+S)",
            requiresSelection: false
        }
    ],

    // 2. EFFECTS (type: "effect")
    effects: [
        {
            id: "fx_fast_box_blur",
            type: "effect",
            effectName: "ADBE Fast Blur",
            label: "Fast Box Blur",
            icon: "fx_blur",
            category: "Blur & Sharpen",
            description: "Standard fast gaussian blur filter"
        },
        {
            id: "fx_gaussian_blur",
            type: "effect",
            effectName: "ADBE Gaussian Blur 2",
            label: "Gaussian Blur",
            icon: "fx_blur",
            category: "Blur & Sharpen",
            description: "High quality smooth gaussian blur"
        },
        {
            id: "fx_glow",
            type: "effect",
            effectName: "ADBE Glo2",
            label: "Glow",
            icon: "fx_glow",
            category: "Stylize",
            description: "Luma-based glow highlighting"
        },
        {
            id: "fx_fill",
            type: "effect",
            effectName: "ADBE Color Control",
            label: "Fill",
            icon: "fx_fill",
            category: "Generate",
            description: "Solid color layer fill filter"
        },
        {
            id: "fx_curves",
            type: "effect",
            effectName: "ADBE CurvesCustom",
            label: "Curves",
            icon: "fx_curves",
            category: "Color Correction",
            description: "RGB and tonal adjustment curves"
        },
        {
            id: "fx_hue_saturation",
            type: "effect",
            effectName: "ADBE HUE SATURATION",
            label: "Hue/Saturation",
            icon: "fx_color",
            category: "Color Correction",
            description: "Tonal color shift and saturation control"
        },
        {
            id: "fx_levels",
            type: "effect",
            effectName: "ADBE Pro Levels2",
            label: "Levels",
            icon: "fx_levels",
            category: "Color Correction",
            description: "Histogram input/output levels adjustment"
        },
        {
            id: "fx_drop_shadow",
            type: "effect",
            effectName: "ADBE Drop Shadow",
            label: "Drop Shadow",
            icon: "fx_shadow",
            category: "Perspective",
            description: "Soft perspective drop shadow"
        },
        {
            id: "fx_gradient_ramp",
            type: "effect",
            effectName: "ADBE Ramp",
            label: "Gradient Ramp",
            icon: "fx_gradient",
            category: "Generate",
            description: "Linear or radial 2-color gradient generator"
        },
        {
            id: "fx_transform",
            type: "effect",
            effectName: "ADBE Geometry2",
            label: "Transform",
            icon: "fx_transform",
            category: "Distort",
            description: "Individual effect-level transform & motion blur"
        }
    ],

    // 3. MENU ITEMS (type: "menu_item")
    menuItems: [
        {
            id: "menu_purge_all",
            type: "menu_item",
            commandId: 10200,
            label: "Purge All Memory & Disk Cache",
            icon: "menu_purge",
            category: "Edit",
            description: "Edit > Purge > All Memory & Disk Cache"
        },
        {
            id: "menu_comp_settings",
            type: "menu_item",
            commandId: 2007,
            label: "Composition Settings",
            icon: "menu_comp",
            category: "Composition",
            description: "Composition > Composition Settings (Ctrl+K)"
        },
        {
            id: "menu_add_to_render_queue",
            type: "menu_item",
            commandId: 2161,
            label: "Add to Render Queue",
            icon: "menu_render",
            category: "Composition",
            description: "Composition > Add to Render Queue (Ctrl+M)"
        }
    ]
};

export function getAllRegistryItems() {
    return [
        ...COMMAND_REGISTRY.shortcuts,
        ...COMMAND_REGISTRY.effects,
        ...COMMAND_REGISTRY.menuItems
    ];
}

export function findRegistryItem(idOrCommand) {
    const all = getAllRegistryItems();
    return all.find(item => item.id === idOrCommand || item.commandId === idOrCommand || item.effectName === idOrCommand);
}
