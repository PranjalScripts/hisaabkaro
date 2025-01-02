import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RedirectIfLoggedIn = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default RedirectIfLoggedIn;
