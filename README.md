# Todo App Frontend
# Estructura del proyecto

A continuación se muestra la estructura recomendada del proyecto frontend, con una breve descripción de cada archivo/directorio.

```
Frontend/
├─ src/
│  ├─ components/
│  │  ├─ Login.jsx         # Componente de inicio de sesión
│  │  ├─ TodoForm.jsx      # Formulario para crear tareas
│  │  ├─ TodoItem.jsx      # Componente individual de tarea
│  │  └─ TodoList.jsx      # Lista de todas las tareas
│  ├─ context/
│  │  ├─ AuthContext.jsx   # Contexto de autenticación
│  │  ├─ ThemeContext.jsx  # Contexto de tema (claro/oscuro)
│  │  └─ ToastContext.jsx  # Contexto para notificaciones
│  ├─ pages/
│  │  ├─ Login.jsx         # Página de login (ruta /login)
│  │  └─ Register.jsx      # Página de registro (ruta /register)
│  ├─ App.jsx              # Componente principal (Router)
│  ├─ main.jsx             # Punto de entrada (mount React)
│  ├─ index.css            # Estilos globales
│  └─ App.css              # Estilos del componente App
├─ public/
│  └─ index.html           # HTML principal
├─ openapi.yaml            # Especificación OpenAPI (API)
├─ swagger-ui/             # UI estática para previsualizar OpenAPI
│  └─ index.html
├─ package.json            # Dependencias y scripts
├─ vite.config.js          # Configuración de Vite
└─ tailwind.config.cjs     # Configuración de Tailwind CSS
```

Si quieres, puedo generar esta estructura de archivos en el repositorio (crear componentes vacíos y archivos de contexto) o dejar solo esta documentación en el `README.md`. ¿Qué prefieres?

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