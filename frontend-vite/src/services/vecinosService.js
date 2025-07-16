import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vecinos'; 

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const getVecinos = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data; 
};

export const getVecinoById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

export const createVecino = async (vecinoData) => {
    const response = await axios.post(API_URL, vecinoData, { headers: getAuthHeaders() });
    return response.data; 
};

export const updateVecino = async (id, vecinoData) => {
    const response = await axios.put(`${API_URL}/${id}`, vecinoData, { headers: getAuthHeaders() });
    return response.data; 
};

export const deleteVecino = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data; 
};

const vecinosService = {
    getVecinos,
    getVecinoById,
    createVecino,
    updateVecino,
    deleteVecino,
};

export default vecinosService;