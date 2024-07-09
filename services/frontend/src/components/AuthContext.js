import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [teacherData, setTeacherData] = useState(null);
    const [adminData, setAdminData] = useState(null);

    const login = (user, studentInfo = null, teacherInfo = null, adminInfo = null) => {
        setIsAuthenticated(true);
        setCurrentUser({
            ...user,
            name: user.name,  //  campo 'name'
            tipo_acceso: user.tipo_acceso  // campo 'tipo_acceso'
        });
        //setCurrentUser(user);
        setStudentData(studentInfo);
        setTeacherData(teacherInfo);
        setAdminData(adminInfo);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setStudentData(null);
        setTeacherData(null);
        setAdminData(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, studentData, teacherData, adminData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
