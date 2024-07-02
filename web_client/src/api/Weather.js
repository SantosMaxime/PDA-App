import axios from "axios";
import { apiConfig } from "../config/config";

const apiInstance = axios.create({
    baseURL: apiConfig.apiUrl, // Use the base URL from your configuration
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function weatherData() {
    try {
        const response = await apiInstance.get(
            `/api/weather`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("meteoToken")}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error;
        } else {
            throw new Error("Network error, please try again later.");
        }
    }
}