import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [studentData, setStudentData] = useState(null);

    const login = (user, studentInfo) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setStudentData(studentInfo);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setStudentData(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, studentData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
