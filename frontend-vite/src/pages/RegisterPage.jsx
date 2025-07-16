import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom'; 
import authService from '../services/authService';

const RegisterSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'El usuario es muy corto!')
        .max(50, 'El usuario es muy largo!')
        .required('Nombre de usuario es requerido'),
    email: Yup.string()
        .email('Email inválido')
        .required('Email es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Contraseña es requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirmar contraseña es requerido'),
});

function RegisterPage() {
    const navigate = useNavigate();

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
        maxWidth: '450px', 
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
        backgroundColor: '#28a745',
        color: 'white',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '10px' 
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#90ee90', 
        cursor: 'not-allowed'
    };

    const errorMessageStyle = {
        color: '#dc3545',
        fontSize: '0.85em',
        marginTop: '5px',
        marginBottom: '10px'
    };

    const statusMessageStyle = {
        marginTop: '15px',
        fontSize: '0.9em',
        padding: '10px',
        borderRadius: '5px'
    };

    const successStatusStyle = {
        ...statusMessageStyle,
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
    };

    const errorStatusStyle = {
        ...statusMessageStyle,
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
    };

    const loginPromptStyle = {
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
                <h2 style={titleStyle}>Registro de Usuario</h2>
                <Formik
                    initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        try {
                            const { confirmPassword, ...userData } = values;
                            await authService.register(userData);
                            setStatus({ success: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
                            navigate('/login'); 
                        } catch (error) {
                            setStatus({ error: error.response?.data?.message || 'Error en el registro' });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ status, isSubmitting }) => (
                        <Form>
                            <div style={inputGroupStyle}>
                                <label htmlFor="username" style={labelStyle}>Usuario:</label>
                                <Field name="username" type="text" style={inputStyle} />
                                <ErrorMessage name="username" component="div" style={errorMessageStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>Email:</label>
                                <Field name="email" type="email" style={inputStyle} />
                                <ErrorMessage name="email" component="div" style={errorMessageStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label htmlFor="password" style={labelStyle}>Contraseña:</label>
                                <Field name="password" type="password" style={inputStyle} />
                                <ErrorMessage name="password" component="div" style={errorMessageStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label htmlFor="confirmPassword" style={labelStyle}>Confirmar Contraseña:</label>
                                <Field name="confirmPassword" type="password" style={inputStyle} />
                                <ErrorMessage name="confirmPassword" component="div" style={errorMessageStyle} />
                            </div>
                            {status && status.success && <div style={successStatusStyle}>{status.success}</div>}
                            {status && status.error && <div style={errorStatusStyle}>{status.error}</div>}
                            <button type="submit" disabled={isSubmitting} style={isSubmitting ? disabledButtonStyle : buttonStyle}>
                                {isSubmitting ? 'Registrando...' : 'Registrarse'}
                            </button>
                        </Form>
                    )}
                </Formik>
                <p style={loginPromptStyle}>
                    ¿Ya tienes una cuenta? <Link to="/login" style={linkStyle}>Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;