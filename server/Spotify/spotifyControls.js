const fetch = require('node-fetch');

const spotifyApiRequest = async (url, method, accessToken) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
};

const playTrack = async (req, res) => {
  if (!req.session || !req.session.accessToken) {
    return res.status(401).send({ success: false, message: 'No access token available' });
  }

  try {
    const response = await spotifyApiRequest('https://api.spotify.com/v1/me/player/play', 'PUT', req.session.accessToken);
    if (response.status === 204 || response.status === 200) {
      res.send({ success: true, message: 'Playback started' });
    } else {
      res.status(response.status).send({ success: false, message: 'Failed to start playback' });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to start playback', error: error.message });
  }
};

const pauseTrack = async (req, res) => {
  // Similar to playTrack, adjust for 'https://api.spotify.com/v1/me/player/pause'
  // Use the spotifyApiRequest function with method 'PUT'
};

const nextTrack = async (req, res) => {
  // Adjust for 'https://api.spotify.com/v1/me/player/next'
  // Use the spotifyApiRequest function with method 'POST'
};

const previousTrack = async (req, res) => {
  // Adjust for 'https://api.spotify.com/v1/me/player/previous'
  // Use the spotifyApiRequest function with method 'POST'
};

// Remember to adjust pauseTrack, nextTrack, and previousTrack similarly to playTrack

module.exports = {
  playTrack,
  pauseTrack,
  nextTrack,
  previousTrack,
};
