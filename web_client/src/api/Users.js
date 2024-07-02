import { apiConfig } from "../config/config";

export function getUsers() {
    const token = localStorage.getItem("token");
    const url = `${apiConfig.apiUrl}/api/protected/users`;
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("There was an error fetching the user data:", error);
            throw error; // Propagate error to be handled where getUsers is called
        });
}

export function addUser(user) {
    const token = localStorage.getItem("token");
    const url = `${apiConfig.apiUrl}/api/protected/users`;
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(user),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // Ensure this line is uncommented
        })
        .catch((error) => {
            console.error("There was an error adding the user:", error);
            throw error;
        });
}

export function removeUsers(ids) {
    const token = localStorage.getItem("token");
    const url = `${apiConfig.apiUrl}/api/protected/users/remove`;
    const idsArray = Array.from(ids);
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ ids: idsArray }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("There was an error removing the user:", error);
            throw error;
        });
}

export function updateUser(user) {
    const token = localStorage.getItem("token");
    const url = `${apiConfig.apiUrl}/api/protected/users/${user.id}`;
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(user),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error("There was an error updating the user:", error);
            throw error; // Propagate error to be handled where updateUser is called
        });
}
