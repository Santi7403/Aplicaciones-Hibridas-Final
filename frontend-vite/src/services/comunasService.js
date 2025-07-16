import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comunas'; 

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getComunas = async () => {
    const response = await axios.get(API_URL);
    return response.data; 
};

const getComunaById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createComuna = async (comunaData) => {
    const response = await axios.post(API_URL, comunaData, { headers: getAuthHeaders() });
    return response.data;
};

const updateComuna = async (id, comunaData) => { 
    const response = await axios.put(`${API_URL}/${id}`, comunaData, { headers: getAuthHeaders() });
    return response.data;
};

const deleteComuna = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

const comunasService = {
    getComunas,
    getComunaById,
    createComuna,
    updateComuna,
    deleteComuna,
};

export default comunasService;