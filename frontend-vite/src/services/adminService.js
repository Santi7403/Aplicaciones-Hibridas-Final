import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users/admin'; 

const getConfig = (token) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const getAllUsers = async (token) => {
    try {
        const response = await axios.get(API_URL, getConfig(token));
        return response.data;
    } catch (error) {
        console.error('Error en getAllUsers:', error.response?.data || error.message);
        throw error;
    }
};

const createUserByAdmin = async (userData, token) => {
    try {
        const response = await axios.post(API_URL, userData, getConfig(token));
        return response.data;
    } catch (error) {
        console.error('Error en createUserByAdmin:', error.response?.data || error.message);
        throw error;
    }
};
const updateUserByAdmin = async (userId, userData, token) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, userData, getConfig(token));
        return response.data;
    } catch (error) {
        console.error('Error en updateUserByAdmin:', error.response?.data || error.message);
        throw error;
    }
};

const deleteUserByAdmin = async (userId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/${userId}`, getConfig(token));
        return response.data;
    } catch (error) {
        console.error('Error en deleteUserByAdmin:', error.response?.data || error.message);
        throw error;
    }
};

export {
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
};
