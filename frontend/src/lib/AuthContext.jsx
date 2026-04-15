import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check for expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // Extract user from token or store more in localStorage
                    const savedUser = JSON.parse(localStorage.getItem('user'));
                    setUser(savedUser);
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            const { token, ...userDetails } = response.data;
            setToken(token);
            setUser(userDetails);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userDetails));
        }
        return response.data;
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            const { token, ...userDetails } = response.data;
            setToken(token);
            setUser(userDetails);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userDetails));
        }
        return response.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const deleteAccount = async () => {
        const response = await api.delete('/auth/me');
        if (response.data.success) {
            logout();
        }
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
