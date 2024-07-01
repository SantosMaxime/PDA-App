const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    pool: {
        max: 10, // maximum size of the pool
        min: 0, // minimum size of the pool
        idleTimeoutMillis: 5000, // close idle connections after 30 seconds
    },
    user_table_name: process.env.DB_USER_TABLE_NAME,
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true,
    },
};

module.exports = dbConfig;
