import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TodoItem from './TodoItem';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTareas();
    setAnimateIn(true);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#312C51] to-[#4B426D] mx-auto mb-4 float-animation shadow-2xl shadow-blue-400/50"></div>
          <p className="text-[#312C51] font-bold text-lg">Cargando tus tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(240, 217, 181, 0.3), 0 0 40px rgba(240, 217, 181, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(240, 217, 181, 0.5), 0 0 60px rgba(240, 217, 181, 0.2);
          }
        }

        .animate-in {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-form {
          animation: slideInUp 0.7s ease-out;
        }

        .animate-list {
          animation: fadeIn 0.8s ease-out;
        }

        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .btn-shine {
          position: relative;
          overflow: hidden;
        }

        .btn-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="fixed top-10 right-10 w-72 h-72 bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="fixed bottom-10 left-10 w-72 h-72 bg-gradient-to-r from-[#312C51] to-[#4B426D] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header Principal */}
          <div className={`bg-gradient-to-r from-[#312C51] to-[#4B426D] rounded-3xl shadow-2xl p-8 mb-8 text-white animate-in border border-[#4B426D]/20 ${animateIn ? '' : 'opacity-0'}`}
            style={{
              boxShadow: '0 20px 60px rgba(49, 44, 81, 0.4), 0 0 40px rgba(240, 217, 181, 0.1)'
            }}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-[#F0D9B5] bg-clip-text text-transparent">Mis Tareas</h1>
                {user && (
                  <p className="text-lg text-gray-300">
                    ¡Hola, <span className="font-bold text-[#F0D9B5] text-xl">{user.name}</span>! 👋
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] hover:from-[#E08B8A] hover:to-[#D07A79] text-white font-bold rounded-full transition duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl btn-shine relative"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Formulario para agregar tarea */}
          <form onSubmit={addTarea} className={`mb-8 animate-form ${animateIn ? '' : 'opacity-0'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="✨ Agregar nueva tarea..."
                className="flex-1 px-6 py-4 border-2 border-[#E8DAEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F0D9B5] focus:border-transparent bg-white text-[#312C51] placeholder-gray-400 shadow-lg hover:shadow-xl transition duration-300 glass-effect"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51] font-bold rounded-2xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl btn-shine relative"
              >
                Agregar
              </button>
            </div>
          </form>

          {/* Buscador interactivo */}
          <div className={`mb-8 glass-effect rounded-2xl shadow-xl p-6 border-2 border-[#E8DAEF] animate-form ${animateIn ? '' : 'opacity-0'} transition-all duration-300 hover:shadow-2xl`}>
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-4 text-[#4B426D]" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="🔍 Buscar una tarea..."
                className="w-full pl-12 pr-12 py-3 border-2 border-[#E8DAEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F0D9B5] focus:border-transparent text-[#312C51] bg-white/50 transition duration-300"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-4 top-3 text-[#F1AAA9] hover:text-[#E08B8A] font-bold text-xl transition duration-200 hover:scale-125"
                >
                  ✕
                </button>
              )}
            </div>
            {busqueda && (
              <p className="text-sm text-[#4B426D] font-semibold animate-pulse">
                Se encontraron <span className="text-[#F0D9B5] text-base">{tareasFiltradas.length}</span> resultado(s)
              </p>
            )}
          </div>

          {/* Lista de tareas */}
          <div className={`glass-effect rounded-3xl shadow-2xl overflow-hidden border-2 border-[#E8DAEF] animate-list ${animateIn ? '' : 'opacity-0'}`}
            style={{
              boxShadow: '0 20px 60px rgba(49, 44, 81, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
            {tareasFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] mx-auto mb-4 flex items-center justify-center shadow-lg pulse-glow">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-[#4B426D] text-lg font-semibold">
                  {busqueda ? '❌ No se encontraron tareas con ese término' : '✅ No hay tareas. ¡Agrega una nueva!'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8DAEF]">
                {tareasFiltradas.map((tarea, index) => (
                  <div
                    key={tarea._id}
                    style={{
                      animation: `slideInUp 0.5s ease-out ${index * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    <TodoItem
                      tarea={tarea}
                      toggleCompleted={toggleCompleted}
                      deleteTarea={deleteTarea}
                      editTarea={editTarea}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas de tareas */}
          {tareas.length > 0 && (
            <div className={`mt-8 grid grid-cols-3 gap-4 animate-list ${animateIn ? '' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-[#312C51] to-[#4B426D] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-[#4B426D]/30 cursor-pointer btn-shine relative"
                style={{
                  boxShadow: '0 15px 40px rgba(49, 44, 81, 0.3), 0 0 30px rgba(75, 66, 109, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.length}</p>
                <p className="text-gray-300 text-sm">Total</p>
              </div>
              <div className="bg-gradient-to-br from-[#F0D9B5] to-[#E8C79E] rounded-2xl p-6 text-[#312C51] shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-[#F0D9B5]/30 cursor-pointer btn-shine relative"
                style={{
                  boxShadow: '0 15px 40px rgba(240, 217, 181, 0.3), 0 0 30px rgba(232, 199, 158, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.filter(t => t.completed).length}</p>
                <p className="text-[#4B426D] text-sm font-semibold">Completadas</p>
              </div>
              <div className="bg-gradient-to-br from-[#F1AAA9] to-[#E08B8A] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-[#F1AAA9]/30 cursor-pointer btn-shine relative"
                style={{
                  boxShadow: '0 15px 40px rgba(241, 170, 169, 0.3), 0 0 30px rgba(224, 139, 138, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.filter(t => !t.completed).length}</p>
                <p className="text-red-100 text-sm">Pendientes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}