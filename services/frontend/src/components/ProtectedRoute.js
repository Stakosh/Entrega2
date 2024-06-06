import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, allowedAccess, ...rest }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedAccess && !allowedAccess.includes(currentUser?.tipo_acceso)) {
        return <Navigate to="/inicio" replace />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
