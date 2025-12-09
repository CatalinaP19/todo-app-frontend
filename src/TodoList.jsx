import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ToastContext } from './context/ToastContext';
import { ThemeContext } from './context/ThemeContext';
import TodoItem from './TodoItem';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  
  const { logout, user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
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
      addToast('Error al cargar tus tareas', 'error', 4000);
      setLoading(false);
    }
  };

  const tareasFiltradas = tareas.filter(tarea =>
    tarea.text.toLowerCase().includes(busqueda.toLowerCase())
  );

  const addTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) {
      addToast('Por favor escribe una tarea', 'warning');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: nuevaTarea })
      });
      
      if (!response.ok) throw new Error('Error al crear tarea');
      
      const data = await response.json();
      setTareas([...tareas, data]);
      setNuevaTarea('');
      addToast('✨ ¡Tarea creada exitosamente!', 'success', 3000);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      addToast('Error al crear la tarea', 'error', 4000);
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
      
      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
      
      if (!tarea.completed) {
        addToast('✅ ¡Tarea completada! ¡Felicitaciones!', 'success', 3000);
      } else {
        addToast('↩️ Tarea marcada como pendiente', 'info', 3000);
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      addToast('Error al actualizar la tarea', 'error', 4000);
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
      
      if (!response.ok) throw new Error('Error al editar tarea');
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
      addToast('📝 Tarea editada correctamente', 'success', 3000);
    } catch (error) {
      console.error('Error al editar tarea:', error);
      addToast('Error al editar la tarea', 'error', 4000);
    }
  };

  const deleteTarea = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar tarea');
      
      setTareas(tareas.filter(t => t._id !== id));
      addToast('🗑️ Tarea eliminada exitosamente', 'success', 3000);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      addToast('Error al eliminar la tarea', 'error', 4000);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('👋 ¡Hasta luego!', 'info', 2000);
    setTimeout(() => navigate('/login'), 500);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen theme-transition ${
        isDark 
          ? 'bg-gradient-to-br from-[#1a1825] via-[#2d2640] to-[#1a1825]' 
          : 'bg-gradient-to-br from-[#FDF6F0] via-[#F5EBE0] to-[#ECE4D8]'
      }`}>
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
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
            isDark
              ? 'from-[#F0D9B5] to-[#F1AAA9]'
              : 'from-[#312C51] to-[#4B426D]'
          } mx-auto mb-4 float-animation shadow-2xl`}></div>
          <p className={`font-bold text-lg ${isDark ? 'text-[#F0D9B5]' : 'text-[#312C51]'}`}>
            Cargando tus tareas...
          </p>
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

        @keyframes pulse-glow-dark {
          0%, 100% {
            box-shadow: 0 0 20px rgba(240, 217, 181, 0.4), 0 0 40px rgba(240, 217, 181, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(240, 217, 181, 0.6), 0 0 60px rgba(240, 217, 181, 0.3);
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

        .pulse-glow-dark {
          animation: pulse-glow-dark 3s ease-in-out infinite;
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .glass-effect-dark {
          backdrop-filter: blur(10px);
          background: rgba(26, 24, 37, 0.85);
          border: 1px solid rgba(240, 217, 181, 0.1);
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

        @keyframes float-blob {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -50px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }

        .animate-blob {
          animation: float-blob 7s infinite;
        }

        .theme-transition {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className={`min-h-screen py-8 px-4 relative overflow-hidden theme-transition ${
        isDark
          ? 'bg-gradient-to-br from-[#1a1825] via-[#2d2640] to-[#1a1825]'
          : 'bg-gradient-to-br from-[#FDF6F0] via-[#F5EBE0] to-[#ECE4D8]'
      }`}>
        {/* Elementos decorativos de fondo */}
        <div className={`fixed top-10 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob ${
          isDark
            ? 'bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9]'
            : 'bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9]'
        }`}></div>
        <div className={`fixed bottom-10 left-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob ${
          isDark
            ? 'bg-gradient-to-r from-[#E8C79E] to-[#F0D9B5]'
            : 'bg-gradient-to-r from-[#312C51] to-[#E8C79E]'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`fixed top-1/2 left-1/3 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
          isDark
            ? 'bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A]'
            : 'bg-gradient-to-r from-[#F1AAA9] to-[#FDF6F0]'
        }`} style={{ animationDelay: '4s' }}></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header Principal */}
          <div className={`rounded-3xl shadow-2xl p-8 mb-8 animate-in border theme-transition ${
            isDark
              ? 'bg-gradient-to-r from-[#2d2640] to-[#3d3555] text-white border-[#F0D9B5]/10'
              : 'bg-gradient-to-r from-[#312C51] to-[#4B426D] text-white border-[#4B426D]/20'
          } ${animateIn ? '' : 'opacity-0'}`}
            style={{
              boxShadow: isDark 
                ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(240, 217, 181, 0.15)'
                : '0 20px 60px rgba(49, 44, 81, 0.4), 0 0 40px rgba(240, 217, 181, 0.1)'
            }}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className={`text-5xl font-bold mb-2 bg-gradient-to-r ${
                  isDark
                    ? 'from-[#F0D9B5] to-[#E8C79E]'
                    : 'from-white to-[#F0D9B5]'
                } bg-clip-text text-transparent`}>
                  Mis Tareas
                </h1>
                {user && (
                  <p className={`text-lg ${isDark ? 'text-[#E8C79E]' : 'text-gray-300'}`}>
                    ¡Hola, <span className={`font-bold text-xl ${isDark ? 'text-[#F0D9B5]' : 'text-[#F0D9B5]'}`}>
                      {user.name}
                    </span>! 👋
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {/* Botón Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-full transition duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl btn-shine relative ${
                    isDark
                      ? 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] text-[#312C51]'
                      : 'bg-gradient-to-r from-[#312C51] to-[#4B426D] text-[#F0D9B5]'
                  }`}
                  title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                  {isDark ? (
                    <SunIcon className="w-6 h-6" />
                  ) : (
                    <MoonIcon className="w-6 h-6" />
                  )}
                </button>
                
                {/* Botón Logout */}
                <button
                  onClick={handleLogout}
                  className={`px-6 py-3 font-bold rounded-full transition duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl btn-shine relative ${
                    isDark
                      ? 'bg-gradient-to-r from-[#E08B8A] to-[#D07A79] hover:from-[#D07A79] hover:to-[#C06968] text-white'
                      : 'bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] hover:from-[#E08B8A] hover:to-[#D07A79] text-white'
                  }`}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Formulario para agregar tarea */}
          <form onSubmit={addTarea} className={`mb-8 animate-form theme-transition ${animateIn ? '' : 'opacity-0'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="✨ Agregar nueva tarea..."
                className={`flex-1 px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl theme-transition ${
                  isDark
                    ? 'bg-[#2d2640]/60 text-[#F0D9B5] placeholder-[#B0956F] border-[#F0D9B5]/20 focus:ring-[#F0D9B5] focus:border-[#F0D9B5]/40'
                    : 'bg-white/80 text-[#312C51] placeholder-gray-400 border-[#E8DAEF] focus:ring-[#F0D9B5] focus:border-transparent'
                }`}
              />
              <button
                type="submit"
                className={`px-8 py-4 font-bold rounded-2xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl btn-shine relative theme-transition ${
                  isDark
                    ? 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51]'
                    : 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51]'
                }`}
              >
                Agregar
              </button>
            </div>
          </form>

          {/* Buscador interactivo */}
          <div className={`mb-8 rounded-2xl shadow-xl p-6 border-2 animate-form transition-all duration-300 hover:shadow-2xl backdrop-blur-sm theme-transition ${
            isDark
              ? 'glass-effect-dark border-[#F0D9B5]/10'
              : 'glass-effect border-[#E8DAEF]'
          } ${animateIn ? '' : 'opacity-0'}`}>
            <div className="relative mb-4">
              <MagnifyingGlassIcon className={`w-5 h-5 absolute left-4 top-4 ${isDark ? 'text-[#E8C79E]' : 'text-[#4B426D]'}`} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="🔍 Buscar una tarea..."
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition duration-300 backdrop-blur-sm theme-transition ${
                  isDark
                    ? 'bg-[#2d2640]/60 text-[#F0D9B5] placeholder-[#B0956F] border-[#F0D9B5]/20 focus:ring-[#F0D9B5] focus:border-[#F0D9B5]/40'
                    : 'bg-white/60 text-[#312C51] border-[#E8DAEF] focus:ring-[#F0D9B5] focus:border-transparent'
                }`}
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className={`absolute right-4 top-3 font-bold text-xl transition duration-200 hover:scale-125 ${
                    isDark ? 'text-[#E8C79E] hover:text-[#F0D9B5]' : 'text-[#F1AAA9] hover:text-[#E08B8A]'
                  }`}
                >
                  ✕
                </button>
              )}
            </div>
            {busqueda && (
              <p className={`text-sm font-semibold animate-pulse ${isDark ? 'text-[#E8C79E]' : 'text-[#4B426D]'}`}>
                Se encontraron <span className={`text-base ${isDark ? 'text-[#F0D9B5]' : 'text-[#F0D9B5]'}`}>
                  {tareasFiltradas.length}
                </span> resultado(s)
              </p>
            )}
          </div>

          {/* Lista de tareas */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden border-2 animate-list backdrop-blur-sm theme-transition ${
            isDark
              ? 'glass-effect-dark border-[#F0D9B5]/10'
              : 'glass-effect border-[#E8DAEF]'
          } ${animateIn ? '' : 'opacity-0'}`}
            style={{
              boxShadow: isDark
                ? '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(240, 217, 181, 0.05)'
                : '0 20px 60px rgba(49, 44, 81, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
            {tareasFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${
                  isDark ? 'pulse-glow-dark bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E]' : 'pulse-glow bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9]'
                }`}>
                  <span className="text-4xl">📝</span>
                </div>
                <p className={`text-lg font-semibold ${isDark ? 'text-[#E8C79E]' : 'text-[#4B426D]'}`}>
                  {busqueda ? '❌ No se encontraron tareas con ese término' : '✅ No hay tareas. ¡Agrega una nueva!'}
                </p>
              </div>
            ) : (
              <div className={`divide-y ${isDark ? 'divide-[#F0D9B5]/10' : 'divide-[#E8DAEF]'}`}>
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
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas de tareas */}
          {tareas.length > 0 && (
            <div className={`mt-8 grid grid-cols-3 gap-4 animate-list ${animateIn ? '' : 'opacity-0'}`}>
              <div className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border cursor-pointer btn-shine relative theme-transition ${
                isDark
                  ? 'bg-gradient-to-br from-[#2d2640] to-[#3d3555] text-[#F0D9B5] border-[#F0D9B5]/10'
                  : 'bg-gradient-to-br from-[#312C51] to-[#4B426D] text-white border-[#4B426D]/30'
              }`}
                style={{
                  boxShadow: isDark
                    ? '0 15px 40px rgba(240, 217, 181, 0.1), 0 0 30px rgba(240, 217, 181, 0.05)'
                    : '0 15px 40px rgba(49, 44, 81, 0.3), 0 0 30px rgba(75, 66, 109, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.length}</p>
                <p className={isDark ? 'text-[#E8C79E] text-sm' : 'text-gray-300 text-sm'}>Total</p>
              </div>
              <div className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border cursor-pointer btn-shine relative theme-transition ${
                isDark
                  ? 'bg-gradient-to-br from-[#2d3d2d] to-[#3d4d3d] text-[#D4AF7A] border-[#F0D9B5]/10'
                  : 'bg-gradient-to-br from-[#F0D9B5] to-[#E8C79E] text-[#312C51] border-[#F0D9B5]/30'
              }`}
                style={{
                  boxShadow: isDark
                    ? '0 15px 40px rgba(212, 175, 122, 0.1), 0 0 30px rgba(212, 175, 122, 0.05)'
                    : '0 15px 40px rgba(240, 217, 181, 0.3), 0 0 30px rgba(232, 199, 158, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.filter(t => t.completed).length}</p>
                <p className={isDark ? 'text-[#D4AF7A] text-sm font-semibold' : 'text-[#4B426D] text-sm font-semibold'}>Completadas</p>
              </div>
              <div className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 border cursor-pointer btn-shine relative theme-transition ${
                isDark
                  ? 'bg-gradient-to-br from-[#3d2d2d] to-[#4d3d3d] text-[#E8A89F] border-[#F0D9B5]/10'
                  : 'bg-gradient-to-br from-[#F1AAA9] to-[#E08B8A] text-white border-[#F1AAA9]/30'
              }`}
                style={{
                  boxShadow: isDark
                    ? '0 15px 40px rgba(232, 168, 159, 0.1), 0 0 30px rgba(232, 168, 159, 0.05)'
                    : '0 15px 40px rgba(241, 170, 169, 0.3), 0 0 30px rgba(224, 139, 138, 0.1)'
                }}>
                <p className="text-4xl font-bold mb-1">{tareas.filter(t => !t.completed).length}</p>
                <p className={isDark ? 'text-[#E8A89F] text-sm' : 'text-red-100 text-sm'}>Pendientes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

