import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ComunasPage from './pages/ComunasPage.jsx';
import VecinosPage from './pages/VecinosPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';

import Navbar from './components/Navbar/Navbar.jsx';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p>Cargando autenticación...</p>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    const userHasRequiredRole = user && allowedRoles ? allowedRoles.includes(user.role) : true;
    if (allowedRoles && !userHasRequiredRole) {
        return <Navigate to="/" replace />; 
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/comunas" element={
                        <PrivateRoute>
                            <ComunasPage />
                        </PrivateRoute>
                    } />
                    <Route path="/vecinos" element={
                        <PrivateRoute>
                            <VecinosPage />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/users" element={
                        <PrivateRoute allowedRoles={['admin']}> 
                            <UserManagementPage />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;