const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cookieParser = require('cookie-parser');

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
//app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'THEBESTSECRETKEYEVERBROTRUSTMEONTHISONE', // This should be a long, random string to secure your sessions
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto', // If you're serving your site over HTTPS, set to true
        httpOnly: true, // Helps against XSS attacks
        maxAge: 3600000 // Session max age in milliseconds
    }
}));

const { loginUser } = require("./api/authHandlers");
const {
    getUsers,
    addUser,
    updateUser,
    removeUsers,
} = require("./api/userHandlers");
const { spotifyAuth, spotifyCallback } = require("./api/Spotify/SpotifyAuthHandler");
const {
    spotifyPlaybackState,
    spotifyPlay,
    spotifyPause,
    spotifySkipToNext,
    spotifySkipToPrevious,
} = require("./api/Spotify/SpotifyPlayer");

app.post("/api/auth/login", loginUser);
app.get("/api/auth/spotify", spotifyAuth);
app.get("/spotify-callback", spotifyCallback);

app.get('/api/auth/status', (req, res) => {
    // console.log("Checking authentication status")
    // console.log("Session ID:", req.sessionID);
    // console.log("req.session.isAuthenticated:", req.session.isAuthenticated)
    if (req.session.isAuthenticated) {
        res.send({ isAuthenticated: true });
    } else {
        res.send({ isAuthenticated: false });
    }
});
app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.accessToken; // Access the cookie named 'accessToken'
    if (!token) {
        return res.status(401).json({ error: 'No authentication token found' });
    }
    try {
        // const user = verifyToken(token); // Assume a function that validates the token
        res.json({ spotifyToken: token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
app.get("/api/spotify/player", spotifyPlaybackState);
app.put("/api/spotify/play", spotifyPlay);
app.put("/api/spotify/pause", spotifyPause);
app.put("/api/spotify/next", spotifySkipToNext);
app.put("/api/spotify/previous", spotifySkipToPrevious);


app.get("/api/weather", (req, res) => {
    const apiKey = '3d7d8006944f7217bf2c8222f7b1ab4a';
    const url = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;

    axios.get(url)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            res.status(500).json({ message: 'Internal server error', details: error.message });
        });
});

app.get("/api/protected/users", getUsers);
app.post("/api/protected/users", addUser);
app.post("/api/protected/users/remove", removeUsers);
app.put("/api/protected/users/:id", updateUser);


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
//app.get("*", (req, res) => {
    //res.sendFile(path.join(__dirname + "/client/build/index.html"));
//});
app.get("*", (req, res) => {
    res.redirect("http://localhost:3000");
});

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
    console.log(
        `Server running on http://${config.SERVER_HOST}:${config.SERVER_PORT}`
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
