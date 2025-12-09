import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TodoItem from './TodoItem';
import { MagnifyingGlassIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
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

  const tareasFiltradas = tareas.filter(tarea =>
    tarea.text.toLowerCase().includes(busqueda.toLowerCase())
  );

  const addTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
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

  const toggleCompleted = async (id) => {
    const tarea = tareas.find(t => t._id === id);
    
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
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

  const editTarea = async (id, nuevoTexto) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
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

  const deleteTarea = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#312C51] to-[#4B426D] mx-auto mb-4 animate-pulse"></div>
          <p className="text-[#312C51] font-semibold">Cargando tus tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Principal */}
        <div className="bg-gradient-to-r from-[#312C51] to-[#4B426D] rounded-3xl shadow-lg p-8 mb-8 text-white">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mis Tareas</h1>
              {user && (
                <p className="text-lg text-gray-200">
                  ¡Hola, <span className="font-bold text-[#F0D9B5]">{user.name}</span>! 👋
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-[#F1AAA9] hover:bg-[#E08B8A] text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 shadow-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Formulario para agregar tarea */}
        <form onSubmit={addTarea} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Agregar nueva tarea..."
              className="flex-1 px-6 py-4 border-2 border-[#E8DAEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F0D9B5] focus:border-transparent bg-white text-[#312C51] placeholder-gray-400 shadow-sm transition"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51] font-bold rounded-2xl transition duration-300 transform hover:scale-105 shadow-md"
            >
              Agregar
            </button>
          </div>
        </form>

        {/* Buscador interactivo */}
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 border-2 border-[#E8DAEF]">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-4 text-[#4B426D]" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar una tarea..."
              className="w-full pl-12 pr-12 py-3 border-2 border-[#E8DAEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F0D9B5] focus:border-transparent text-[#312C51]"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-3 text-[#F1AAA9] hover:text-[#E08B8A] font-bold text-xl transition"
              >
                ✕
              </button>
            )}
          </div>
          {busqueda && (
            <p className="text-sm text-[#4B426D] font-semibold">
              Se encontraron <span className="text-[#F0D9B5]">{tareasFiltradas.length}</span> resultado(s)
            </p>
          )}
        </div>

        {/* Lista de tareas */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-[#E8DAEF]">
          {tareasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-[#4B426D] text-lg font-semibold">
                {busqueda ? 'No se encontraron tareas con ese término' : 'No hay tareas. ¡Agrega una nueva!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8DAEF]">
              {tareasFiltradas.map(tarea => (
                <TodoItem
                  key={tarea._id}
                  tarea={tarea}
                  toggleCompleted={toggleCompleted}
                  deleteTarea={deleteTarea}
                  editTarea={editTarea}
                />
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas de tareas */}
        {tareas.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#312C51] to-[#4B426D] rounded-2xl p-6 text-white shadow-md transform hover:scale-105 transition">
              <p className="text-3xl font-bold">{tareas.length}</p>
              <p className="text-gray-300 text-sm mt-1">Total</p>
            </div>
            <div className="bg-gradient-to-br from-[#F0D9B5] to-[#E8C79E] rounded-2xl p-6 text-[#312C51] shadow-md transform hover:scale-105 transition">
              <p className="text-3xl font-bold">{tareas.filter(t => t.completed).length}</p>
              <p className="text-[#4B426D] text-sm mt-1">Completadas</p>
            </div>
            <div className="bg-gradient-to-br from-[#F1AAA9] to-[#E08B8A] rounded-2xl p-6 text-white shadow-md transform hover:scale-105 transition">
              <p className="text-3xl font-bold">{tareas.filter(t => !t.completed).length}</p>
              <p className="text-red-200 text-sm mt-1">Pendientes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}