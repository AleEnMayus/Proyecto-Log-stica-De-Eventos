@echo off
echo Instalando Frontend...
cd frontend
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ No se pudo acceder al directorio frontend
    exit /b
)

call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del frontend
    exit /b
)

call npm install react-router-dom
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar react-router-dom
    exit /b
)
call npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

call npx eslint --init

echo Instalando Backend...
cd ..\backend
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ No se pudo acceder al directorio backend
    exit /b
)

call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del backend
    exit /b
)

call npm install express
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar express
    exit /b
)
call npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

call npx eslint --init

echo ¡Listo! Dependencias instaladas correctamente.
pause

