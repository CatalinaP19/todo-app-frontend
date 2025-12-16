# Todo App Frontend

## Descripción
Aplicación frontend de una lista de tareas (Todo App) creada con React y Vite. Permite registrarse, iniciar sesión y gestionar tareas (crear, editar, eliminar, listar).

## Stack tecnológico
- Frontend: React + Vite
- Estilos: Tailwind CSS
- Peticiones HTTP: Axios
- Routing: React Router

## Requisitos previos
- Node.js 18+ y `npm`

## Ejecutar el frontend en local
1. Clona el repositorio y entra en la carpeta:

```
git clone <repo-frontend-url>
cd todo-app-frontend
```

2. Instala dependencias:

```
npm install
```

3. Configura variables de entorno (ver `.env.example`).

4. Ejecuta en modo desarrollo:

```
npm run dev
```

El proyecto correrá en `http://localhost:5173` por defecto (Vite).

## Ejecutar el backend en local
Este repositorio solo contiene el frontend. El backend debe ejecutarse desde su propio repositorio. Guía genérica:

1. Clona el repositorio del backend (ejemplo):

```
git clone <repo-backend-url>
cd repo-backend
```

2. Instala dependencias:

```
npm install
```

3. Crea un archivo `.env` basado en `.env.example` y completa las variables (DATABASE_URL, JWT_SECRET, etc.).

4. Ejecuta el servidor:

```
npm run dev
```

Nota: Asegúrate de que la variable `VITE_API_URL` del frontend apunte al backend.

## Variables de entorno
Consulta el archivo `.env.example` incluido en la raíz del proyecto para un ejemplo de configuración.

## Documentos adicionales
- `ARCHITECTURA.md` — Diagrama y descripción de arquitectura.
- `API.md` — Documentación de los endpoints que consume el frontend.

## Licencia
Proyecto licenciado a nombre de Catalina Perez Losada. Ver `LICENSE`.