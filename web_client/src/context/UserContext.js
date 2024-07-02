import React, { createContext, useContext, useState, useEffect } from "react";
import { authLogin } from "../api/AuthRequests";

// Create the context
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Directly use the token for authentication verification
                    const data = await authLogin(null, null, token);
                    if (data.user && data.token) {
                        setUser(data.user);
                        login(data.token);
                        setValidToken(true);
                    } else {
                        logout();
                        setValidToken(false);
                    }
                } catch (error) {
                    console.error("Login validation failed:", error.message);
                    logout(); // Ensures clean state if login is not validated
                    setValidToken(false);
                }
            }
        };

        checkLoginStatus();
    }, []);

    const login = (token) => {
        setIsLoggedIn(true);
        setValidToken(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setValidToken(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
    };

    const getLoggedIn = () => {
        return isLoggedIn;
    };

    // The value that will be given to the context
    const value = {
        user,
        setUser,
        validToken,
        setValidToken,
        login,
        logout,
        getLoggedIn,
        isLoggedIn,
        setIsLoggedIn,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
