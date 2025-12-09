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
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/todos');
    } else {
      setErrors(prev => ({ ...prev, server: result.error }));
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#312C51] via-[#4B426D] to-[#2A2540] flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card de login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-[#E8DAEF]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-[#312C51] mb-2">Bienvenido</h2>
            <p className="text-[#4B426D] text-sm">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-[#312C51] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="tu@email.com"
                className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-2 bg-gradient-to-r from-slate-50 to-blue-50 ${
                  errors.email 
                    ? 'border-[#F1AAA9] focus:ring-[#F1AAA9]' 
                    : 'border-[#E8DAEF] focus:ring-[#F0D9B5]'
                } text-[#312C51] placeholder-gray-400`}
              />
              {errors.email && (
                <p className="text-[#F1AAA9] text-sm font-medium mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#312C51] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-2 bg-gradient-to-r from-slate-50 to-blue-50 pr-12 ${
                    errors.password 
                      ? 'border-[#F1AAA9] focus:ring-[#F1AAA9]' 
                      : 'border-[#E8DAEF] focus:ring-[#F0D9B5]'
                  } text-[#312C51]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#4B426D] hover:text-[#312C51] transition"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#F1AAA9] text-sm font-medium mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Error del servidor */}
            {errors.server && (
              <div className="bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] text-white p-4 rounded-xl border-2 border-[#E08B8A] text-center">
                <p className="font-semibold">⚠ {errors.server}</p>
                <p className="text-sm mt-1 text-red-100">Verifica tu email y contraseña</p>
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] disabled:from-gray-400 disabled:to-gray-500 text-[#312C51] font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#312C51] border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Links adicionales */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-[#4B426D] text-sm">
              ¿No tienes cuenta?{' '}
              <Link 
                to="/register" 
                className="font-bold text-[#F0D9B5] hover:text-[#E8C79E] transition"
              >
                Regístrate
              </Link>
            </p>
            <Link 
              to="/forgot-password" 
              className="block text-[#4B426D] text-sm hover:text-[#F0D9B5] transition font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;