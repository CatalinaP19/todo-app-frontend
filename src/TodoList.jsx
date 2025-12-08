import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TodoItem from './TodoItem';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Obtener el token
  const token = localStorage.getItem('token');

  // Cargar tareas y datos del usuario al montar el componente
  useEffect(() => {
    fetchTareas();
    fetchUserData();
  }, []);

  // Obtener datos del usuario
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserName(data.user.name);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  // Obtener todas las tareas
  const fetchTareas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTareas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setLoading(false);
    }
  };

  // Agregar nueva tarea
  const addTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: nuevaTarea })
      });
      
      const data = await response.json();
      setTareas([...tareas, data]);
      setNuevaTarea('');
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  // Marcar como completada/no completada
  const toggleCompleted = async (id) => {
    const tarea = tareas.find(t => t._id === id);
    
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !tarea.completed })
      });
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  // Editar tarea
  const editTarea = async (id, nuevoTexto) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: nuevoTexto })
      });
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };

  // Eliminar tarea
  const deleteTarea = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setTareas(tareas.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header con saludo, nombre de usuario y botón de logout */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mis Tareas</h1>
              {userName && (
                <p className="text-lg text-gray-600 mt-1">
                  ¡Hola, <span className="font-semibold text-blue-600">{userName}</span>! 👋
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Formulario para agregar tarea */}
        <form onSubmit={addTarea} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Agregar nueva tarea..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de tareas */}
        <div className="space-y-2">
          {tareas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay tareas. ¡Agrega una nueva!
            </p>
          ) : (
            tareas.map(tarea => (
              <TodoItem
                key={tarea._id}
                tarea={tarea}
                toggleCompleted={toggleCompleted}
                deleteTarea={deleteTarea}
                editTarea={editTarea}
              />
            ))
          )}
        </div>

        {/* Estadísticas de tareas */}
        {tareas.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-around text-sm text-gray-600">
              <div className="text-center">
                <p className="font-semibold text-gray-800">{tareas.length}</p>
                <p>Total</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">
                  {tareas.filter(t => t.completed).length}
                </p>
                <p>Completadas</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-orange-600">
                  {tareas.filter(t => !t.completed).length}
                </p>
                <p>Pendientes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}