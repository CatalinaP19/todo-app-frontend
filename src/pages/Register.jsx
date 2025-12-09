import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    setAnimate(true);
  }, []);

  const validateName = (name) => {
    const trimmedName = name.trim();
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    
    if (words.length < 2) {
      return 'El nombre debe incluir nombre y apellido';
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Mínimo 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Necesita una mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'Necesita una minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'Necesita un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Necesita un carácter especial';
    }
    return null;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value) {
      const error = validateName(value);
      setErrors(prev => ({ ...prev, username: error }));
    } else {
      setErrors(prev => ({ ...prev, username: null }));
    }
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

    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value && password !== value) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameError = validateName(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Las contraseñas no coinciden' : null;

    const newErrors = {
      username: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== null)) {
      return;
    }
    
    setLoading(true);
    
    const result = await register(username, email, password);
    
    if (result.success) {
      navigate('/login');
    } else {
      setErrors(prev => ({ ...prev, server: result.error }));
    }
    
    setLoading(false);
  };

  const passwordValid = !validatePassword(password) && password.length > 0;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

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
          {/* Card de registro */}
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
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-4xl font-bold text-[#312C51] mb-2">Crear Cuenta</h2>
              <p className="text-[#4B426D] text-sm font-medium">Únete a nosotros hoy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-bold text-[#312C51] mb-2">
                  👤 Nombre Completo
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={handleNameChange}
                  placeholder="Juan Pérez"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none bg-gradient-to-r from-slate-50 to-blue-50 input-glow ${
                    errors.username 
                      ? 'border-[#F1AAA9] focus:ring-2 focus:ring-[#F1AAA9]' 
                      : 'border-[#E8DAEF] focus:border-[#F0D9B5]'
                  } text-[#312C51] placeholder-gray-400 font-medium`}
                />
                {errors.username && (
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 animate-pulse">⚠ {errors.username}</p>
                )}
              </div>

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
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 animate-pulse">⚠ {errors.email}</p>
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
                {errors.password ? (
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 animate-pulse">⚠ {errors.password}</p>
                ) : passwordValid ? (
                  <p className="text-[#F0D9B5] text-sm font-semibold mt-2 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Contraseña segura
                  </p>
                ) : null}
              </div>

              {/* Campo Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-bold text-[#312C51] mb-2">
                  ✓ Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none bg-gradient-to-r from-slate-50 to-blue-50 pr-12 input-glow ${
                      errors.confirmPassword 
                        ? 'border-[#F1AAA9] focus:ring-2 focus:ring-[#F1AAA9]' 
                        : 'border-[#E8DAEF] focus:border-[#F0D9B5]'
                    } text-[#312C51] font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#4B426D] hover:text-[#312C51] transition transform hover:scale-125"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="text-[#F1AAA9] text-sm font-semibold mt-2 animate-pulse">⚠ {errors.confirmPassword}</p>
                ) : passwordsMatch ? (
                  <p className="text-[#F0D9B5] text-sm font-semibold mt-2 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Las contraseñas coinciden
                  </p>
                ) : null}
              </div>

              {/* Error del servidor */}
              {errors.server && (
                <div className="bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] text-white p-4 rounded-xl border-2 border-[#E08B8A] text-center shadow-lg animate-pulse">
                  <p className="font-bold">⚠ {errors.server}</p>
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
                    Registrando...
                  </span>
                ) : (
                  '🎉 Crear Cuenta'
                )}
              </button>
            </form>

            {/* Link de login */}
            <p className="text-center text-[#4B426D] text-sm mt-6 font-medium border-t border-[#E8DAEF] pt-6">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="font-bold text-[#F0D9B5] hover:text-[#E8C79E] transition duration-200 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;