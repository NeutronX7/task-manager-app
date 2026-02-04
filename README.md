# Task Manager App

Technical test – Task Manager

## Estructura
- `/backend` → Laravel API (JWT Auth)
- `/mobile-app` → Expo React Native app
- `docker-compose.yml` → Local development environment

## Requisitos
- Docker
- Docker Compose
- Expo CLI (para el móvil)

## Backend – Laravel API

El backend está desarrollado en Laravel y se ejecuta dentro de contenedores Docker.
Incluye conexión a MySQL y está preparado para autenticación JWT y un CRUD de tareas.

### Servicios utilizados

- backend → Laravel API (`http://localhost:8000`)
- mysql → Base de datos MySQL 8

---

## Levantar el backend

Desde la raíz del proyecto:

```bash
docker compose up -d --build

Se deben instalar dependencias y preparar laravel:
docker compose exec backend composer install
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate

Cuando ya se levante todo y no hayan problemas, se encontrará disponible en: http://localhost:8000

Se estandarizó solo un Dockerfile para Backend como se tenía que seguir en la estructura de la prueba,

Lo que hace el Dockerfile:

- Usa PHP 8.3 CLI
- Instala extensiones necesarias para Laravel y MySQL
- Incluye Composer
- Define el directorio de trabajo del proyecto
- Expone el puerto 8000
- Inicia el servidor embebido de Laravel

Pero cuando ya se quiera compilar el código fuente, se debe hacer dentro del proyecto raíz, donde se encuentra el docker-compose.yml
