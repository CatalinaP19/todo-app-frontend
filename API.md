
# Documentación de la API (OpenAPI / Colección)

Esta documentación describe los endpoints que consume el frontend en `src/services/api.js`.

Base URL
- En desarrollo: `http://localhost:3000` (configurable con `VITE_API_URL`)

Puedes encontrar una especificación OpenAPI en `openapi.yaml` incluida en este repositorio.

Resumen de endpoints

1) Registrar usuario
- Ruta: `/auth/register`
- Método: `POST`
- Body (application/json):

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- Respuestas:
  - `201 Created` — Registro correcto. Body:

```json
{
  "user": { "id": "string", "name": "string", "email": "string" },
  "token": "string"
}
```
  - `400 Bad Request` — datos inválidos.

Ejemplo curl:

```bash
curl -X POST "http://localhost:3000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Catalina","email":"catalina@example.com","password":"secret"}'
```

2) Login
- Ruta: `/auth/login`
- Método: `POST`
- Body:

```json
{
  "email": "string",
  "password": "string"
}
```
- Respuestas:
  - `200 OK` — Login correcto. Body:

```json
{
  "user": { "id": "string", "name": "string", "email": "string" },
  "token": "string"
}
```
  - `401 Unauthorized` — credenciales inválidas.

Ejemplo curl:

```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"catalina@example.com","password":"secret"}'
```

3) Obtener tareas
- Ruta: `/todos`
- Método: `GET`
- Headers: `Authorization: Bearer <token>` (si la API requiere autenticación)
- Respuestas:
  - `200 OK` — Lista de tareas. Body ejemplo:

```json
[
  { "id": "t1", "title": "Comprar leche", "completed": false, "userId": "123" }
]
```
  - `401 Unauthorized` — token faltante/Inválido.

Ejemplo curl:

```bash
curl -X GET "http://localhost:3000/todos" \
  -H "Authorization: Bearer <token>"
```

4) Crear tarea
- Ruta: `/todos`
- Método: `POST`
- Body:

```json
{
  "title": "string",
  "completed": false
}
```
- Respuestas:
  - `201 Created` — Tarea creada. Body ejemplo:

```json
{ "id": "t2", "title": "Nueva tarea", "completed": false }
```
  - `400 Bad Request` — datos inválidos.

Ejemplo curl:

```bash
curl -X POST "http://localhost:3000/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Nueva tarea","completed":false}'
```

5) Actualizar tarea
- Ruta: `/todos/{id}`
- Método: `PUT`
- Path parameter: `id` (string)
- Body (parcial o completo):

```json
{
  "title": "string",
  "completed": true
}
```
- Respuestas:
  - `200 OK` — Objeto actualizado.
  - `400 Bad Request` — body inválido.
  - `404 Not Found` — id no existe.

Ejemplo curl:

```bash
curl -X PUT "http://localhost:3000/todos/t2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Actualizada","completed":true}'
```

6) Eliminar tarea
- Ruta: `/todos/{id}`
- Método: `DELETE`
- Respuestas:
  - `200 OK` o `204 No Content` — eliminado correctamente.
  - `404 Not Found` — id no existe.

Ejemplo curl:

```bash
curl -X DELETE "http://localhost:3000/todos/t2" \
  -H "Authorization: Bearer <token>"
```

Códigos de estado comunes
- `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

Especificación OpenAPI
- Archivo: `openapi.yaml` — contiene la especificación OpenAPI 3.0 para estos endpoints. Puedes importarlo en Swagger UI o Postman.

Notas
- El frontend guarda `token` y `user` en `localStorage` tras `login` o `register`.

