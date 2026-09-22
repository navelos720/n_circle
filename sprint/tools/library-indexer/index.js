/**
 * index.js — Dev-time Library Indexer Tool
 * Scans a designated template directory for .aep files and generates/updates library.json
 * 
 * Usage: node index.js <path-to-templates-dir> [output-library.json]
 */

const fs = require('fs');
const path = require('path');

function generateUUID() {
    return 'lib_aep_' + Math.random().toString(36).substring(2, 9);
}

function scanAepFiles(dir, baseDir) {
    let results = [];
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return results;
    }

    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            results = results.concat(scanAepFiles(fullPath, baseDir));
        } else if (file.toLowerCase().endsWith('.aep')) {
            const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            const nameWithoutExt = path.basename(file, path.extname(file));
            
            // Format label nicely: "01_Logo_Reveal" -> "Logo Reveal"
            const cleanLabel = nameWithoutExt.replace(/^[\d_-]+/, '').replace(/_/g, ' ');

            results.push({
                id: generateUUID(),
                type: 'aep_file',
                label: cleanLabel || nameWithoutExt,
                category: 'templates',
                description: `Auto-indexed AEP project: ${file}`,
                path: relPath,
                tags: ['aep', 'template', ...cleanLabel.toLowerCase().split(' ')].filter(Boolean)
            });
        }
    }
    return results;
}

function run() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("Usage: node index.js <path-to-templates-dir> [output-library.json]");
        process.exit(1);
    }

    const targetDir = path.resolve(args[0]);
    const outputPath = args[1] ? path.resolve(args[1]) : path.join(__dirname, 'library.json');

    console.log(`Scanning for .aep files in: ${targetDir}`);
    const aepItems = scanAepFiles(targetDir, targetDir);
    console.log(`Found ${aepItems.length} .aep file(s).`);

    let existingLib = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        categories: [
            { id: "shortcuts", label: "Shortcuts", icon: "keyboard" },
            { id: "menu_items", label: "Menu Items", icon: "menu" },
            { id: "effects", label: "Effects", icon: "sparkles" },
            { id: "templates", label: "AEP Templates", icon: "folder" }
        ],
        items: []
    };

    if (fs.existsSync(outputPath)) {
        try {
            existingLib = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        } catch (e) {
            console.warn(`Could not parse existing library. Creating fresh one.`);
        }
    }

    // Merge without duplicating existing relative paths
    const existingPaths = new Set(existingLib.items.filter(i => i.type === 'aep_file').map(i => i.path));
    let addedCount = 0;

    for (const newItem of aepItems) {
        if (!existingPaths.has(newItem.path)) {
            existingLib.items.push(newItem);
            addedCount++;
        }
    }

    existingLib.lastUpdated = new Date().toISOString();
    fs.writeFileSync(outputPath, JSON.stringify(existingLib, null, 2), 'utf8');

    console.log(`Successfully indexed library! Added ${addedCount} new templates. Total items: ${existingLib.items.length}`);
    console.log(`Saved to: ${outputPath}`);
}

run();
