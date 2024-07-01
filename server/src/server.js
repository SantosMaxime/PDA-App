const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();

const config = require("./config/config.js");
const { clearTokens } = require("./api/tokenStorage");
const validateTokenMiddleware = require("./api/validateTokenMiddleware");

global.TokenList = [];

const allowedOrigins = [
    `http://${config.WEB_HOST}:${config.WEB_PORT}`,
    `http://${config.SECONDARY_HOST}:${config.WEB_PORT}`,
    `http://${config.CUSTOM_HOST}:${config.WEB_PORT}`,
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(null, false);
        }
        return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE", // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed in requests
    credentials: true, // Important: This must be true for credentials to be included
};

app.use(cors(corsOptions));
app.use("/api/protected/", validateTokenMiddleware);
app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.json());

const { loginUser } = require("./api/authHandlers");
const {
    getUsers,
    addUser,
    updateUser,
    removeUsers,
} = require("./api/userHandlers");

app.post("/api/auth/login", loginUser);

app.get("/api/protected/users", getUsers);
app.post("/api/protected/users", addUser);
app.post("/api/protected/users/remove", removeUsers);
app.put("/api/protected/users/:id", updateUser);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
    console.log(
        `Server running on http://${config.SERVER_HOST}:${config.SERVER_PORT}`,
    );
});

// Use clearTokens on server shutdown
process.on("exit", () => {
    clearTokens();
    console.log("Clearing tokens due to server shutdown.");
});

// Use clearTokens on SIGINT
process.on("SIGINT", () => {
    process.exit();
});
