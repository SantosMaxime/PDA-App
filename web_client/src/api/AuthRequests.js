import axios from "axios";
import { apiConfig } from "../config/config";

const apiInstance = axios.create({
    baseURL: apiConfig.apiUrl, // Use the base URL from your configuration
});

export async function authLogin(email, password, token) {
    try {
        const response = await apiInstance.post(
            "/api/auth/login",
            {
                email,
                password,
                token,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming token is a bearer token
                    "Content-Type": "application/json", // Ensure JSON content type
                },
                withCredentials: true, // This is needed if your server session is based on cookies
            },
        );
        return response.data; // Return the whole response data object
    } catch (error) {
        if (error.response) {
            // Throw an error with both the status code and the message
            throw error;
        } else {
            // If the error is not from a HTTP response, throw a generic error
            throw new Error("Network error, please try again later.");
        }
    }
}
