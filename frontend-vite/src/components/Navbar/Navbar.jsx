import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav style={{
            backgroundColor: '#333',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold', marginRight: '20px' }}>
                    Api Comunas
                </Link>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
                    <li style={{ marginRight: '15px' }}>
                        <Link to="/comunas" style={{ color: 'white', textDecoration: 'none' }}>Comunas</Link>
                    </li>
                    <li style={{ marginRight: '15px' }}>
                        <Link to="/vecinos" style={{ color: 'white', textDecoration: 'none' }}>Vecinos</Link>
                    </li>
                    {isAuthenticated && user?.role === 'admin' && (
                        <li style={{ marginRight: '15px' }}>
                            <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Administrar Usuarios</Link>
                        </li>
                    )}
                </ul>
            </div>

            <div>
                {isAuthenticated ? (
                    <>
                        <span style={{ marginRight: '10px' }}>Hola, {user?.username || user?.email}</span>
                        <button
                            onClick={logout}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '10px' }}>
                            <button style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Iniciar Sesión
                            </button>
                        </Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
                            <button style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Registrarse
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
