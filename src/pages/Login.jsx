import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validar email
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

  // Validar contraseña
  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  // Manejar cambios en email
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

  // Manejar cambios en contraseña
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
    
    // Validar campos
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);

    // Si hay errores, no enviar
    if (emailError || passwordError) {
      return;
    }
    
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/todos');
    } else {
      // Errores del servidor
      setErrors(prev => ({ ...prev, server: result.error }));
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="ejemplo@correo.com"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Campo Contraseña */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            {errors.password && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>
          
          {/* Error del servidor (credenciales inválidas, usuario no existe, etc.) */}
          {errors.server && (
            <div style={{ 
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #f5c6cb',
              textAlign: 'center'
            }}>
              <strong>⚠ {errors.server}</strong>
              {errors.server === 'Credenciales inválidas' && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
                  Verifica tu email y contraseña
                </p>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem' }}>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.5rem' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
              Regístrate aquí
            </Link>
          </p>
          
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#999' }}>
            <Link to="/forgot-password" style={{ color: '#6c757d', textDecoration: 'none' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;