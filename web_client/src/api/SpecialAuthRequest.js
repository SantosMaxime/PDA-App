import axios from "axios";
import { apiConfig } from "../config/config";

const apiInstance = axios.create({
    baseURL: apiConfig.apiUrl, // Use the base URL from your configuration
});

export async function authSpotify() {
    window.location.href = `${apiConfig.apiUrl}/api/auth/spotify`;
}
