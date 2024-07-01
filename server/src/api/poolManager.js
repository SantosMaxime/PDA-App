const sql = require("mssql");
const dbConfig = require("../config/dbConfig.js");

let pool = new sql.ConnectionPool(dbConfig);
let poolConnection;
let connectionTimeout;

// Initialize the connection pool
async function initializePool() {
    try {
        poolConnection = await pool.connect();
        console.log("Database connected successfully!");
        // Reset the connection timeout whenever the pool is (re)initialized
        resetConnectionTimeout();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
}

// Function to reset the timeout
function resetConnectionTimeout() {
    clearTimeout(connectionTimeout);
    connectionTimeout = setTimeout(() => {
        if (poolConnection) {
            poolConnection.close();
            console.log("Database connection closed due to inactivity.");
            poolConnection = null;
        }
    }, 30000); // 30 seconds of inactivity
}

// Export a function to get the pool
exports.getPool = async function () {
    if (!poolConnection || !pool.connected) {
        await initializePool();
    } else {
        // Reset the timeout as the pool is still active
        resetConnectionTimeout();
    }
    return poolConnection;
};
