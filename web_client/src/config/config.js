const config = {
    development: {
        apiUrl: "http://localhost:8086", // UPDATE THIS WITH YOUR MACHINE NAME
    },
    production: {
        apiUrl: "http://W19WEB1:8086", // W19WEB1 is the machine name of the server
    },
    test: {
        apiUrl: "http://localhost:3001",
    },
};

const environment = process.env.NODE_ENV || "development"; // Default to 'development' if NODE_ENV is not set

export const apiConfig = config[environment];
