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
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-[#312C51] via-[#4B426D] to-[#2A2540] flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card de registro */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-[#E8DAEF]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#F0D9B5] to-[#F1AAA9] mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-[#312C51] mb-2">Crear Cuenta</h2>
            <p className="text-[#4B426D] text-sm">Únete a nosotros hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-semibold text-[#312C51] mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={username}
                onChange={handleNameChange}
                placeholder="Juan Pérez"
                className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-2 bg-gradient-to-r from-slate-50 to-blue-50 ${
                  errors.username 
                    ? 'border-[#F1AAA9] focus:ring-[#F1AAA9]' 
                    : 'border-[#E8DAEF] focus:ring-[#F0D9B5]'
                } text-[#312C51] placeholder-gray-400`}
              />
              {errors.username && (
                <p className="text-[#F1AAA9] text-sm font-medium mt-1">⚠ {errors.username}</p>
              )}
            </div>

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
                <p className="text-[#F1AAA9] text-sm font-medium mt-1">⚠ {errors.email}</p>
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
              {errors.password ? (
                <p className="text-[#F1AAA9] text-sm font-medium mt-1">⚠ {errors.password}</p>
              ) : passwordValid ? (
                <p className="text-[#F0D9B5] text-sm font-medium mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" /> Contraseña segura
                </p>
              ) : null}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#312C51] mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-2 bg-gradient-to-r from-slate-50 to-blue-50 pr-12 ${
                    errors.confirmPassword 
                      ? 'border-[#F1AAA9] focus:ring-[#F1AAA9]' 
                      : 'border-[#E8DAEF] focus:ring-[#F0D9B5]'
                  } text-[#312C51]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[#4B426D] hover:text-[#312C51] transition"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-[#F1AAA9] text-sm font-medium mt-1">⚠ {errors.confirmPassword}</p>
              ) : passwordsMatch ? (
                <p className="text-[#F0D9B5] text-sm font-medium mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" /> Las contraseñas coinciden
                </p>
              ) : null}
            </div>

            {/* Error del servidor */}
            {errors.server && (
              <div className="bg-gradient-to-r from-[#F1AAA9] to-[#E08B8A] text-white p-4 rounded-xl border-2 border-[#E08B8A] text-center">
                <p className="font-semibold">⚠ {errors.server}</p>
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] disabled:from-gray-400 disabled:to-gray-500 text-[#312C51] font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#312C51] border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Link de login */}
          <p className="text-center text-[#4B426D] text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="font-bold text-[#F0D9B5] hover:text-[#E8C79E] transition"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;