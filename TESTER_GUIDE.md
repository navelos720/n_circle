# Company After Effects Radial Suite — Tester Guide & Installation Tutorial

Welcome to the tester guide for the **Company After Effects Radial Suite** CEP panel plugin. Follow this quick tutorial to install, activate, and test the extension inside Adobe After Effects (or in a standalone web browser).

---

## 📋 System Requirements
- **OS**: Windows 10 or Windows 11 (64-bit)
- **Host Application**: Adobe After Effects CC 2020 through CC 2026+ (v17.0 – v99.9)
- **Permissions**: Standard user permissions (Administrator is NOT required for per-user installation)

---

## 🚀 1-Click Automated Installation (Recommended)

1. **Close Adobe After Effects** if it is currently running.
2. Navigate to the `sprint/` folder.
3. Double-click **`Install_Plugin.bat`**.
4. The batch script will automatically:
   - Enable Adobe CEP `PlayerDebugMode` in the Windows Registry (allowing development/unsigned extensions to load).
   - Copy the extension files directly into your user CEP directory:  
     `%APPDATA%\Adobe\CEP\extensions\com.company.ae.radialsuite.panel\`
5. Press any key when prompted to complete installation.

---

## 🛠️ Manual Installation (Alternative)

If batch files cannot be executed on your workstation:

1. **Enable CEP Debug Mode in Registry**:
   - Press `Win + R`, type `regedit`, and press Enter.
   - Navigate to `HKEY_CURRENT_USER\Software\Adobe\`.
   - For keys `CSXS.10`, `CSXS.11`, `CSXS.12`, `CSXS.13`, `CSXS.14`, `CSXS.15`, `CSXS.16` (create any that do not exist):
     - Add a **String Value (REG_SZ)** named `PlayerDebugMode` and set its value to `1`.
2. **Copy Extension Files**:
   - Open File Explorer and enter `%APPDATA%\Adobe\CEP\extensions\` in the address bar (create the `extensions` folder if missing).
   - Copy the folder `sprint/ae-radial-plugin` into this directory and rename the copied folder to:  
     `com.company.ae.radialsuite.panel`

---

## 🎬 Activating the Panel in After Effects

1. **Launch Adobe After Effects**.
2. In the top menu bar, click **Window** $\to$ **Extensions** $\to$ **Company Radial Suite**.
3. The dockable **Suite Panel** will open. You can dock this panel anywhere in your After Effects workspace (e.g. next to the Project or Effects Control panel).

---

## 🕹️ How to Use & Test the Features

### 1. Summoning the Radial Wheel Menu
- **Option A (Hotkey)**: Press **`Alt + Space`** on your keyboard.
- **Option B (Button)**: Click the **⚡ Summon Radial Wheel** button at the top of the Suite Panel.
- The 8-slot Radial Wheel will appear centered on your screen or cursor.

### 2. Radial Wheel Navigation & Execution
- **Mouse Hover & Selection**: Move your cursor over any wedge to highlight it. The wedge dynamically expands (Fitts's Law targeting).
- **Direct Command Execution**: Click or release on an action wedge (e.g. *Easy Ease*, *Pre-compose*, *New Null*, *Adjustment Layer*) to execute the native After Effects command. A green confirmation toast will appear.
- **Submenu Fan-Out (Folders)**: Move your mouse over the **Effects** wedge (Slot 1). An outer ring of 8 child effects (*Glow, Fast Blur, Curves, Drop Shadow, Gradient Ramp, Transform FX, Hue/Sat, Levels*) will fan out.
- **Center Hub Navigation**:
  - At root level, the center hub displays **`CLOSE`** (clicking it closes the wheel).
  - Inside a submenu, the center hub transitions to **`BACK`** (clicking it collapses the submenu and returns to the root wheel).
- **Dismissing the Wheel**: Click outside the wheel or press `Escape`.

### 3. Safe Error Handling Verification
- Try applying an effect from the outer submenu ring (*Glow* or *Curves*) **without any layer selected** in your active composition.
- **Expected Result**: A non-blocking notification toast will appear stating:  
  `"Select a layer to use this action."`  
  The plugin will handle the context safely without crashing or throwing unhandled exceptions.

### 4. Suite Panel Search & Category Browsing
- Use the **Search Bar** in the Suite Panel to search across 42+ commands, effects, and `.aep` templates in real time.
- Click category tabs (**All**, **Shortcuts**, **Menu Items**, **Effects**, **AEP Files**) to filter library items.
- Click any card directly in the panel to execute that command or apply that effect.

### 5. Wheel Settings Modal
- Click the **⚙️ (Gear Icon)** in the Suite Panel header to open the **Wheel Settings Editor**.
- Switch between **Wheel Layout**, **AEP Files**, and **General Preferences** tabs to view configuration options.
- Click the **X** or outside the dialog to dismiss the modal.

---

## 🌐 Standalone Browser Testing (No After Effects Required)

You can also test the entire UI and simulated execution flow in Google Chrome or Microsoft Edge without opening After Effects:

1. Navigate to `sprint/ae-radial-plugin/`.
2. Double-click **`index.html`** or launch a local static web server (e.g. `npx serve sprint/ae-radial-plugin`).
3. The panel will automatically activate its built-in browser simulation mock for `CSInterface`, allowing you to test all gestures, submenus, search filters, and toasts.

---

## 🧹 How to Uninstall

1. Close Adobe After Effects.
2. Run **`sprint/Uninstall_Plugin.bat`**.
3. The script will safely remove `%APPDATA%\Adobe\CEP\extensions\com.company.ae.radialsuite.panel\` while preserving any custom user configurations.
