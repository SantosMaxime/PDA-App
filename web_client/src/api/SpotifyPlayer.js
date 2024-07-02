import axios from "axios";
import { apiConfig } from "../config/config";

const apiInstance = axios.create({
    baseURL: apiConfig.apiUrl, // Use the base URL from your configuration
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function spotifyPlaybackState() {
    try {
        const response = await apiInstance.get(
            `api/spotify/player`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
                },
                withCredentials: true,
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

export async function spotifyPlay(deviceId, contextUri, offsetPosition, positionMs) {
    try {
        const response = await apiInstance.put(
            `api/spotify/play`,
            {
                deviceId,
                "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                "offset": {
                    "position": 5
                },
                "position_ms": 0
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
                },
                withCredentials: true,
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

export async function spotifyPause(deviceId) {
    try {
        const response = await apiInstance.put(
            `api/spotify/pause`,
            {
                deviceId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
                },
                withCredentials: true,
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

export async function spotifySkipToNext(deviceId) {
    try {
        const response = await apiInstance.put(
            `api/spotify/next`,
            {
                deviceId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
                },
                withCredentials: true,
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

export async function spotifySkipToPrevious(deviceId) {
    try {
        const response = await apiInstance.put(
            `api/spotify/previous`,
            {
                deviceId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
                },
                withCredentials: true,
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