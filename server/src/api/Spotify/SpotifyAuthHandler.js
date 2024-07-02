const querystring = require('querystring');
const config = require("../../config/config.js");
const crypto = require('crypto');
const axios = require('axios');

const clientId = config.SPOTIFY_CLIENT_ID;
const redirectUri = config.SPOTIFY_REDIRECT_URI;

function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    return Array.from(randomBytes).map(byte => possible.charAt(byte % possible.length)).join('');
}

async function sha256(plain) {
    const hash = crypto.createHash('sha256');
    hash.update(plain);
    return hash.digest();
}

function base64encode(buffer) {
    return buffer.toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
exports.spotifyAuth = async (req, res) => {
    const codeVerifier = generateRandomString(64);
    req.session.codeVerifier = codeVerifier; // Store codeVerifier in session

    // console.log("AUTH codeVerifier:", codeVerifier)
    // console.log("AUTH req.session.codeVerifier:", req.session.codeVerifier)
    // console.log("Session ID:", req.sessionID);

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    res.redirect(authUrl.toString());
}

exports.spotifyCallback = async (req, res) => {
    const code = req.query.code;
    const codeVerifier = req.session.codeVerifier;

    // console.log("CALLBACK codeVerifier:", codeVerifier)
    // console.log("CALLBACK req.session.codeVerifier:", req.session.codeVerifier)
    // console.log("Session ID:", req.sessionID);

    if (!code || !codeVerifier) {
        return res.status(400).json({ error: 'Missing code or codeVerifier' });
    }

    try {
        const params = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }).toString();

        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // Send the token information back to the client
        res.cookie('accessToken', response.data.access_token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        // console.log("CALLBACK #2 response.data:", response.data);
        // console.log("CALLBACK #2 response.data.access_token:", response.data.access_token);
        // console.log(res.cookie.accessToken);
        req.session.isAuthenticated = true;
        res.redirect('http://localhost:3000');
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
