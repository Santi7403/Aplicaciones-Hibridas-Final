import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();

  const pageContainerStyle = {
    padding: '40px 20px',
    maxWidth: '900px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  };

  const titleStyle = {
    fontSize: '2.8em',
    color: '#333333',
    marginBottom: '20px',
    fontWeight: '600'
  };

  const textStyle = {
    fontSize: '1.1em',
    color: '#555555',
    lineHeight: '1.6'
  };

  const authSectionStyle = {
    marginTop: '35px',
    padding: '25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  };

  const buttonStyle = {
    padding: '12px 25px',
    fontSize: '1.05em',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    margin: '0 8px' 
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const linkListStyle = {
    listStyle: 'none',
    padding: '0',
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  };

  const linkItemStyle = {
    backgroundColor: '#e0f7fa',
    padding: '12px 25px',
    borderRadius: '8px',
    width: 'fit-content',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    transition: 'background-color 0.3s ease'
  };


  if (loading) {
    return (
      <div style={pageContainerStyle}>
        <p style={textStyle}>Cargando información de usuario...</p>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Parcial 2 - Aplicaciones Híbridas</h1>
      <p>Alumno: <strong> Santiago Martinez Donde </strong></p>
      <p>Comisión: <strong> DWT4AV </strong> </p>


      {isAuthenticated ? (
        <div style={authSectionStyle}>
          <p style={textStyle}>¡Hola, <strong style={{ color: '#007bff' }}>{user.username || user.email}</strong>, acabas de iniciar sesión!</p>
          <p style={textStyle}>Desde aquí puedes explorar las funcionalidades principales de la aplicación.</p>
          <h3 style={{ fontSize: '1.4em', color: '#333333', marginTop: '30px', marginBottom: '15px' }}>Navegación Rápida:</h3>
          <ul style={linkListStyle}>
            <li style={linkItemStyle}>
              <Link to="/comunas" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                Ver y Gestionar Comunas
              </Link>
            </li>
            <li style={linkItemStyle}>
              <Link to="/vecinos" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                Ver y Gestionar Vecinos
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div style={authSectionStyle}>
          <p style={textStyle}>Para acceder a todas las funcionalidades, por favor, inicia sesión o regístrate.</p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={primaryButtonStyle}>Iniciar Sesión</button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button style={secondaryButtonStyle}>Registrarse</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;