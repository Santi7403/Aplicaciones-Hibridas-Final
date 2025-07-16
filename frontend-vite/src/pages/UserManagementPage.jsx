import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAllUsers, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from '../services/adminService.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './UserManagementPage.css'; 

const userSchema = Yup.object().shape({
    username: Yup.string().required('El nombre de usuario es requerido'),
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').when('isNewUser', {
        is: true, 
        then: (schema) => schema.required('La contraseña es requerida para nuevos usuarios'),
        otherwise: (schema) => schema.notRequired() 
    }),
    role: Yup.string().oneOf(['user', 'admin'], 'Rol inválido').required('El rol es requerido'),
});

function UserManagementPage() {
    const { user, token, loading: authLoading } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError(null);
        try {
            if (token) {
                const fetchedUsers = await getAllUsers(token);
                setUsers(fetchedUsers);
            } else {
                setError('No hay token de autenticación disponible para cargar usuarios.');
            }
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (!authLoading && token) {
            fetchUsers();
        }
    }, [token, authLoading]);

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await deleteUserByAdmin(userId, token);
                fetchUsers();
            } catch (err) {
                console.error("Error al eliminar usuario:", err);
                setError('Error al eliminar usuario: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleEdit = (userToEdit) => {
        setEditingUser(userToEdit);
        setShowForm(true);
    };

    const handleCreateNew = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setEditingUser(null);
        setShowForm(false);
        setError(null);
    };

    const handleSubmitUser = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setError(null);
        try {
            if (editingUser) {
                await updateUserByAdmin(editingUser._id, values, token);
                alert('Usuario actualizado exitosamente!');
            } else {
                await createUserByAdmin(values, token);
                alert('Usuario creado exitosamente!');
            }
            fetchUsers();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Error al guardar usuario:", err);
            setError('Error al guardar usuario: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return <p className="message-text">Verificando autenticación...</p>;
    if (loadingUsers) return <p className="message-text">Cargando usuarios...</p>;
    if (error) return <p className="message-text error-text">{error}</p>;

    return (
        <div className="user-management-container">
            <h1 className="user-management-title">Administración de Usuarios</h1>

            <button
                onClick={handleCreateNew}
                className="btn-primary"
            >
                Crear Nuevo Usuario
            </button>

            {showForm && (
                <div className="form-card">
                    <h2 className="form-card-title">{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                    <Formik
                        initialValues={{
                            username: editingUser ? editingUser.username : '',
                            email: editingUser ? editingUser.email : '',
                            password: '',
                            role: editingUser ? editingUser.role : 'user',
                            isNewUser: !editingUser
                        }}
                        validationSchema={userSchema}
                        onSubmit={handleSubmitUser}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="username">Nombre de Usuario:</label>
                                    <Field type="text" name="username" />
                                    <ErrorMessage name="username" component="div" className="form-error-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <Field type="email" name="email" />
                                    <ErrorMessage name="email" component="div" className="form-error-message" />
                                </div>
                                {!editingUser && (
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña:</label>
                                        <Field type="password" name="password" />
                                        <ErrorMessage name="password" component="div" className="form-error-message" />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="role">Rol:</label>
                                    <Field as="select" name="role">
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="form-error-message" />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" disabled={isSubmitting} className="btn-submit">
                                        {isSubmitting ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
                                    </button>
                                    <button type="button" onClick={handleCancelForm} className="btn-cancel">
                                        Cancelar
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {!showForm && (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u._id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button onClick={() => handleEdit(u)} className="btn-edit">Editar</button>
                                        <button onClick={() => handleDelete(u._id)} className="btn-delete">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserManagementPage;
