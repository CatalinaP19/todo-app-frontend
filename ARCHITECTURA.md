# Arquitectura

## Visión general (C4 - Nivel 1)

Usuario → Frontend (Vercel) → Backend (Render) → Base de datos (Railway/Postgres)

Descripción breve:
- El usuario interactúa con la interfaz React (frontend). El frontend consume una API REST en el backend. El backend gestiona autenticación, lógica de negocios y persistencia en la base de datos.

## Componentes

- Frontend (`todo-app-frontend`)
  - Qué hace: UI para registrar/entrar, listar tareas, crear/editar/eliminar tareas.
  - Principales pantallas: Login, Register, Lista de tareas (TodoList), Item detalle/edición.

- Backend (repositorio separado)
  - Capas típicas: Rutas (endpoints), Controladores (orquestan peticiones), Servicios (lógica de negocio), Repositorios/Modelos (acceso a BD), Middlewares (auth, validación).
  - Rutas relevantes: `/auth/*`, `/todos/*`.

- Base de datos
  - Modelo: tabla/colección `users` y `todos`.
  - Ejemplo (Postgres):
    - `users` (id, name, email, password_hash, created_at)
    - `todos` (id, title, completed, user_id, created_at, updated_at)

## Flujo: Crear una tarea (ejemplo)
1. Usuario rellena formulario "Nueva tarea" en la UI y presiona "Crear".
2. Frontend hace `POST /todos` con body `{ title, completed }` y `Authorization` header.
3. Backend valida token y datos, crea el registro en la BD asociado a `user_id`.
4. Backend responde con el objeto creado (201).
5. Frontend actualiza la lista en pantalla (state) y muestra la nueva tarea.

## Pipeline de CI (propuesta simple)
- Trigger: push a `main` o PR abierto.
- Jobs posibles:
  - `install` — instalar dependencias.
  - `lint` — ejecutar `eslint`.
  - `test` — ejecutar tests unitarios (si existen).
  - `build` — `npm run build` para frontend (artefacto para despliegue).
  - `deploy` — despliegue automático al merge (Vercel/Netlify para frontend; Render para backend).

## Notas finales
- Incluye captura o enlace a Railway si la BD está en Railway.
- El diagrama completo se puede exportar desde draw.io y añadir aquí como PDF o imagen.
