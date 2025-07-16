import { useState, useEffect, useCallback } from 'react';
import comunasService from '../services/comunasService';

const useComunas = () => {
    const [comunas, setComunas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComunas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await comunasService.getComunas();
            setComunas(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar comunas');
            console.error("Error fetching comunas:", err);
        } finally {
            setLoading(false);
        }
    }, []); 

    const addComuna = async (comunaData) => {
        setError(null);
        try {
            const newComuna = await comunasService.createComuna(comunaData);
            setComunas((prevComunas) => [...prevComunas, newComuna]);
            return newComuna;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear comuna');
            throw err; 
        }
    };

    const removeComuna = async (id) => {
        setError(null);
        try {
            await comunasService.deleteComuna(id);
            setComunas((prevComunas) => prevComunas.filter((comuna) => comuna._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar comuna');
            throw err;
        }
    };

    useEffect(() => {
        fetchComunas();
    }, [fetchComunas]);

    return { comunas, loading, error, addComuna, removeComuna, fetchComunas };
};

export default useComunas;