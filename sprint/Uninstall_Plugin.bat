@echo off
setlocal EnableDelayedExpansion

echo =========================================================
echo Company After Effects Radial Suite - Uninstaller (Windows)
echo =========================================================
echo.

set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\com.company.ae.radialsuite.panel"

if exist "%TARGET_DIR%" (
    echo Removing extension from %TARGET_DIR%...
    rmdir /s /q "%TARGET_DIR%"
    echo Extension removed successfully.
) else (
    echo Extension was not found in %TARGET_DIR%.
)

echo.
echo Uninstallation complete. Please restart After Effects.
echo.
pause
