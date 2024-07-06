"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

interface AuthContextType {
    authData: { username: string; accessToken: string } | null;
    setAuth: React.Dispatch<React.SetStateAction<{ username: string; accessToken: string } | null>>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    authData: null,
    setAuth: () => {},
    login: async () => {},
    logout: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authData, setAuthData] = useState<{ username: string; accessToken: string } | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setAuthData(user);
            console.log('AuthProvider: Loaded user from localStorage', user);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/users/login', { username, password });
            const { accessToken } = response.data;
            const user = { username, accessToken };
            setAuthData(user);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('AuthProvider: User logged in', user);
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed');
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post('/users/logout');
            console.log('Logout response:', response);
            setAuthData(null);
            localStorage.removeItem('user');
            console.log('AuthProvider: User logged out');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Logout failed:', error.message);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                }
            } else {
                console.error('Logout failed:', error);
            }
            throw new Error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ authData, setAuth: setAuthData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
