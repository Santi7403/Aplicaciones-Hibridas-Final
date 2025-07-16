import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null); 

    useEffect(() => {
        const checkCurrentUser = async () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.token) {
                setUser(currentUser.user);
                setIsAuthenticated(true);
                setToken(currentUser.token);
            }
            setLoading(false);
        };
        checkCurrentUser();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        setUser(data.user);
        setIsAuthenticated(true);
        setToken(data.token);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setToken(null); 
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        token, 
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
