import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ element: Component }) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
