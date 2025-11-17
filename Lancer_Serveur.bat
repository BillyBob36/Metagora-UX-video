@echo off
echo ========================================
echo   Demarrage du serveur local Vite
echo ========================================
echo.

REM Se placer dans le répertoire du fichier
cd /d "%~dp0"

echo Repertoire actuel: %CD%
echo.

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo Installation des dependances...
    echo.
    call npm install
    echo.
)

echo Lancement du serveur de developpement...
echo.
echo Le serveur sera accessible sur: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.

REM Lancer le serveur Vite
call npm run dev

pause
