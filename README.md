Task Manager App

Technical Test – Task Manager

Aplicación de gestión de tareas desarrollada como prueba técnica, compuesta por un backend en Laravel y una aplicación móvil en React Native (Expo).

📁 Estructura del proyecto
/backend            → Laravel API (JWT Auth)
/mobile-app         → Expo React Native app
docker-compose.yml  → Entorno local con Docker

🧩 Tecnologías utilizadas
Backend

Laravel

PHP 8.3

MySQL 8

Sanctum Auth

Docker / Docker Compose

Mobile

Yarn

React Native

Expo

Axios

Expo Go (para pruebas en dispositivo físico)

⚙️ Requisitos

Para poder probar la aplicación localmente se requiere:

Docker

Docker Compose

Node.js (recomendado 18+ o 20+)

Expo Go (en dispositivo iOS o Android)

⚠️ El backend no está publicado en internet, por lo tanto Docker es obligatorio para levantar la API.

🖥️ Backend – Laravel

El backend está desarrollado en Laravel y se ejecuta completamente dentro de contenedores Docker.
Incluye conexión a MySQL, autenticación sanctum y un CRUD completo de tareas.

Servicios Docker

backend → Laravel API
Disponible en: http://localhost:8000

mysql → MySQL 8 (contenedor de base de datos)

🚀 Levantar el backend (Laravel + MySQL)

Desde la raíz del proyecto:

docker compose up -d --build

Preparar Laravel (solo la primera vez)
docker compose exec backend composer install
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate


Una vez completado, el backend estará disponible en:

http://localhost:8000

🐳 Dockerfile del Backend

Se estandarizó un único Dockerfile para el backend, siguiendo la estructura solicitada en la prueba técnica.

El Dockerfile realiza lo siguiente:

Usa PHP 8.3 CLI

Instala extensiones necesarias para Laravel y MySQL

Incluye Composer

Define el directorio de trabajo

Expone el puerto 8000

Inicia el servidor embebido de Laravel

Para compilar y ejecutar el backend siempre se debe usar el docker-compose.yml ubicado en la raíz del proyecto.

📱 Cómo probar la app móvil (modo evaluación)

La aplicación móvil se ejecuta con Expo y se abre usando Expo Go escaneando un QR.

1️⃣ Configurar la app móvil

Es necesario configurar la URL del backend en el archivo .env de la app móvil.

Obtener la IP local de la computadora

Mac

ipconfig getifaddr en0


Windows

ipconfig

Crear archivo .env en /mobile-app
EXPO_PUBLIC_API_URL=http://IP_LOCAL:8000


Ejemplo:

EXPO_PUBLIC_API_URL=http://192.168.1.25:8000


📌 Importante:

El teléfono debe estar en la misma red Wi-Fi que la computadora.

No usar localhost en teléfonos físicos.

2️⃣ Correr la app móvil (forma recomendada)

Desde la carpeta /mobile-app:

yarn add
yarn ios o android


Esto mostrará un QR en la terminal.

Abrir la app

Instalar Expo Go en el teléfono

Abrir Expo Go

Escanear el QR

La app se abrirá y se conectará automáticamente al backend

🐳 Alternativa: correr todo con Docker (opcional)

Si se desea levantar todo desde Docker, desde la raíz:

docker compose up -d --build
docker compose logs -f mobile-app


Cuando aparezca el mensaje:

Logs for your project will appear below


En otra terminal ejecutar:

docker exec -it manager_mobile sh


Dentro del contenedor:

npx expo start --tunnel --port 19000


Esto mostrará un QR, el cual puede escanearse con Expo Go para probar la aplicación en un dispositivo físico.

🧪 Funcionalidades implementadas

Registro e inicio de sesión

Autenticación JWT

CRUD de tareas

Estados de tarea:

Pendiente
En progreso
Completada

Manejo de errores y loading states

Arquitectura limpia (Container–Presenter en mobile)

Repository + Service Layer en backend

📝 Notas finales

El proyecto está diseñado para ser reproducible y evaluable localmente

Docker garantiza un entorno consistente para el backend

Expo Go simplifica la prueba de la aplicación móvil sin necesidad de builds nativos
