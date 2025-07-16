// frontend-vite/src/services/authService.js
import axios from 'axios';

// CAMBIA ESTO:
// const API_URL = '/api/users';
// A ESTO:
const API_URL = 'http://localhost:5000/api/users'; // <-- Usa la URL completa de tu backend

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
