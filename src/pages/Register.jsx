import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validar nombre (debe tener apellido)
  const validateName = (name) => {
    const trimmedName = name.trim();
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    
    if (words.length < 2) {
      return 'El nombre debe incluir nombre y apellido';
    }
    return null;
  };

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  };

  // Validar contraseña segura
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)';
    }
    return null;
  };

  // Manejar cambios en los campos con validación en tiempo real
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

    // Validar coincidencia con confirmación
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
    
    // Validar todos los campos
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

    // Si hay algún error, no enviar el formulario
    if (Object.values(newErrors).some(error => error !== null)) {
      return;
    }
    
    setLoading(true);
    
    const result = await register(username, email, password);
    
    if (result.success) {
      navigate('/login');
    } else {
      // Mostrar error del servidor (ej: email ya registrado)
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
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nombre Completo:
            </label>
            <input
              type="text"
              value={username}
              onChange={handleNameChange}
              required
              placeholder="Juan Pérez"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                border: `1px solid ${errors.username ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            {errors.username && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.username}
              </p>
            )}
          </div>
          
          {/* Campo Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
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
              required
              placeholder="Mínimo 8 caracteres"
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
            {!errors.password && password && (
              <p style={{ color: '#28a745', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ✓ Contraseña segura
              </p>
            )}
          </div>
          
          {/* Campo Confirmar Contraseña */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              placeholder="Repite la contraseña"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </p>
            )}
            {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
              <p style={{ color: '#28a745', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ✓ Las contraseñas coinciden
              </p>
            )}
          </div>
          
          {/* Error del servidor */}
          {errors.server && (
            <div style={{ 
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #f5c6cb'
            }}>
              {errors.server}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;