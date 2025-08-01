@echo off

echo Limpiando node_modules del Frontend...
IF EXIST frontend\node_modules (
    rmdir /S /Q frontend\node_modules
    echo ✔ node_modules del Frontend eliminados
)

echo Limpiando node_modules del Backend...
IF EXIST backend\node_modules (
    rmdir /S /Q backend\node_modules
    echo ✔ node_modules del Backend eliminados
)

echo Instalando Frontend...
cd frontend
IF %ERRORLEVEL% NEQ 0 (
    echo  No se pudo acceder al directorio frontend
    exit /b
)

call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo  Error al instalar dependencias del frontend
    exit /b
)

call npm install react-router-dom
IF %ERRORLEVEL% NEQ 0 (
    echo  Error al instalar react-router-dom
    exit /b
)

echo Instalando Backend...
cd ..\backend
IF %ERRORLEVEL% NEQ 0 (
    echo  No se pudo acceder al directorio backend
    exit /b
)

call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo  Error al instalar dependencias del backend
    exit /b
)

call npm install express
IF %ERRORLEVEL% NEQ 0 (
    echo  Error al instalar express
    exit /b
)

echo ¡Listo! Dependencias instaladas correctamente.
pause

