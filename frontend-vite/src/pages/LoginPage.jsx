import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error de inicio de sesión. Por favor, verifica tus credenciales.');
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)', 
        backgroundColor: '#f0f2f5',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px'
    };

    const formCardStyle = {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
    };

    const titleStyle = {
        fontSize: '2em',
        color: '#333333',
        marginBottom: '25px',
        fontWeight: '600'
    };

    const inputGroupStyle = {
        marginBottom: '20px',
        textAlign: 'left'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: '#555555',
        fontSize: '0.95em',
        fontWeight: '500'
    };

    const inputStyle = {
        width: 'calc(100% - 20px)',
        padding: '12px 10px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
        fontSize: '1em',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    };

    const errorStyle = {
        color: '#dc3545',
        marginTop: '15px',
        fontSize: '0.9em'
    };

    const registerPromptStyle = {
        marginTop: '25px',
        fontSize: '0.95em',
        color: '#666666'
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '600'
    };

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h2 style={titleStyle}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    {error && <p style={errorStyle}>{error}</p>}
                    <button type="submit" style={buttonStyle}>Iniciar Sesión</button>
                </form>
                <p style={registerPromptStyle}>
                    ¿No tienes una cuenta? <Link to="/register" style={linkStyle}>Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;