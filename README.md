Task Manager App

Technical Test – Task Manager

Aplicación de gestión de tareas desarrollada como prueba técnica.
Incluye un backend en Laravel y una aplicación móvil en React Native (Expo).

📁 Estructura del proyecto
/backend            → Laravel API (Sanctum Auth)
/mobile-app         → Expo React Native app
docker-compose.yml  → Entorno local con Docker

🧩 Tecnologías
Backend

Laravel

PHP 8.3

MySQL 8

Laravel Sanctum

Docker / Docker Compose

Mobile

React Native

Expo

Yarn

Axios

Expo Go

⚙️ Requisitos

Docker

Docker Compose

Node.js (18+ recomendado)

Expo Go (iOS o Android)

⚠️ El backend no está publicado en internet, por lo que Docker es obligatorio para levantar la API.

🚀 Levantar el backend (Laravel + MySQL)
1️⃣ Crear archivo de entorno

Dentro del folder /backend, crear el archivo .env (puede copiarse desde .env.example).

2️⃣ Levantar MySQL

Desde la raíz del proyecto:

docker compose up -d mysql

3️⃣ Instalar dependencias de Laravel
docker compose run --rm backend sh -lc \
"composer config -g process-timeout 2000 && composer install --no-interaction --prefer-dist"

4️⃣ Crear carpetas necesarias y permisos
docker compose run --rm backend sh -lc \
"mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs && chmod -R 775 bootstrap/cache storage"

5️⃣ Generar APP_KEY
docker compose run --rm backend php artisan key:generate

6️⃣ Ejecutar migraciones
docker compose run --rm backend php artisan migrate

7️⃣ Levantar backend
docker compose up -d backend


El backend quedará disponible en:

http://localhost:8000

📱 Probar la aplicación móvil (Expo)

La app móvil se ejecuta con Expo y se abre usando Expo Go mediante un QR.

1️⃣ Configurar URL del backend

Obtener la IP local de la computadora:

Mac

ipconfig getifaddr en0


Windows

ipconfig


Crear el archivo /mobile-app/.env con una sola línea:

EXPO_PUBLIC_API_URL=http://IP_LOCAL:8000


Ejemplo:

EXPO_PUBLIC_API_URL=http://192.168.1.25:8000


📌 Importante:

El teléfono debe estar en la misma red Wi-Fi.

No usar localhost en dispositivos físicos.

2️⃣ Levantar la app móvil

Desde /mobile-app:

cd mobile-app
yarn install
npx expo start


Esto mostrará un QR en la terminal.

3️⃣ Abrir la app

Instalar Expo Go en el teléfono

Abrir Expo Go

Escanear el QR

La app se abrirá y se conectará automáticamente al backend

🧪 Funcionalidades implementadas

Registro e inicio de sesión

Autenticación con Laravel Sanctum

CRUD de tareas

Estados de tarea:

Pendiente

En progreso

Completada

Manejo de errores y loading states

Arquitectura Container–Presenter (mobile)

Repository + Service Layer (backend)

📝 Notas finales
El proyecto está diseñado para ser reproducible y evaluable localmente
Docker garantiza un entorno consistente para el backend
Expo Go permite probar la app móvil sin builds nativos
