require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './session.sqlite', // Path to the database file
});

app.use(session({
  secret: 'your-secret', // Replace 'your-secret' with a real secret key
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false, // We don't need to save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Ensure you're using HTTPS in production
    sameSite: 'none', // Adjust according to your needs
  }
}));

const User = sequelize.define('User', {
  // Define attributes
  spotifyUserId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  accessToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Add any other settings/preferences you want to store
  preferredVolume: {
    type: Sequelize.INTEGER,
    defaultValue: 50 // Example setting
  }
  // You can add more fields here as needed
}, {
  // Model options
});

sequelize.sync(); // Ensure your table is created/updated

// Temporary list to store session IDs
let sessionList = [];

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
  console.error('Please set CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI environment variables.');
  process.exit(1);
}

// Set CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // This should match the URL of your React application
  credentials: true,
};

// Enable CORS pre-flight across the board for simplicity, remove app.options('*', cors())
app.use(cors(corsOptions));
app.use(express.json()); // Apply body parser middleware after CORS

const port = 8080;

async function refreshSpotifyToken(spotifyUserId) {
  const user = await User.findOne({ where: { spotifyUserId: spotifyUserId } });

  if (user) {
    const refreshOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: user.refreshToken,
        grant_type: 'refresh_token',
      }),
    };

    const refreshResponse = await fetch('https://accounts.spotify.com/api/token', refreshOptions);
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      user.accessToken = refreshData.access_token;
      await user.save();
      return refreshData.access_token; // Return the new access token
    }
  }
  return null; // Indicate failure to refresh token
}

async function updateUserSettings(spotifyUserId, newSettings) {
  const user = await User.findOne({ where: { spotifyUserId: spotifyUserId } });

  if (user) {
    Object.keys(newSettings).forEach(key => {
      user[key] = newSettings[key];
    });
    await user.save();
  }
}

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/get-spotify-auth-url', (req, res) => {
  const state = generateRandomString(16); // A random string for state parameter
  const scope = encodeURIComponent('user-read-private user-read-email'); // Desired scopes
  req.session.sessionId = req.headers['x-session-id'];
  console.log('Session ID GET SPOTIFY AUTH URL:', req.session.sessionId);
  // Construct the full Spotify authorization URL
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(process.env.CLIENT_ID)}&scope=${scope}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;

  // Return the Spotify authorization URL in the response body
  res.json({ spotifyAuthUrl });
});

app.get('/is-authenticated', async (req, res) => {
  if (req.session.spotifyUserId) {
    try {
      const user = await User.findOne({ where: { spotifyUserId: req.session.spotifyUserId } });
      if (user && user.accessToken) {
        // Optionally, you can add more checks here, like validating the access token's expiration
        res.json({ isAuthenticated: true });
      } else {
        res.json({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      res.json({ isAuthenticated: false });
    }
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  };

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);


    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();

      // Assume you have the Spotify user ID and any initial settings
      const spotifyUserId = 'someSpotifyUserId'; // You would get this from Spotify's API response
      const initialSettings = { preferredVolume: 70 }; // Example setting

      // Assume spotifyUserId is obtained from Spotify's API response after exchanging the code
      req.session.spotifyUserId = spotifyUserId; // Store Spotify user ID in the session

      // Upsert user data into the database
      const [user, created] = await User.findOrCreate({
        where: { spotifyUserId: spotifyUserId },
        defaults: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          ...initialSettings
        }
      });

      if (!created) {
        // If the user already existed, update their tokens and any settings as needed
        user.accessToken = tokenData.access_token;
        user.refreshToken = tokenData.refresh_token;
        await user.save();
      }

      res.redirect(`http://localhost:3000/?success=true`);
    } else {
      res.redirect(`http://localhost:3000/login?error=failed_to_retrieve_access_token`);
    }
  } catch (error) {
    console.error('Error in /callback:', error);
    res.redirect(`http://localhost:3000/login?error=${error.message}`);
  }
});

// Playback control routes (assuming you have these defined in ./Spotify/spotifyControls.js)
const spotifyControls = require('./Spotify/spotifyControls');
app.post('/play', spotifyControls.playTrack);
app.post('/pause', spotifyControls.pauseTrack);
app.post('/next', spotifyControls.nextTrack);
app.post('/previous', spotifyControls.previousTrack);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
