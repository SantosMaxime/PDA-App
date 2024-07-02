const dotenv = require("dotenv");
const path = require("path");

const envPath = process.env.NODE_ENV
    ? `${process.env.NODE_ENV}.env`
    : "production.env";
dotenv.config({
    path: path.resolve(__dirname, `../../${envPath}`),
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV || "production",
    WEB_HOST: process.env.WEB_HOST || "localhost",
    SERVER_HOST: process.env.SERVER_HOST || "localhost",
    SECONDARY_HOST: process.env.SECONDARY_HOST || "localhost",
    CUSTOM_HOST: process.env.CUSTOM_HOST || "localhost",
    SERVER_PORT: process.env.PORT || 8086,
    WEB_PORT: process.env.WEB_PORT || 8086,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
};
