#!/bin/bash
echo "🔧 Instalando Frontend..."
cd frontend
npm install
npm install react-router-dom

echo "🔧 Instalando Backend..."
cd ../backend
npm init -y
npm install
npm i express

echo "✅ Listo: dependencias instaladas en frontend y backend"
