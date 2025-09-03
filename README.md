

# Cine SD - Backend

API REST para la gestión de un cine, desarrollada con [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/) y MySQL. Permite la administración de usuarios, películas, salas, asientos, funciones y tickets, integrando autenticación, mailing y cache con Redis.

Repositorio: [https://github.com/CarlitoUwU/back_sd_cine](https://github.com/CarlitoUwU/back_sd_cine)

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso con Docker](#uso-con-docker)
- [Scripts disponibles](#scripts-disponibles)
- [Base de datos](#base-de-datos)
- [Módulos principales](#módulos-principales)
- [API y Documentación Swagger](#api-y-documentación-swagger)
- [Testing](#testing)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---


## Características

- Gestión de usuarios y autenticación.
- Administración de películas, salas, asientos, funciones y tickets.
- Envío de correos (ej: recuperación de contraseña).
- Cache con Redis.
- Documentación interactiva con Swagger.
- Arquitectura modular y escalable.
- Scripts para desarrollo, testing y despliegue.
- Soporte para Docker (MySQL y Redis).
- **Prevención de venta de tickets duplicados**: Implementación de rollback tanto en Prisma como en SQL (mediante un procedure) para evitar la venta simultánea de un mismo asiento en una función.

## Arquitectura

- **NestJS**: Framework principal.
- **Prisma ORM**: Acceso a base de datos MySQL.
- **MySQL**: Base de datos relacional.
- **Redis**: Cache y almacenamiento temporal.
- **Swagger**: Documentación de la API.
- **Mailer**: Envío de emails (ejemplo: recuperación de contraseña).

## Instalación

1. Clona el repositorio:
  ```bash
  git clone https://github.com/CarlitoUwU/back_sd_cine
  cd back_sd_cine
  ```

2. Instala dependencias:
  ```bash
  npm install
  ```

3. Copia y configura las variables de entorno:
  ```bash
  cp .env.example .env
  # Edita .env según tu entorno
  ```

4. Genera el cliente de Prisma y ejecuta migraciones:
  ```bash
  npx prisma generate
  npx prisma migrate deploy
  ```

## Configuración

- Variables de entorno principales:
  - `DATABASE_URL`: URL de conexión a MySQL.
  - `REDIS_URL`: URL de conexión a Redis.
  - `MAIL_USER`, `MAIL_PASS`: Credenciales SMTP para envío de correos.
  - `PORT`: Puerto de la API (por defecto 3000).

## Uso con Docker

El proyecto incluye un `docker-compose.yml` para levantar MySQL y Redis fácilmente:

```bash
docker-compose up -d
```

- MySQL: puerto 3310 (usuario: `mysql_user`, password: `password_123`)
- Redis: puerto 6379

El archivo `cine_sd.sql` inicializa la base de datos.

## Scripts disponibles

- `npm run start` - Inicia la API en modo producción.
- `npm run start:dev` - Inicia en modo desarrollo con hot-reload.
- `npm run test` - Ejecuta tests unitarios.
- `npm run test:e2e` - Ejecuta tests end-to-end.
- `npm run test:cov` - Cobertura de tests.
- `npm run lint` - Linter.
- `npm run format` - Formatea el código.

## Base de datos

El modelo de datos está definido en `prisma/schema.prisma` e incluye:

- **users**: Usuarios del sistema.
- **movies**: Películas.
- **rooms**: Salas de cine.
- **seats**: Asientos por sala.
- **showtimes**: Funciones de películas.
- **tickets**: Tickets de usuario para funciones y asientos.

## Módulos principales

- **Users**: Registro, login, recuperación de contraseña, gestión de usuarios.
- **Movies**: CRUD de películas.
- **Rooms**: CRUD de salas.
- **Seats**: CRUD y gestión de asientos (ocupados/libres).
- **Showtimes**: CRUD de funciones.
- **Tickets**: Compra y gestión de tickets.
- **Mails**: Envío de correos (ejemplo: recuperación de contraseña).
- **Common/Redis**: Cache y almacenamiento temporal.

## API y Documentación Swagger

- La API expone endpoints RESTful para todos los recursos.
- Accede a la documentación interactiva en:  
  ```
  http://localhost:3000/swagger
  ```


## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu feature/fix.
3. Haz tus cambios y asegúrate de pasar los tests y linter.
4. Haz un pull request.


