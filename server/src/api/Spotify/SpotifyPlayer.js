const axios = require('axios');

function checkForSpotifyToken(req) {
    let spotifyToken = req.headers.authorization;
    if (spotifyToken)
        spotifyToken = spotifyToken.split(' ')[1];
    spotifyToken = spotifyToken.trim().replace(/^"|"$/g, '');
    if (!spotifyToken || spotifyToken === 'null') {
        return null;
    }
    return spotifyToken;

}

exports.spotifyPlaybackState = async (req, res) => {
    let spotifyToken = checkForSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).send({ error: 'No token provided' });
    }
    try {
        const spotifyResponse = await axios.get('https://api.spotify.com/v1/me/player/', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`
            }
        });
        res.json(spotifyResponse.data);
    } catch (error) {
        console.error('Error contacting Spotify API:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });    }
}

exports.spotifyPlay = async (req, res) => {
    let spotifyToken = checkForSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const deviceId = req.body.deviceId;
    const body = req.body;
    if (!deviceId || !body) {
        return res.status(400).send({ error: 'No deviceId or uri provided' });
    }
    console.log('Playing track on device:', deviceId, 'body:', body)
    try {
        const spotifyResponse = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            body: body
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`
            }
        });
        res.json(spotifyResponse.data);
    } catch (error) {
        console.error('Error contacting Spotify API:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
}

exports.spotifyPause = async (req, res) => {
    let spotifyToken = checkForSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const deviceId = req.body.deviceId;
    if (!deviceId) {
        return res.status(400).send({ error: 'No deviceId provided' });
    }
    console.log('Pausing playback on device:', deviceId)
    try {
        const spotifyResponse = await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`
            }
        });
        res.json(spotifyResponse.data);
    } catch (error) {
        console.error('Error contacting Spotify API:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
}

exports.spotifySkipToNext = async (req, res) => {
    let spotifyToken = checkForSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const deviceId = req.body.deviceId;
    if (!deviceId) {
        return res.status(400).send({ error: 'No deviceId provided' });
    }
    console.log('Skipping to next track on device:', deviceId)
    try {
        const spotifyResponse = await axios.post(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`
            }
        });
        res.json(spotifyResponse.data);
    } catch (error) {
        console.error('Error contacting Spotify API:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
}

exports.spotifySkipToPrevious = async (req, res) => {
    let spotifyToken = checkForSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const deviceId = req.body.deviceId;
    if (!deviceId) {
        return res.status(400).send({ error: 'No deviceId provided' });
    }
    console.log('Skipping to previous track on device:', deviceId)
    try {
        const spotifyResponse = await axios.post(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`
            }
        });
        res.json(spotifyResponse.data);
    } catch (error) {
        console.error('Error contacting Spotify API:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
}