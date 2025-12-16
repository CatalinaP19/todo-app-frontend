# Todo App Frontend

## Descripción
<details>
<summary>Ver descripción</summary>

Aplicación frontend de una lista de tareas (Todo App) creada con React y Vite. Permite registrarse, iniciar sesión y gestionar tareas (crear, editar, eliminar, listar).

</details>
## Stack tecnológico
<details>
<summary>Ver stack</summary>
- Frontend: React + Vite
- Estilos: Tailwind CSS
- Peticiones HTTP: Axios
- Routing: React Router

</details>
## Requisitos previos
<details>
<summary>Ver requisitos previos</summary>
- Node.js 18+ y `npm`

</details>
## Ejecutar el frontend en local
<details>
<summary>Instrucciones paso a paso</summary>
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

</details>
## Ejecutar el backend en local
<details>
<summary>Guía genérica para backend</summary>
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

</details>
## Variables de entorno
<details>
<summary>Ver `.env` de ejemplo</summary>
Consulta el archivo `.env.example` incluido en la raíz del proyecto para un ejemplo de configuración.

</details>
## Documentos adicionales
<details>
<summary>Archivos de documentación</summary>
- `ARCHITECTURA.md` — Diagrama y descripción de arquitectura.
- `API.md` — Documentación de los endpoints que consume el frontend.

</details>
## Previsualizar API (Swagger UI estático)
<details>
<summary>Abrir Swagger UI</summary>
He incluido una previsualización estática de Swagger UI en el repositorio. Abre el archivo:

- [swagger-ui/index.html](swagger-ui/index.html)
La página consume `openapi.yaml` en la raíz del repositorio. Para ver la UI en el navegador en local (evita problemas de CORS), sirve los archivos estáticos con un servidor simple. Ejemplos:

```bash
# usar `serve` (recomendado):
npx serve -s .

# o usar `http-server`:
npx http-server -c-1 .

```
Luego abre en el navegador `http://localhost:3000/swagger-ui/index.html` (o el puerto que muestre la herramienta `serve`).

</details>
## Licencia
<details>
<summary>Ver licencia</summary>
Proyecto licenciado a nombre de Catalina Perez Losada. Ver `LICENSE`.

</details>
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

## Previsualizar API (Swagger UI estático)

He incluido una previsualización estática de Swagger UI en el repositorio. Abre el archivo:

- [swagger-ui/index.html](swagger-ui/index.html)

La página consume `openapi.yaml` en la raíz del repositorio. Para ver la UI en el navegador en local (evita problemas de CORS), sirve los archivos estáticos con un servidor simple. Ejemplos:

```bash
# usar `serve` (recomendado):
npx serve -s .

# o usar `http-server`:
npx http-server -c-1 .
```

Luego abre en el navegador `http://localhost:3000/swagger-ui/index.html` (o el puerto que muestre la herramienta `serve`).

## Licencia
Proyecto licenciado a nombre de Catalina Perez Losada. Ver `LICENSE`.