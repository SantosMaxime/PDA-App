import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, CircularProgress } from "@mui/material";

const LoadingPage = ({ children }) => {
    const { user, validToken, getLoggedIn } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [countdown, setCountdown] = useState(5); // Initial countdown value set to 5 seconds
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown === 0) {
            navigate("/login");
        }
    }, [countdown, navigate]);

    useEffect(() => {
        let timeout = null;
        let countdownInterval = null;

        // Function to start the countdown
        const startCountdown = () => {
            countdownInterval = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(countdownInterval); // Stop the countdown
                        return 0;
                    }
                    return prevCount - 1; // Decrement the countdown
                });
            }, 1000);
        };

        if (!user && !validToken && !getLoggedIn()) {
            // Simulate loading and then set error if conditions are met
            timeout = setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("isLoggedIn");
                setLoading(false);
                setError(true);
                startCountdown(); // Start the countdown when setting the error
            }, 1000); // Wait for 1 seconds before simulating an error
        } else {
            setLoading(false); // Set loading to false if user and token exist
        }

        return () => {
            clearTimeout(timeout);
            clearInterval(countdownInterval); // Clear interval on cleanup to avoid memory leaks
        };
    }, [user, navigate, getLoggedIn, validToken]);

    if (error) {
        return (
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
            >
                <Typography variant="h5" color="error">
                    An error occurred, your token might be invalid. Please login
                    again.
                </Typography>
                <Typography variant="h7" color="error">
                    Redirecting in {countdown}{" "}
                </Typography>
            </Grid>
        );
    }

    if (loading) {
        return (
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
            >
                <CircularProgress />
            </Grid>
        );
    }

    return children;
};

export default LoadingPage;
