import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../service/Auth';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const authService = new AuthService();

    // Fetch user profile after login or page reload
   // Run once when the component mounts

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (updatedUserData) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Also remove the token on logout
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
