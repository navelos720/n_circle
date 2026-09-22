@echo off
setlocal EnableDelayedExpansion

echo =======================================================
echo Company After Effects Radial Suite - Installer (Windows)
echo =======================================================
echo.

:: 1. Enable CEP Debug Mode in Windows Registry for unsigned extension loading
echo Enabling CEP PlayerDebugMode...
REG ADD "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.14" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.15" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
REG ADD "HKCU\Software\Adobe\CSXS.16" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1

:: 2. Target CEP Extension Directory
set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\com.company.ae.radialsuite.panel"
set "SOURCE_DIR=%~dp0ae-radial-plugin"

echo Target Directory: %TARGET_DIR%
echo Source Directory: %SOURCE_DIR%

if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions"
)

:: 3. Copy extension files
echo Copying extension files...
if exist "%TARGET_DIR%" (
    echo Removing previous installation...
    rmdir /s /q "%TARGET_DIR%"
)

xcopy "%SOURCE_DIR%" "%TARGET_DIR%\" /E /I /H /Y >nul

if %ERRORLEVEL% equ 0 (
    echo.
    echo =======================================================
    echo Installation Successful!
    echo.
    echo Please restart Adobe After Effects.
    echo Open the panel via: Window ^> Extensions ^> Company Radial Suite
    echo =======================================================
) else (
    echo.
    echo Installation encountered an error. Code: %ERRORLEVEL%
)

echo.
pause
