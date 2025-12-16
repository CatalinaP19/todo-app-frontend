# Documentación de la API

Esta documentación describe los endpoints que consume el frontend en `src/services/api.js`.

Base URL
- En desarrollo: `http://localhost:3000` (configurable con `VITE_API_URL`)

Endpoints

1) Registro de usuario
- Ruta: `/auth/register`
- Método: `POST`
- Body esperado (JSON):

```json
{
  "name": "Nombre",
  "email": "usuario@ejemplo.com",
  "password": "tu_password"
}
```
- Respuesta ejemplo (201):

```json
{
  "user": { "id": "123", "name": "Nombre", "email": "usuario@ejemplo.com" },
  "token": "<jwt-token>"
}
```

2) Login
- Ruta: `/auth/login`
- Método: `POST`
- Body esperado:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_password"
}
```
- Respuesta ejemplo (200):

```json
{
  "user": { "id": "123", "name": "Nombre", "email": "usuario@ejemplo.com" },
  "token": "<jwt-token>"
}
```

3) Obtener todas las tareas
- Ruta: `/todos`
- Método: `GET`
- Headers: `Authorization: Bearer <token>` (si la API requiere autenticación)
- Respuesta ejemplo (200):

```json
[
  { "id": "t1", "title": "Comprar leche", "completed": false, "userId": "123" }
]
```

4) Crear tarea
- Ruta: `/todos`
- Método: `POST`
- Body esperado:

```json
{
  "title": "Nueva tarea",
  "completed": false
}
```
- Respuesta ejemplo (201):

```json
{ "id": "t2", "title": "Nueva tarea", "completed": false }
```

5) Actualizar tarea
- Ruta: `/todos/:id`
- Método: `PUT`
- Body esperado (parcial o completo):

```json
{
  "title": "Título actualizado",
  "completed": true
}
```
- Respuesta ejemplo (200): objeto actualizado.

6) Eliminar tarea
- Ruta: `/todos/:id`
- Método: `DELETE`
- Respuesta ejemplo (200/204): éxito de borrado.

Códigos de estado comunes
- `200 OK` — petición exitosa.
- `201 Created` — recurso creado.
- `400 Bad Request` — datos inválidos.
- `401 Unauthorized` — token faltante o inválido.
- `403 Forbidden` — sin permisos.
- `404 Not Found` — recurso no encontrado.
- `500 Internal Server Error` — error en servidor.

Notas
- El frontend guarda `token` y `user` en `localStorage` tras `login` o `register`.
- Asegúrate de que el backend acepte y responda con el esquema mostrado.
