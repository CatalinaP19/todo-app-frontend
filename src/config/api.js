import axios from 'axios';

// URL del backend - cambiarás esto cuando despliegues
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funciones para interactuar con el backend
export const todoAPI = {
  // Obtener todas las tareas
  getTodos: async () => {
    const response = await api.get('/todos');
    return response.data;
  },

  // Crear nueva tarea
  createTodo: async (text) => {
    const response = await api.post('/todos', { text });
    return response.data;
  },

  // Actualizar tarea (marcar como completada o editar texto)
  updateTodo: async (id, data) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data;
  },

  // Eliminar tarea
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};