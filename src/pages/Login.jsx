import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    setAnimate(true);
  }, []);

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El email es requerido';
    }
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value) {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    } else {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    } else {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);

    if (emailError || passwordError) {
      return;
    }
    
    setLoading(true);
    setLoadingProgress(10);
    
    // Simular delay mínimo para mostrar la animación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await login(email, password);
    
    if (result.success) {
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/todos');
    } else {
      setErrors(prev => ({ ...prev, server: result.error }));
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes orbitBig {
            0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }

          @keyframes orbitMedium {
            0% { transform: rotate(0deg) translateX(55px) rotate(0deg); }
            100% { transform: rotate(-360deg) translateX(55px) rotate(360deg); }
          }

          @keyframes orbitSmall {
            0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
          }

          @keyframes pulse-center {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(240, 217, 181, 0.7), 0 0 40px rgba(240, 217, 181, 0.4);
            }
            50% { 
              transform: scale(1.1);
              box-shadow: 0 0 0 20px rgba(240, 217, 181, 0.3), 0 0 60px rgba(240, 217, 181, 0.6);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideProgress {
            0% { width: 0%; }
            100% { width: var(--progress, 0%); }
          }

          .orbit-big {
            animation: orbitBig 8s linear infinite;
          }

          .orbit-medium {
            animation: orbitMedium 6s linear infinite;
          }

          .orbit-small {
            animation: orbitSmall 4s linear infinite;
          }

          .pulse-center {
            animation: pulse-center 2s ease-in-out infinite;
          }

          .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .progress-bar {
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
            margin: 0 2px;
          }

          .dot:nth-child(1) { animation-delay: -0.32s; }
          .dot:nth-child(2) { animation-delay: -0.16s; }

          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-[#312C51] via-[#4B426D] to-[#2A2540] flex justify-center items-center px-4 py-8 relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#F1AAA9] to-[#F0D9B5] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Animación orbital */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-12">
              {/* Círculos de fondo */}
              <div className="absolute inset-0 rounded-full border-2 border-[#F0D9B5]/20"></div>
              <div className="absolute inset-12 rounded-full border-2 border-[#F1AAA9]/20"></div>
              <div className="absolute inset-24 rounded-full border-2 border-[#E8C79E]/20"></div>

              {/* Órbita grande - elemento 1 */}
              <div className="absolute orbit-big">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] shadow-lg shadow-[#F0D9B5]/50"></div>
              </div>

              {/* Órbita grande - elemento 2 */}
              <div className="absolute orbit-big" style={{ animationDelay: '-4s' }}>
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] shadow-lg shadow-[#F1AAA9]/50"></div>
              </div>

              {/* Órbita media */}
              <div className="absolute orbit-medium">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#312C51] to-[#4B426D] shadow-lg shadow-[#312C51]/50"></div>
              </div>

              {/* Órbita pequeña */}
              <div className="absolute orbit-small">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] shadow-lg shadow-[#F0D9B5]/50"></div>
              </div>

              {/* Centro pulsante */}
              <div className="absolute w-12 h-12 pulse-center">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
            </div>

            {/* Texto de carga */}
            <div className="text-center space-y-4 fade-in-up">
              <h3 className="text-2xl font-bold text-white">Iniciando sesión</h3>
              <p className="text-[#E8C79E] text-sm font-semibold">
                Por favor espera un momento
              </p>
              
              {/* Puntos animados */}
              <div className="flex justify-center mt-3">
                <div className="dot bg-[#F0D9B5]"></div>
                <div className="dot bg-[#F1AAA9]"></div>
                <div className="dot bg-[#E8C79E]"></div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-64 mt-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-r from-[#4B426D] to-[#312C51] rounded-full h-1.5 overflow-hidden border border-[#F0D9B5]/20 shadow-lg">
                <div
                  className="progress-bar h-full bg-gradient-to-r from-[#F0D9B5] via-[#F1AAA9] to-[#E8C79E] shadow-lg shadow-[#F0D9B5]/50"
                  style={{
                    width: `${loadingProgress}%`,
                    boxShadow: '0 0 20px rgba(240, 217, 181, 0.6)'
                  }}
                ></div>
              </div>
              <p className="text-center text-[#E8C79E] text-xs font-semibold mt-3">
                {Math.round(loadingProgress)}%
              </p>
            </div>

            {/* Consejos dinámicos */}
            <div className="mt-16 text-center max-w-md fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-[#E8DAEF] text-sm">
                {loadingProgress < 30 && "🔐 Verificando credenciales..."}
                {loadingProgress >= 30 && loadingProgress < 60 && "📝 Cargando tu perfil..."}
                {loadingProgress >= 60 && loadingProgress < 90 && "📋 Obteniendo tus tareas..."}
                {loadingProgress >= 90 && "✨ ¡Casi listo!"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInCenter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-center {
          animation: slideInCenter 0.8s ease-out;
        }

        .float-element {
          animation: float 6s ease-in-out infinite;
        }

        .input-glow {
          transition: all 0.3s ease;
        }

        .input-glow:focus {
          box-shadow: 0 0 0 4px rgba(240, 217, 181, 0.1), 0 0 30px rgba(240, 217, 181, 0.3);
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
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

      <div className="min-h-screen bg-gradient-to-br from-[#312C51] via-[#4B426D] to-[#2A2540] flex justify-center items-center px-4 py-8 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] rounded-full mix-blend-multiply filter blur-3xl opacity-10 float-element"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#F1AAA9] to-[#F0D9B5] rounded-full mix-blend-multiply filter blur-3xl opacity-10 float-element" style={{ animationDelay: '2s' }}></div>

        <div className={`w-full max-w-md relative z-10 ${animate ? 'animate-center' : 'opacity-0'}`}>
          {/* Card de login */}
          <div className="glass-morphism rounded-3xl shadow-2xl p-8 border border-white/20"
            style={{
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 50px rgba(240, 217, 181, 0.1)'
            }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] mx-auto mb-4 flex items-center justify-center shadow-xl"
                style={{
                  boxShadow: '0 15px 40px rgba(240, 217, 181, 0.3), 0 0 30px rgba(241, 170, 169, 0.2)'
                }}>
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-4xl font-bold text-[#312C51] mb-2">Bienvenido</h2>
              <p className="text-[#4B426D] text-sm font-medium">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label className="block text-sm font-bold text-[#312C51] mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none bg-gradient-to-r from-slate-50 to-blue-50 input-glow ${
                    errors.email 
                      ? 'border-[#F1AAA9] focus:ring-2 focus:ring-[#F1AAA9]' 
                      : 'border-[#E8DAEF] focus:border-[#F0D9B5]'
                  } text-[#312C51] placeholder-gray-400 font-medium`}
                />
                {errors.email && (
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 flex items-center gap-2 animate-pulse">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-sm font-bold text-[#312C51] mb-2">
                  🔐 Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none bg-gradient-to-r from-slate-50 to-blue-50 pr-12 input-glow ${
                      errors.password 
                        ? 'border-[#F1AAA9] focus:ring-2 focus:ring-[#F1AAA9]' 
                        : 'border-[#E8DAEF] focus:border-[#F0D9B5]'
                    } text-[#312C51] font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#4B426D] hover:text-[#312C51] transition transform hover:scale-125"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 flex items-center gap-2 animate-pulse">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Error del servidor */}
              {errors.server && (
                <div className="bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] text-white p-4 rounded-xl border-2 border-[#E08B8A] text-center shadow-lg animate-pulse">
                  <p className="font-bold">⚠ {errors.server}</p>
                  <p className="text-sm mt-1 text-red-100">Verifica tu email y contraseña</p>
                </div>
              )}

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] disabled:from-gray-400 disabled:to-gray-500 text-[#312C51] font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl hover:shadow-2xl btn-shine relative mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-3 border-[#312C51] border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  '✨ Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Links adicionales */}
            <div className="mt-8 space-y-3 text-center border-t border-[#E8DAEF] pt-6">
              <p className="text-[#4B426D] text-sm font-medium">
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/register" 
                  className="font-bold text-[#F0D9B5] hover:text-[#E8C79E] transition duration-200 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
              <Link 
                to="/forgot-password" 
                className="block text-[#4B426D] text-sm hover:text-[#F0D9B5] transition font-semibold hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;