import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // ensure axios is installed via npm
import { apiConfig } from "../config/config";

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        // Function to check if the user is authenticated
        const checkAuthentication = async () => {
            try {
                // Assuming you have an endpoint '/api/auth/status' that checks if the user is logged in
                const response = await axios.get(`${apiConfig.apiUrl}/api/auth/status`, {
                    withCredentials: true, // This is needed if your server session is based on cookies
                });
                setIsLoggedIn(response.data.isAuthenticated); // Set based on response
                console.log('Authentication check passed:', response.data.isAuthenticated)
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsLoggedIn(false);
                console.log('Authentication check failed:', error)
            }
        };

        checkAuthentication();
    }, []);

    // Show loading or a specific component while checking authentication status
    if (isLoggedIn === null) {
        return <div>Loading...</div>; // or any loading spinner
    }

    // Navigate to login if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
